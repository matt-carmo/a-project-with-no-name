"use client";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { useProductStore } from "@/store/useProductStore";
import { MenuProps } from "@/app/types/menu";
import { formatPrice } from "@/lib/utils";
import { fetcher } from "@/api/axios";






export function Menu({ storeId }: { storeId: string }) {
  const { slug } = useParams();
  
  const {data, error, isLoading} = useSWR<MenuProps>(`/stores/${storeId}/customer-menu`, fetcher);

 const setProduct = useProductStore(state => state.setProduct);
  return (
    <main className="space-y-4 flex-1 overflow-hidden pt-3 px-3">
      <ScrollArea>
        {data?.map((category) => (
          <section key={category.id}>
            <h2 className="text-lg font-semibold mt-4 mb-2">{category.name}</h2>

            <div className="grid lg:grid-cols-3">
              {category.products.map((product) => (
                <Link
                  href={`${slug}/product/${product.id}`}
                  key={product.id}
                  onClick={() => setProduct(product)  }
                  className={`flex gap-3 bg-white py-2.5  border-y border-black/5`}
                >
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    {product.photoUrl ? (
                      <Image
                        src={product.photoUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover  w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-zinc-900">
                      {product.name}
                    </h3>

                    <p className="text-sm text-zinc-500 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </ScrollArea>
    </main>
  );
}
