import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

// const WINDOW_API = {
//   greeting: (name: string) =>
//     `Hello, ${name}! This message is from Preload script.`,
//   greet: () => "Hello from Preload Script!",
//   onQR: (callback: (data: string) => void) => {
//     ipcRenderer.on("qr", (_, data) => {
//       callback(data);
//     });
//   },
//    startQR: () => ipcRenderer.invoke('start-qr')
// };
// contextBridge.exposeInMainWorld("api", WINDOW_API);
contextBridge.exposeInMainWorld("whatsapp", {
  onQR: (callback) => ipcRenderer.on("qr", (_, data) => callback(data)),
  onConnected: (callback) => ipcRenderer.on("connected", (_, data) => callback(data)),
});

// contextBridge.exposeInMainWorld('whats', WINDOW_API)
