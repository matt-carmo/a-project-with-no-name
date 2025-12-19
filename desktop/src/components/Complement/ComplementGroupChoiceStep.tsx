import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type ComplementChoice = "new-complement" | "existing-complement";

interface Props {
  value: ComplementChoice;
  onChange: (value: ComplementChoice) => void;
}

export function ComplementGroupChoiceStep({ value, onChange }: Props) {
  return (
    <div className="flex-1/3">
      <h2 className="text-2xl">Grupo de complementos</h2>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <OptionCard
          title="Criar Grupo"
          description="[...]"
          active={value === "new-complement"}
          onClick={() => onChange("new-complement")}
        />

        <OptionCard
          title="Vincular grupo existente"
          description="..."
          active={value === "existing-complement"}
          onClick={() => onChange("existing-complement")}
        />
      </div>
    </div>
  );
}

function OptionCard({
  title,
  description,
  active,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick} className="relative cursor-pointer">
      <SelectionIndicator active={active} />
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function SelectionIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex justify-end absolute top-2 right-2">
      <span className="aspect-square w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
        {active && (
          <span className="block w-2.5 h-2.5 bg-white rounded-full" />
        )}
      </span>
    </div>
  );
}
