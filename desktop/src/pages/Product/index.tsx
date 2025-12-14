/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from "react-router";
import { DetailsProduct } from "./DetailsProduct";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import { ComplementGroup } from "@/interfaces/menu.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { SheetCreateComplement } from "@/components/sheet-create-complement";
import { useSheetComplementStore } from "@/store/use-sheet-complement-store";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { useComplementStore } from "@/store/complement-store";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { EditableProductRow } from "@/components/editable-product-row";

// import { useForm } from "react-hook-form";

export default function ProductPage() {
  const { state } = useLocation();
  const { item } = state;
  const { setOpen: openCreateComplement } = useSheetComplementStore();

  const [groupedComplements, setGroupedComplements] = useState<
    ComplementGroup[]
  >([]);

  const { selectedComplements, setSelectedComplements } = useComplementStore();
  async function fetchComplements() {
    try {
      const response = await api.get(
        `/${item.storeId}/groups-complements?productId=${item.id}`
      );
      setGroupedComplements(response.data);
    } catch (error) {
      console.error("Error fetching complements:", error);
    }
  }
  useEffect(() => {
    fetchComplements();
  }, []);

  const handleCreateGroupComplement = async (data) => {
    // const data = selectedComplements.map((group) => ({
    //   name: group.name,
    //   minSelect: group.minSelected,
    //   maxSelect: group.maxSelected,
    //   complements: group.complements,
    // }));
    const result = await api.post(
      `/${item.storeId}/groups-complements/${item.id}`,
      [data]
    );

    if (result.status === 201) {
      toastManager.add({
        type: "success",
        title: "Grupo de complementos criado com sucesso!",
      });
      fetchComplements();
    }
    if (result.status !== 201) {
      toastManager.add({
        type: "error",
        title: "Erro ao criar grupo de complementos!",
      });
    }
    setSelectedComplements([]);
  };
  return (
    <>
      <SheetCreateComplement onSubmitGroup={handleCreateGroupComplement} />
      <div className='text-3xl font-semibold  space-y-4 '>
        <h1 className='text-3xl font-semibold'>{item.name}</h1>
        <Tabs defaultValue='tab-1'>
          <TabsList>
            <TabsTab value='tab-1'>Detalhes do Produto</TabsTab>
            <TabsTab value='tab-2'>Complementos</TabsTab>
          </TabsList>
          <TabsPanel value='tab-1'>
            <DetailsProduct item={item} />
          </TabsPanel>
          <TabsPanel className={"space-y-4"} value='tab-2'>
            <Button onClick={() => openCreateComplement(true)}>
              Novo grupo de complementos
            </Button>
            <ul className='grid grid-cols-1 gap-4'>
              {groupedComplements.map((group) => (
                <li className='' key={group.id}>
                  <Card className='border-0 py-2 h-full'>
                    <CardContent className='px-4'>
                      <Collapsible key={group.id} defaultOpen={false}>
                        <div className='flex justify-between items-center'>
                          <h2 className='text-xl font-semibold'>
                            {group.name}
                          </h2>
                          <CollapsibleTrigger className='inline-flex items-center gap-2 font-medium text-sm data-panel-open:[&_svg]:rotate-180'>
                            <ChevronDownIcon className='size-5' />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsiblePanel>
                          <ul className='flex flex-col gap-1 py-2 text-sm'>
                            <li>
                              {group.complements.map((complement) => (
                                <Card
                                  key={complement.id}
                                  className='border-foreground/10 mb-2'
                                >
                                  <CardContent className="flex flex-row justify-between  items-center">
                                   
                                    <CardDescription>
                                      <img src={complement?.image} className="w-8 h-8"/>
                                      <EditableProductRow
                                        isAvailable={
                                          complement?.isActive || false
                                        }
                                        name={complement.name}
                                        storeId={item.storeId}
                                        complementId={complement.id}
                                        
                                        productId={item.id}
                                        key={complement.id}
                                        type='complement'
                                        price={complement.price}
                                      />
                                    </CardDescription>
                                  </CardContent>
                                </Card>
                              ))}
                            </li>
                          </ul>
                        </CollapsiblePanel>
                      </Collapsible>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </TabsPanel>
        </Tabs>
      </div>
    </>
  );
}
