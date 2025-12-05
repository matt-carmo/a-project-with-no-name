import { useEffect, useRef, useState } from "react";
import Input from "./ui/input";
import { Button } from "./ui/button";
import { Pen } from "lucide-react";
import api from "@/api/axios";
import { UpdateStoreInput } from "@/schemas/store.schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/category.schema";
import { Spinner } from "./ui/spinner";

export function EditInput({ props, onSubmit }: { props: { name: string; id: string }; onSubmit: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<{ name: string }>({
    resolver: zodResolver(categorySchema.pick({ name: true })),
    defaultValues: {
      name: props.name,
    },
  });

  async function handleEditCategoryName(data: UpdateStoreInput) {
    try {
      const response = await api.patch(`categories/${props.id}`, {
        name: data.name,
      });

      if (response.status === 200) {
        setIsEditing(true);
        onSubmit();
      }
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
    }
  }
    useEffect(() => {
    setValue("name", props.name);
  }, [props.name, setValue]);
  return (
    <form className="flex-1" onSubmit={handleSubmit(handleEditCategoryName)}>
      <div className="flex gap-2 items-center ">
        {isEditing && (
          <Pen
            onClick={() => {
              setIsEditing(false);
              inputRef.current?.focus();
            }}
            className="w-4 cursor-pointer"
          />
        )}

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              className={`${isEditing ? "w-full" : "max-w-80"} `}
              {...field}
              ref={(el) => {
                inputRef.current = el;
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setIsEditing(true);
                  if(isSubmitting) return
                setValue("name", props.name); 
                }, 200);
              }}
              unstyled={isEditing}
              type="text"
            />
          )}
        />

        {!isEditing && (
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner /> : "Salvar"}
          </Button>
        )}
      </div>
    </form>
  );
}
