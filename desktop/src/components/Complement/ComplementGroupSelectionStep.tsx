import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useComplementStore } from "@/store/complement-store";

interface Props {
  complements: any[];
  selectedIds: string[];
  onToggle: (complement: any) => void;
  isSelected: (id: string) => boolean;
  error?: string;
}

export function ComplementGroupSelectionStep({
  complements,
  // selectedIds,
  onToggle,
  isSelected,
  error,
}: Props) {
  const { selectedComplements } = useComplementStore();

  // ---------------------------------------------------------------------------
  // Merge complements + selectedComplements (sem duplicar)
  // ---------------------------------------------------------------------------
  const mergedComplements = [...selectedComplements, ...complements].filter(
    (complement, index, self) =>
      index === self.findIndex((c) => c.id === complement.id)
  );

  return (
    <div className="flex-1/3 relative">
      <h2 className="text-2xl mb-2">Complementos</h2>

      {error && <span className="text-destructive text-sm">{error}</span>}

      <ScrollArea className="max-h-[70vh] pr-2">
        {mergedComplements.map((complement) => (
          <Card
            key={complement.id}
            onClick={() => onToggle(complement)}
            className="mb-4 py-3 px-0 relative cursor-pointer"
          >
            <SelectionIndicator active={isSelected(complement.id)} />

            <CardContent className="px-3">
              <CardTitle>{complement.name}</CardTitle>

              {complement.products?.length > 0 ? (
                <CardDescription className="line-clamp-1">
                  Disponível em{" "}
                  {complement.products
                    .map((p: { product: { name: string } }) => p.product.name)
                    .join(", ")}
                </CardDescription>
              ) : (
                <CardDescription>Nenhum produto vinculado</CardDescription>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}

function SelectionIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex justify-end absolute top-2 right-2">
      <span className="aspect-square w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
        <span
          className={`block w-2.5 h-2.5 rounded-full ${
            active ? "bg-white" : "bg-transparent"
          }`}
        />
      </span>
    </div>
  );
}
