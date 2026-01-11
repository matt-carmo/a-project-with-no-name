import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { createMainWindow } from "./windows/mainWindow";
import { resetWhatsappConnection, startSock } from "./whatsapp/socket";
import { checkConnection } from "./network/connection";
import { fileURLToPath } from "url";
import { sendOrderStatus } from "./services/whatsapp";
import { electronStore } from './store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RENDERER_DIST = path.join(__dirname, "../dist");
const PRELOAD_PATH = path.join(__dirname, "preload.mjs");
const DEV_URL = process.env["VITE_DEV_SERVER_URL"];

app.whenReady().then(() => {
  createMainWindow(RENDERER_DIST, PRELOAD_PATH, DEV_URL).webContents.once("did-finish-load", () => {
    startSock();
  });
});

ipcMain.handle("check-connection", async () => {
  return await checkConnection();
});
ipcMain.handle("start-sock", async () => {
  startSock();
});

ipcMain.handle("whatsapp:reset", async () => {
  await resetWhatsappConnection();
  return { ok: true };
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (!BrowserWindow.getAllWindows().length) createMainWindow(RENDERER_DIST, PRELOAD_PATH, DEV_URL);
});


ipcMain.handle(
  "order:send-status",
  async (_event, payload) => {
    console.log("IPC received:", payload);

    if (
      !payload ||
      typeof payload.phone !== "string" ||
      typeof payload.status !== "string"
    ) {
      throw new Error("Dados inválidos (payload malformado)");
    }

    const { phone, status } = payload;

    const allowedStatus = [
      "PENDING",
      "CONFIRMED",
      "IN_PREPARATION",
      "READY",
      "IN_DELIVERY",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatus.includes(status)) {
      throw new Error(`Status inválido: ${status}`);
    }

    await sendOrderStatus(phone, status);

    return { success: true };
  }
);


ipcMain.handle('store:get', (_, key) => {
  return electronStore.get(key);
});

ipcMain.handle('store:set', (_, key, value) => {
  electronStore.set(key, value);
});

ipcMain.handle('store:delete', (_, key) => {
  electronStore.delete(key);
});
