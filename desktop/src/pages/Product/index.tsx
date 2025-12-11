import { useLocation } from "react-router";
import { DetailsProduct } from "./DetailsProduct";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import { ComplementGroup } from "@/interfaces/menu.interface";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

// import { useForm } from "react-hook-form";

export default function ProductPage() {
  const { state } = useLocation();
  const { item } = state;

  const [groupedComplements, setGroupedComplements] = useState<
    ComplementGroup[]
  >([]);

  useEffect(() => {
    async function fetchComplements() {
      try {
        const response = await api.get(`/${item.storeId}/groups-complements`);
        setGroupedComplements(response.data);
      } catch (error) {
        console.error("Error fetching complements:", error);
      }
    }

    fetchComplements();
  }, [item.storeId]);
  return (
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
        <TabsPanel value='tab-2'>
          <ul className='grid grid-cols-4 gap-4'>
            {groupedComplements.map((group) => (
              <li className='' key={group.id}>
                <Card className='border-0 py-2 h-full'>
                  <CardContent className='px-4'>
                    <h2 className='text-xl font-semibold'>{group.name}</h2>
                    <CardDescription>
                      <span className='text-muted-foreground line-clamp-2'>
                        {group.products.length === 0 && (
                          <>Não há complementos</>
                        )}
                        {group.products.length > 0 && (
                          <>
                            Disponível em:{" "}
                            {group.products
                              .map((product) => product.product.name)
                              .join(", ")}
                          </>
                        )}
                      </span>
                      <span className='line-clamp-1'></span>
                    </CardDescription>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </TabsPanel>
      </Tabs>
    </div>
  );
}
