import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { convertBRL } from "@/utils/convertBRL";

import Stock from "./stock";

interface EditableProductRowProps {
  stock?: number | null;
  price: number;
  isAvailable: boolean;
  onToggleAvailable?: () => void;
  onStockChange?: (value: number) => void;
  onPriceChange?: (value: number) => void;
}

export function EditableProductRow({
  stock,
  price,
  isAvailable,
  onToggleAvailable,
  onStockChange,
  onPriceChange,
}: EditableProductRowProps) {
  console.log(stock);
  return (
    <div className='flex items-center gap-3'>
      {/* Stock */}
      {stock !== undefined &&  (

      <Stock stock={stock || null} onStockChange={onStockChange} />
      )}

      {/* Price */}
      <div className='w-22 ml-auto'>
        <Input
          value={convertBRL(price)}
          onChange={(e) => onPriceChange?.(Number(e.target.value))}
          className='font-medium'
        />
      </div>

      {/* Toggle Availability */}
      <Button variant='outline' size='icon' onClick={onToggleAvailable}>
        {isAvailable ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}
