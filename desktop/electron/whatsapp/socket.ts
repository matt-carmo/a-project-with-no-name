import { makeWASocket, Browsers, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import path from "path";
import { app } from "electron";
import { sendStatus } from "./status";
import { Boom } from "@hapi/boom";

let sock: ReturnType<typeof makeWASocket>;

export async function startSock() {
  const sessionPath = path.join(app.getPath("userData"), "auth-info");
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    if (connection === "connecting") sendStatus({ status: "connecting" });
    if (connection === "open") {
      sendStatus({ status: "connected" });
      await sock.sendPresenceUpdate("available");
    }
    if (connection === "close") {
      sendStatus({ status: "disconnected", data: lastDisconnect?.error });
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) reconnectSock();
    }
  });

  return sock;
}

let reconnecting = false;
async function reconnectSock() {
  if (reconnecting) return;
  reconnecting = true;
  setTimeout(async () => {
    sendStatus({ status: "connecting" });
    await startSock();
    reconnecting = false;
  }, 5000);
}
