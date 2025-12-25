"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type Category = {
  id: string;
  name: string;
  products: Product[];
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  photoUrl: string | null;
  isAvailable: boolean;
  productComplementGroups: any[];
};

interface MenuProps {
  categories: Category[];
}
function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
console.log();

export function Menu({ categories }: MenuProps) {
  return (
    <main className="space-y-4 flex-1 overflow-hidden pt-3 px-3">
      <ScrollArea>
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="text-lg font-semibold mt-4 mb-2">{category.name}</h2>

            <div className="grid lg:grid-cols-3">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className={`flex gap-3 bg-white py-2.5  border-y border-black/5 ${
                    !product.isAvailable && "opacity-50"
                  }`}
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
                </div>
              ))}
            </div>
          </section>
        ))}
      </ScrollArea>
    </main>
  );
}
