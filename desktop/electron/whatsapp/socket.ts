import {
  makeWASocket,
  Browsers,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import path from "path";
import fs from "fs/promises";
import { app } from "electron";
import { sendStatus } from "./status";
import { Boom } from "@hapi/boom";

export let sock: ReturnType<typeof makeWASocket> | null = null;
let isStarting = false;
let reconnecting = false;

const sessionPath = path.join(app.getPath("userData"), "auth-info");


// ===============================
// 🧹 Limpa a sessão do WhatsApp
// ===============================
export async function clearWhatsappSession() {
  try {
    await fs.rm(sessionPath, {
      recursive: true,
      force: true,
    });

    console.log("🧹 Sessão do WhatsApp removida com sucesso");
  } catch (error) {
    console.error("Erro ao remover sessão:", error);
  }
}


export async function startSock() {
  if (isStarting || sock) {
    console.log("⚠️ Socket já iniciado ou em inicialização");
    return;
  }

  isStarting = true;
  reconnecting = false;

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  sock = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("Desktop"),
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) sendStatus({ status: "qr", data: qr });

    if (connection === "connecting") {
      sendStatus({ status: "connecting" });
    }

    if (connection === "open") {
      sendStatus({ status: "connected" });
      sock?.sendMessage("5518991276817@s.whatsapp.net", { text: "✅ Conectado ao WhatsApp Web!" });
      isStarting = false;
      reconnecting = false;
    }

    if (connection === "close") {
      sendStatus({ status: "disconnected" });

      sock = null;
      isStarting = false;

      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

      if (statusCode !== DisconnectReason.loggedOut) {
        reconnectSock();
      }
    }
  });
}


// ===============================
// 🔁 Reconexão automática
// ===============================
async function reconnectSock() {
  if (reconnecting) return;

  reconnecting = true;

  setTimeout(async () => {
    reconnecting = false;
    await startSock();
  }, 5000);
}



// ===============================
// ♻️ Reset completo (nova conta)
// ===============================
export async function resetWhatsappConnection() {
  sendStatus({ status: "resetting" });

  try {
    if (sock) {
      try {
        await sock.logout();
      } catch {}

      sock.end(undefined);
      sock = null;
    }

    await clearWhatsappSession();
    await startSock();
  } catch (error) {
    console.error("Erro ao resetar conexão:", error);
  }
}
