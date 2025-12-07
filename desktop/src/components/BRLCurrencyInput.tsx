import { Input } from "./ui/input";

// componente BRLInput (tipagem assumida)
type BRLInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  onChange: (valueInCents: number) => void;
  value?: number;
};

export default function BRLInput({
  onChange,
  value = 0,
  ...props
}: BRLInputProps) {

  function format(number: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(number / 100);
  }
 

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    const numeric = Number(onlyDigits); // numeric é centavos
    onChange(numeric); // devolvemos centavos
  }

  return (
    <Input
      {...props}
      type='text'
      value={format(value)}
      onChange={handleChange}
      placeholder='R$ 0,00'
    />
  );
}
