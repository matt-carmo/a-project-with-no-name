import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { convertBRL } from "@/utils/convertBRL";
import { Pause, Play, Plus } from "lucide-react";

const data = [
  {
    id: 1,
    name: "Bebidas",
    items: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80",
        name: "Coca-Cola",
        description: "Refrigerante de cola",
        price: 100,
        quantity: 1,
        available: true,
      },
      {
        id: 2,
        name: "Fanta",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80",
        description: "Refrigerante de laranja",
        price: 5.99,
        quantity: 4,
        available: true,
      },
    ],
  },
  {
    id: 2,
    name: "Lanches",
    items: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1500&q=80",
        name: "Hambúrguer",
        description: "Pão, carne, queijo e salada",
        price: 14.9,
        quantity: 3,
        available: true,
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1500&q=80",
        name: "Batata Frita",
        description: "Porção de batatas fritas crocantes",
        price: 9.9,
        quantity: 5,
        available: false,
      },
    ],
  },
  {
    id: 3,
    name: "Bebidas",
    items: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80",
        name: "Coca-Cola",
        description: "Refrigerante de cola",
        price: 5.99,
        quantity: 21,
        available: false,
      },
      {
        id: 2,
        name: "Fanta",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80",
        description: "Refrigerante de laranja",
        price: 5.99,
        quantity: 0,
        available: false,
      },
    ],
  },
  {
    id: 4,
    name: "Lanches",
    items: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1500&q=80",
        name: "Hambúrguer",
        description: "Pão, carne, queijo e salada",
        price: 14.9,
        quantity: 12,
        available: false,
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1500&q=80",
        name: "Batata Frita",
        description: "Porção de batatas fritas crocantes",
        price: 9.9,
        quantity: 12,
        available: false,
      },
    ],
  },
];

export default function MenuPage() {
  return (
    <div className='space-y-4'>
      <h1 className='text-4xl font-semibold'>Cardápio</h1>
      <p>Gerencie e customize o cardápio do seu restaurante</p>
      <Popover>
        <PopoverTrigger>
          <Button variant='outline'>
            <Plus />
            Adicionar Categoria
          </Button>
        </PopoverTrigger>
        <PopoverPopup align='center' side='bottom' className={"w-80 mt-2"}>
          <div className='mb-4'>
            <PopoverTitle className='text-base'>
              Adicionar Categoaria
            </PopoverTitle>
            <PopoverDescription>Insira o nome da categoria</PopoverDescription>
          </div>
          <Form>
            <Field>
              <Input placeholder='Nome da categoria' />
            </Field>
            <Button type='submit'>Salvar</Button>
          </Form>
        </PopoverPopup>
      </Popover>
      {data.map((category) => (
        <>
          <Card className='border-0 gap-0 '>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                {category.items.length} itens disponíveis
              </CardDescription>
            </CardHeader>

            {category.items.map((item) => (
              <CardPanel className={`mb-2 last:mb-0 mx-4 p-2  rounded-md ${item.available && "bg-muted "}`}>
                <div key={item.id} className='grid grid-cols-[auto_1fr] gap-3'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='aspect-5/4 w-16 object-cover rounded-md'
                  />

                  <div className='flex gap-2 items-center'>
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold'>{item.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {item.description}
                      </p>
                    </div>
                    <div className='w-16'>
                      <Input value={item.quantity} className='font-medium' />
                    </div>
                    <div className='w-22 ml-auto'>
                      <Input
                        value={convertBRL(item.price)}
                        className='font-medium'
                      />
                    </div>

                    <Button variant='outline' size={"icon"}>
                      {item.available ? <Pause /> : <Play />}
                    </Button>
                  </div>
                </div>
              </CardPanel>
            ))}
          </Card>
        </>
      ))}
    </div>
  );
}
