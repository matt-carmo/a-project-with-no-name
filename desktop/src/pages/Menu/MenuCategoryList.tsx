import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { SheetCreateProduct } from "@/components/sheet-create-product";
import { CameraOff, ChevronDownIcon, Trash } from "lucide-react";
import { EditInput } from "@/components/edit-input";
import { Badge } from "@/components/ui/badge";
import { EditableProductRow } from "@/components/editable-product-row";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { Category } from "@/interfaces/menu.interface";
import {
  Collapsible,
  CollapsibleContent,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function MenuCategoryList({
  data,
  onDeleteCategory,
  onMenuUpdated,
}: {
  data: Category[];
  onDeleteCategory: (id: string) => void;
  onMenuUpdated: () => void;
}) {
  const { selectedStore } = useAuthStore();

  return (
    <>
      {data.map((category) => (
        <Card key={category.id} className='border-0 gap-1.5'>
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
                    <DialogClose onClick={() => onDeleteCategory(category.id)}>
                      <Button variant='destructive'>Confirmar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogPopup>
              </Dialog>

              <EditInput endpoint={`categories/${category.id}`} name={category.name} key={category.id} onSuccess={onMenuUpdated} />
              <SheetCreateProduct category={category} />
            </CardTitle>

            <CardDescription>
              {category.products.length} itens disponíveis
            </CardDescription>
          </CardHeader>

          {category.products.map((item) => (
            <CardPanel
              key={item.id}
              className={`mb-2 last:mb-0 mx-4 p-2 rounded-md ${
                item.isAvailable && "bg-muted"
              }`}
            >
              <Collapsible key={item.id} defaultOpen={false}>
                <div className='grid grid-cols-[auto_1fr] gap-3'>

                  {!item.photoUrl ? (
                    <div className='w-16 aspect-5/4'>
                      <CameraOff className='w-full h-full object-cover' />
                    </div>
                  ) : (
                    <img
                      src={item.photoUrl}
                    
                      className='w-16 aspect-5/4 object-cover rounded-md'
                    />
                  )}

                  <div className='flex gap-2 items-center'>
                    <div className='flex-1 min-w-0 '>
                      <Link
                        className='font-semibold'
                        state={{ item }}
                        to={`/store/${selectedStore?.store.id}/product/${item.id}`}
                      >
                        <Button
                          variant='link'
                          className='p-0 font-semibold text-base'
                        >
                          {item.name}
                        </Button>
                      </Link>
                      <div className='max-w-4xl'>
                        <p className='text-sm text-muted-foreground  line-clamp-1'>
                          {item.description || "Sem descricao"}
                        </p>
                      </div>
                    </div>
                    <CollapsibleTrigger className='inline-flex items-center gap-2 font-medium text-sm data-panel-open:[&_svg]:rotate-180'>
                      <Button variant='link' className='p-0 text-sm'>
                        <ChevronDownIcon className='size-5' />
                        Complementos
                      </Button>
                    </CollapsibleTrigger>
                    <EditableProductRow
                      storeId={selectedStore?.store.id as string}
                      stock={item.stock}
                      type='product'
                      productId={item.id}
                      isAvailable={item.isAvailable}
                      price={item.price}
                    />
                  </div>
                </div>

                <CollapsibleContent>
                  <ul className='space-y-2'>
                    {item?.productComplementGroups?.map((complementGroup) => (
                      <li key={complementGroup.id} className='mt-2'>
                        <CardPanel className='border border-foreground/20 p-4 rounded-2xl'>
                          <div className='flex gap-2 items-center'>
                            <div className='flex-1 min-w-0'>
                              <p className='font-semibold'>
                                {complementGroup.group.name}
                              </p>
                              <p>{complementGroup.group.isAvailable}</p>

                              <ul>
                                <li>
                                  {complementGroup.group.minSelected > 0 ? (
                                    <Badge
                                      variant='required'
                                      className='rounded-full px-2 py-0.5'
                                    >
                                      Obrigatorio
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant='optional'
                                      className='rounded-full px-2 py-0.5'
                                    >
                                      Opcional
                                    </Badge>
                                  )}
                                </li>
                              </ul>

                              <ul className='w-full flex flex-col gap-2 mt-2'>
                                {complementGroup?.group?.complements?.map(
                                  (complement) => (
                                    <li
                                      key={complement.id}
                                      className='flex justify-between'
                                    >

                                      
                                      <div className='flex gap-2 items-center'>

                                        {!complement.photoUrl && (
                                          <CameraOff className='w-8 h-8 object-cover rounded-md' />
                                        )}
                                        {complement.photoUrl && (
                                          <img
                                            src={complement.photoUrl}
                                            className='w-8 h-8 object-cover rounded-md'
                                          />
                                        )}

                                        {complement.name}
                                      </div>
                                        
                                      <EditableProductRow
                                        storeId={
                                          selectedStore?.store.id as string
                                        }
                                        type='complement'
                                        complementId={complement.id}
                                        productId={item.id}
                                        isAvailable={
                                          complement.isActive as boolean
                                        }
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
                </CollapsibleContent>
              </Collapsible>
            </CardPanel>
          ))}
        </Card>
      ))}
    </>
  );
}
