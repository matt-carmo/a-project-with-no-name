import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "../ui/sheet";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

import { useEffect, useState } from "react";
import { z } from "zod";

import { Complement } from "@/interfaces/menu.interface";

import { useComplementStore } from "@/store/complement-store";
import { ComplementStep } from "./ComplementStep";
import { ComplementState } from "../sheet-create-product";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import api from "@/api/axios";
import { useParams } from "react-router";
import { ComplementGroup } from "@/schemas/complement-group.schema";
import { ScrollArea } from "../ui/scroll-area";
import { useToggleTableList } from "@/hooks/use-toggle-table-list";

const complementSchema = z.object({
  complements: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.any().optional(),
    productPrice: z.number().min(0),
  }),
});

export function SheetUpdateComplementX({
  onSubmitGroup,
  open,
  onOpenChange,
}: {
  onSubmitGroup?: (data: any) => void;
  open: boolean;
  onOpenChange: () => void;
}) {
  const [step, setStep] = useState(1);

  const [itemsComplements, setItemsComplements] = useState<Complement[]>([]);
  const [complement, setComplement] =
    useState<ComplementState>("none-complement");

  const {
    complements,
    setComplements,
    selectedComplements,
    setSelectedComplements,
  } = useComplementStore();
  const { toggle: toggleComplement, isSelected: isComplementSelected } =
    useToggleTableList({
      selected: selectedComplements,
      setSelected: setSelectedComplements,
    });

  const { id: storeId } = useParams();

  const getComplements = async function (): Promise<ComplementGroup[]> {
    const res = await api.get(`${storeId}/groups-complements`);

    console.log("RES COMPLEMENTS GROUPS:", complements);
    setComplements(res.data);
    return res.data;
  };
  useEffect(() => {
    getComplements();
  }, []);
  type FormValues = {
    group: {
      name: string;
      minSelected: number;
      maxSelected: number;
    };
    complements: {
      name: string;
      description?: string;
      image?: { url: string; id: string } | undefined;
      imagePreview?: string | undefined;
      productPrice: number;
    };
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, control, getValues, reset } =
    useForm<FormValues>({
      defaultValues: {
        group: {
          name: "X",
          minSelected: 1,
          maxSelected: 1,
        },
        complements: {
          name: "",
          description: "",
          image: undefined,
          imagePreview: undefined,
          productPrice: 0,
        },
      },
    });

  const onCaptureGroup = async () => {
    // const comps = complements;

    const data = {
      complements: itemsComplements.map((c) => ({
        name: c.name,
        description: c.description,
        price: c.price,
        photoUrl:
          c.image &&
            typeof c.image === "object" &&
            "url" in (c.image as Record<string, unknown>)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (c.image as Record<string, any>).url
            : null,
      })),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedComplements((prev) => [data, ...prev] as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setComplements((prev) => [data, ...prev] as any);

    setStep(1);
    reset({
      complements: { name: "", description: "", image: undefined },
    });
    setItemsComplements([]);
    setImagePreview(null);
    if (onSubmitGroup) {
      onSubmitGroup(data);
    }
    onOpenChange();

    // }
  };

  const onSubmitComplement = () => {
    const result = complementSchema.safeParse(getValues());

    if (!result.success) {
      console.log("Erros Step 2:", result.error.flatten());
      return;
    }

    const values = getValues();

    const newComplement: Complement = {
      name: values.complements.name,
      description: values.complements.description,
      price: values.complements.productPrice,
      isAvailable: true,
      image: values?.complements?.image || null,
      imagePreview: values.complements.imagePreview,
    };

    setItemsComplements((prev) => [...prev, newComplement]);

    reset({
      ...values,
      complements: {
        name: "",
        description: "",
        image: undefined,
        imagePreview: undefined,
        productPrice: 0,
      },
    });
    setImagePreview(null);
  };

  // -----------------------------------
  const handleSetComplement = (
    _complement: "none-complement" | "existing-complement" | "new-complement"
  ) => {
    if (_complement === complement) {
      return setComplement("none-complement");
    }
    setComplement(_complement);
  };
  return (
    <>
      <Sheet
        open={open}
        onOpenChange={() => {
          onOpenChange();
          reset({
            complements: {
              name: "",
              description: "",
              image: undefined,
              imagePreview: undefined,
              productPrice: 0,
            },
            group: { name: "", minSelected: 0, maxSelected: 0 },
          });
          setStep(1);
        }}
      >
        <SheetPopup className="max-w-2xl">
          <SheetHeader>
            <SheetTitle>Cadastrar complemento — Step... {step}</SheetTitle>
          </SheetHeader>

          <SheetPanel className="h-full">
            <div className={`${step === 1 ? "flex-1/3" : "hidden"}`}>
              <h2 className="text-2xl">Complementos</h2>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <Card
                  onClick={() => {
                    handleSetComplement("new-complement");
                  }}
                  className=""
                >
                  <div className="flex justify-end absolute top-2 right-2">
                    <button className="aspect-square w-5 h-5 bg-secondary  rounded-full flex items-center justify-center">
                      {complement === "new-complement" && (
                        <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
                      )}
                    </button>
                  </div>
                  <CardContent>
                    <CardTitle>Criar complemento</CardTitle>
                    <CardDescription>[...]</CardDescription>
                  </CardContent>
                </Card>
                <Card
                  onClick={() => handleSetComplement("existing-complement")}
                  className=""
                >
                  <div className="flex justify-end absolute top-2 right-2">
                    <button className="aspect-square w-5 h-5 bg-secondary  rounded-full flex items-center justify-center">
                      {complement === "existing-complement" && (
                        <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
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
            {step === 2 && complement === "new-complement" && (
              <ComplementStep
                getValues={() => { }}
                register={register}
                control={control}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                items={itemsComplements}
                onAdd={onSubmitComplement}
                onRemove={(name) =>
                  setItemsComplements((prev) =>
                    prev.filter((c) => c.name !== name)
                  )
                }
                onAddExisting={(complement) => {
                  setItemsComplements((prev) => [...prev, complement]);
                }}
              />
            )}
            {step === 2 && complement === "existing-complement" && (
              <div>
                <h2 className="text-2xl mb-4">Complementos existentes</h2>
                <ScrollArea className="">
                  {complements.map((complement) => (
                    <Card
                      onClick={() => toggleComplement(complement)}
                      key={complement.id}
                      className="mb-4 py-3 px-0"
                    >
                      <div className="flex justify-end absolute top-2 right-2">
                        <button className="aspect-square w-5 h-5 bg-secondary  rounded-full flex items-center justify-center">
                          <span
                            className={`block w-2.5 h-2.5 ${isComplementSelected(complement.id)
                              ? "bg-white"
                              : "bg-transparent"
                              } rounded-full`}
                          />
                        </button>
                      </div>
                      <CardContent className="px-3">
                        <CardTitle>{complement.name}</CardTitle>
                        {complement?.products?.length > 0 && (
                          <CardDescription className="line-clamp-1">
                            {" "}
                            Disponível em{" "}
                            {complement.products
                              .map((product) => product.product.name)
                              .join(", ")}
                          </CardDescription>
                        )}
                        {complement?.products?.length === 0 && (
                          <CardDescription>
                            Nenhum produto vinculado
                          </CardDescription>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </div>
            )}
          </SheetPanel>

          <SheetFooter className="flex justify-between">
            <Button>
              {step === 2 && (
                <span
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  Voltar
                </span>
              )}
            </Button>
            <div>
              <SheetClose>
                <Button variant="secondary">Cancelar</Button>
              </SheetClose>

              {/* <Button
              disabled={complement === 'none-complement'}
              onClick={onCaptureGroup}
            >
              Adicionar grupo
            </Button> */}
              <Button>
                {step === 1 ? (
                  <span
                    onClick={() => {
                      if (complement === "none-complement") return;
                      setStep(2);
                    }}
                  >
                    Próximo
                  </span>
                ) : (
                  <span onClick={onCaptureGroup}>Adicionar grupo</span>
                )}
              </Button>
            </div>
          </SheetFooter>
        </SheetPopup>
      </Sheet>
    </>
  );
}
