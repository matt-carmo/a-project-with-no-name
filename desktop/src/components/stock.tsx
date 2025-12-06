import { ShoppingBag, X } from "lucide-react";
import { Button } from "./ui/button";
import Input from "./ui/input";
import { useState } from "react";

export default function Stock({
  stock,
  onStockChange,
}: {
  stock: number | null
  onStockChange?: (value: number) => void;
}) {
  const [_stock, _setStock] = useState<number | null>(stock);
  return (
    <div className='max-w-35 flex items-center'>
      {_stock === null ? (
        <Button onClick={() => _setStock(0)} variant='outline'>
          <ShoppingBag /> Ativar estoque
        </Button>
      ) : (
        <>
          <Button className={`${!_stock && "rounded-r-none border border-white !before:inset-0" }`} onClick={() => _setStock(null)} variant='ghost'>
            <X />
          </Button>
          <Input
            type="number"
            value={_stock}
            onChange={(e) => {
              onStockChange?.(Number(e.target.value))
              _setStock(Number(e.target.value))
            }}
            className={`font-medium w-20 ${!_stock && "rounded-l-none border-l-" }`}
          />
        </>
      )}
    </div>
  )
}
