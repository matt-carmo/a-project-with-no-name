import api from "@/api/axios";
import BRLInput from "@/components/BRLCurrencyInput";
import ModalImage from "@/components/modal-image";
import Stock from "@/components/stock";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastManager } from "@/components/ui/toast";

import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export function DetailsProduct({ item }: { item: any }) {

  const navigate = useNavigate();
  const {

    control,
    handleSubmit,

    watch,

    formState: { errors, isSubmitting },
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

  const onSubmit = async (_data) => {
    const data = {
      name: _data.name,
      description: _data.description,
      price: _data.price,
      stock: _data.stock,
      isAvailable: _data.isAvailable,

      ...(_data?.image?.url && { image: _data.image }),
    };
    try {
      const res = await api.patch(
        `stores/${item.storeId}/products/${item.id}`,
        data
      );

      if (res.status === 200) {
        toastManager.add({
          type: "success",
          title: "Produto atualizado",
          timeout: 1500,
          description: `As informações do produto foram atualizadas com sucesso.`,
        });
        navigate(-1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastManager.add({
        type: "error",
        title: "Erro ao atualizar produto",
        timeout: 3000,
        description:
          "Log: " + error?.response?.data.errors.map((e) => e.message),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      <code className='text-lg'>{JSON.stringify(watch())}</code>

      <Label className='mt-4 mb-2'>Nome do Produto</Label>
      <Controller
        name='name'
        control={control}
        defaultValue={item.name}
        render={({ field }) => <Input {...field} />}
      />

      <Label className='mt-4 mb-2'>Descrição</Label>
      <Controller
        name='description'
        control={control}
        defaultValue={item.description}
        render={({ field }) => <Textarea {...field} />}
      />

      <Label className='mt-4 mb-2'>Preço</Label>
      <Controller
        name='price'
        control={control}
        defaultValue={item.price}
        render={({ field }) => (
          <BRLInput value={field.value} onChange={field.onChange} />
        )}
      />

      <Label className='mt-4 mb-2'>Imagem URL</Label>
      <Controller
        name='image'
        control={control}
        defaultValue={item.image ?? ""}
        render={({ field }) => <ModalImage onImageSelect={field.onChange} />}
      />

      <Field className='mt-4'>
        <FieldLabel>Estoque</FieldLabel>
        <Controller
          control={control}
          name='stock'
          defaultValue={item.stock ?? null}
          render={({ field }) => (
            <Stock stock={field.value} onStockChange={field.onChange} />
          )}
        />
      </Field>

      <Button className='mt-6 w-32' type='submit' disabled={isSubmitting}>
        Salvar
      </Button>
    </form>
  );
}
