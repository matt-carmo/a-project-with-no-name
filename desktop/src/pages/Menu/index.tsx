import api from "@/api/axios";
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
import { useAuthStore } from "@/store/auth-store";
import { convertBRL } from "@/utils/convertBRL";
import { Pause, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const { selectedStore } = useAuthStore();
  const [data, setData] = useState([]);
  const getMenu = async () => {
    try {
      const response = await api.get(`stores/${selectedStore?.store.id}/menu`);
      setData(response.data);
    } catch (err) {
      alert(JSON.stringify(err));
      console.error("Erro ao buscar menu:", err);
    }
  };

  useEffect(() => {
    if (!selectedStore?.store?.id) return;

    getMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);
  async function handleAddCategory() {
    try {
      const response = await api.post(`${selectedStore?.store.id}/categories`, {
        name: "Novo",
      });
      console.log(response);
      if (response.status === 201) {
        getMenu();
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      
    }
  }
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
          <Form onSubmit={handleAddCategory}>
            <Field>
              <Input placeholder='Nome da categoria' />
            </Field>
            <Button type='submit'>Salvar</Button>
          </Form>
        </PopoverPopup>
      </Popover>
      {data.map((category) => (
        <>
          <Card className='border-0 gap-1.5 '>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                {category.products.length} itens disponíveis
              </CardDescription>
            </CardHeader>

            {category.products.map((item) => (
              <CardPanel
                className={`mb-2 last:mb-0 mx-4 p-2  rounded-md ${
                  item.isAvailable && "bg-muted "
                }`}
              >
                <div key={item.id} className='grid grid-cols-[auto_1fr] gap-3'>
                  <img
                    src={item.image || "https://i.imgur.com/rUsYzzJ.png"}
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
                      <Input value={item.stock} className='font-medium' />
                    </div>
                    <div className='w-22 ml-auto'>
                      <Input
                        value={convertBRL(item.price)}
                        className='font-medium'
                      />
                    </div>

                    <Button variant='outline' size={"icon"}>
                      {item.isAvailable ? <Pause /> : <Play />}
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
