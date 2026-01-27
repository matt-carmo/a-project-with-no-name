import { useEffect, useState } from "react";
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

interface ComplementActionProps {
  minSelected?: number;
  maxSelected?: number;
  onMinChange?: (value: number) => void;
  onMaxChange?: (value: number) => void;
}

export default function ComplementActionLocal({
  minSelected = 0,
  maxSelected = 0,
  onMinChange,
  onMaxChange,
}: ComplementActionProps) {
  const [internalMin, setInternalMin] = useState(minSelected);
  const [internalMax, setInternalMax] = useState(maxSelected);

  // Sync externo → interno
  useEffect(() => setInternalMin(minSelected), [minSelected]);
  useEffect(() => setInternalMax(maxSelected), [maxSelected]);

  // Garantir coerência min <= max
  useEffect(() => {
    if (internalMin > internalMax) {
      setInternalMax(internalMin);
      onMaxChange?.(internalMin);
    }
  }, [internalMin, internalMax, onMaxChange]);

  const isRequired = internalMin >= 1;

  return (
    <div className="border-border gap-3 flex flex-col">
      <div className="flex gap-2 items-center">
        {/* Obrigatório / Opcional */}
        <Select

          value={isRequired ? "Obrigatorio" : "Opcional"}
          onValueChange={(v) => {
            const newMin = v === "Obrigatorio" ? 1 : 0;
            setInternalMin(newMin);
            onMinChange?.(newMin);
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

        {/* MIN */}
        <NumberField
          min={0}
          value={internalMin}
          onValueChange={(v) => {
            const val = Number(v) || 0;
            setInternalMin(val);
            onMinChange?.(val);
          }}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>

        {/* MAX */}
        <NumberField
          min={0}
          value={internalMax}
          onValueChange={(v) => {
            const val = Number(v) || 0;
            setInternalMax(val);
            onMaxChange?.(val);
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
