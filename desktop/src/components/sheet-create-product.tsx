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

import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import api from "@/api/axios";
import { Category } from "@/schemas/category.schema";
import { Controller, useForm } from "react-hook-form";
import BRLInput from "./BRLCurrencyInput";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import ComplementAction from "./complement-action";
import { toastManager } from "./ui/toast";
import { Spinner } from "./ui/spinner";
import { productSchema } from "@/schemas/product.shema";
import Stock from "./stock";
import { useSheetComplementStore } from "@/store/use-sheet-complement-store";
import { emitRefetch } from "@/lib/utils";

import { SheetCreateComplement } from "./sheet-create-complement";
import { ScrollArea } from "./ui/scroll-area";

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

const productSchemaWithoutStoreId = productSchema.omit({ storeId: true });
export type ProductInput = z.infer<typeof productSchemaWithoutStoreId>;

export function SheetCreateProduct({ category }: { category: Category }) {
  const [step, setStep] = useState(1);
  const [complement, setComplement] = useState<ComplementState>(
    ComplementState.NONE
  );
  const { setOpen: openCreateComplement } = useSheetComplementStore();
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
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    getValues,

    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchemaWithoutStoreId),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      photoUrl: "",
      stock: undefined,
      isAvailable: true,
      productComplementGroups: complements.map((g) => ({
        groupId: g.id,
        minSelected: g.minSelected,
        maxSelected: g.maxSelected,
      })),
    },
  });
  const handleNextStep = () => {
    const step1Data = {
      name: getValues("name"),
      description: getValues("description"),
      price: getValues("price"),
      image: getValues("image"),
      productComplementGroups: getValues("productComplementGroups"),
    };
    if (step === 1) {
      const step1Schema = productSchema.pick({
        name: true,
        description: true,
        image: true,
        price: true,
      });
      const result = step1Schema.safeParse(step1Data);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return setError(issue.path[0] as any, {
            message: issue.message,
          });
        });
        return;
      }
    }
    if (step === 2) {
      if (complement === "new-complement") {
        openCreateComplement(true);
      }
    }
    if (step === 3 && selectedsComplements.length === 0) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setError("productComplementGroups", {
        message: "Selecione pelo menos um complemento",
      });
      return;
    }
    setStep(step + 1);
  };
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  useEffect(() => {
    if (selectedsComplements.length === 0) {
      setError("productComplementGroups", {
        message: "Selecione pelo menos um complemento",
      });
    } else {
      setError("productComplementGroups", {
        message: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedsComplements]);
  const getComplements = async function (): Promise<ComplementGroup[]> {
    const res = await api.get(`${category.storeId}/complements`);
    setComplements(res.data as ComplementGroup[]);
    return res.data;
  };
  useEffect(() => {
    getComplements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStepsNumber(complementIndexMap[complement] + 2);
  }, [complement]);

  const onSubmit = async (data: ProductInput) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price / 100));
    formData.append("categoryId", category.id);
    formData.append("isAvailable", String(data.isAvailable));
    formData.append("stock", String(data.stock));
    // imagem

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    if (data.productComplementGroups) {
      formData.append(
        "productComplementGroups",
        JSON.stringify(
          data.productComplementGroups.map((g) => ({
            groupId: g.id,
            minSelected: g.minSelected,
            maxSelected: g.maxSelected,
          }))
        )
      );
    }

    const res = await api.post(
      `stores/${category.storeId}/products`,
      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 201) {
      emitRefetch();
      toastManager.add({
        title: "Produto criado com sucesso",
        type: "success",
      });
      setOpen(false);
    } else {
      toastManager.add({
        title: "Erro ao criar produto",
        type: "error",
        description:
          res?.data?.message || "Erro no servidor... Contate o suporte",
      });
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const ButtonAction = () => {
    if (step === stepsNumber) {
      return (
        <Button
          onClick={() => console.log(getValues())}
          disabled={isSubmitting}
          type='submit'
        >
          {isSubmitting ? <Spinner /> : "Criar"}
        </Button>
      );
    }
    return <Button onClick={handleNextStep}>Próximo</Button>;
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <SheetCreateComplement
        onCreateComplement={async (element) => {
          const complements = await getComplements();
          const findComplement = complements.find(
            (c) => c.id === element.id
          )          
          if (!findComplement) {
            return;
          }          
          setSelectedsComplements((prev) => [...prev, findComplement]);
        
        }}
      />
      <Sheet
        open={open}
        onOpenChange={() => {
          reset();
          setOpen(!open);
          setSelectedsComplements([]);
          setStep(1);
        }}
      >
        <SheetTrigger>
          <Button>Adicionar produto</Button>
        </SheetTrigger>
        <SheetPopup className={"w-1/2 max-w-none justify-between max-h-screen "}>
          <form
            className='flex flex-col justify-between flex-1 max-h-screen'
            onSubmit={handleSubmit(onSubmit)}
          >
            <SheetHeader className="h-full overflow-hidden">
              <SheetTitle>
                Adicionar produto na categoria{" "}
                <span className='font-bold'>{category.name}</span>
              </SheetTitle>
              <div className='flex  gap-2'>
                {Array.from({ length: stepsNumber }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-3 flex-1 ${
                      step > index ? "bg-primary" : "bg-secondary"
                    } rounded-full`}
                  ></span>
                ))}
              </div>
              <div className={"flex flex-row flex-1 gap-4 relative"}>
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
                          onChange={(value) => field.onChange(value)}
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
                    <Controller
                      control={control}
                      name='stock'
                      render={({ field }) => (
                        <Stock
                          stock={field.value ?? null}
                          onStockChange={field.onChange}
                        />
                      )}
                    ></Controller>
                  </Field>
                </div>
                <div className={`${step === 2 ? "flex-1/3" : "hidden"}`}>
                  <h2 className='text-2xl'>Complementos</h2>

                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <Card
                      onClick={() => {
              
                        handleSetComplement("new-complement")
                      }}
                      className=''
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
                      className=''
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
                  {errors.productComplementGroups && (
                    <span className='text-destructive text-sm'>
                      {errors.productComplementGroups.message}
                    </span>
                  )}

                 <ScrollArea className="max-h-[-webkit-fill-available] absolute">
                   {complements.map((complement: ComplementGroup) => (
                    <Card
                      onClick={() => handleSelectComplement(complement)}
                      key={complement.id}
                      className='mb-4 py-3 px-0'
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
                 </ScrollArea>
                </div>
                <div className={`${step === 4 ? "flex-1/3" : "hidden"}`}>
                  <h2 className='text-2xl'>Complementos</h2>

                  {selectedsComplements.map(
                    (complement: ComplementGroup, index) => (
                      <Card className=' mb-4 py-3 px-0'>
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
                            // watch={watch}
                            nameBase={`productComplementGroups.${index}`}
                            key={complement.id}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            props={complement as any}
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
    </>
  );
}
