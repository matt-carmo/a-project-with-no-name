"use client";

import { useCart } from "@/store/useCart";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth-store";
import { withMask } from "use-mask-input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { ChevronRight, MapPin } from "lucide-react";

/* =======================
   TIPOS
======================= */
type PaymentMethod = "pix" | "credit" | "debit" | "cash";

type GeocodeResult = {
  displayName: string;
  lat: number;
  lon: number;
  road: string;
  city: string;
  state: string;
};

/* =======================
   ZOD SCHEMA
======================= */
const checkoutSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11, {
      message: "Telefone inválido",
    }),
  address: z.object({
    displayName: z.string().min(1, "Selecione um endereço"),
    number: z.string().min(1, "Informe o número"),
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { items, total, quantity, clear } = useCart();
  const { selectedStore } = useAuthStore();

  /* =======================
     FORM
  ======================= */
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: {
        displayName: "",
        number: "",
        city: "",
        latitude: undefined,
        longitude: undefined,
      },
    },
  });

  /* =======================
     ENDEREÇO
  ======================= */
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);

  /* =======================
     PAGAMENTO
  ======================= */
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");

  /* =======================
     DEBOUNCE GEOCODE
  ======================= */
  useEffect(() => {
    if (search.length < 4) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await api.get("/geocode", {
          params: { q: search },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Erro ao buscar endereço", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleSelectAddress(item: GeocodeResult) {
    setValue("address.displayName", item.displayName);
    setValue("address.city", item.city);
    setValue("address.latitude", item.lat);
    setValue("address.longitude", item.lon);

    setSearch(item.displayName);
    setResults([]);
    setAddressSelected(true);
  }

  /* =======================
     FINALIZAR PEDIDO
  ======================= */
  async function onSubmit(data: CheckoutFormData) {
    const _items = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      complements:
        item.complements.map((c) => ({
          complementId: c.complementId,
          quantity: c.quantity,
        })) || [],
    }));

    const order = {
      slug,
      customerName: data.name,
      customerPhone: data.phone,

      items: _items,

      address: {
        road: data.address.displayName,
        number: data.address.number,
        city: data.address.city,
        lat: data.address.latitude,
        lon: data.address.longitude,
      },

      paymentMethod,
      total: total(),
    };

    await api.post(`/stores/${selectedStore?.store.id}/orders`, order);

    clear();
    router.push("success");
  }

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">Checkout</h1>

      {/* =======================
          CLIENTE
      ======================= */}
      <section className="space-y-3">
        <h2 className="font-medium">Seus dados</h2>

        <Input placeholder="Nome" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Telefone / WhatsApp"
              type="tel"
              ref={withMask("(99) 99999-9999")}
            />
          )}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </section>

      {/* =======================
          ENDEREÇO
      ======================= */}
      <section className="space-y-3">
        <h2 className="font-medium">Selecione seu endereço</h2>

        {!addressSelected && (
          <div className="relative">
            <Input
              placeholder="Pesquisar endereço"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading && (
              <p className="text-xs text-muted-foreground mt-1">
                Buscando endereço...
              </p>
            )}

            {results.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow">
                {results.map((item, index) => (
                  <div key={index} className="flex items-center border-b last-of-type:border-0 p-1">
                    <MapPin />
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm"
                      onClick={() => handleSelectAddress(item)}
                    >
                      {item.displayName}
                    </button>
                    <ChevronRight className="ml-auto mr-1" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {errors.address?.displayName && (
          <p className="text-xs text-red-500">
            {errors.address.displayName.message}
          </p>
        )}

        {addressSelected && (
          <div className="rounded-xl border p-4 space-y-2 bg-muted/40">
            <p className="text-sm font-medium">Endereço selecionado</p>

            <p className="text-sm">{search}</p>

            <Input placeholder="Número" {...register("address.number")} />
            {errors.address?.number && (
              <p className="text-xs text-red-500">
                {errors.address.number.message}
              </p>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAddressSelected(false);
                setSearch("");
              }}
            >
              Editar endereço
            </Button>
          </div>
        )}
      </section>

      {/* =======================
          PAGAMENTO
      ======================= */}
      <section className="space-y-3">
        <h2 className="font-medium">Forma de pagamento</h2>
        <p>Na entrega</p>

        <div className="flex gap-2 flex-wrap">
          {[
            { label: "PIX", value: "pix" },
            { label: "Crédito", value: "credit" },
            { label: "Débito", value: "debit" },
            { label: "Dinheiro", value: "cash" },
          ].map((method) => (
            <Button
              key={method.value}
              variant={paymentMethod === method.value ? "default" : "outline"}
              onClick={() => setPaymentMethod(method.value as PaymentMethod)}
            >
              {method.label}
            </Button>
          ))}
        </div>
      </section>

      {/* =======================
          RESUMO
      ======================= */}
      <section className="space-y-3">
        <h2 className="font-medium">Resumo do pedido</h2>

        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start border-b pb-2">
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-100">
              {item.product.photoUrl && (
                <Image
                  src={item.product.photoUrl}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-sm">
                {item.quantity}x {item.product.name}
              </p>
            </div>

            <span className="text-sm font-semibold">
              {formatPrice(item.totalPrice * item.quantity)}
            </span>
          </div>
        ))}

        <div className="flex justify-between font-semibold pt-2">
          <span>Total ({quantity()} itens)</span>
          <span>{formatPrice(total())}</span>
        </div>
      </section>

      <Button
        className="w-full h-12 text-base font-semibold"
        onClick={handleSubmit(onSubmit)}
      >
        Finalizar pedido
      </Button>
    </div>
  );
}
