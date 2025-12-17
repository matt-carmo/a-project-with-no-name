import { convertBRL } from "@/utils/convertBRL";
import { Complement } from "@/interfaces/menu.interface";
import { Field } from "../ui/field";
import { Label } from "../ui/label";
import Input from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Controller } from "react-hook-form";
import BRLInput from "../BRLCurrencyInput";
import ModalImage from "../modal-image";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface ComplementStepProps {
  register: any;
  control: any;

  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;

  items: Complement[];
  onAdd: () => void;
  onRemove: (name: string) => void;
}

export function ComplementStep({
  register,
  control,
  imagePreview,
  setImagePreview,
  items,
  onAdd,
  onRemove,
}: ComplementStepProps) {
  return (
    <div className="space-y-4">
      {/* Nome */}
      <Field>
        <Label>Nome*</Label>
        <Input placeholder="Ex: Coca-Cola" {...register("complements.name")} />
      </Field>

      {/* Descrição */}
      <Field>
        <Label>Descrição</Label>
        <Textarea {...register("complements.description")} />
      </Field>

      {/* Preço */}
      <Field>
        <Label>Preço*</Label>
        <Controller
          control={control}
          name="complements.productPrice"
          defaultValue={0}
          render={({ field }) => (
            <BRLInput
              value={field.value ?? 0}
              onChange={(v) => field.onChange(v)}
            />
          )}
        />
      </Field>

      {/* Imagem */}
      <Field className="flex flex-row items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Imagem</Label>
          <Controller
            control={control}
            name="complements.image"
            render={({ field }) => (
              <ModalImage
                onImageSelect={(img) => {
                  field.onChange(img);
                  setImagePreview(img.url);
                }}
              />
            )}
          />
        </div>

        <img
          src={imagePreview || "https://placehold.co/600x400"}
          className="h-12 aspect-4/3 border-0"
          alt=""
        />
      </Field>

      {/* Adicionar complemento */}
      <Button
        type="button"
        className="w-full py-2 font-semibold text-lg"
        onClick={onAdd}
      >
        <Plus />
        Adicionar complemento
      </Button>
      

      {/* Lista de complementos */}
      {items.length > 0 && (
        <div className="mt-4 space-y-4">
          {items.map((c, i) => (
            <Card
              key={`${c.name}-${i}`}
              className="flex gap-4 p-2 border-0 bg-secondary"
            >
              <CardContent className="flex gap-4 p-2 w-full">
                {c.image && (
                  <div className="rounded-md h-16 aspect-4/3 overflow-hidden">
                    <img
                      src={c.image.url}
                      className="h-full w-full object-cover rounded-md"
                      alt={c.name}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{c.name}</span>
                  {c.description && (
                    <span className="text-sm text-muted-foreground">
                      {c.description}
                    </span>
                  )}
                  <span className="text-sm">{convertBRL(c.price)}</span>
                </div>

                <div className="ml-auto flex items-center">
                  <Button
                    onClick={() => onRemove(c.name)}
                    className="aspect-square rounded-full"
                    variant="destructive"
                  >
                    <Trash />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
