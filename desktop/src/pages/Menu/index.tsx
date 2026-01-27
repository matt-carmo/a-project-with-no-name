import { menuService } from "@/services/menu.service";

import { useAuthStore } from "@/store/auth-store";

import { useEffect, useState } from "react";

import { Category } from "@/interfaces/menu.interface";

import { onRefetch } from "@/lib/utils";
import CategoryCreateForm from "./Category";
import { MenuCategoryList } from "./MenuCategoryList";

export default function MenuPage() {
  const { selectedStore } = useAuthStore();
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMenu = async () => {
    if (!selectedStore?.store.id) return;
    try {
      setIsLoading(true);
      const menuData = await menuService.getMenu(selectedStore.store.id);
      setData(menuData);
    } catch (err) {
      console.error("Erro ao buscar menu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMenu();
    const unsubscribe = onRefetch(() => {
      getMenu();
    });
    return () => {
      unsubscribe();
      if (typeof unsubscribe === "function") {
        void unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  async function handleDeleteCategory(id: string) {
    try {
      const response = await menuService.deleteCategory(id);
      if (response.status === 204) {
        getMenu();
      }
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  }

  if (isLoading && data.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Cardápio</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold">Cardápio</h1>
      <p>Gerencie e customize o cardápio do seu restaurante</p>

      <CategoryCreateForm onCreated={getMenu} />
      <MenuCategoryList
        data={data}
        onDeleteCategory={handleDeleteCategory}
        onMenuUpdated={getMenu}
      />
    </div>
  );
}
