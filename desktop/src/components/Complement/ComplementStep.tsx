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
import { ScrollArea } from "../ui/scroll-area";

interface ComplementStepProps {
  register: any;
  control: any;

  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;

  items: Complement[];
  onAdd: () => void;
  getValues: () => any;
  onRemove: (name: string) => void;
}

export function ComplementStep({
  register,
  control,
  imagePreview,
  getValues,
  setImagePreview,
  items,
  onAdd,

  onRemove,
}: ComplementStepProps) {
  return (
    <div className="space-y-4 flex flex-col h-full w-full">
      <div>{getValues("group.name")}</div>
      <Field>
        <Label>Nome*</Label>
        <Input placeholder="Ex: Coca-Cola" {...register("complements.name")} />
      </Field>

      {/* Descrição */}
      <div className="flex gap-2">
        <Field className={"flex-1"}>
          <Label>Descrição</Label>
          <Textarea
            className="h-full"
            {...register("complements.description")}
          />
        </Field>
        <Field className="flex flex-row items-center">
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
        </Field>
      </div>
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

      {/* Adicionar complemento */}
      <Button
        type="button"
        className="w-full py-2 font-semibold text-lg"
        onClick={onAdd}
      >
        <Plus />
        Adicionar complemento
      </Button>


      {items.length > 0 && (
        <div className="relative h-full border">
          <ScrollArea className="h-full absolute">
            <div className="space-y-4 p-2">
              {items.map((c, i) => (
                <Card
                  key={`${c.name}-${i}`}
                  className="flex gap-4 p-2 bg-secondary"
                >
                  <CardContent className="flex gap-4 p-2 w-full">
                    {c.image && (
                      <div className="h-16 aspect-4/3 overflow-hidden rounded-md">
                        <img
                          src={c.image.url}
                          className="h-full w-full object-cover"
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

                    <Button
                      onClick={() => onRemove(c.id as string)}
                      variant="destructive"
                      className="ml-auto h-8 w-8 p-0"
                    >
                      <Trash />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
