import { BrowserWindow } from "electron";
import path from "path";

export let mainWindow: BrowserWindow | null;

export function createMainWindow(rendererDist: string, preloadPath: string, devUrl?: string) {
  mainWindow = new BrowserWindow({
    icon: path.join(rendererDist, "electron-vite.svg"),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (devUrl) mainWindow.loadURL(devUrl);
  else mainWindow.loadFile(path.join(rendererDist, "index.html"));

  return mainWindow;
}
