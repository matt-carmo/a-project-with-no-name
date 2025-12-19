import { Button } from "@/components/ui/button";
import { AlertTriangle, EllipsisVerticalIcon, Pause, Play, Trash } from "lucide-react";
import { useState } from "react";




import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ModalImage from "../modal-image";
import Stock from "../stock";
import Input from "../ui/input";
import BRLInput from "../BRLCurrencyInput";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

import { Alert, AlertDescription } from "../ui/alert";



interface EditableProductRowLocalProps {
  stock?: number | null;
  price: number;
  isAvailable: boolean;
  name?: string;
  photoUrl?: string;
  editable?: boolean;
  type: "product" | "complement";

  onNameChange?: (value: string) => void;
  onPriceChange?: (value: number) => void;
  onPhotoChange?: (url: string) => void;
  onToggleAvailable?: () => void;
  onDelete?: () => void;
  onStockChange?: (value: number | null) => void;
}
export function EditableProductRowLocal({
  stock,
  price,
  isAvailable,
  name,
  photoUrl,
  editable = false,
  type,
  onNameChange,
  onPriceChange,
  onPhotoChange,
  onToggleAvailable,
  onDelete,
  onStockChange,
}: EditableProductRowLocalProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {editable && (
        <ModalImage
          defaultSelectedImage={photoUrl}
          onImageSelect={(url) => onPhotoChange?.(url.url)}
        />
      )}

      {stock !== undefined && (
        <Stock stock={stock} onStockChange={onStockChange} />
      )}

      {type === "complement" && editable && (
        <div className="flex-1">
          <Input
            value={name}
            onChange={(e) => onNameChange?.(e.target.value)}
            className="font-medium flex-1"
            placeholder="Nome do complemento"
          />
        </div>
      )}

      <div className="w-22 ml-auto">
        <BRLInput
          value={price}
          onChange={(value) => onPriceChange?.(value)}
          className="font-medium"
          min={0.01}
          step={0.01}
        />
      </div>

      <Button variant="outline" size="icon" onClick={onToggleAvailable}>
        {isAvailable ? <Pause /> : <Play />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger className="relative -left-2 cursor-pointer">
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-secondary">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              {type === "complement" && (
                <Alert variant="warning" className="mb-4 flex items-center">
                  <AlertTriangle size={25} className="text-yellow-600" />
                  <AlertDescription>
                    <p className="font-medium text-yellow-600">
                      Ao excluir este complemento, ele será removido de todos os grupos associados.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              Tem certeza que deseja excluir este item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.();
                setOpenDeleteDialog(false);
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
