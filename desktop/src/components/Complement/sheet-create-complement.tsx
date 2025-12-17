import { useSheetComplementStore } from "@/store/use-sheet-complement-store";
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
import { Field } from "../ui/field";
import Input from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { useEffect, useState } from "react";
import { z } from "zod";

import ComplementAction from "../complement-action";

import { Complement } from "@/interfaces/menu.interface";

import { useComplementStore } from "@/store/complement-store";
import { ComplementStep } from "./ComplementStep";

const complementSchema = z.object({
  complements: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.any().optional(),
  }),
  productPrice: z.number().min(0),
});

export function SheetCreateComplement({
  onSubmitGroup,


}: {
  onSubmitGroup?: (data: any) => void;
}) {
  const [step, setStep] = useState(1);

  const {open, setOpen} = useSheetComplementStore();
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
    };
    productPrice: number;
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, control, getValues, setValue, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        group: {
          name: "",
          minSelected: 1,
          maxSelected: 1,
        },
        complements: {
          name: "",
          description: "",
          image: undefined,
          imagePreview: undefined,
        },
        productPrice: 0,
      },
    });

  const onCaptureGroup = async () => {
    const group = getValues("group");
    // const comps = complements;

    const data = {
      id: Math.random().toString(20).substring(2, 9),
      minSelected: group.minSelected,
      maxSelected: group.maxSelected,
      name: group.name,
      isAvailable: true,

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
      group: { name: "", minSelected: 0, maxSelected: 0 },
      productPrice: 0,
    });
    setItemsComplements([]);
    setImagePreview(null);
    if (onSubmitGroup) {
      onSubmitGroup(data);
    }
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
      price: values.productPrice,

      image: values?.complements?.image || null,
      imagePreview: values.complements.imagePreview,
    };

    setItemsComplements((prev) => [...prev, newComplement]);

    reset({
      ...values,
      complements: { name: "", description: "", image: undefined },
      productPrice: 0,
    });
    // onOpenChange()
    setImagePreview(null);
  };

  // -----------------------------------

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
          reset({
            complements: { name: "", description: "", image: undefined },
            group: { name: "", minSelected: 0, maxSelected: 0 },
            productPrice: 0,
          });
          setStep(1);
        }}
      >
        <SheetPopup className="max-w-2xl">
          <SheetHeader>
            <SheetTitle>Cadastrar complemento — Step {step}</SheetTitle>
          </SheetHeader>

          <SheetPanel>
            {/* STEP 1 ----------------------- */}
            {step === 1 && (
              <div className="space-y-4">
                <Field>
                  <Label>Nome do grupo*</Label>
                  <Input
                    placeholder="Ex: Bebidas"
                    {...register("group.name")}
                  />
                </Field>

                <Field>
                  <Label>Configurações</Label>

                  <ComplementAction
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    nameBase="group"
                    props={{
                      maxSelected: 1,
                      minSelected: 1,
                      complements: [],
                      description: "",
                      products: [],
                      isAvailable: true,
                      name: "",
                    }}
                  />
                </Field>
              </div>
            )}

            {/* STEP 2 ----------------------- */}
            {step === 2 && (
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
            )}
          </SheetPanel>

          <SheetFooter>
            <SheetClose>
              <Button variant="secondary">Cancelar</Button>
            </SheetClose>

            {step === 1 && (
              <Button
                disabled={watch("group.name").trim() === ""}
                onClick={() => setStep(2)}
              >
                Avançar
              </Button>
            )}
            {step === 2 && (
              <Button
                disabled={itemsComplements.length === 0}
                onClick={onCaptureGroup}
              >
                Adicionar grupo
              </Button>
            )}
          </SheetFooter>
        </SheetPopup>
      </Sheet>
    </>
  );
}
