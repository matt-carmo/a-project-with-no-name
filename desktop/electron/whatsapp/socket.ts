import {
  makeWASocket,
  Browsers,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import path from "path";
import fs from "fs/promises";
import { app } from "electron";
import { Boom } from "@hapi/boom";
import { sendStatus } from "./status";
import 'dotenv/config';


let sockInstance: ReturnType<typeof makeWASocket> | null = null;
let isStarting = false;
const answered = new Set<string>();
const sessionPath = path.join(app.getPath("userData"), "auth-info");

// 🔌 Getter do socket (IMPORTANTE)
// ===============================
export function getSock() {
  return sockInstance;
}


// ===============================
// 🧹 Limpa a sessão
// ===============================
export async function clearWhatsappSession() {
  try {
    await fs.rm(sessionPath, { recursive: true, force: true });
    console.log("🧹 Sessão removida");
  } catch (err) {
    console.error("Erro ao limpar sessão:", err);
  }
}

// ===============================
// ▶️ Inicia o socket
// ===============================
export async function startSock() {


  if (isStarting || sockInstance) {
    console.log("⚠️ Socket já iniciado");
    return;
  }

  isStarting = true;

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  sockInstance = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("Desktop"),
    printQRInTerminal: false,
    markOnlineOnConnect: true,
  });

  sockInstance.ev.on("creds.update", saveCreds);
  sockInstance.ev.on("messages.upsert", async ({ messages, type }) => {
    if(!sockInstance) return;

    if (type !== "notify") return;

    const msg = messages[0];
    console.log("📩 Nova mensagem recebida:", msg.key.remoteJid, msg.message);
    if (!msg.message || msg.key.fromMe || msg.key.remoteJid?.endsWith("@g.us")) return;

    const jid = msg.key.remoteJid!;
    if (answered.has(jid)) return;

    answered.add(jid);

    return;
    // await sockInstance.sendMessage(jid, {
    //   text: `Olá! 👋 Veja nosso cardápio:\n${process.env.VITE_FRONTEND_URL}/s/${selectedStore?.store.slug}`,
    // });
  });

  sockInstance.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) sendStatus({ status: "qr", data: qr });

    if (connection === "connecting") {
      sendStatus({ status: "connecting" });
    }

    if (connection === "open") {
      console.log("✅ WhatsApp conectado");
      sendStatus({ status: "connected" });

//       await sockInstance?.sendMessage(
//         "5518991276817@s.whatsapp.net",
//         {       text: `Olá! 👋 Veja nosso cardápio:\n${process.env.VITE_FRONTEND_URL}/s/${selectedStore?.store.slug}.com`,
//  }
//       );

      isStarting = false;
      return;
    }

    if (connection === "close") {

      if (DisconnectReason.loggedOut === (lastDisconnect?.error as Boom)?.output?.statusCode) {
        await clearWhatsappSession();
      }
      console.log("❌ WhatsApp desconectado");
      // sendStatus({ status: "" });

      sockInstance = null;
      isStarting = false;

      await startSock();
      // const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

      // if (statusCode !== DisconnectReason.loggedOut) {
      //   reconnectSock();
      // }
    }
  });
}


// ♻️ Reset completo
// ===============================
export async function resetWhatsappConnection() {
  console.log("♻️ Resetando conexão do WhatsApp...");
  sendStatus({ status: "qr" });

  try {
    if (sockInstance) {
      try {
        await sockInstance.logout()
        sockInstance = null;
        await clearWhatsappSession();
        startSock();
      } catch { }

      // sockInstance.end(undefined);
      // sockInstance = null;
    }


    ;

  } catch (err) {
    console.error("Erro ao resetar:", err);
  }
}
