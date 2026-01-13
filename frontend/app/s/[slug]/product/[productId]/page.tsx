"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { useProductStore } from "@/store/useProductStore";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* =======================
   TIPOS
======================= */

type SelectedComplements = {
  [groupId: string]: {
    [complementId: string]: number;
  };
};

/* =======================
   COMPONENTE
======================= */

export default function ProductPage() {
  const { product } = useProductStore((state) => state);
  const router = useRouter();
  const { add } = useCart();

  const [selected, setSelected] = useState<SelectedComplements>({});

  if (!product) {
    return <p>Produto não encontrado</p>;
  }

  /* =======================
     FRASE DE INSTRUÇÃO
  ======================= */

  const phrase = ({ min, max }: { min: number; max: number }) => {
    if (min === 0 && max > 0) return `Escolha até ${max} opções`;
    if (max === 0 && min > 0) return `Escolha no mínimo ${min} opções`;
    if (min === max) return `Escolha ${min} opções`;
    return `Escolha entre ${min} e ${max} opções`;
  };

  /* =======================
     HELPERS
  ======================= */

  const updateComplement = (
    groupId: string,
    complementId: string,
    value: number
  ) => {
    setSelected((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [complementId]: value,
      },
    }));
  };

  const getGroupTotal = (groupId: string) => {
    return Object.values(selected[groupId] || {}).reduce(
      (sum, qty) => sum + qty,
      0
    );
  };

  const isGroupValid = (groupId: string, min: number, max: number) => {
    const total = getGroupTotal(groupId);
    return total >= min && total <= max;
  };

  const validateAllGroups = () => {
    return product.productComplementGroups.every(({ group }) =>
      isGroupValid(group.id, group.minSelected, group.maxSelected)
    );
  };
  const getComplementsTotal = () => {
    let total = 0;

    product.productComplementGroups.forEach(({ group }) => {
      group.complements.forEach((complement) => {
        const qty = selected[group.id]?.[complement.id] ?? 0;

        total += qty * complement.price;
      });
    });

    return total;
  };
  const getTotalPrice = () => {
    return product.price + getComplementsTotal();
  };

  const buildComplements = () => {
    const complements: Array<{
      groupId: string;
      complementId: string;
      name: string;
      price: number;
      quantity: number;
    }> = [];

    product.productComplementGroups.forEach(({ group }) => {
      group.complements.forEach((complement) => {
        const qty = selected[group.id]?.[complement.id] ?? 0;

        if (qty > 0) {
          complements.push({
            groupId: group.id,
            complementId: complement.id,
            name: complement.name,
            price: complement.price,
            quantity: qty,
          });
        }
      });
    });

    return complements;
  };
  const handleAddToCart = () => {
    const complements = buildComplements();

    const unitTotalPrice =
      product.price +
      complements.reduce((sum, c) => sum + c.price * c.quantity, 0);

    add({
      id: generateCartItemId(complements),
      product,

      complements,
      quantity: 1,
      totalPrice: unitTotalPrice,
    });

    router.back(); // opcional: voltar após adicionar
  };

  const generateCartItemId = (complements: any[]) => {
    return `${product.id}-${complements
      .map((c) => `${c.complementId}:${c.quantity}`)
      .join("|")}`;
  };

  return (
    <div className="pb-20 mx-auto relative">
      {/* VOLTAR */}
      <button
        className="fixed top-2 left-2 bg-primary-foreground p-1 rounded-full z-10"
        onClick={() => router.back()}
      >
        <ArrowLeft />
      </button>

      {/* IMAGEM */}
      <Image
        src={product.photoUrl || ""}
        alt={product.name}
        className="object-cover aspect-3/2"
        width={800}
        height={800}
      />

      {/* INFO PRODUTO */}
      <div className="p-4 space-y-2">
        <h1 className="font-semibold text-lg">{product.name}</h1>
        <p className="text-sm">{product.description}</p>
        <p className="font-medium">{formatPrice(product.price)}</p>
      </div>

      {/* COMPLEMENTOS */}
      <ul>
        {product.productComplementGroups.map(({ group }) => {
          const totalSelected = getGroupTotal(group.id);
         

          return (
            <li key={group.id} className="border-t p-4">
              <Card className="mb-2 py-0 bg-accent-foreground/10 border-0">
                <CardContent className="px-2 py-3">
                  <div>
                    <h2 className="font-semibold text-lg">{group.name}</h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {phrase({
                        min: group.minSelected,
                        max: group.maxSelected,
                      })}
                    </p>
                    {group.minSelected > 0 && (
                      <Badge variant={"default"} className="mt-1">
                        Obrigatório
                      </Badge>
                    )}
                    {group.minSelected === 0 && (
                      <Badge variant="outline" className="mt-1">
                        Opcional
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <ul className="space-y-2">
                {group.complements.map((complement) => {
                  const currentValue = selected[group.id]?.[complement.id] ?? 0;

                  const reachedMax = totalSelected >= group.maxSelected;

                  return (
                    <li
                      key={complement.id}
                      className="flex justify-between items-center border-b border-muted-foreground/20 pb-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{complement.name}</span>
                        <span className="text-sm">
                          {complement.price > 0 &&
                            `+ ${formatPrice(complement.price)}`}
                        </span>
                      </div>
                      <NumberField
                        min={0}
                        value={currentValue}
                        onValueChange={(value) =>
                          updateComplement(
                            group.id,
                            complement.id,
                            value as number
                          )
                        }
                        className="w-28"
                      >
                        <NumberFieldGroup>
                          <NumberFieldDecrement />
                          <NumberFieldInput className="p-0" />
                          <NumberFieldIncrement disabled={reachedMax} />
                        </NumberFieldGroup>
                      </NumberField>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      {/* BOTÃO FINAL */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex">
        <button
          onClick={handleAddToCart}
          disabled={!validateAllGroups()}
          className="flex-2 h-12 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
        >
          Adicionar
        </button>

        <div className="flex items-center justify-center font-semibold flex-1 text-nowrap">
          Total: {formatPrice(getTotalPrice())}
        </div>
      </div>
    </div>
  );
}
