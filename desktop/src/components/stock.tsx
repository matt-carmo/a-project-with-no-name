import { ShoppingBag, X } from "lucide-react";
import { Button } from "./ui/button";
import Input from "./ui/input";
import { useRef, useState } from "react";

export default function Stock({
  stock,
  onStockChange,
}: {
  stock: number | null;
  onStockChange?: (value: number | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [_stock, _setStock] = useState<number | null>(stock);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = Number(e.target.value);
    if (number >= 0) _setStock(number);
  };

  return (
    <div className='max-w-35 flex items-center gap-2'>
      {_stock === null ? (
        <Button
          onClick={() => {
            _setStock(0);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          variant='outline'
        >
          <ShoppingBag /> Ativar estoque
        </Button>
      ) : (
        <>
          <Button
            size='icon'
            onClick={() => {
              _setStock(null);
              onStockChange?.(null);
            }}
            variant='outline'
          >
            <X />
          </Button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onStockChange?.(_stock);
            }}
          >
            <Input
              ref={inputRef}
              value={_stock}
              onBlur={() => {
                if(_stock === stock) return;
                onStockChange?.(_stock)
              }}
              onChange={handleChange}
              className='font-medium w-20'
            />
          </form>
        </>
      )}
    </div>
  );
}
