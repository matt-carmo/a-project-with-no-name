import { app, BrowserWindow } from "electron";
import { Boom } from "@hapi/boom";
import { fileURLToPath } from "url";
import path from "path";
import {
  makeWASocket,
  Browsers,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";

// import makeWASocket, { DisconnectReason } from "baileys";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
function sendStatus({ status, data }: { status: string; data?: any }) {
  win?.webContents.send("wa-status", { status, data });
}
async function startSock() {
  const sessionPath = path.join(app.getPath("userData"), "auth-info");
  console.log("Session Path:", sessionPath);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("Desktop"),
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      sendStatus({ status: "qr", data: qr });
    }
    if (connection === "connecting") {
      sendStatus({ status: "connecting" });
    }
    if (connection === "open") {
      sendStatus({ status: "connected" });
      await sock.sendPresenceUpdate("available");

      const numero = "5518991276817@s.whatsapp.net";

      await sock.sendMessage(numero, {
        text: "Sessão iniciada com sucesso! 🤖📲",
      });
    }
    if (connection === "close") {
      sendStatus("disconnected", lastDisconnect?.error);
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        // startSock();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  win?.webContents.once("did-finish-load", () => {
    startSock();
  });
});
