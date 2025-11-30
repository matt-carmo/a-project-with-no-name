import https from "https";

export function checkConnection(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = https.get("https://aisenseapi.com/services/v1/ping", (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.end();
  });
}
