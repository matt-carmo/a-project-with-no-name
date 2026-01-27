import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ComplementGroupSelectionStep } from "./Complement/ComplementGroupSelectionStep";
import { useEffect, useState } from "react";
import { menuService } from "@/services/menu.service";
import { useAuthStore } from "@/store/auth-store";
import { toastManager } from "./ui/toast";
import { Spinner } from "./ui/spinner";
import { PlusIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";



interface DialogAddComplementGroupProps {
    productId: string;
    existingGroupsIds: string[];
    onSuccess: () => void;
}

export function DialogAddComplementGroup({
    productId,
    existingGroupsIds,
    onSuccess,
}: DialogAddComplementGroupProps) {
    const { selectedStore } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [availableGroups, setAvailableGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && selectedStore?.store.id) {
            fetchGroups();
        }
    }, [open, selectedStore]);

    async function fetchGroups() {
        if (!selectedStore?.store.id) return;
        setLoading(true);
        try {
            const groups = await menuService.getComplementGroups(selectedStore.store.id);
            // Filter out groups that are already attached to the product
            const filtered = groups.filter(
                (g) => !existingGroupsIds.includes(g.id)
            );
            setAvailableGroups(filtered);
        } catch (error) {
            console.error("Failed to fetch groups", error);
            toastManager.add({
                title: "Erro",
                description: "Não foi possível carregar os grupos.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirm() {
        if (!selectedGroup || !selectedStore?.store.id) return;
        setSaving(true);
        try {
            await menuService.connectGroupToProduct(
                selectedStore.store.id,
                productId,
                selectedGroup.id
            );
            toastManager.add({
                title: "Sucesso",
                description: "Grupo adicionado com sucesso.",
                type: "success",
            });
            onSuccess();
            setSelectedGroup(null);
        } catch (error) {
            console.error("Failed to connect group", error);
            toastManager.add({
                title: "Erro",
                description: "Não foi possível adicionar o grupo.",
                type: "error",
            });
        } finally {
            setOpen(false);
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline" size="sm" className="gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Vincular grupo existente
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Adicionar grupo de complementos</DialogTitle>
                    <DialogDescription>
                        Escolha um grupo existente para vincular a este produto.
                    </DialogDescription>
                    <div className="mt-4">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Spinner />
                            </div>
                        ) : availableGroups.length === 0 ? (
                            <div className="text-center text-muted-foreground">
                                Nenhum grupo disponível para adicionar.
                            </div>
                        ) : (
                            <ScrollArea className="max-h-[400px] pr-4">
                                <ComplementGroupSelectionStep
                                    complements={availableGroups}
                                    selectedIds={selectedGroup ? [selectedGroup.id] : []}
                                    onToggle={(group) =>
                                        setSelectedGroup(
                                            selectedGroup?.id === group.id ? null : group
                                        )
                                    }
                                    isSelected={(id) => selectedGroup?.id === id}
                                />
                            </ScrollArea>
                        )}
                    </div>
                </DialogHeader>



                <DialogFooter className="mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedGroup || saving}
                        className="min-w-[120px]"
                    >
                        {saving ? <Spinner /> : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}
