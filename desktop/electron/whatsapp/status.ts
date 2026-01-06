import { WhatsAppState } from "@/store/useWhatsAppStore";
import { mainWindow } from "../windows/mainWindow";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendStatus({ status, data }: { status: WhatsAppState['status']; data?: any }) {
  mainWindow?.webContents.send("wa-status", { status, data });
}
