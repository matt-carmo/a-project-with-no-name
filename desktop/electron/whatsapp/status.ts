import { mainWindow } from "electron/windows/mainWindow";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendStatus({ status, data }: { status: string; data?: any }) {
  mainWindow?.webContents.send("wa-status", { status, data });
}
