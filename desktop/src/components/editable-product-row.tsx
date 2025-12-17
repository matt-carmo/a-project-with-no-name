import { Button } from "@/components/ui/button";
import { AlertTriangle, EllipsisVerticalIcon, Pause, Pencil, Play, Trash } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import api from "@/api/axios";
import { emitRefetch } from "@/lib/utils";
import Stock from "./stock";
import BRLInput from "./BRLCurrencyInput";
import Input from "./ui/input";
import { toastManager } from "./ui/toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import ModalImage from "./modal-image";
import { Alert, AlertDescription } from "./ui/alert";
import { Product } from "@/interfaces/menu.interface";

type FormValues = {
  name?: string;
  price: number;
  photoUrl?: string;
};

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
  product?: Product;
  editable?: boolean;
  onPriceChange?: (value: number) => void;
}

export function EditableProductRow({
  stock,
  price,
  isAvailable,
  productId,
  product,
  storeId,
  complementId,
  type,
  photoUrl,
  name,
  onPriceChange,
  editable = false,
}: EditableProductRowProps) {
  const [_isAvailable, setIsAvailable] = useState(isAvailable);
  const [_name, setName] = useState(name ?? "");
  const [_price, setPrice] = useState(price);
  const [_photoUrl, setPhotoUrl] = useState(photoUrl ?? "");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Debounce refs separados para cada campo
  const nameDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const photoDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const endPoint = type === "product" 
    ? `stores/${storeId}/${type}s/${productId}` 
    : `${type}s/${complementId}`;

  const useDebouncedPatch = (field: keyof FormValues) => {
    return useCallback((value: any) => {
      const refs = {
        name: nameDebounceRef,
        price: priceDebounceRef,
        photoUrl: photoDebounceRef,
      }[field];

      if (refs.current) {
        clearTimeout(refs.current);
      }

      refs.current = setTimeout(async () => {
        try {
          const res = await api.patch(endPoint, { [field]: value });
          
          if (res.status === 200) {
            toastManager.add({
              type: "success",
              title: "Atualizado",
              timeout: 1200,
              description: "Alterações salvas com sucesso.",
            });
          } else {
            toastManager.add({
              type: "error",
              title: "Erro",
              description: "Erro ao salvar alterações.",
            });
          }
        } catch (error) {
          toastManager.add({
            type: "error",
            title: "Erro",
            description: "Erro ao salvar alterações.",
          });
        }
      }, 1000); 

    }, [endPoint]);
  };

  // Funções específicas para cada campo
  const debouncedNamePatch = useDebouncedPatch('name');
  const debouncedPricePatch = useDebouncedPatch('price');
  const debouncedPhotoPatch = useDebouncedPatch('photoUrl');

  // Cleanup dos timeouts
  useEffect(() => {
    return () => {
      [nameDebounceRef, priceDebounceRef, photoDebounceRef].forEach(ref => {
        if (ref.current) clearTimeout(ref.current);
      });
    };
  }, []);

  const onIsAvailableChange = async () => {
    try {
      const res = await api.patch(endPoint, {
        isAvailable: !_isAvailable,
      });
      
      if (res.status === 200) {
        setIsAvailable(!_isAvailable);
        toastManager.add({
          type: "success",
          title: "Disponibilidade atualizada",
          timeout: 1500,
          description: `O item agora está ${!_isAvailable ? "disponível" : "indisponível"}.`,
        });
      }
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Erro",
        timeout: 3000,
        description: "Erro ao atualizar disponibilidade.",
      });
    }
  };

  const handleDelete = async () => {
    try {
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
      }
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Erro ao excluir item",
        timeout: 3000,
        description: "Ocorreu um erro ao tentar excluir o item.",
      });
    }
  };

  const handleStockChange = async (value: number | null) => {
    try {
      const res = await api.patch(`stores/${storeId}/${type}s/${productId}`, {
        stock: value,
      });
      
      if (res.status === 200) {
        toastManager.add({
          type: "success",
          title: "Estoque atualizado",
          timeout: 1500,
          description: value !== null 
            ? `O estoque foi atualizado para ${value}.` 
            : "O controle de estoque foi desativado.",
        });
      }
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Erro",
        timeout: 3000,
        description: "Erro ao atualizar o estoque.",
      });
    }
  };

  
  const handleNameChange = (value: string) => {
    setName(value);
    if (editable && type === 'complement') {
      debouncedNamePatch(value);
    }
  };

  const handlePriceChange = (value: number) => {
    setPrice(value);
    onPriceChange?.(value);
   
    if (value > 0) { 
      debouncedPricePatch(value);
    }
  };

  const handlePhotoChange = (url: string) => {
    setPhotoUrl(url);
    if (editable) {
      debouncedPhotoPatch(url);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {editable && (
        <ModalImage
          defaultSelectedImage={_photoUrl}
          onImageSelect={(url) => {
            handlePhotoChange(url.url);
          }}
        />
      )}

      {stock !== undefined && (
        <Stock stock={stock} onStockChange={handleStockChange} />
      )}

      {type === "complement" && editable && (
        <div className="flex-1">
          <Input
            value={_name}
            onChange={(e) => {
              handleNameChange(e.target.value);
            }}
            className="font-medium flex-1"
            placeholder="Nome do complemento"
          />
        </div>
      )}

      <div className="w-22 ml-auto">
        <BRLInput
          value={_price}
          onChange={handlePriceChange}
          className="font-medium"
          min={0.01}
          step={0.01}
        />
      </div>

      <Button variant="outline" size="icon" onClick={onIsAvailableChange}>
        {_isAvailable ? <Pause /> : <Play />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger className="relative -left-2 cursor-pointer">
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-secondary">
          {type === "product" && (
            <DropdownMenuItem className="p-0">
              <Link
                className="w-full"
                state={{ item: product }}
                to={`/store/${storeId}/product/${productId}`}
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
                    <AlertTriangle size={25} className="text-yellow-600" />
                  </div>
                  <AlertDescription>
                    <p className="font-medium text-yellow-600">
                      Ao excluir este complemento, ele será removido de todos os grupos de complementos e produtos associados.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              Tem certeza que deseja excluir este item? Essa ação não poderá ser desfeita.
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