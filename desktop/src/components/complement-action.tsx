/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComplementGroup } from "@/interfaces/menu.interface";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "./ui/number-field";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Controller, Control, UseFormSetValue } from "react-hook-form";

export default function ComplementAction({
  props,
  control,
  nameBase = "complements",
  setValue,
}: {
  props?: ComplementGroup;
  control: Control<any>;
  nameBase: string; // 👉 agora você passa isso
  setValue: UseFormSetValue<any>;
}) {
  return (
    <div className="border-border gap-3">
      {/* Ensure ID exists */}
      <Controller
        control={control}
        name={`${nameBase}.id`}
        defaultValue={props?.id ?? ""}
        render={() => <input type="hidden" />}
      />

      <div className="flex gap-2">
        {/* IS REQUIRED */}
        <Controller
          control={control}
          name={`${nameBase}.isRequired`}
          defaultValue={(props?.minSelected ?? 0) > 0}
          render={({ field }) => (
            <Select
              value={field.value ? "Obrigatorio" : "Opcional"}
              onValueChange={(v) => {
                const isRequired = v === "Obrigatorio";

                field.onChange(isRequired);

                setValue(`${nameBase}.minSelected`, isRequired ? 1 : 0);
              }}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>

              <SelectPopup className="text-white">
                <SelectItem value="Opcional">Opcional</SelectItem>
                <SelectItem value="Obrigatorio">Obrigatório</SelectItem>
              </SelectPopup>
            </Select>
          )}
        />

        {/* MIN SELECTED */}
        <Controller
          control={control}
          name={`${nameBase}.minSelected`}
          defaultValue={props?.minSelected ?? 0}
          render={({ field }) => (
            <NumberField
              min={0}
              value={field.value ?? 0}
              onValueChange={(raw) => {
                const v = Number(raw) || 0;

                field.onChange(v);

                setValue(`${nameBase}.isRequired`, v > 0);
              }}
            >
              <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
          )}
        />

        {/* MAX SELECTED */}
        <Controller
          control={control}
          name={`${nameBase}.maxSelected`}
          defaultValue={props?.maxSelected ?? 0}
          render={({ field }) => (
            <NumberField
              min={0}
              value={field.value ?? 0}
              onValueChange={(v) => field.onChange(Number(v) || 0)}
            >
              <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
          )}
        />
      </div>
    </div>
  );
}
