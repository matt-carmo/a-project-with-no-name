import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
export default function SettingsPage() {
  const [qrCode, setQRCode] = useState<string | null>(null);
  useEffect(() => {
    // window.api.startQR();
    window.api.onQR((qr) => {
      setQRCode(qr);
    });
  }, []);
  return (
    <div className="p-2 bg-white">
      <div className="ml-12 mt-12"
        style={{
        
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "80%", width: "100%" }}
          value={qrCode ?? ""}
          viewBox={`0 0 200 200`}
        />
      </div>
    </div>
  );
}
