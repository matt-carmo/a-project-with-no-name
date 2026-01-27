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

import { Complement, ComplementGroup } from "@/interfaces/menu.interface";

import { useComplementStore } from "@/store/complement-store";
import { ComplementStep } from "./ComplementStep";
import { ComplementState } from "../sheet-create-product";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import api from "@/api/axios";
import { useParams } from "react-router";

import { ScrollArea } from "../ui/scroll-area";
import { convertBRL } from "@/utils/convertBRL";


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
    setComplements,
    setSelectedComplements,
  } = useComplementStore();

  const [availableComplements, setAvailableComplements] = useState<Complement[]>(
    []
  );


  const { id: storeId } = useParams();

  const getComplements = async function (): Promise<ComplementGroup[]> {
    const res = await api.get(`${storeId}/groups-complements`);

    console.log("RES COMPLEMENTS GROUPS:", res.data);
    setComplements(res.data);

    const allComplements: Complement[] = [];
    const seenIds = new Set<string>();

    (res.data as ComplementGroup[]).forEach((group: ComplementGroup) => {
      group.complements?.forEach((comp: Complement) => {
        if (comp.id && !seenIds.has(comp.id)) {
          allComplements.push(comp);
          seenIds.add(comp.id);
        }
      });
    });
    setAvailableComplements(allComplements);

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
          c.photoUrl || (c.image && typeof c.image === "object" && "url" in c.image ? c.image.url : null),
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
                  <CardContent className="space-y-1">
                    <CardTitle>Criar Novo</CardTitle>
                    <CardDescription>
                      Crie um complemento novo para o seu produto.
                    </CardDescription>
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
                  <CardContent className="space-y-1">
                    <CardTitle>Vincular existente</CardTitle>
                    <CardDescription>
                      Selecione um complemento existente para vincular ao seu produto.
                    </CardDescription>
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
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 gap-4">
                    {availableComplements.map((item) => {
                      const isSelected = itemsComplements.some(
                        (c) => c.id === item.id
                      );
                      return (
                        <Card
                          onClick={() => {
                            if (isSelected) {
                              setItemsComplements((prev) =>
                                prev.filter((c) => c.id !== item.id)
                              );
                            } else {
                              setItemsComplements((prev) => [...prev, item]);
                            }
                          }}
                          key={item.id}
                          className={`relative py-3 px-4 cursor-pointer transition-colors ${isSelected ? "border-primary bg-primary/5" : "hover:bg-accent"
                            }`}
                        >
                          <div className="flex justify-end absolute top-2 right-2">
                            <div className={`aspect-square w-5 h-5 border-2 rounded-full flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                              }`}>
                              {isSelected && (
                                <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {(item.photoUrl || (item.image && typeof item.image === 'object' && 'url' in item.image)) && (
                              <img
                                src={item.photoUrl || (item.image as any)?.url}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="font-semibold text-lg">{item.name}</span>
                              {item.description && (
                                <span className="text-sm text-muted-foreground line-clamp-1">
                                  {item.description}
                                </span>
                              )}
                              <span className="font-medium mt-1">
                                {convertBRL(item.price)}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}

          </SheetPanel>

          <SheetFooter className="flex justify-between">
            {step === 2 && (
              <Button>
                <span
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  Voltar
                </span>
              </Button>
            )}
            <div>
              <SheetClose>
                <Button variant="secondary">Cancelar</Button>
              </SheetClose>
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
