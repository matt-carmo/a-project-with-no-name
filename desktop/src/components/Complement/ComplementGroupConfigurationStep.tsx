import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import ComplementAction from "@/components/complement-action";

interface Props {
  complements: any[];
  control: any;
  setValue: any;
  watch: any;
}

export function ComplementGroupConfigurationStep({
  complements,
  control,
  setValue,
  watch,
}: Props) {

  console.log("Rendering ComplementGroupConfigurationStep with complements:", complements);
  return (
    <div className="flex-1/3">
      <h2 className="text-2xl">Complementos</h2>
      
      {complements.map((complement, index) => (
        <Card key={complement.id} className="mb-4 py-3 px-0">
          <CardContent className="px-3">
            <CardTitle>{complement.name}</CardTitle>

            {complement.products?.length > 0 ? (
              <CardDescription className="line-clamp-1">
                Disponível em{" "}
                {complement.products
                  .map((p) => p.product.name)
                  .join(", ")}
              </CardDescription>
            ) : (
              <CardDescription>
                Complemento novo, sem produtos vinculados
              </CardDescription>
            )}

            <ComplementAction
              control={control}
              setValue={setValue}
              watch={watch}
              nameBase={`productComplementGroups.${index}`}
              props={complement as any}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
