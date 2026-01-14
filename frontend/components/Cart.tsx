'use client";';
import { useCart } from "@/store/useCart";
import { ChevronDown, ShoppingBag, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { useParams, useRouter } from "next/navigation";

export function Cart() {
  const { items, total, quantity, remove } = useCart();

  const [open, setOpen] = useState(false);
  const navigation = useRouter();
  const { slug } = useParams();

  return (
    items.length > 0 && (
      <footer>
        <div className="px-3 pb-3">
          <div className="w-full bg-primary text-white rounded-2xl px-4 py-3 shadow-lg flex flex-col gap-2">
            <ScrollArea className={`max-h-1/2 ${!open && "h-0"}`}>
              <Button variant={"ghost"} onClick={() => setOpen(!open)}>
                <ChevronDown className="mx-auto" />
              </Button>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-2.5 border-y border-black/5"
                >
                  {/* IMAGEM */}
                  <div className="h-14 w-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    {item.product.photoUrl ? (
                      <Image
                        src={item.product.photoUrl}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">
                        Sem foto
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium flex items-center gap-1 leading-tight">
                      <div className="bg-primary-foreground/10 w-4.5 flex justify-center items-center  aspect-square rounded-full text-xs">
                        {item.quantity}
                      </div>{" "}
                      {item.product.name}
                    </h3>

                    {/* COMPLEMENTOS */}
                    {item.complements.length > 0 && (
                      <ul className="text-sm space-y-1">
                        {item.complements.map((c) => (
                          <li
                            className="flex items-center gap-1"
                            key={c.complementId}
                          >
                            <div className="bg-primary-foreground/10 w-4.5 flex justify-center items-center  aspect-square rounded-full text-xs">
                              {c.quantity}
                            </div>{" "}
                            {c.name}
                            {c.price > 0 && ` (+${formatPrice(c.price)})`}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* PREÇO E QUANTIDADE */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-semibold text-sm ">
                        {formatPrice(item.totalPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Button
                      size="icon"
                      className="hover:text-foreground/70 bg-white hover:bg-white border-white/30"
                      onClick={() => remove(item.id)}
                    >
                      <Trash className="text-foreground " />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <ShoppingBag size={18} />
              </div>

              <div className="flex-1 leading-tight">
                <span className="text-sm text-white/80">Total com entrega</span>

                <div className="font-semibold text-base">
                  {formatPrice(total())} / {quantity()} itens
                </div>
              </div>

              {!open && (
                <Button
                  
                  onClick={() => setOpen(true)}
                  className=" text-primary bg-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white hover:text-primary"
                >
                  Ver carrinho
                </Button>
              )}
              {open && (
                <Button
                  onClick={() => navigation.push(`${slug}/checkout`)}
                  variant="default"
                  className=" text-primary bg-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white"
                >
                  Continuar
                </Button>
              )}
            </div>
          </div>
        </div>
      </footer>
    )
  );
}
