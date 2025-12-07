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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = Number(e.target.value);
    if(number >= 0) {
      _setStock(number);
    }
  }
  return (
    <div className='max-w-35 flex items-center gap-2'>
      {_stock === null ? (
        <Button onClick={() => _setStock(0)} variant='outline'>
          <ShoppingBag /> Ativar estoque
        </Button>
      ) : (
        <>
          <Button size='icon' onClick={() => _setStock(null)} variant='outline'>
            <X />
          </Button>
          <Input
     
            value={_stock}
            onChange={(e) => {
              onStockChange?.(Number(e.target.value))
              handleChange(e)
            }}
            className={`font-medium w-20`}
          />
        </>
      )}
    </div>
  )
}
