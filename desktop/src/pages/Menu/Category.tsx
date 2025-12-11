import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/category.schema";
import api from "@/api/axios";
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function CategoryCreateForm({ onCreated }: { onCreated?: () => void }) {
  const { selectedStore } = useAuthStore();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>({
    resolver: zodResolver(categorySchema.pick({ name: true })),
  });

  async function handleAddCategory(data: { name: string }) {
    try {
      const response = await api.post(
        `${selectedStore?.store.id}/categories`,
        { name: data.name }
      );

      if (response.status === 201) {
        onCreated?.();
        setOpen(false);
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button variant="outline">
          <Plus /> Adicionar Categoria
        </Button>
      </PopoverTrigger>

      <PopoverPopup className="w-80 mt-2" align="center" side="bottom">
        <div className="mb-4">
          <PopoverTitle className="text-base">Adicionar Categoria</PopoverTitle>
          <PopoverDescription>Insira o nome da categoria</PopoverDescription>
        </div>

        <Form onSubmit={handleSubmit(handleAddCategory)}>
          <Field>
            <Input placeholder="Nome da categoria" {...register("name")} />
            <span className="text-red-500">{errors?.name?.message}</span>
          </Field>

          <Button disabled={isSubmitting} type="submit">
            Salvar
          </Button>
        </Form>
      </PopoverPopup>
    </Popover>
  );
}
export default CategoryCreateForm;