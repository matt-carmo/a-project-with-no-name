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
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { categorySchema } from "@/schemas/category.schema";
import { useAuthStore } from "@/store/auth-store";

import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { EditInput } from "@/components/edit-input";
import { Category } from "@/interfaces/menu.interface";
import { Badge } from "@/components/ui/badge";
import { EditableProductRow } from "@/components/editable-product-row";

import { SheetCreateProduct } from "@/components/sheet-create-product";
import { SheetCreateComplement } from "@/components/sheet-create-complement";


export default function MenuPage() {
  const { selectedStore } = useAuthStore();
  const [data, setData] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>({
    resolver: zodResolver(categorySchema.pick({ name: true })),
  });

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
  async function handleAddCategory(data: { name: string }) {
    try {
      const response = await api.post(`${selectedStore?.store.id}/categories`, {
        name: data.name,
      });
      console.log(errors);
      if (response.status === 201) {
        getMenu();
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  }
  async function handleDeleteCategory(id: string) {
    try {
      const response = await api.delete(`categories/${id}`);
      if (response.status === 204) {
        getMenu();
      }
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  }
  return (
    <div className='space-y-4'>
                <SheetCreateComplement/>

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
          <Form onSubmit={handleSubmit(handleAddCategory)}>
            <Field>
              <Input placeholder='Nome da categoria' {...register("name")} />
              <span className='text-red-500'>{errors?.name?.message}</span>
              {/* <span>{JSON.stringify(errors || {})}</span> */}
            </Field>
            <PopoverClose>
              <Button disabled={isSubmitting} type='submit'>
                Salvar
              </Button>
            </PopoverClose>
          </Form>
        </PopoverPopup>
      </Popover>

      {data.map((category) => (
        <>
          <Card className='border-0 gap-1.5 '>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Dialog>
                  <DialogTrigger>
                    <Trash className='w-4' />
                  </DialogTrigger>
                  <DialogPopup>
                    <DialogHeader>
                      <DialogTitle>Atenção, excluir categoria</DialogTitle>
                      <DialogDescription>
                        Todos os itens dessa categoria também serão excluídos
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <DialogClose>
                        <Button variant='outline'>Cancelar</Button>
                      </DialogClose>
                      <DialogClose
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Button variant='destructive'>Confirmar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogPopup>
                </Dialog>

                <EditInput onSubmit={() => getMenu()} props={category} />
                <SheetCreateProduct category={category} />
              </CardTitle>
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
                    src={item.photoUrl || "https://i.imgur.com/rUsYzzJ.png"}
                    alt={item.name}
                    className='aspect-5/4 w-16 object-cover rounded-md'
                  />

                  <div className='flex gap-2 items-center'>
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold'>{item.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {item.description || "Sem descricao"}
                      </p>
                    </div>
                    <EditableProductRow
                      stock={item.stock }
                      isAvailable={item.isAvailable}
                      price={item.price}
                    />
                  </div>
                </div>
                <ul className='space-y-2'>
                  {item.productComplementGroups.map((complementGroup) => (
                    <li className='mt-2'>
                      <CardPanel
                        className='border border-foreground/20 p-4 rounded-2xl'
                        key={complementGroup.id}
                      >
                        <div className='flex gap-2 items-center'>
                          <div className='flex-1 min-w-0 '>
                            <p className='font-semibold'>
                              {complementGroup.group.name}
                            </p>
                            <p>{complementGroup.group.isAvailable}</p>
                            <ul>
                              <li>
                                {complementGroup.group.isRequired ? (
                                  <Badge
                                    className='rounded-full px-2 py-0.5'
                                    variant='required'
                                  >
                                    Obrigatorio
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant='optional'
                                    className='rounded-full px-2 py-0.5'
                                  >
                                    Opicional
                                  </Badge>
                                )}
                              </li>
                            </ul>
                            <ul className='w-full flex flex-col gap-2 mt-2'>
                              {complementGroup.group.complements.map(
                                (complement) => (
                                  <li
                                    key={complement.id}
                                    className='flex justify-between'
                                  >
                                    <div className='flex gap-2 items-center'>
                                      <img
                                        src={"https://i.imgur.com/rUsYzzJ.png"}
                                        alt={""}
                                        className='w-8 h-8 object-cover rounded-md'
                                      />
                                      {complement.name}
                                    </div>
                                    <EditableProductRow
                                      
                                      isAvailable={complement.isActive}
                                      price={complement.price}
                                    />
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </CardPanel>
                    </li>
                  ))}
                </ul>
              </CardPanel>
            ))}
          </Card>
        </>
      ))}
    </div>
  );
}
