import { pusher } from "../lib/pusher";


export class RealtimeService {
  static async orderCreated(storeId: string, payload: any) {
    await pusher.trigger(
      `store-${storeId}`,
      "order-created",
      payload
    );
  }

  static async orderStatusUpdated(storeId: string, payload: any) {
    await pusher.trigger(
      `store-${storeId}`,
      "order-status-updated",
      payload
    );
  }
}
