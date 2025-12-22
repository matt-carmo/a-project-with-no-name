import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { SheetCreateProduct } from "@/components/sheet-create-product";
import { CameraOff, ChevronDownIcon, Pause, Play, Trash } from "lucide-react";
import { EditInput } from "@/components/edit-input";
import { Badge } from "@/components/ui/badge";
import { EditableProductRow } from "@/components/editable-product-row";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { Category } from "@/interfaces/menu.interface";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import api from "@/api/axios";
import { toastManager } from "@/components/ui/toast";

export function MenuCategoryList({
  data,
  onDeleteCategory,
  onMenuUpdated,
}: {
  data: Category[];
  onDeleteCategory: (id: string) => void;
  onMenuUpdated: () => void;
}) {
  const { selectedStore } = useAuthStore();

  async function handleToggleGroup(groupId: string, isAvailable: boolean) {
    if (!selectedStore?.store.id) return;

    const response = await updateGroupComplementAvailability({
      storeId: selectedStore.store.id,
      groupId,
      isAvailable,
    });

    if (response.status === 200) {
      onMenuUpdated();
      toastManager.add({
        title: "Sucesso",
        description: `Grupo foi ${
          isAvailable ? "ativado" : "desativado"
        } com sucesso.`,
        type: "success",
      });
    }else {
      toastManager.add({
        title: "Erro",
        description: `Não foi possível atualizar o grupo.`,
        type: "error",
      });
    }
  }

  async function updateGroupComplementAvailability({
    storeId,
    groupId,
    isAvailable,
  }: {
    storeId: string;
    groupId: string;
    isAvailable: boolean;
  }) {
    return api.put(`/${storeId}/groups-complements/${groupId}`, {
      isAvailable,
    });
  }

  return (
    <>
      {data.map((category) => (
        <Card key={category.id} className="border-0 gap-1.5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger>
                  <Trash className="w-4" />
                </DialogTrigger>
                <DialogPopup>
                  <DialogHeader>
                    <DialogTitle>Atenção, excluir categoria</DialogTitle>
                    <DialogDescription>
                      Todos os itens dessa categoria também serão excluídos
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <DialogClose onClick={() => onDeleteCategory(category.id)}>
                      <Button variant="destructive">Confirmar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogPopup>
              </Dialog>

              <EditInput
                endpoint={`categories/${category.id}`}
                name={category.name}
                key={category.id}
                onSuccess={onMenuUpdated}
              />

              <SheetCreateProduct category={category} />
            </CardTitle>

            <CardDescription>
              {category.products.length} itens disponíveis
            </CardDescription>
          </CardHeader>

          {category.products.map((item) => (
            <CardPanel
              key={item.id}
              className={`mb-2 last:mb-0 mx-4 p-2 rounded-md ${
                item.isAvailable && "bg-muted"
              }`}
            >
              <Collapsible>
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  {!item.photoUrl ? (
                    <div className="w-16 aspect-5/4">
                      <CameraOff className="w-full h-full" />
                    </div>
                  ) : (
                    <img
                      src={item.photoUrl}
                      className="w-16 aspect-5/4 object-cover rounded-md"
                    />
                  )}

                  <div className="flex gap-2 items-center">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/store/${selectedStore?.store.id}/product/${item.id}`}
                        state={{ item }}
                      >
                        <Button
                          variant="link"
                          className="p-0 font-semibold text-base"
                        >
                          {item.name}
                        </Button>
                      </Link>

                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description || "Sem descrição"}
                      </p>
                    </div>

                    <CollapsibleTrigger className={'data-panel-open:[&_svg]:rotate-180'}>
                      <Button variant="link" className="p-0 text-sm ">
                        <ChevronDownIcon className="size-5 " />
                        Complementos
                      </Button>
                    </CollapsibleTrigger>

                    <EditableProductRow
                      storeId={selectedStore?.store.id as string}
                      stock={item.stock}
                      type="product"
                      product={item}
                      productId={item.id}
                      isAvailable={item.isAvailable}
                      price={item.price}
                    />
                  </div>
                </div>

                <CollapsibleContent>
                  <ul className="space-y-2">
                    {item.productComplementGroups?.map((complementGroup) => {
                      const group = complementGroup.group;

                      return (
                        <li key={group.id} className="mt-2">
                          <CardPanel className="border p-4 rounded-2xl">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold">{group.name}</p>

                              <Button
                              className="mr-8"
                                variant={"outline"}
                                onClick={() =>
                                  handleToggleGroup(
                                    group.id as string,
                                    !group.isAvailable
                                  )
                                }
                              >
                                {group.isAvailable ? <Pause /> : <Play />}
                              </Button>
                            </div>

                            <div className="mt-2">
                              {group.minSelected > 0 ? (
                                <Badge variant="required">Obrigatório</Badge>
                              ) : (
                                <Badge variant="optional">Opcional</Badge>
                              )}
                            </div>

                            <ul className="flex flex-col gap-2 mt-3">
                              {group.complements?.map((complement) => (
                                <li
                                  key={complement.id}
                                  className="flex justify-between items-center"
                                >
                                  <div className="flex gap-2 items-center">
                                    {!complement.photoUrl ? (
                                      <CameraOff className="w-8 h-8" />
                                    ) : (
                                      <img
                                        src={complement.photoUrl}
                                        className="w-8 h-8 object-cover rounded-md"
                                      />
                                    )}
                                    {complement.name}
                                  </div>

                                  <EditableProductRow
                                    storeId={selectedStore?.store.id as string}
                                    type="complement"
                                    complementId={complement.id}
                                    productId={item.id}
                                    isAvailable={complement.isAvailable}
                                    price={complement.price}
                                  />
                                </li>
                              ))}
                            </ul>
                          </CardPanel>
                        </li>
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </CardPanel>
          ))}
        </Card>
      ))}
    </>
  );
}
