/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from "react-router";
import { DetailsProduct } from "./DetailsProduct";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import { Complement, ComplementGroup } from "@/interfaces/menu.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, Trash } from "lucide-react";
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
import { SheetUpdateComplementX } from "@/components/Complement/sheet-update-complement";
import { onRefetch } from "@/lib/utils";

import { EditableProductRowLocal } from "@/components/Complement/EditableProductRowLocal";
import { updateComplement } from "@/services/complements/updateComplementField.service";
import { updateProduct } from "@/services/products/updateProductField.service";
import { toastManager } from "@/components/ui/toast";
import { CreateGroupComplementSheet } from "@/components/Complement/CreateGroupComplementWizard";

/* =========================
   TIPOS LOCAIS
========================= */

type ActionType = "create" | "update" | "delete" | undefined;

interface ComplementLocal extends Complement {
  action?: ActionType;
}

interface ComplementGroupLocal extends ComplementGroup {
  action?: ActionType;
  complements: ComplementLocal[];
}

/* =========================
   UTILS
========================= */

function markUpdate(action?: ActionType): ActionType {
  if (action === "create") return "create";
  return "update";
}

/* =========================
   COMPONENT
========================= */
function splitGroupsByAction(groups: ComplementGroupLocal[]) {
  const create: ComplementGroupLocal[] = [];
  const update: ComplementGroupLocal[] = [];
  const remove: ComplementGroupLocal[] = [];

  for (const group of groups) {
    if (!group.action) continue;

    if (group.action === "create") create.push(group);
    if (group.action === "update") update.push(group);
    if (group.action === "delete") remove.push(group);
  }

  return { create, update, remove };
}
function splitComplementsByAction(groups: ComplementGroupLocal[]) {
  const create: ComplementLocal[] = [];
  const update: ComplementLocal[] = [];
  const remove: ComplementLocal[] = [];

  for (const group of groups) {
    for (const complement of group.complements) {
      if (!complement.action) continue;

      if (complement.action === "create") create.push(complement);
      if (complement.action === "update") update.push(complement);
      if (complement.action === "delete") remove.push(complement);
    }
  }

  return { create, update, remove };
}

export default function ProductPage() {
  const { state } = useLocation();
  const { item } = state;

  const [groupedComplements, setGroupedComplements] = useState<
    ComplementGroupLocal[]
  >([]);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openUpdateComplement, setOpenUpdateComplement] = useState(false);
  const [product, setProduct] = useState<any>(item);

  /* =========================
     FETCH
  ========================= */
  const navigate = useNavigate();

  async function fetchComplements() {
    const response = await api.get(
      `/${item.storeId}/groups-complements?productId=${item.id}`
    );

    setGroupedComplements(
      response.data.map((g: ComplementGroup) => ({
        ...g,
        action: undefined,
        complements: g.complements.map((c) => ({
          ...c,
          action: undefined,
        })),
      }))
    );
  }

  useEffect(() => {
    fetchComplements();
    const unsubscribe = onRefetch(fetchComplements);

    return () => {
      unsubscribe();
    };
  }, []);

  /* =========================
     CREATE
  ========================= */

  const handleCreateComplement = (data: Complement[]) => {
    if (!selectedGroupId) return;

    const newComplements: ComplementLocal[] = data.map((c) => ({
      ...c,
      id: c.id ?? crypto.randomUUID(),
 
      groupId: selectedGroupId,
      action: "create",
    }));

    setGroupedComplements((prev) =>
      prev.map((group) =>
        group.id === selectedGroupId
          ? {
              ...group,
              complements: [...group.complements, ...newComplements],
            }
          : group
      )
    );
  };

  /* =========================
     UPDATE
  ========================= */

  function updateComplementLocal(
    groupId?: string,
    complementId?: string,
    changes?: Partial<Complement>
  ) {
    if (!groupId || !complementId || !changes) return;

    setGroupedComplements((prev) =>
      prev.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              action: markUpdate(group.action),
              complements: group.complements.map((c) =>
                c.id !== complementId
                  ? c
                  : {
                      ...c,
                      ...changes,
                      action: markUpdate(c.action),
                    }
              ),
            }
      )
    );
  }

  /* =========================
     DELETE (LÓGICO)
  ========================= */

  function removeComplementLocal(groupId?: string, complementId?: string) {
    if (!groupId || !complementId) return;

    setGroupedComplements((prev) =>
      prev.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              complements: group.complements.map((c) =>
                c.id !== complementId ? c : { ...c, action: "delete" }
              ),
            }
      )
    );
  }

  function removeGroupLocal(groupId: string) {
    setGroupedComplements((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, action: "delete" } : group
      )
    );
  }

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {
    try {
      // 1. Produto
      await updateProduct(item.storeId, item.id, {
        name: product.name,
        description: product.descriptiotn,
        price: product.price,
        ...(typeof product.image === "object" && { image: product.image }),

        isAvailable: product.isAvailable,
      });

      // 2. Complementos
      const { create, update, remove } =
        splitComplementsByAction(groupedComplements);

      const {
        create: createGroups,
        update: updateGroups,
        remove: removeGroups,
      } = splitGroupsByAction(groupedComplements);
      // UPDATE
      await Promise.all(
        update.map((c) =>
          updateComplement(c.id as string, {
            name: c.name,
            price: c.price,
            isAvailable: c.isAvailable,
            
            photoUrl: c.photoUrl,
          })
        )
      );

      await api.post(
        `${item.storeId}/groups-complements/${item.id}`,
        createGroups.map((g) => ({
          name: g.name,
          description: g.description,
          isAvailable: g.isAvailable,
          minSelected: g.minSelected,
          maxSelected: g.maxSelected,
          complements: g.complements,
        }))
      );
      await Promise.all(
        updateGroups.map((g) =>
          api.put(`${item.storeId}/groups-complements/${g.id}`, {
            name: g.name,
            description: g.description,
            isAvailable: g.isAvailable,
            minSelected: g.minSelected,
            maxSelected: g.maxSelected,
          })
        )
      );
      // CREATE
      await Promise.all(
        create.map((c) =>
          api.post(
            `${item.storeId}/complement-groups/${c.groupId}/complements`,
            {
              name: c.name,
              price: c.price,
              isAvailable: c.isAvailable,
              stock: c.stock,
              photoUrl: c.image?.url,
              image: c.image,
            }
          )
        )
      );
      await Promise.all(
        removeGroups.map(
          async (g) =>
            await api.delete(
              `${item.storeId}/products/${item.id}/groups-complements/${g.id}`
            )
        )
      );

      // DELETE
      await Promise.all(remove.map((c) => api.delete(`complements/${c.id}`)));

      toastManager.add({
        type: "success",
        title: "Sucesso",
        description: "Produto e complementos atualizados com sucesso!",
      });
      navigate(-1);
    } catch (err) {
      toastManager.add({
        type: "error",
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o produto e complementos.",
      });
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <>
      <SheetUpdateComplementX
        open={open}
        onOpenChange={() => setOpen(false)}
        onSubmitGroup={(data) => handleCreateComplement(data.complements)}
      />
      <CreateGroupComplementSheet
        onSubmitGroup={(data) => {
          setGroupedComplements((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              products: [],
              name: data.group.name,
              description: data.group.description,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              complements: data.complements,
              action: "create",
              isAvailable: true,
              minSelected: data.group.minSelected,
              maxSelected: data.group.maxSelected,
            },
          ]);
        }}
        open={openUpdateComplement}
        onOpenChange={setOpenUpdateComplement}
      />

      <div className="justify-between flex flex-col h-full">
        <div className="grid grid-cols-2 gap-x-10">
          <Tabs defaultValue="tab-1">
            <TabsList>
              <TabsTab value="tab-1">Detalhes</TabsTab>
              <TabsTab value="tab-2">Complementos</TabsTab>
            </TabsList>

            <TabsPanel value="tab-1">
              <DetailsProduct onChange={setProduct} item={item} />
            </TabsPanel>

            <TabsPanel value="tab-2" className="space-y-4">
              <Button onClick={() => setOpenUpdateComplement(true)}>
                Adicionar grupo de complementos
              </Button>
              <ul className="space-y-4">
                {groupedComplements
                  .filter((g) => g.action !== "delete")
                  .map((group) => (
                    <Card key={group.id}>
                      <CardContent>
                        <Collapsible>
                          <div className="flex justify-between items-center">
                            <EditInput
                              name={group.name}
                              onchange={(name) =>
                                setGroupedComplements((prev) =>
                                  prev.map((g) =>
                                    g.id === group.id
                                      ? {
                                          ...g,
                                          action: markUpdate(g.action),
                                          name,
                                        }
                                      : g
                                  )
                                )
                              }
                            />
                            <Dialog>
                              <DialogTrigger>
                                <Trash className="w-4" />
                              </DialogTrigger>
                              <DialogPopup>
                                <DialogHeader>
                                  <DialogTitle>Excluir grupo?</DialogTitle>
                                  <DialogDescription>
                                    Esta ação não pode ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose>
                                    <Button variant="outline">Cancelar</Button>
                                  </DialogClose>
                                  <DialogClose>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        removeGroupLocal(group.id as string)
                                      }
                                    >
                                      Excluir
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogPopup>
                            </Dialog>
                            <CollapsibleTrigger>
                              <ChevronDownIcon />
                            </CollapsibleTrigger>
                          </div>

                          <CollapsiblePanel className="mt-2 space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedGroupId(group.id as string);
                                setOpen(true);
                              }}
                            >
                              Adicionar complemento
                            </Button>

                            {group.complements
                              .filter((c) => c.action !== "delete")
                              .map((complement) => (
                                <EditableProductRowLocal
                                  key={complement.id}
                                  type="complement"
                                  editable
                                  {...complement}
                                  onStockChange={(v) =>
                                    updateComplementLocal(
                                      group.id,
                                      complement.id,
                                      {
                                        stock: v,
                                      }
                                    )
                                  }
                                  onPhotoChange={(v) => {
                                    updateComplementLocal(
                                      group.id,
                                      complement.id,
                                      {
                                        photoUrl: v,
                                      }
                                    );
                                  }}
                                  onNameChange={(v) =>
                                    updateComplementLocal(
                                      group.id,
                                      complement.id,
                                      {
                                        name: v,
                                      }
                                    )
                                  }
                                  onPriceChange={(v) =>
                                    updateComplementLocal(
                                      group.id,
                                      complement.id,
                                      {
                                        price: v,
                                      }
                                    )
                                  }
                                  onToggleAvailable={() =>
                                    updateComplementLocal(
                                      group.id,
                                      complement.id,
                                      {
                                        isAvailable: !complement.isAvailable,
                                      }
                                    )
                                  }
                                  onDelete={() =>
                                    removeComplementLocal(
                                      group.id,
                                      complement.id
                                    )
                                  }
                                />
                              ))}
                          </CollapsiblePanel>
                        </Collapsible>
                      </CardContent>
                    </Card>
                  ))}
              </ul>
            </TabsPanel>
          </Tabs>

          <pre className="mt-4 bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify(product, null, 2)}
            {JSON.stringify(groupedComplements, null, 2)}
          </pre>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar alterações</Button>
          
        </div>
      </div>
    </>
  );
}
