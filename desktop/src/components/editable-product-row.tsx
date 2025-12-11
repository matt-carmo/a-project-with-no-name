import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, Pause, Pencil, Play, Trash } from "lucide-react";

import Stock from "./stock";
import api from "@/api/axios";
import { useState } from "react";
import BRLInput from "./BRLCurrencyInput";
import { toastManager } from "./ui/toast";
import { convertBRL } from "@/utils/convertBRL";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { emitRefetch } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
  complementId,
  type,

  onPriceChange,
}: EditableProductRowProps) {
  const [_isAvailable, setIsAvailable] = useState(isAvailable);
  const [_price, setPrice] = useState(price);

  const endPoint =
    type === "product"
      ? `stores/${storeId}/${type}s/${productId}`
      : `${type}s/${complementId}`;
  const onIsAvailableChange = async () => {
    const res = await api.patch(endPoint, {
      isAvailable: !_isAvailable,
    });
    if (res.status === 200) {
      setIsAvailable(!_isAvailable);
      toastManager.add({
        type: "success",
        title: "Disponibilidade atualizada",
        timeout: 1500,
        description: `O item agora está ${
          !_isAvailable ? "disponível" : "indisponível"
        }.`,
      });
    } else {
      alert("Erro ao atualizar o estoque.");
    }
  };

  const handleDelete = async () => {
    const res = await api.delete(endPoint);
    if (res.status === 204) {
      emitRefetch();
      toastManager.add({
        type: "success",
        title: "Item excluído",
        timeout: 1500,
        description: `O item foi excluído com sucesso.`,
      });
    } else {
      toastManager.add({
        type: "error",
        title: "Erro ao excluir item",
        timeout: 3000,
        description: `Ocorreu um erro ao tentar excluir o item.`,
      });
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
        timeout: 1500,
        description: `${
          value !== null
            ? `O estoque foi atualizado para ${value}.`
            : "O estoque foi desativado."
        }`,
      });
    }
  };
  const handlePriceChange = async () => {
    const res = await api.patch(endPoint, {
      price: _price,
    });
    if (res.status === 200) {
      toastManager.add({
        type: "success",
        title: "Preço atualizado",
        timeout: 1500,
        description: `O preço foi atualizado com sucesso para ${convertBRL(
          _price
        )}.`,
      });
    } else alert("Erro ao atualizar o preço.");
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

      {type === "product" && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='border-secondary'>
            <DropdownMenuItem
              className='p-0'
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Button variant='ghost' className='w-full justify-start'>
                <Trash /> Excluir
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem className='p-0'>
              <Link
                className='w-full'
                to={`/store/${storeId}/${type}/${productId}`}
              >
                <Button variant='ghost' className='w-full justify-start'>
                  <Pencil /> Editar
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogTrigger></DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este item? Essa ação não poderá ser
              desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancelar
            </Button>

            <Button
              className='cursor-pointer'
              variant='destructive'
              onClick={() => {
                handleDelete();
                // setOpenDeleteDialog(false);
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
