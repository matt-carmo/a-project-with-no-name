import { useState } from "react";
import { useForm } from "react-hook-form";


// Interfaces
import { Complement } from "@/interfaces/menu.interface";

// UI
import { Field } from "../ui/field";
import Input from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetPanel,
} from "../ui/sheet";

// Features
import ComplementAction from "../complement-action";
import { ComplementStep } from "./ComplementStep";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type FormValues = {
  group: {
    id?: string;
    name: string;
    minSelected: number;
    maxSelected: number;
  };
  complements: {
    id?: string;
    name: string;
    description?: string;
    image?: { url: string; id: string };
    imagePreview?: string;
    productPrice: number;
  };
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

interface CreateGroupComplementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitGroup?: (data: any) => void;
}

export function CreateGroupComplementSheet({
  open,
  onOpenChange,
  onSubmitGroup,
}: CreateGroupComplementSheetProps) {
  const [step, setStep] = useState(1);
  const [itemsComplements, setItemsComplements] = useState<Complement[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, control, getValues, setValue, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        group: {
          id: "",
          name: "",
          minSelected: 0,
          maxSelected: 1,
        },
        complements: {
          id: "",
          name: "",
          description: "",
          image: undefined,
          productPrice: 0,
        },
      },
    });

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleAddComplement = () => {
    const values = getValues();

    const newComplement: Complement = {
      id: values.complements.id || crypto.randomUUID(),
      name: values.complements.name,
      description: values.complements.description,
      photoUrl: values.complements.image?.url,
      price: values.complements.productPrice,
      isAvailable: true,
      ...(values.complements.image
        ? { image: values.complements.image }
        : { image: null }),
    };
    console.log("New Complement: ", newComplement);
    setItemsComplements((prev) => [...prev, newComplement]);

    reset({
      ...values,
      complements: {
        name: "",
        description: "",
        image: undefined,
        productPrice: 0,
      },
    });

    setImagePreview(null);
  };

  const resetForm = () => {
    setStep(1);
    setItemsComplements([]);
    setImagePreview(null);
    reset();
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-secondary sm:max-w-2xl h-full "
      >
        <SheetHeader>
          <SheetTitle>Cadastrar complemento</SheetTitle>
        </SheetHeader>
        <SheetPanel className="h-full">
          <div className="space-y-6 h-full">
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
                      name: "",
                      minSelected: 0,
                      maxSelected: 1,
                      complements: [],
                      description: "",
                      products: [],
                      isAvailable: true,
                    }}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <ComplementStep
                register={register}
                getValues={getValues}
                control={control}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                items={itemsComplements}
                onAdd={handleAddComplement}
                onRemove={(id) =>
                  setItemsComplements((prev) => prev.filter((c) => c.id !== id))
                }
              />
            )}
          </div>
        </SheetPanel>

        <SheetFooter className="flex gap-2 border-0 rounded-0">
          {step === 1 && (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>

              <Button
                disabled={watch("group.name").trim() === ""}
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Avançar
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Voltar
              </Button>

              <Button
                className="flex-1"
                onClick={() => {
                  onSubmitGroup?.({
                    group: getValues("group"),
                    complements: itemsComplements,
                  });
                  onOpenChange(false);
                  handleClose();
                }}
              >
                Salvar grupo
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
