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
import { useEffect, useState } from "react";
// import { watch } from "fs";

export default function ComplementAction({
  props,
  control,
  nameBase = "complements",
  setValue,
  watch,
}: {
  props?: ComplementGroup;
  control: Control<any>;
  nameBase: string; // 👉 agora você passa isso
  setValue: UseFormSetValue<any>;
  watch: any;
}) {
  const [isRequiredValue, setIsRequiredValue] = useState(false);

const minSelected = watch(`${nameBase}.minSelected`);
const maxSelected = watch(`${nameBase}.maxSelected`);

useEffect(() => {
  setIsRequiredValue(minSelected > 0);

  if (minSelected > maxSelected) {
    setValue(`${nameBase}.maxSelected`, minSelected);
  }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [minSelected]);
useEffect(() => {
 
  if (maxSelected < minSelected) {
    setValue(`${nameBase}.minSelected`, maxSelected);
  }
}, [maxSelected]);

  return (
    <div className='border-border gap-3'>
      {/* Ensure ID exists */}
      <Controller
        control={control}
        name={`${nameBase}.id`}
        defaultValue={props?.id ?? ""}
        render={() => <input type='hidden' />}
      />

      <div className='flex gap-2'>
        {/* IS REQUIRED */}
        <Controller
          control={control}
          name={`${nameBase}.isRequired`}
          defaultValue={(props?.minSelected ?? 0) > 0}
          render={({ field }) => (
            <Select
              value={isRequiredValue ? "Obrigatorio" : "Opcional"}
              onValueChange={(v) => {
                const isRequired = v === "Obrigatorio";
                console.log("VALUE SELECTED:", v, isRequired);
                field.onChange(isRequired);
                setIsRequiredValue(isRequired);
                if (isRequired) {
                  setValue(`${nameBase}.minSelected`, 1);
                } else {
                  setValue(`${nameBase}.minSelected`, 0);
                }

              }}
            >
              min{JSON.stringify(watch(`${nameBase}.minSelected`))} {" "}
              max{JSON.stringify(watch(`${nameBase}.maxSelected`))}

              <SelectTrigger size='sm'>
                <SelectValue />
              </SelectTrigger>

              <SelectPopup className='text-white'>
                <SelectItem value='Opcional'>Opcional</SelectItem>
                <SelectItem value='Obrigatorio'>Obrigatório</SelectItem>
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
              value={field.value || 0}
              onValueChange={(raw) => {
                const v = Number(raw) || 0;
                field.onChange(v);
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
              value={field.value ?? 0} // ← usar field.value sempre!
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
