/* eslint-disable @typescript-eslint/no-explicit-any */
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from "@/components/ui/number-field";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplementGroup } from "@/interfaces/menu.interface";


import { useEffect, useState } from "react";

interface ComplementActionProps {
  props?: ComplementGroup;
  nameBase?: string;
  onChange?: (data: {
    id: string;
    isRequired: boolean;
    minSelected: number;
    maxSelected: number;
  }) => void;
  initialData?: {
    id?: string;
    isRequired?: boolean;
    minSelected?: number;
    maxSelected?: number;
  };
}

export default function SelectMinMax({
  props,
  onChange,
  initialData,
}: ComplementActionProps) {
  // Estado local para todos os valores
  const [id, setId] = useState<string>(props?.id || initialData?.id || "");
  const [isRequired, setIsRequired] = useState<boolean>(
    (props?.minSelected ?? 0) > 0 || initialData?.isRequired || false
  );
  const [minSelected, setMinSelected] = useState<number>(
    props?.minSelected ?? initialData?.minSelected ?? 0
  );
  const [maxSelected, setMaxSelected] = useState<number>(
    props?.maxSelected ?? initialData?.maxSelected ?? 0
  );

  useEffect(() => {
    if (onChange) {
      onChange({
        id,
        isRequired,
        minSelected,
        maxSelected,
      });
    }
  }, [id, isRequired, minSelected, maxSelected]);

  useEffect(() => {
    const newIsRequired = minSelected > 0;
    if (isRequired !== newIsRequired) {
      setIsRequired(newIsRequired);
    }
  }, [minSelected, isRequired]);

  useEffect(() => {
    if (minSelected > maxSelected) {
      setMaxSelected(minSelected);
    }
  }, [minSelected]);

  useEffect(() => {
    if (maxSelected < minSelected) {
      setMinSelected(maxSelected);
    }
  }, [maxSelected]);

  const handleRequiredChange = (value: "Obrigatorio" | "Opcional") => {
    const newIsRequired = value === "Obrigatorio";
    setIsRequired(newIsRequired);

    if (newIsRequired && minSelected < 1) {
      setMinSelected(1);
      if (maxSelected < 1) {
        setMaxSelected(1);
      }
    } else if (!newIsRequired) {
    }
  };

  const handleMinSelectedChange = (value: number) => {
    const newValue = Math.max(0, value);

    if (newValue > 0 && newValue < 1) {
      setMinSelected(1);
    } else {
      setMinSelected(newValue);
    }

    setIsRequired(newValue > 0);
  };

  const handleMaxSelectedChange = (value: number) => {
    const newValue = Math.max(0, value);
    setMaxSelected(newValue);
  };

  return (
    <div className='border-border gap-3'>
      {/* Campo hidden para ID */}
      <input
        type='hidden'
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <div className='flex gap-2 text-white'>
        {/* SELECT OBRIGATÓRIO/OPCIONAL */}
        <Select
          value={isRequired ? "Obrigatorio" : "Opcional"}
          onValueChange={handleRequiredChange as any}
        >
          <SelectTrigger size='sm'>
            <SelectValue />
          </SelectTrigger>

          <SelectPopup className='text-white'>
            <SelectItem value='Opcional'>Opcional</SelectItem>
            <SelectItem value='Obrigatorio'>Obrigatório</SelectItem>
          </SelectPopup>
        </Select>

        {/* MIN SELECTED */}
        <NumberField
          min={0}
          value={minSelected}
          onValueChange={(raw) => {
            const v = Number(raw) || 0;
            handleMinSelectedChange(v);
          }}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>

        {/* MAX SELECTED */}
        <NumberField
          min={0}
          value={maxSelected}
          onValueChange={(raw) => {
            const v = Number(raw) || 0;
            handleMaxSelectedChange(v);
          }}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </div>
    </div>
  );
}