/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from "react-router";
import { DetailsProduct } from "./DetailsProduct";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import { Complement, ComplementGroup } from "@/interfaces/menu.interface";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { SheetCreateComplement } from "@/components/Complement/sheet-create-complement";

import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { useComplementStore } from "@/store/complement-store";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, Trash } from "lucide-react";
import { EditableProductRow } from "@/components/editable-product-row";
import { EditInput } from "@/components/edit-input";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useSheetComplementStore } from "@/store/use-sheet-complement-store";
import { SheetUpdateComplementX } from "@/components/Complement/sheet-update-complement";
import { onRefetch } from "@/lib/utils";
import SelectMinMax from "./SelectMinMax";

// import { useForm } from "react-hook-form";

export default function ProductPage() {
  const { state } = useLocation();
  const { item } = state;
  const { setOpen: openCreateComplement } = useSheetComplementStore();

  const [groupedComplements, setGroupedComplements] = useState<
    ComplementGroup[]
  >([]);

  
  const { setSelectedComplements } = useComplementStore();
  async function fetchComplements() {
    try {
      const response = await api.get(
        `/${item.storeId}/groups-complements?productId=${item.id}`
      );
      
      setGroupedComplements(response.data);
    } catch (error) {
      console.error("Error fetching complements:", error);
    }
  }
  useEffect(() => {
    fetchComplements();
     const unsubscribe = onRefetch(() => {
          fetchComplements();
        });
      return () => {
        unsubscribe();
      }
  }, []);

  const handleCreateGroupComplement = async (data: Complement) => {
    const result = await api.post(
      `/${item.storeId}/groups-complements/${item.id}`,
      [data]
    );

    if (result.status === 201) {
      toastManager.add({
        type: "success",
        title: "Grupo de complementos criado com sucesso!",
      });
      setOpen(false)
      fetchComplements();
    }
    if (result.status !== 201) {
      toastManager.add({
        type: "error",
        title: "Erro ao criar grupo de complementos!",
      });
    }
    setSelectedComplements([]);
  };
  const handleCreateComplement = async (
    groupId: string,
    data: {
      complements: Array<{
        name: string;
        description?: string | undefined;
        image?: { url: string; id: string } | undefined;
        productPrice: number;
      }>;
    }
  ) => {
    try {
      const response = await api.post(
        `/${item.storeId}/complement-groups/${groupId}/complements`,
        data.complements
      );

      if (response.status === 201) {
        toastManager.add({
          type: "success",
          title: "Complemento criado com sucesso!",
        });
        fetchComplements();
      }
    } catch (error) {
      console.error("Erro ao criar complemento:", error);
      toastManager.add({
        type: "error",
        title: "Erro ao criar complemento!",
      });
    }
  };
  async function handleDeleteGroupComplement(groupId: string) {
    console.log("Deleting group complement with id:", item);
    try {
      const response = await api.delete(
        `/${item.storeId}/products/${item.id}/groups-complements/${groupId}`
      );

      if (response.status === 200 || response.status === 204) {
        toastManager.add({
          type: "success",
          title: "Grupo de complementos removido com sucesso!",
        });
        fetchComplements();
      }
    } catch (error) {
      console.error("Erro ao deletar grupo de complementos:", error);
      toastManager.add({
        type: "error",
        title: "Erro ao remover grupo de complementos!",
      });
    }
  }

  const [open, setOpen] = useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  return (
    <>
      <SheetUpdateComplementX
        open={open}
        onOpenChange={() => setOpen(false)}
        onSubmitGroup={(data) => {
          if (!selectedGroupId) return;
          handleCreateComplement(selectedGroupId, data);
        }}
      />
      <SheetCreateComplement
      open={false}
      onOpenChange={setOpen}
        onSubmitGroup={(data) => {
          
          // if (!selectedGroupId) return;
          handleCreateGroupComplement(data);
        }}
      />

      <div className="text-3xl font-semibold  space-y-4">
        <h1 className="text-3xl font-semibold">{item?.name}</h1>
        <Tabs defaultValue="tab-1">
          <TabsList>
            <TabsTab value="tab-1">Detalhes do Produto</TabsTab>
            <TabsTab value="tab-2">Complementos</TabsTab>
          </TabsList>
          <TabsPanel value="tab-1">
            <DetailsProduct item={item} />
          </TabsPanel>
          <TabsPanel className={"space-y-4"} value="tab-2">
            <Button onClick={() => openCreateComplement(true)}>
              Novo grupo de complementos
            </Button>
            <ul className="grid grid-cols-1 gap-4">
              {groupedComplements.map((group) => (
                <li className="" key={group.id}>
                  
                  <Card className="border-0 py-2 h-full">
                    <CardContent className="px-4">
                      <Collapsible key={group.id} defaultOpen={false}>
                        <div className="flex justify-between items-center">
                          <div className="text-xl flex items-center gap-2 font-semibold">
                            <Dialog>
                              <DialogTrigger>
                                <Trash className="w-4" />
                              </DialogTrigger>
                              <DialogPopup>
                                <DialogHeader>
                                  <DialogTitle>
                                    Atenção, excluir grupo de complementos?
                                  </DialogTitle>
                                  <DialogDescription>
                                    Tem certeza que deseja excluir o grupo de
                                    complementos <strong>{group.name}</strong>?
                                    Esta ação não pode ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose>
                                    <Button variant="outline">Cancelar</Button>
                                  </DialogClose>
                                  <DialogClose>
                                    <Button
                                      onClick={() =>
                                        handleDeleteGroupComplement(
                                          group.id as string
                                        )
                                      }
                                      variant="destructive"
                                    >
                                      Confirmar
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogPopup>
                            </Dialog>
         
                            <EditInput
                              method="PUT"
                              endpoint={`/${item.storeId}/groups-complements/${group.id}`}
                              name={group.name}
                              onSuccess={fetchComplements}
                            />
                          </div>
                          <CollapsibleTrigger className="inline-flex items-center gap-2 font-medium text-sm data-panel-open:[&_svg]:rotate-180">
                            <ChevronDownIcon className="size-5" />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsiblePanel>
                          <Button
                            onClick={() => {
                              setSelectedGroupId(group.id as string);
                              setOpen(true);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Adicionar complemento
                          </Button>
                          <div className="max-w-lg mt-2">
                            <SelectMinMax/>
                          </div>
                          <ul className="flex flex-col gap-1 py-2 text-sm">
                            {group.complements.map((complement) => (
                              <li>
                                <Card
                                  key={complement.id}
                                  className="border-foreground/10 mb-2"
                                >
                                  <CardContent className="flex flex-row justify-between items-center">
                                    <CardDescription className="w-full">
                            
                                      <EditableProductRow
                                        isAvailable={
                                          complement?.isAvailable
                                        }

                                        editable={true}
                                        name={complement.name}
                                        storeId={item.storeId}
                                        complementId={complement.id}
                                        photoUrl={complement.photoUrl}
                                        productId={item.id}
                                        key={complement.id}
                                        type="complement"
                                        price={complement.price}
                                      />
                                    </CardDescription>
                                  </CardContent>
                                </Card>
                              </li>
                            ))}
                          </ul>
                        </CollapsiblePanel>
                      </Collapsible>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </TabsPanel>
        </Tabs>
      </div>
    </>
  );
}
