import { useSheetComplementStore } from "@/store/use-sheet-complement-store";
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Controller, useForm } from "react-hook-form";
import { Field } from "./ui/field";
import Input from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import BRLInput from "./BRLCurrencyInput";
import ComplementAction from "./complement-action";
import { Card, CardContent } from "./ui/card";

// ------------------------------
// 1. SCHEMAS POR ETAPA
// ------------------------------

const groupSchema = z.object({
  group: z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    minSelected: z.number().min(1),
    maxSelected: z.number().min(1),
  }),
});

const complementSchema = z.object({
  complements: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.any().optional(),
  }),
  productPrice: z.number().min(0.01),
});

// ------------------------------

type Complement = {
  name: string;
  description?: string;
  price: number;
  image?: string | null;
};

// ------------------------------


export function SheetCreateComplement() {
  const { open, setOpen } = useSheetComplementStore();
  const [step, setStep] = useState(1);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [complements, setComplements] = useState<Complement[]>([]);

  const { register, control, getValues, setValue, reset } = useForm({
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
      },
      productPrice: 0,
    },
  });

  // -----------------------------------
  // PREVIEW DE IMAGEM
  // -----------------------------------
  const handlePreviewImage = (file?: File) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("complements.image", file as any);
  };

 const onCaptureGroup = () => {
    const result = groupSchema.safeParse(getValues());

    const result2 = complementSchema.safeParse(getValues());

  
    if (!result.success) {
      console.log("Erros Step 1:", result.error.flatten());
      return;
    }

    setStep(2);
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
      image: previewImage,
    };

    setComplements((prev) => [...prev, newComplement]);

    reset({
      ...values,
      complements: { name: "", description: "", image: undefined , },
      productPrice: 0,

    });

    setPreviewImage(null);
  };

  const removeComplement = (index: number) => {
    const newComplements = [...complements];
    newComplements.splice(index, 1);
    setComplements(newComplements);
  };

  // -----------------------------------

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* <SheetTrigger>Open</SheetTrigger> */}

      <SheetPopup className='max-w-2xl'>
        <SheetHeader>
          <SheetTitle>Cadastrar complemento — Step {step}</SheetTitle>
        </SheetHeader>

        <SheetPanel>
          {/* STEP 1 ----------------------- */}
          {step === 1 && (
            <div className='space-y-4'>
              <Field>
                <Label>Nome do grupo*</Label>
                <Input placeholder='Ex: Bebidas' {...register("group.name")} />
              </Field>

              <Field>
                <Label>Configurações</Label>

                <ComplementAction
                  setValue={setValue}
                  control={control}
                  nameBase='group'
                  props={{
                    maxSelected: 1,
                    minSelected: 1,
                    complements: [],
                    description: "",
                    id: "",
                    isAvailable: true,
                    isRequired: false,
                    name: "",
                  }}
                />
              </Field>
            </div>
          )}

          {/* STEP 2 ----------------------- */}
          {step === 2 && (
            <div className='space-y-4'>
              <Field>
                <Label>Nome*</Label>
                <Input
                  placeholder='Ex: Coca-Cola'
                  {...register("complements.name")}
                />
              </Field>

              <Field>
                <Label>Descrição</Label>
                <Input {...register("complements.description")} />
              </Field>

              <Field>
                <Label>Preço*</Label>
                <Controller
                  control={control}
                  name='productPrice'
                  render={({ field }) => (
                    <BRLInput
                      value={field.value}
                      onChange={(v) => field.onChange(v / 100)}
                    />
                  )}
                />
              </Field>

              <Field>
                <Label>Imagem</Label>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handlePreviewImage(e.target.files?.[0])}
                />
              </Field>

              <Button type='button' onClick={onSubmitComplement}>
                <Plus size={18} /> Adicionar complemento
              </Button>

              <div className='mt-4 space-y-4'>
                {complements.map((c, i) => (
                  <Card key={i} className='flex gap-4 p-2 border-0 bg-secondary'>
                    <CardContent className='flex gap-4 p-2'>
                      {c.image && (
                        <div className='rounded-xl overflow-hidden'>
                          <img
                            src={c.image}
                            className='w-16 h-16 rounded-md object-fi overflow-hidden'
                          />
                        </div>
                      )}
                      <div className='flex flex-col gap-0'>
                        <span className='font-semibold'>{c.name}</span>
                        <span className='text-sm'>{c.description}</span>
                        <span className='text-sm'>R$ {c.price.toFixed(2)}</span>
                      </div>
                      <div className='ml-auto flex items-center aspect-square'>
                      <Button onClick={() => removeComplement(i)} className="aspect-square rounded-full" variant='destructive'><Trash /></Button>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </SheetPanel>

        <SheetFooter>
          <SheetClose>
            <Button variant='secondary'>Cancelar</Button>
          </SheetClose>

          {step === 1 && <Button onClick={onCaptureGroup}>Avançar</Button>}
          {step === 2 && <Button onClick={onCaptureGroup}>Salvar</Button>}

        </SheetFooter>
      </SheetPopup>
    </Sheet>
  );
}
