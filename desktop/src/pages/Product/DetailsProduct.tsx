
import BRLInput from "@/components/BRLCurrencyInput";
import ModalImage from "@/components/modal-image";
import Stock from "@/components/stock";
import { Field, FieldLabel } from "@/components/ui/field";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";


export function DetailsProduct({ item, onChange }: { item: any, onChange: (data: any) => void }) {
  if (!item) return null;
  
  const {
    control,
    watch,

  } = useForm({
    // resolver: zodResolver(productSchemaWithoutStoreId),
    defaultValues: {
      stock: item.stock,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.photoUrl,
      isAvailable: item.isAvailable,
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  

  return (
    <form
      
      className="flex flex-col justify-between"
    >
      {/* <code className="text-lg">{JSON.stringify(watch())}</code> */}

      <div>
        <Label className="mt-4 mb-2">Nome do Produto</Label>
        <Controller
          name="name"
          control={control}
          defaultValue={item.name}
          render={({ field }) => <Input {...field} />}
        />

        <Label className="mt-4 mb-2">Descrição</Label>
        <Controller
          name="description"
          control={control}
          defaultValue={item.description}
          render={({ field }) => <Textarea {...field} />}
        />

        <Label className="mt-4 mb-2">Preço</Label>
        <Controller
          name="price"
          control={control}
          defaultValue={item.price}
          render={({ field }) => (
            <BRLInput value={field.value} onChange={field.onChange} />
          )}
        />

        <Label className="mt-4 mb-2">Imagem URL</Label>
        <Controller
          name="image"
          control={control}
          defaultValue={item.photoUrl}
          render={({ field }) => (
            <div className="w-20">
              <ModalImage
                defaultSelectedImage={item.photoUrl}
                onImageSelect={field.onChange}
              />
            </div>
          )}
        />

        <Field className="mt-4">
          <FieldLabel>Estoque</FieldLabel>
          <Controller
            control={control}
            name="stock"
            defaultValue={item.stock ?? null}
            render={({ field }) => (
              <Stock stock={field.value} onStockChange={field.onChange} />
            )}
          />
        </Field>
      </div>
    </form>
  );
}
