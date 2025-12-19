import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";

import api from "@/api/axios";
import { categorySchema } from "@/schemas/category.schema";

import Input from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

// =====================
// Types
// =====================

type FormData = {
  name: string;
};

type EditInputProps = {
  name: string;
  endpoint?: string; // ex: "categories"
  onSuccess?: () => void;
  method?: "PATCH" | "PUT";
  onchange?: (text: string) => void;
};

// =====================
// Component
// =====================

export function EditInput({
  name,
  endpoint,
  onSuccess,
  method = "PATCH",
  onchange,
}: EditInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isEditing) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        cancelEditing();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema.pick({ name: true })),
    defaultValues: { name },
  });

  // =====================
  // Sync external name
  // =====================
  useEffect(() => {
    setValue("name", name);
    
  }, [name, setValue]);

  // =====================
  // Handlers
  // =====================
  async function onSubmit(data: FormData) {
    try {
      if (!endpoint) {
        setIsEditing(false);
        onSuccess?.();
        onchange?.(data.name);
        return;
      }
      if (method === "PUT") {
        await api.put(`${endpoint}`, data);
      }
      if (method === "PATCH") {
        await api.patch(`${endpoint}`, data);
      }

      setIsEditing(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  }

  function startEditing() {
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function cancelEditing() {
    if (isSubmitting) return;
    setIsEditing(false);
    setValue("name", name);
  }

  // =====================
  // Render
  // =====================
  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <div ref={containerRef} className="flex items-center gap-2">
        {!isEditing && (
          <Pen className="w-4 cursor-pointer" onClick={startEditing} />
        )}

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              {...field}
              ref={inputRef}
              type="text"
              onClick={startEditing}
              unstyled={!isEditing}
              className={isEditing ? "max-w-80" : "w-full"}
              readOnly={!isEditing}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelEditing();
              }}
            />
          )}
        />

        {isEditing && (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Salvar"}
          </Button>
        )}
      </div>
    </form>
  );
}
