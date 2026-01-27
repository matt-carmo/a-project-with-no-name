import { Complement } from "@/interfaces/menu.interface";
import { useEffect, useState } from "react";
import { menuService } from "@/services/menu.service";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "../ui/spinner";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { convertBRL } from "@/utils/convertBRL";
import { Check } from "lucide-react";

interface Props {
    onSelect: (complement: Complement) => void;
    selectedIds: string[];
}

export function ComplementSelectionStep({ onSelect, selectedIds }: Props) {
    const { selectedStore } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [complements, setComplements] = useState<Complement[]>([]);

    useEffect(() => {
        async function fetchComplements() {
            if (!selectedStore?.store.id) return;
            setLoading(true);
            try {
                const groups = await menuService.getComplementGroups(selectedStore.store.id);
                const allComplements: Complement[] = [];
                const seenIds = new Set<string>();

                groups.forEach((group: any) => {
                    group.complements?.forEach((comp: Complement) => {
                        if (!seenIds.has(comp.id as string)) {
                            allComplements.push(comp);
                            seenIds.add(comp.id as string);
                        }
                    });
                });

                setComplements(allComplements);
            } catch (error) {
                console.error("Failed to fetch complements", error);
            } finally {
                setLoading(false);
            }
        }

        fetchComplements();
    }, [selectedStore]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner />
            </div>
        );
    }

    return (
        <ScrollArea className="h-[400px] border rounded-md p-4">
            <div className="grid grid-cols-1 gap-2">
                {complements.map((c) => {
                    const isSelected = selectedIds.includes(c.id as string);
                    return (
                        <Card
                            key={c.id}
                            onClick={() => onSelect(c)}
                            className={`cursor-pointer transition-colors ${isSelected ? "border-primary bg-primary/5" : "hover:bg-accent"
                                }`}
                        >
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {c.photoUrl && (
                                        <img
                                            src={c.photoUrl}
                                            alt={c.name}
                                            className="w-10 h-10 rounded-md object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{c.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {convertBRL(c.price)}
                                        </p>
                                    </div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-primary" />}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
