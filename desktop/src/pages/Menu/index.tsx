import api from "@/api/axios";

import { useAuthStore } from "@/store/auth-store";

import { useEffect, useState } from "react";

import { Category } from "@/interfaces/menu.interface";

import { onRefetch } from "@/lib/utils";
import CategoryCreateForm from "./Category";
import { MenuCategoryList } from "./MenuCategoryList";

export default function MenuPage() {
  const { selectedStore } = useAuthStore();
  const [data, setData] = useState<Category[]>([]);

  const getMenu = async () => {
    try {
      const response = await api.get(`stores/${selectedStore?.store.id}/menu`);

      console.log("Menu fetched:", response.data);
      setData(response.data);
    } catch (err) {
      alert(JSON.stringify(err));
      console.error("Erro ao buscar menu:", err);
    }
  };

  useEffect(() => {
    if (!selectedStore?.store?.id) return;
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
      <h1 className='text-4xl font-semibold'>Cardápio</h1>
      <p>Gerencie e customize o cardápio do seu restaurante</p>

      <CategoryCreateForm />
      <MenuCategoryList
        key={data.length}
        data={data}
        onDeleteCategory={handleDeleteCategory}
        onMenuUpdated={getMenu}
      />
    </div>
  );
}
