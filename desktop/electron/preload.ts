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

contextBridge.exposeInMainWorld("api", {
  checkConnection: () => ipcRenderer.invoke("check-connection"),
})
contextBridge.exposeInMainWorld("whatsapp", {
  onQR: (callback: (data: string) => void) => ipcRenderer.on("qr", (_, data) => callback(data)),
  onStatus: (callback: (data: string) => void) =>
    ipcRenderer.on("wa-status", (_, data) => callback(data)),
  startSock: () => ipcRenderer.invoke("start-sock"),
  reset: () => ipcRenderer.invoke("whatsapp:reset"),
  start: () => ipcRenderer.invoke("whatsapp:start"),

  // onStatus: (callback: (status: any) => void) => {
  //   ipcRenderer.on("whatsapp:status", (_, data) => callback(data));
  // },
});
contextBridge.exposeInMainWorld("env", {
  BASE_URL: process.env.BASE_URL || "http://localhost:8080",
});
console.log("🔥 PRELOAD CARREGADO");

contextBridge.exposeInMainWorld("order", {
  sendStatus: (data: { phone: string; status: string; summary?: string }) =>
    ipcRenderer.invoke("order:send-status", data),
});



contextBridge.exposeInMainWorld('electron', {
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: any) =>
      ipcRenderer.invoke('store:set', key, value),
    delete: (key: string) =>
      ipcRenderer.invoke('store:delete', key),
  },
});