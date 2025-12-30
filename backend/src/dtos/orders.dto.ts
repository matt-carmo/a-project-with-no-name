import { OrderStatus } from "@prisma/client";

export interface CreateOrderDTO {
  storeId: string;

  customerName?: string;
  customerPhone?: string;

  items: {
    productId: string;
    quantity: number;
    complements: {
      complementId: string;
      quantity: number;
    }[];
  }[];

  address?: {
    road: string;
    number?: string;
    district: string; // bairro
    city: string;
    state: string;
    zipCode?: string;
    complement?: string;

    lat: number;
    lon: number;
  };
}
