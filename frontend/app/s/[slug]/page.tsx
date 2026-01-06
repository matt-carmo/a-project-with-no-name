"use client";
import { fetcher } from "@/api/axios";
import { Cart } from "@/components/Cart";
import { Menu } from "@/components/Menu";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

import Image from "next/image";
import { useEffect } from "react";
import useSWR from "swr";
export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string;
  coverUrl: string | null;
  address: string | null;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  settings: StoreSettings;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  isAvailable: boolean;
  order: number;
  deletedAt: string | null;
  products: Product[];
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  photoUrl: string;
  name: string;
  description: string;
  price: number; // em centavos (ex: 1280 = R$ 12,80)
  image: string | null;
  isAvailable: boolean;
  stock: number | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface StoreSettings {
  id: string;
  storeId: string;
  isOpen: boolean;
  minOrderValue: number;
  deliveryFee: number;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  openHours: string; // ex: "08:00-23:00"
}


export default function Home() {

  const {setSelectedStore} = useAuthStore();
  const { data, error, isLoading } = useSWR(
    "/stores/slug/lanchonete-central",
    fetcher
  );

  useEffect(() => {
    if (data) {
      setSelectedStore({ store: data });
    }
  }, [data, setSelectedStore]);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load store data</p>;
  return (
    <>
      <header className="bg-primary ">
        <div className={`bg-primary/90 backdrop-blur pt-1.5 px-4`}>
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${
                  data.settings?.isOpen ? "bg-green-500" : "bg-red-500"
                } opacity-75 animate-ping`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  data.settings?.isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </span>
            {data.settings?.isOpen ? "Loja aberta" : "Loja fechada"}
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-12 h-12 rounded-full border border-primary/80 flex items-center justify-center bg-white overflow-hidden">
            <Image
              src={data?.logoUrl}
              alt="Logo"
              width={40}
              height={40}
              className="object-cover aspect-square flex-1"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-white font-semibold text-lg leading-tight">
              {data?.name}
            </h1>
            <span className="text-white/80 text-xs">
              {data?.description || "Sem descrição"}
            </span>
          </div>
        </div>
      </header>

      <Menu  storeId={data.id} />
      <Cart />
     
    </>
  );
}
