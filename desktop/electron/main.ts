import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { createMainWindow } from "./windows/mainWindow";
import { startSock } from "./whatsapp/socket";
import { checkConnection } from "./network/connection";

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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (!BrowserWindow.getAllWindows().length) createMainWindow(RENDERER_DIST, PRELOAD_PATH, DEV_URL);
});
