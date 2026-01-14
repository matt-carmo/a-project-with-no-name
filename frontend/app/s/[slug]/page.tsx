"use client";
import { fetcher } from "@/api/axios";
import { Cart } from "@/components/Cart";
import { Menu } from "@/components/Menu";
import MenuSkeleton from "@/components/skeletons/menu-skeleton";
import StoreHeaderSkeleton from "@/components/skeletons/store-header-skeleton";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
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
  const { setSelectedStore } = useAuthStore();
  const { slug } = useParams();

  const { data, error, isLoading } = useSWR(
    `/stores/slug/${slug}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setSelectedStore({ store: data });
    }
  }, [data, setSelectedStore]);
  if (isLoading) {
    return (
      <>
        <StoreHeaderSkeleton />
        <MenuSkeleton />
      </>
    );
  }

  if (error) {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-red-500 text-2xl">!</span>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900">
        Loja indisponível
      </h2>

      <p className="text-sm text-zinc-500 mt-1 max-w-xs">
        Não conseguimos carregar os dados da loja.
        Verifique sua conexão ou tente novamente.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-5 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium"
      >
        Recarregar página
      </button>
    </div>
  );
}

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
          <Avatar className="w-12 h-12 border border-primary/80 bg-white">
            <AvatarImage
              src={data?.logoUrl}
              alt="Logo"
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {data?.name?.toString()
                ?.split(" ")
                .map((n: string[]) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "N/A"}
            </AvatarFallback>
          </Avatar>

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

      <Menu storeId={data.id} />
      <Cart />
    </>
  );
}
