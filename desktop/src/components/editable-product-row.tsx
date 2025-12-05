import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { convertBRL } from "@/utils/convertBRL";

interface EditableProductRowProps {
  stock: number;
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
  return (
    <div className="flex items-center gap-3">
      {/* Stock */}
      <div className="w-16">
        <Input
          value={stock}
          onChange={(e) => onStockChange?.(Number(e.target.value))}
          className="font-medium"
        />
      </div>

      {/* Price */}
      <div className="w-22 ml-auto">
        <Input
          value={convertBRL(price)}
          onChange={(e) => onPriceChange?.(Number(e.target.value))}
          className="font-medium"
        />
      </div>

      {/* Toggle Availability */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleAvailable}
      >
        {isAvailable ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}
