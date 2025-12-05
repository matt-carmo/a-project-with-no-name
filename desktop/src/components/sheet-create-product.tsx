import {
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";

import { useEffect, useState } from "react";
import { Field, FieldLabel } from "./ui/field";
import Input from "./ui/input";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import api from "@/api/axios";
import { Category } from "@/schemas/category.schema";
// import ComplementAction from "./complement-action";
import { Controller, useForm } from "react-hook-form";
import BRLInput from "./BRLCurrencyInput";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import ComplementAction from "./complement-action";

export interface ComplementGroup {
  id: string;
  name: string;
  description: string;

  minSelected: number;
  maxSelected: number;
  isAvailable: boolean;
  storeId: string;
  products: GroupProduct[];
}

export interface GroupProduct {
  id: string;
  productId: string;
  groupId: string;
  product: ProductInfo;
}

export interface ProductInfo {
  name: string;
}
export const ComplementState = {
  NONE: "none-complement",
  EXISTING: "existing-complement",
  NEW: "new-complement",
} as const;

export type ComplementState =
  (typeof ComplementState)[keyof typeof ComplementState];
const complementIndexMap: Record<ComplementState, number> = {
  "none-complement": 0,
  "existing-complement": 2,
  "new-complement": 2,
};

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().min(0.01, "Preço inválido"),
  image: z.any().optional(),

  groups: z.array(
    z.object({
      id: z.string(),
      minSelected: z.number().min(0, "minSelected inválido"),
      maxSelected: z.number().min(1, "maxSelected inválido"),
    })
  ),
});

export type ProductInput = z.infer<typeof productSchema>;

export function SheetCreateProduct({ category }: { category: Category }) {
  const [step, setStep] = useState(1);
  const [complement, setComplement] = useState<ComplementState>(
    ComplementState.NONE
  );

  const [stepsNumber, setStepsNumber] = useState(3);

  const [complements, setComplements] = useState<ComplementGroup[]>([]);

  const [selectedsComplements, setSelectedsComplements] = useState<
    ComplementGroup[]
  >([]);

  const handleSelectComplement = (complement: ComplementGroup) => {
    if (selectedsComplements.includes(complement)) {
      setSelectedsComplements(
        selectedsComplements.filter((c) => c.id !== complement.id)
      );
    } else {
      setSelectedsComplements([...selectedsComplements, complement]);
    }
  };
  const handleSetComplement = (
    _complement: "none-complement" | "existing-complement" | "new-complement"
  ) => {
    if (_complement === complement) {
      return setComplement("none-complement");
    }
    setComplement(_complement);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getComplements = async function () {
    const res = await api.get(`${category.storeId}/complements`);
    setComplements(res.data as ComplementGroup[]);
  };
  useEffect(() => {
    getComplements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStepsNumber(complementIndexMap[complement] + 2);
  }, [complement]);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    // getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: undefined,
      groups: complements.map((g) => ({
        id: g.id,
        minSelected: g.minSelected,
        maxSelected: g.maxSelected,
      })),
    },
  });

  const onSubmit = async (data: ProductInput) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));

    // imagem
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    formData.append("groups", JSON.stringify(data.groups));

    const res = await api.post(`${category.storeId}/products`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    console.log(json);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const ButtonAction = () => {
    if (step === stepsNumber) {
      return <Button type='submit'>Salvar</Button>;
    }
    return <Button onClick={handleNextStep}>Proximo</Button>;
  };
  return (
    <Sheet onOpenChange={() => reset()}>
      <SheetTrigger>
        <Button>Adicionar produto</Button>
      </SheetTrigger>
      <SheetPopup className={"w-1/2 max-w-none justify-between"}>
        <form
          className='flex flex-col justify-between flex-1'
          onSubmit={handleSubmit(onSubmit)}
        >
          <SheetHeader>
            <SheetTitle>
              Adicionar produto na categoria{" "}
              <span className='font-bold'>{category.name}</span>
            </SheetTitle>
            <div className='flex flex-1 gap-2'>
              {Array.from({ length: stepsNumber }).map((_, index) => (
                <span
                  key={index}
                  className={`h-3 flex-1 ${
                    step > index ? "bg-primary" : "bg-secondary"
                  } rounded-full`}
                ></span>
              ))}
            </div>
            <div className={"flex flex-row flex-1 gap-4"}>
              <div
                className={`space-y-4 ${step === 1 ? "flex-1/3" : "hidden"}`}
              >
                {/* NOME */}
                <Field>
                  <FieldLabel>Nome do produto</FieldLabel>
                  <Input {...register("name")} type='text' />

                  {errors.name && (
                    <span className='text-destructive text-sm'>
                      {errors.name.message}
                    </span>
                  )}
                </Field>

                {/* DESCRIÇÃO */}
                <Field>
                  <FieldLabel>Descrição do produto</FieldLabel>
                  <Textarea {...register("description")} />

                  {errors.description && (
                    <span className='text-destructive text-sm'>
                      {errors.description.message}
                    </span>
                  )}
                </Field>

                {/* PREÇO */}
                <Field>
                  <FieldLabel>Preço</FieldLabel>

                  <Controller
                    control={control}
                    name='price'
                    render={({ field }) => (
                      <BRLInput
                        value={field.value ?? 0}
                        onChange={(value) => field.onChange(value / 100)}
                      />
                    )}
                  />

                  {errors.price && (
                    <span className='text-destructive text-sm'>
                      {errors.price.message}
                    </span>
                  )}
                </Field>

                {/* IMAGEM */}
                <Field>
                  <FieldLabel>Imagem</FieldLabel>
                  <Input {...register("image")} type='file' />
                </Field>

                {/* ESTOQUE */}
                <Field>
                  <FieldLabel>Estoque</FieldLabel>
                  <Button variant='outline'>
                    <ShoppingBag /> Ativar estoque
                  </Button>
                </Field>
              </div>
              <div className={`${step === 2 ? "flex-1/3" : "hidden"}`}>
                <h2 className='text-2xl'>Complementos</h2>

                <div className='grid grid-cols-2 gap-4 mt-2'>
                  <Card
                    onClick={() => handleSetComplement("new-complement")}
                    className='relative'
                  >
                    <div className='flex justify-end absolute top-2 right-2'>
                      <button className='aspect-square w-5 h-5 bg-secondary  rounded-full flex items-center justify-center'>
                        {complement === "new-complement" && (
                          <span className='block w-2.5 h-2.5 bg-white rounded-full'></span>
                        )}
                      </button>
                    </div>
                    <CardContent>
                      <CardTitle>Criar complemento</CardTitle>
                      <CardDescription>...</CardDescription>
                    </CardContent>
                  </Card>
                  <Card
                    onClick={() => handleSetComplement("existing-complement")}
                    className='relative'
                  >
                    <div className='flex justify-end absolute top-2 right-2'>
                      <button className='aspect-square w-5 h-5 bg-secondary  rounded-full flex items-center justify-center'>
                        {complement === "existing-complement" && (
                          <span className='block w-2.5 h-2.5 bg-white rounded-full'></span>
                        )}
                      </button>
                    </div>
                    <CardContent>
                      <CardTitle>Vincular complemento existente</CardTitle>
                      <CardDescription>...</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className={`${step === 3 ? "flex-1/3" : "hidden"}`}>
                <h2 className='text-2xl'>Complementos</h2>

                {complements.map((complement: ComplementGroup) => (
                  <Card
                    onClick={() => handleSelectComplement(complement)}
                    key={complement.id}
                    className='relative mb-4 py-3 px-0'
                  >
                    <div className='flex justify-end absolute top-2 right-2'>
                      <button className='aspect-square w-5 h-5 bg-secondary  rounded-full flex items-center justify-center'>
                        <span
                          className={`block w-2.5 h-2.5 ${
                            complement.id ===
                            selectedsComplements.find(
                              (c) => c.id === complement.id
                            )?.id
                              ? "bg-white"
                              : "bg-transparent"
                          } rounded-full`}
                        ></span>
                      </button>
                    </div>
                    <CardContent className='px-3'>
                      <CardTitle>{complement.name}</CardTitle>
                      {complement.products.length > 0 && (
                        <CardDescription>
                          {" "}
                          Disponível em{" "}
                          {complement.products
                            .map((product) => product.product.name)
                            .join(", ")}
                        </CardDescription>
                      )}
                      {complement.products.length === 0 && (
                        <CardDescription>
                          Nenhum produto vinculado
                        </CardDescription>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className={`${step === 4 ? "flex-1/3" : "hidden"}`}>
                <h2 className='text-2xl'>Complementos</h2>

                {selectedsComplements.map(
                  (complement: ComplementGroup, index) => (
                    <Card className='relative mb-4 py-3 px-0'>
                      <CardContent className='px-3'>
                        <CardTitle>{complement.name}</CardTitle>
                        {complement.products.length > 0 && (
                          <CardDescription>
                            {" "}
                            Disponível em{" "}
                            {complement.products
                              .map((product) => product.product.name)
                              .join(", ")}
                          </CardDescription>
                        )}
                        {complement.products.length === 0 && (
                          <CardDescription>
                            Nenhum produto vinculado
                          </CardDescription>
                        )}

                        <ComplementAction
                          control={control}
                          setValue={setValue}
                          watch={watch}
                          groupIndex={index}
                          key={complement.id}
                          props={complement}
                        />
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
              <div className='flex-1'>
                <div className='border aspect-470/945 rounded-4xl max-w-xs'>
                  <img src='https://i.imgur.com/rUsYzzJ.png' alt='' />
                  <div className='p-4'>
                    <div>
                      <h2 className='font-semibold'>Produto Teste</h2>
                      <p>Descrição</p>
                    </div>
                    <ul>
                      <li>...</li>
                      <li>...</li>
                      <li>...</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          <SheetFooter>
            <Button variant='outline' onClick={handlePreviousStep}>
              Voltar
            </Button>
            <ButtonAction />
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
