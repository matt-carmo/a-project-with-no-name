import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  EllipsisVerticalIcon,
  Pause,
  Pencil,
  Play,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import api from "@/api/axios";
import { emitRefetch } from "@/lib/utils";

import Stock from "./stock";
import BRLInput from "./BRLCurrencyInput";
import Input from "./ui/input";
import { toastManager } from "./ui/toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ModalImage from "./modal-image";
import { Alert, AlertDescription } from "./ui/alert";

interface EditableProductRowProps {
  stock?: number | null;
  price: number;
  isAvailable: boolean;
  type: "product" | "complement";
  productId?: string;
  storeId: string;
  complementId?: string;
  name?: string;
  photoUrl?: string;

  editable?: boolean;
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
  photoUrl,
  name,

  onPriceChange,
  editable = false,
}: EditableProductRowProps) {
  const [_isAvailable, setIsAvailable] = useState(isAvailable);
  const [_price, setPrice] = useState(price);
  const [_name, setName] = useState(name ?? "");
  const [_photoUrl, setPhotoUrl] = useState(photoUrl ?? "");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const endPoint =
    type === "product"
      ? `stores/${storeId}/${type}s/${productId}`
      : `${type}s/${complementId}`;

  const patchData = useCallback(
    async (data: Partial<{ price: number; name: string }>) => {
      const res = await api.patch(endPoint, data);
      if (res.status === 200) {
        toastManager.add({
          type: "success",
          title: "Atualizado",
          timeout: 1500,
          description: "Alterações salvas com sucesso.",
        });
      } else {
        alert("Erro ao salvar alterações.");
      }
    },
    [endPoint]
  );

  const debouncedPatch = useCallback(
    (data: Partial<{ price: number; name: string; photoUrl: string }>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => patchData(data), 600);
    },
    [patchData]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
      alert("Erro ao atualizar disponibilidade.");
    }
  };

  const handleDelete = async () => {
    const res = await api.delete(endPoint);

    if (res.status === 204) {
      emitRefetch();
      setOpenDeleteDialog(false);
      toastManager.add({
        type: "success",
        title: "Item excluído",
        timeout: 1500,
        description: "O item foi excluído com sucesso.",
      });
    } else {
      toastManager.add({
        type: "error",
        title: "Erro ao excluir item",
        timeout: 3000,
        description: "Ocorreu um erro ao tentar excluir o item.",
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
        description:
          value !== null
            ? `O estoque foi atualizado para ${value}.`
            : "O estoque foi desativado.",
      });
    } else {
      alert("Erro ao atualizar o estoque.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {editable && (
        <ModalImage
          defaultSelectedImage={_photoUrl}
          onImageSelect={(url) => {
            setPhotoUrl(url.url);
            debouncedPatch({ photoUrl: url.url });
            // You can implement debounced patch for photoUrl if your API supports it
          }}
        />
      )}
      {stock !== undefined && (
        <Stock stock={stock} onStockChange={handleStockChange} />
      )}

      {type === "complement" && editable && (
        <Input
          value={_name}
          onChange={(e) => {
            const value = e.target.value;
            setName(value);
            debouncedPatch({ name: value });
          }}
          className="font-medium w-40"
        />
      )}

      <div className="w-22 ml-auto">
        <BRLInput
          value={_price}
          onChange={(value) => {
            setPrice(value);
            onPriceChange?.(value);
            debouncedPatch({ price: value });
          }}
          className="font-medium"
        />
      </div>

      <Button variant="outline" size="icon" onClick={onIsAvailableChange}>
        {_isAvailable ? <Pause /> : <Play />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="border-secondary">
          {type === "product" && (
            <DropdownMenuItem className="p-0">
              <Link
                className="w-full"
                to={`/store/${storeId}/${type}/${productId}`}
              >
                <Button variant="ghost" className="w-full justify-start">
                  <Pencil /> Editar
                </Button>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="p-0"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Button variant="ghost" className="w-full justify-start">
              <Trash /> Excluir
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogTrigger />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              {type === "complement" && (
                <Alert variant="warning" className="mb-4 flex items-center">
                  <div>
                    <AlertTriangle size={25} className=" text-yellow-600" />
                  </div>
                  <AlertDescription>
                    <p className="font-medium text-yellow-600">
                      Ao excluir este complemento, ele será removido de todos os
                      grupos de complementos e produtos associados.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              Tem certeza que deseja excluir este item? Essa ação não poderá ser
              desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
