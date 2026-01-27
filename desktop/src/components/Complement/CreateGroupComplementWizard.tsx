import { useState } from "react";
import { useForm } from "react-hook-form";


// Interfaces
import { Complement } from "@/interfaces/menu.interface";

// UI
import { Field } from "../ui/field";
import Input from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetPanel,
} from "../ui/sheet";

// Features
import ComplementAction from "../complement-action";
import { ComplementStep } from "./ComplementStep";
import { ComplementGroupChoiceStep } from "./ComplementGroupChoiceStep";
import { ComplementGroupSelectionStep } from "./ComplementGroupSelectionStep";
import { useAuthStore } from "@/store/auth-store";
import { menuService } from "@/services/menu.service";
import { toastManager } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect } from "react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type FormValues = {
  group: {
    id?: string;
    name: string;
    minSelected: number;
    maxSelected: number;
  };
  complements: {
    id?: string;
    name: string;
    description?: string;
    image?: { url: string; id: string };
    imagePreview?: string;
    productPrice: number;
  };
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

interface CreateGroupComplementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitGroup?: (data: any) => void;
}

export function CreateGroupComplementSheet({
  open,
  onOpenChange,
  onSubmitGroup,
}: CreateGroupComplementSheetProps) {
  const { selectedStore } = useAuthStore();
  const [step, setStep] = useState(0); // 0: Choice, 1: Create Group, 2: Complements, 3: Select Existing Group
  const [choice, setChoice] = useState<"new-complement" | "existing-complement">("new-complement");
  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [selectedExistingGroup, setSelectedExistingGroup] = useState<any | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [itemsComplements, setItemsComplements] = useState<Complement[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, control, getValues, setValue, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        group: {
          id: "",
          name: "",
          minSelected: 0,
          maxSelected: 1,
        },
        complements: {
          id: "",
          name: "",
          description: "",
          image: undefined,
          productPrice: 0,
        },
      },
    });

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleAddComplement = () => {
    const values = getValues();

    const newComplement: Complement = {
      id: values.complements.id || crypto.randomUUID(),
      name: values.complements.name,
      description: values.complements.description,
      photoUrl: values.complements.image?.url,
      price: values.complements.productPrice,
      isAvailable: true,
      ...(values.complements.image
        ? { image: values.complements.image }
        : { image: null }),
    };
    console.log("New Complement: ", newComplement);
    setItemsComplements((prev) => [...prev, newComplement]);

    reset({
      ...values,
      complements: {
        name: "",
        description: "",
        image: undefined,
        productPrice: 0,
      },
    });

    setImagePreview(null);
  };

  useEffect(() => {
    if (open && step === 3 && selectedStore?.store.id) {
      fetchGroups();
    }
  }, [open, step, selectedStore]);

  async function fetchGroups() {
    if (!selectedStore?.store.id) return;
    setLoadingGroups(true);
    try {
      const groups = await menuService.getComplementGroups(selectedStore.store.id);
      setAvailableGroups(groups);
    } catch (error) {
      console.error("Failed to fetch groups", error);
      toastManager.add({
        title: "Erro",
        description: "Não foi possível carregar os grupos.",
        type: "error",
      });
    } finally {
      setLoadingGroups(false);
    }
  }

  const resetForm = () => {
    setStep(0);
    setChoice("new-complement");
    setItemsComplements([]);
    setImagePreview(null);
    setSelectedExistingGroup(null);
    reset();
  };

  const handleSave = () => {
    onSubmitGroup?.({
      group: getValues("group"),
      complements: itemsComplements,
      ...(choice === "existing-complement" && { id: selectedExistingGroup.id }),
    });
    onOpenChange(false);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-secondary sm:max-w-2xl h-full "
      >
        <SheetHeader>
          <SheetTitle>Cadastrar complemento</SheetTitle>
        </SheetHeader>
        <SheetPanel className="h-full">
          <div className="space-y-6 h-full">
            {step === 0 && (
              <ComplementGroupChoiceStep
                value={choice}
                onChange={setChoice}
              />
            )}

            {step === 1 && (
              <div className="space-y-4">
                {choice === "new-complement" && (
                  <Field>
                    <Label>Nome do grupo*</Label>
                    <Input
                      placeholder="Ex: Bebidas"
                      {...register("group.name")}
                    />
                  </Field>
                )}

                <Field>
                  <Label>Configurações</Label>
                  <ComplementAction
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    nameBase="group"
                    props={{
                      name: "",
                      minSelected: 0,
                      maxSelected: 1,
                      complements: [],
                      description: "",
                      products: [],
                      isAvailable: true,
                    }}
                  />
                </Field>

                {choice === "existing-complement" && itemsComplements.length > 0 && (
                  <div className="space-y-2">
                    <Label>Itens incluídos no grupo</Label>
                    <ScrollArea className="max-h-[200px] rounded-md border p-3">
                      <ul className="divide-y divide-border">
                        {itemsComplements.map((complement) => (
                          <li key={complement.id} className="py-2 flex justify-between items-center text-sm">
                            <span className="font-medium">{complement.name}</span>
                            <span className="text-muted-foreground">
                              {complement.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <ComplementStep
                register={register}
                getValues={getValues}
                control={control}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                items={itemsComplements}
                onAdd={handleAddComplement}
                onRemove={(id) =>
                  setItemsComplements((prev) => prev.filter((c) => c.id !== id))
                }
                onAddExisting={(complement) => {
                  setItemsComplements((prev) => [...prev, complement]);
                }}
              />
            )}

            {step === 3 && (
              <div className="mt-4">
                <Label className="mb-2 block text-lg font-semibold">Selecione o grupo existente</Label>
                {loadingGroups ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : availableGroups.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    Nenhum grupo disponível para adicionar.
                  </div>
                ) : (
                  <ScrollArea className="max-h-[400px] pr-4 border rounded-md p-4">
                    <ComplementGroupSelectionStep
                      complements={availableGroups}
                      selectedIds={selectedExistingGroup ? [selectedExistingGroup.id] : []}
                      onToggle={(group) => {
                        setSelectedExistingGroup(
                          selectedExistingGroup?.id === group.id ? null : group
                        );
                        // Pre-fill form when selected
                        if (selectedExistingGroup?.id !== group.id) {
                          setValue("group.name", group.name);
                          setValue("group.minSelected", group.minSelected);
                          setValue("group.maxSelected", group.maxSelected);
                          setItemsComplements(group.complements || []);
                        }
                      }}
                      isSelected={(id) => selectedExistingGroup?.id === id}
                    />
                  </ScrollArea>
                )}
              </div>
            )}
          </div>
        </SheetPanel>

        <SheetFooter className="flex gap-2 border-0 rounded-0">
          {step === 0 && (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (choice === "new-complement") {
                    setStep(1);
                  } else {
                    setStep(3);
                  }
                }}
                className="flex-1"
              >
                Avançar
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <Button variant="secondary" onClick={() => setStep(0)}>
                Voltar
              </Button>

              <Button
                disabled={choice === "new-complement" && watch("group.name").trim() === ""}
                onClick={() => {
                  if (choice === "new-complement") {
                    setStep(2);
                  } else {
                    handleSave();
                  }
                }}
                className="flex-1"
              >
                {choice === "new-complement" ? "Avançar" : "Salvar grupo"}
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Button variant="secondary" onClick={() => setStep(0)}>
                Voltar
              </Button>

              <Button
                disabled={!selectedExistingGroup}
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Avançar
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button variant="secondary" onClick={() => {
                if (choice === "new-complement") {
                  setStep(1);
                } else {
                  setStep(3);
                }
              }}>
                Voltar
              </Button>

              <Button
                className="flex-1"
                onClick={handleSave}
              >
                Salvar grupo
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
