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
import api from "@/api/axios";
import { Category } from "@/schemas/category.schema";
import { Controller, useForm } from "react-hook-form";
import BRLInput from "./BRLCurrencyInput";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toastManager } from "./ui/toast";
import { Spinner } from "./ui/spinner";
import { productSchema } from "@/schemas/product.shema";
import Stock from "./stock";
import { useSheetComplementStore } from "@/store/use-sheet-complement-store";
import { emitRefetch } from "@/lib/utils";
import ModalImage from "./modal-image";
import { useComplementStore } from "@/store/complement-store";
import { SheetUpdateComplementX } from "./Complement/sheet-update-complement";
import { useToggleTableList } from "@/hooks/use-toggle-table-list";
import { ComplementGroupChoiceStep } from "./Complement/ComplementGroupChoiceStep";
import { ComplementGroupSelectionStep } from "./Complement/ComplementGroupSelectionStep";
import { ComplementGroupConfigurationStep } from "./Complement/ComplementGroupConfigurationStep";
import { CreateGroupComplementSheet } from "./Complement/CreateGroupComplementWizard";

export interface ComplementGroup {
  id: string;
  name: string;

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

  const [stepsNumber, setStepsNumber] = useState(3);

  const {
    complements,
    setComplements,
    selectedComplements,
    setSelectedComplements,
  } = useComplementStore();

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
    watch,

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
      productComplementGroups: [],
    },
  });
  const handleNextStep = () => {
    const step1Data = {
      name: getValues("name"),
      description: getValues("description"),
      price: getValues("price"),

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
          return setError(issue.path[0] as any, {
            message: issue.message,
          });
        });
        return;
      }
    }
    if (step === 2) {
      if (complement === "new-complement") {
      
        setOpenCreateGroupComplementSheet(true);
      }
    }
    if (complement === "new-complement" && step === 3) {
    }
    if (step === 3 && selectedComplements.length === 0) {
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
    console.log("Selected Complements:", selectedComplements);
    if (selectedComplements.length === 0) {
      setError("productComplementGroups", {
        message: "Selecione pelo menos um complemento",
      });
    } else {
      setError("productComplementGroups", {
        message: "",
      });
    }
  }, [selectedComplements]);
  const getComplements = async function (): Promise<ComplementGroup[]> {
    const res = await api.get(`${category.storeId}/groups-complements`);
    setComplements(res.data);
    return res.data;
  };
  useEffect(() => {
    getComplements();
  }, []);

  useEffect(() => {
    setStepsNumber(complementIndexMap[complement] + 2);
  }, [complement]);

  const onSubmit = async (data: ProductInput) => {
    const complementGroupsWithoutId = selectedComplements.filter(
      (g) => g.id.length !== 25
    );

    let resultingComplementGroups: ComplementGroup[] = [];

    if (complementGroupsWithoutId.length > 0) {
      console.log("Creating new complement groups:", complementGroupsWithoutId);
      try {
        const createdGroups = await Promise.all(
          complementGroupsWithoutId?.map((group) =>
            api.post(`${category.storeId}/groups-complements`, {
              name: group.name,

              isAvailable: group.isAvailable,
              minSelected: group.minSelected,
              maxSelected: group.maxSelected,
              complements: group.complements.map((c) => ({
                name: c.name,
                price: c.price,
                isAvailable: true,
              })),
            })
          )
        );

        resultingComplementGroups = createdGroups.map((res) => res.data);

        toastManager.add({
          title: "Grupos de complementos criados com sucesso",
          type: "success",
        });
      } catch (err: any) {
        console.error("Erro ao criar grupos de complementos:", err);
        toastManager.add({
          title: "Erro ao criar grupos de complementos",
          type: "error",
          description: err?.response?.data?.message || "Falha inesperada...",
        });
        return;
      }
    }

    const formatedData =
      step !== 2
        ? {
            ...data,
            productComplementGroups: [
              ...selectedComplements
                .filter((g) => g.id.length === 25)
                .map((g) => ({
                  groupId: g.id!,
                  minSelected: g.minSelected,
                  maxSelected: g.maxSelected,
                })),

              ...resultingComplementGroups.map((g) => ({
                groupId: g.id,
                minSelected: g.minSelected,
                maxSelected: g.maxSelected,
              })),
            ],
          }
        : data;

    try {
      const res = await api.post(
        `stores/${category.storeId}/products/${category.id}`,
        formatedData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) {
        emitRefetch();
        toastManager.add({
          title: "Produto criado com sucesso",
          type: "success",
        });
        setOpen(false);
      } else {
        throw new Error("Erro inesperado ao criar produto");
      }
    } catch (err: any) {
      toastManager.add({
        title: "Erro ao criar produto",
        type: "error",
        description:
          err?.response?.data?.message ||
          "Erro no servidor... Contate o suporte",
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
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Spinner /> : "Criar"}
        </Button>
      );
    }
    return <Button onClick={handleNextStep}>Próximo {complement}</Button>;
  };

  const {
    open,
    setOpen,

    setOpenCreateComplementSheet,
  } = useSheetComplementStore();

  const [openCreateGroupComplement, setOpenCreateGroupComplementSheet] = useState(false);

  const { toggle: toggleComplement, isSelected: isComplementSelected } =
    useToggleTableList({
      selected: selectedComplements,
      setSelected: setSelectedComplements,
    });

  return (
    <>
      <SheetUpdateComplementX onOpenChange={() => setOpen(!open)} open={open} />
      <Sheet
        open={open}
        onOpenChange={() => {
          reset();
          setOpen(!open);
          setSelectedComplements([]);
          setStep(1);
        }}
      >
        <SheetTrigger>
          <Button>Adicionar produto</Button>
        </SheetTrigger>
        <SheetPopup
          className={"w-1/2 max-w-none justify-between max-h-screen "}
        >
          <form
            className="flex flex-col justify-between flex-1 max-h-screen"
            onSubmit={() => onSubmit(getValues())}
          >
            <SheetHeader className="h-full overflow-hidden">
              <SheetTitle>
                Adicionar produto na categoria{" "}
                <span className="font-bold">{category.name}</span>
              </SheetTitle>
              <div className="flex  gap-2">
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
                    <Input {...register("name")} type="text" />

                    {errors.name && (
                      <span className="text-destructive text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </Field>

                  {/* DESCRIÇÃO */}
                  <Field>
                    <FieldLabel>Descrição do produto</FieldLabel>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Textarea onChange={field.onChange} />
                      )}
                    />

                    {errors.description && (
                      <span className="text-destructive text-sm">
                        {errors.description.message}
                      </span>
                    )}
                  </Field>

                  {/* PREÇO */}
                  <Field>
                    <FieldLabel>Preço</FieldLabel>

                    <Controller
                      control={control}
                      name="price"
                      render={({ field }) => (
                        <BRLInput
                          value={field.value ?? 0}
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />

                    {errors.price && (
                      <span className="text-destructive text-sm">
                        {errors.price.message}
                      </span>
                    )}
                  </Field>

                  {/* IMAGEM */}
                  <Field>
                    <FieldLabel>Imagem</FieldLabel>

                    <Controller
                      control={control}
                      name="image"
                      render={({ field }) => (
                        <ModalImage onImageSelect={field.onChange} />
                      )}
                    ></Controller>
                  </Field>

                  {/* ESTOQUE */}
                  <Field>
                    <FieldLabel>Estoque</FieldLabel>
                    <Controller
                      control={control}
                      name="stock"
                      render={({ field }) => (
                        <Stock
                          stock={field.value ?? null}
                          onStockChange={field.onChange}
                        />
                      )}
                    ></Controller>
                  </Field>
                </div>
                {step === 2 && (
                  <ComplementGroupChoiceStep
                    value={complement as any}
                    
                    onChange={handleSetComplement}
                  />
                )}

                {step === 3 && (
                  <ComplementGroupSelectionStep
                    complements={complements}
                    selectedIds={selectedComplements.map((c) => c.id)}
                    isSelected={isComplementSelected}
                    onToggle={toggleComplement}
                    error={errors.productComplementGroups?.message}
                  />
                )}

                {step === 4 && (
                  <ComplementGroupConfigurationStep
                    complements={selectedComplements}
                    control={control}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                <div>
                  <div className="border aspect-470/945 rounded-4xl max-w-xs overflow-hidden relative">
                    <span className="block w-12 h-2.5 bg-black rounded-full absolute left-1/2 translate-x-[-50%] top-2"></span>
                    <img
                      src={
                        watch("image")?.url || "https://placehold.co/600x400"
                      }
                      alt=""
                    />
                 
                    <div className="p-4">
                      <div>
                        <h2 className="font-semibold">{watch("name")}</h2>
                        <p>{watch("description")}</p>
                      </div>
                      <ul>
                        {selectedComplements.map((complement) => (
                          <li key={complement.id}>
                            + {complement.name} ({complement.minSelected}-
                            {complement.maxSelected})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <SheetFooter>
              <Button variant="outline" onClick={handlePreviousStep}>
                Voltar
              </Button>
              <ButtonAction />
            </SheetFooter>
          </form>
        </SheetPopup>
      </Sheet>
      {/* <SheetCreateComplement
        onOpenChange={setOpenCreateComplementSheet}
        open={openCreateComplementSheet}
      /> */}

      <CreateGroupComplementSheet
        onSubmitGroup={(data) => {
          
          const group = {
            ...data.group,
            complements: data.complements,
            
          };
     

          console.log("New Complement Group: ", group);

        
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSelectedComplements((prev) => [group, ...prev] as any);
        }}
        onOpenChange={setOpenCreateGroupComplementSheet}
        open={openCreateGroupComplement}
      />
    </>
  );
}
