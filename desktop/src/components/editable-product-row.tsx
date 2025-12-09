import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

import Stock from "./stock";
import api from "@/api/axios";
import { useState } from "react";
import BRLInput from "./BRLCurrencyInput";
import { toastManager } from "./ui/toast";
import { convertBRL } from "@/utils/convertBRL";

interface EditableProductRowProps {
  stock?: number | null;
  price: number;
  isAvailable: boolean;
  type: "product" | "complement";
  productId?: string;
  storeId: string;
  complementId?: string;
  onToggleAvailable?: () => void;
  onStockChange?: (value: number) => void;
  onPriceChange?: (value: number) => void;
}

export function EditableProductRow({
  stock,
  price,
  isAvailable,
  productId,
  storeId,

  type,

  onPriceChange,
}: EditableProductRowProps) {
  const [_isAvailable, setIsAvailable] = useState(isAvailable);
  // const [_stock, setStock] = useState(stock);
  const [_price, setPrice] = useState(price);
  const onIsAvailableChange = async () => {
    const res = await api.patch(`stores/${storeId}/${type}s/${productId}`, {
      isAvailable: !_isAvailable,
    });
    if (res.status === 200) {
      setIsAvailable(!_isAvailable);
      toastManager.add({
        type: "success",
        title: "Disponibilidade atualizada",
        description: `O item agora está ${
          !_isAvailable ? "disponível" : "indisponível"
        }.`,
      });
    } else {
      alert("Erro ao atualizar o estoque.");
    }
  };
  const handleStockChange = async (value: number | null) => {
    const res = await api.patch(`stores/${storeId}/${type}s/${productId}`, {
      stock: value,
    });
    if (res.status === 200) {
      toastManager.add({
        type: "success",
        title: "Estoque atualizado",
        timeout: 1000,
        description: `${value !== null  ? `O estoque foi atualizado para ${value}.` : "O estoque foi desativado."}`,
      });
    }
  };
  const handlePriceChange = async () => {
    const res = await api.patch(`stores/${storeId}/${type}s/${productId}`, {
      price: _price,
    });
    if (res.status === 200) {
      toastManager.add({
        type: "success",
        title: "Preço atualizado",
        description: `O preço foi atualizado com sucesso para ${convertBRL(_price)}.`,
      });
    } else alert("Erro ao atualizar o preço.");
  };

  return (
    <div className='flex items-center gap-3'>
      {/* Stock */}
      {stock !== undefined && (
        <Stock stock={stock} onStockChange={handleStockChange} />
      )}

      {/* Price */}
      <div className='w-22 ml-auto'>
        <BRLInput
          value={_price}
          onBlur={handlePriceChange}
          onChange={(value) => {
            setPrice(value);
            onPriceChange?.(value);
          }}
          className='font-medium'
        />
      </div>

      {/* Toggle Availability */}
      <Button
        variant='outline'
        size='icon'
        onClick={() => onIsAvailableChange()}
      >
        {_isAvailable ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}
