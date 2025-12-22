
import { OrderDetails } from "./OrderDetails";
import { OrderList } from "./OrderList";

import useOrderStore from "@/store/userOrderStore";


export default function OrdersPage() {
  const { orders, setSelectedOrder } = useOrderStore();


 const loading = false
  return (
    <div className="grid h-full grid-cols-[2fr_5fr] gap-4">
      <div className="bg-accent/20 flex-1 p-4">
        <OrderList orders={orders} loading={loading} />
      </div>

      <div className="bg-accent/20 flex-1 p-4">
        <OrderDetails />
      </div>

      {/* {error && (
        <div className="absolute bottom-4 left-4 text-sm text-destructive">
          {error}
        </div>
      )} */}
    </div>
  );
}
