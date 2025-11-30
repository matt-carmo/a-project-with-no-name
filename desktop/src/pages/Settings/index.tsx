
import { useWhatsAppStore } from "@/store/useWhatsAppStore";

import QRCode from "react-qr-code";
export default function SettingsPage() {

const {qr, status} = useWhatsAppStore();


  if(status == "connected") return <div>Você já está conectado</div>
  return (  
    <div className="p-2 bg-white">
      <div className="max-w-sm">
        {}
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={qr || ""}
          viewBox={`0 0 200 200`}
        />
      </div>
    </div>
  );
}
