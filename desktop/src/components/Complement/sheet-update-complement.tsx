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

import { useState } from "react";
import { z } from "zod";

import { Complement } from "@/interfaces/menu.interface";

import { useComplementStore } from "@/store/complement-store";
import { ComplementStep } from "./ComplementStep";

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
  const { setComplements, setSelectedComplements } = useComplementStore();

  const [itemsComplements, setItemsComplements] = useState<Complement[]>([]);

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

  const { register, control, getValues, setValue, reset, watch } =
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
      complements: { name: "", description: "", image: undefined}
    })
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

      image: values?.complements?.image || null,
      imagePreview: values.complements.imagePreview,
    };

    setItemsComplements((prev) => [...prev, newComplement]);

    reset({
      ...values,
      complements: { name: "", description: "", image: undefined, imagePreview: undefined, productPrice: 0},
      
    });
    setImagePreview(null);
  };

  // -----------------------------------

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={() => {
          onOpenChange();
          reset({
            complements: { name: "", description: "", image: undefined, imagePreview: undefined , productPrice: 0},
            group: { name: "", minSelected: 0, maxSelected: 0 },
            
          });
          setStep(1);
        }}
      >
        <SheetPopup className="max-w-2xl">
          <SheetHeader>
            <SheetTitle>Cadastrar complemento — Step {step}</SheetTitle>
          </SheetHeader>

          <SheetPanel>
            <ComplementStep
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
            />
          </SheetPanel>

          <SheetFooter>
            <SheetClose>
              <Button variant="secondary">Cancelar</Button>
            </SheetClose>

            <Button
              disabled={itemsComplements.length === 0}
              onClick={onCaptureGroup}
            >
              Adicionar grupo
            </Button>
          </SheetFooter>
        </SheetPopup>
      </Sheet>
    </>
  );
}
