import { useSheetComplementStore } from "@/store/use-sheet-complement-store";
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
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
import { convertBRL } from "@/utils/convertBRL";
import api from "@/api/axios";
import { useParams } from "react-router";
import { Complement } from "@/interfaces/menu.interface";
import ModalImage from "./modal-image";
import { Textarea } from "./ui/textarea";

// ------------------------------
// 1. SCHEMAS POR ETAPA
// ------------------------------

// const groupSchema = z.object({
//   group: z.object({
//     name: z.string().min(1, "Nome é obrigatório"),
//     minSelected: z.number().min(0),
//     maxSelected: z.number().min(1),
//   }),
// });

const complementSchema = z.object({
  complements: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.any().optional(),
  }),
  productPrice: z.number().min(0),
});

// ------------------------------

// ------------------------------

export function SheetCreateComplement({
  onCreateComplement,
}: {
  onCreateComplement(complement: Complement): void;
}) {
  const { open, setOpen } = useSheetComplementStore();
  const [step, setStep] = useState(1);
  const [complements, setComplements] = useState<Complement[]>([]);

  const { id: storeId } = useParams();

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

  const { register, control, getValues, setValue, reset, watch } = useForm<FormValues>(
    {
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
    }
  );

  // -----------------------------------
  // PREVIEW DE IMAGEM
  // -----------------------------------
  const handlePreviewImage = (img: { url: string, id: string }) => {
    const url = img.url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("complements.imagePreview", url as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("complements.image", img as any);

    setImagePreview(url);
  };

  const onCaptureGroup = async () => {
    if (step === 1) return setStep(2);

    const group = getValues("group");
    const comps = complements;

    const data = {
      minSelected: group.minSelected,
      maxSelected: group.maxSelected,
      name: group.name,
      isAvailable: true,

      complements: comps.map((c) => ({
        name: c.name,
        description: c.description,
        price: c.price,
        photoUrl:
          c.image &&
          typeof c.image === "object" &&
          "url" in (c.image as Record<string, unknown>)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? (c.image as Record<string, any>).url
            : null,
      })),
      // image will be handled separately
    };


    const res = await api.post(`${storeId}/groups-complements`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 201) {
      onCreateComplement(res.data);
      setOpen(false);
    }
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

    setComplements((prev) => [...prev, newComplement]);

    reset({
      ...values,
      complements: { name: "", description: "", image: undefined },
      productPrice: 0,
      
    });
    setImagePreview(null);
  };

  const removeComplement = (index: number) => {
    const newComplements = [...complements];
    newComplements.splice(index, 1);
    setComplements(newComplements);
  };

  // -----------------------------------

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setComplements([]);
          reset({
            complements: { name: "", description: "", image: undefined },
            group: { name: "", minSelected: 0, maxSelected: 0 },
            productPrice: 0,
          });
          setStep(1);
        }}
      >
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
                  <Input
                    placeholder='Ex: Bebidas'
                    {...register("group.name")}
                  />
                </Field>

                <Field>
                  <Label>Configurações</Label>

                  <ComplementAction
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    nameBase='group'
                    props={{
                      maxSelected: 1,
                      minSelected: 1,
                      complements: [],
                      description: "",

                      isAvailable: true,
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
                  <Textarea {...register("complements.description")} />
                </Field>

                <Field>
                  <Label>Preço*</Label>
                  <Controller
                    control={control}
                    name='productPrice'
                    defaultValue={0}
                    render={({ field }) => (
                      <BRLInput
                        value={field.value ?? 0}
                        onChange={(v) => field.onChange(v)}
                      />
                    )}
                  />
                </Field>

                <Field className={'flex flex-row items-center gap-4'}>
                  <div className='flex flex-col gap-2'>
                    <Label>Imagem</Label>

                    <Controller
                      control={control}
                      name='complements.image'
                      render={() => (
                        <ModalImage onImageSelect={handlePreviewImage} />
                      )}
                    />
                  </div>
                  <img
                    src={imagePreview || "https://placehold.co/600x400"}
                    className='h-12 aspect-4/3 border-0'
                    alt=''
                  />
                </Field>

                <Button
                  className='w-full py-2 font-semibold text-lg'
                  type='button'
                  onClick={onSubmitComplement}
                >
                  <div>
                    {" "}
                    <Plus />
                  </div>{" "}
                  Adicionar complemento
                </Button>

                <div className='mt-4 space-y-4'>
                  {complements.map((c, i) => (
                    <Card
                      key={i}
                      className='flex gap-4 p-2 border-0 bg-secondary'
                    >
                      <CardContent className='flex gap-4 p-2'>
                        {c.image && (
                          <div className='rounded-md h-16 aspect-4/3 overflow-hidden'>
                            <img
                              src={c.imagePreview}
                              className='h-full mx-auto max-h-full rounded-md object-cover '
                            />
                          </div>
                        )}
                        <div className='flex flex-col gap-0'>
                          <span className='font-semibold'>{c.name}</span>
                          <span className='text-sm'>{c.description}</span>
                          <span className='text-sm'>{convertBRL(c.price)}</span>
                        </div>
                        <div className='ml-auto flex items-center aspect-square'>
                          <Button
                            onClick={() => removeComplement(i)}
                            className='aspect-square rounded-full'
                            variant='destructive'
                          >
                            <Trash />
                          </Button>
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
            {step === 2 && (
              <Button
                disabled={complements.length === 0}
                onClick={onCaptureGroup}
              >
                Criar grupo
              </Button>
            )}
          </SheetFooter>
        </SheetPopup>
      </Sheet>
    </>
  );
}
