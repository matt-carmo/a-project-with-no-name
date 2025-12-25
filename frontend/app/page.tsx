"use client";
import { Menu } from "@/components/Menu";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Circle, Dot, DotIcon, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
const categories = [
  {
    id: "cmj7ysqx90007yx6o1y6vk360",
    storeId: "cmj64vndd0000xz6oag3ultnf",
    name: "Pipocas Gourmet",
    order: 0,
    deletedAt: null,
    products: [
      {
        id: "cmj7ytcrc0008yx6o84pgr6d1",
        storeId: "cmj64vndd0000xz6oag3ultnf",
        categoryId: "cmj7ysqx90007yx6o1y6vk360",
        photoUrl: "https://i.ibb.co/S4DXDt6v/972bcb615c63.avif",
        name: "Pipoca gourmet de Ninho - Copo 770 ml",
        description:
          "A clássica pipoca gourmet como você nunca provou! Com o sabor cremoso do leite Ninho, ela combina o croc croc da pipoca com o toque suave e aveludado que todo mundo ama.\n\nPipoca doce, crocante, cheirosa e viciante, essa belezinha vem num potão de 770 ml / 110 g — perfeito pra dividir (ou guardar só pra você, a gente entende).",
        price: 1280,
        image: null,
        isAvailable: true,
        stock: null,
        createdAt: "2025-12-16T02:30:14.232Z",
        deletedAt: null,
        productComplementGroups: [],
      },
      {
        id: "cmj7ytcrc0008yx6o84pgr6d2",
        storeId: "cmj64vndd0000xz6oag3ultnf",
        categoryId: "cmj7ysqx90007yx6o1y6vk360",
        photoUrl: "https://i.ibb.co/S4DXDt6v/972bcb615c63.avif",
        name: "Pipoca gourmet de Ninho - Copo 770 ml",
        description:
          "A clássica pipoca gourmet como você nunca provou! Com o sabor cremoso do leite Ninho, ela combina o croc croc da pipoca com o toque suave e aveludado que todo mundo ama.\n\nPipoca doce, crocante, cheirosa e viciante, essa belezinha vem num potão de 770 ml / 110 g — perfeito pra dividir (ou guardar só pra você, a gente entende).",
        price: 1280,
        image: null,
        isAvailable: true,
        stock: null,
        createdAt: "2025-12-16T02:30:14.232Z",
        deletedAt: null,
        productComplementGroups: [],
      },
      {
        id: "cmj7ytcrc0008y36o84pgr6d1",
        storeId: "cmj64vndd0000xz6oag3ultnf",
        categoryId: "cmj7ysqx90007yx6o1y6vk360",
        photoUrl: "https://i.ibb.co/S4DXDt6v/972bcb615c63.avif",
        name: "Pipoca gourmet de Ninho - Copo 770 ml",
        description:
          "A clássica pipoca gourmet como você nunca provou! Com o sabor cremoso do leite Ninho, ela combina o croc croc da pipoca com o toque suave e aveludado que todo mundo ama.\n\nPipoca doce, crocante, cheirosa e viciante, essa belezinha vem num potão de 770 ml / 110 g — perfeito pra dividir (ou guardar só pra você, a gente entende).",
        price: 1280,
        image: null,
        isAvailable: true,
        stock: null,
        createdAt: "2025-12-16T02:30:14.232Z",
        deletedAt: null,
        productComplementGroups: [],
      },
      {
        id: "cmj7ytcrc0008y6o84pgr6d1",
        storeId: "cmj64vndd0000xz6oag3ultnf",
        categoryId: "cmj7ysqx90007yx6o1y6vk360",
        photoUrl: "https://i.ibb.co/S4DXDt6v/972bcb615c63.avif",
        name: "Pipoca gourmet de Ninho - Copo 770 ml",
        description:
          "A clássica pipoca gourmet como você nunca provou! Com o sabor cremoso do leite Ninho, ela combina o croc croc da pipoca com o toque suave e aveludado que todo mundo ama.\n\nPipoca doce, crocante, cheirosa e viciante, essa belezinha vem num potão de 770 ml / 110 g — perfeito pra dividir (ou guardar só pra você, a gente entende).",
        price: 1280,
        image: null,
        isAvailable: true,
        stock: null,
        createdAt: "2025-12-16T02:30:14.232Z",
        deletedAt: null,
        productComplementGroups: [],
      },
      {
        id: "cmj7ytcrc0008yx6o84p3r6d1",
        storeId: "cmj64vndd0000xz6oag3ultnf",
        categoryId: "cmj7ysqx90007yx6o1y6vk360",
        photoUrl: "https://i.ibb.co/S4DXDt6v/972bcb615c63.avif",
        name: "Pipoca gourmet de Ninho - Copo 770 ml",
        description:
          "A clássica pipoca gourmet como você nunca provou! Com o sabor cremoso do leite Ninho, ela combina o croc croc da pipoca com o toque suave e aveludado que todo mundo ama.\n\nPipoca doce, crocante, cheirosa e viciante, essa belezinha vem num potão de 770 ml / 110 g — perfeito pra dividir (ou guardar só pra você, a gente entende).",
        price: 1280,
        image: null,
        isAvailable: true,
        stock: null,
        createdAt: "2025-12-16T02:30:14.232Z",
        deletedAt: null,
        productComplementGroups: [],
      },

      {
        id: "cmj7ytcrc0008yx6o84pgr6dh",
        storeId: "cmj64vndd0000xz6oag3ultnf",
        categoryId: "cmj7ysqx90007yx6o1y6vk360",
        photoUrl: "https://i.ibb.co/S4DXDt6v/972bcb615c63.avif",
        name: "Pipoca gourmet de Ninho - Copo 770 ml",
        description:
          "A clássica pipoca gourmet como você nunca provou! Com o sabor cremoso do leite Ninho, ela combina o croc croc da pipoca com o toque suave e aveludado que todo mundo ama.\n\nPipoca doce, crocante, cheirosa e viciante, essa belezinha vem num potão de 770 ml / 110 g — perfeito pra dividir (ou guardar só pra você, a gente entende).",
        price: 1280,
        image: null,
        isAvailable: true,
        stock: null,
        createdAt: "2025-12-16T02:30:14.232Z",
        deletedAt: null,
        productComplementGroups: [
          {
            id: "cmjd85lht000a8z6opvmnvy3f",
            productId: "cmj7ytcrc0008yx6o84pgr6dh",
            groupId: "cmjd85lhr00078z6ot9r4zt4s",
            group: {
              id: "cmjd85lhr00078z6ot9r4zt4s",
              name: "Bebidas",
              minSelected: 0,
              maxSelected: 1,
              isAvailable: true,
              deletedAt: null,
              storeId: "cmj64vndd0000xz6oag3ultnf",
              complements: [
                {
                  id: "cmjhfcem30004pt6ox8ic71nm",
                  groupId: "cmjd85lhr00078z6ot9r4zt4s",
                  name: "Coca cola 200ml",
                  description: null,
                  price: 350,
                  isAvailable: true,
                  photoUrl: "https://i.ibb.co/1f4tXkGM/05b410b9b56e.avif",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "cmjhsf5hs0000j56oxrbjngwf",
    storeId: "cmj64vndd0000xz6oag3ultnf",
    name: "Degustações Gourmet",
    order: 0,
    deletedAt: null,
    products: [
      {
        id: "cmjhsiemj000aj56od4gtjor6",
        storeId: "cmj64vndd0000xz6oag3ultnf",
        categoryId: "cmjhsf5hs0000j56oxrbjngwf",
        photoUrl: "https://i.ibb.co/TD2RrNWq/c36eeb4c87b9.jpg",
        name: "Petisqueira de Pipocas Gourmet",
        description:
          "Uma experiência pra compartilhar (ou não ).\nMonte sua degustação escolhendo até 5 sabores das nossas pipocas gourmet e descubra novos favoritos em uma única petisqueira.",
        price: 4500,
        image: null,
        isAvailable: true,
        stock: null,
        createdAt: "2025-12-22T23:31:27.498Z",
        deletedAt: null,
        productComplementGroups: [
          {
            id: "cmjhsiemk000bj56odi80l7r8",
            productId: "cmjhsiemj000aj56od4gtjor6",
            groupId: "cmjhsiem10002j56oqvlhuhci",
            group: {
              id: "cmjhsiem10002j56oqvlhuhci",
              name: "Petisqueira de Pipocas Gourmet",
              minSelected: 5,
              maxSelected: 5,
              isAvailable: true,
              deletedAt: null,
              storeId: "cmj64vndd0000xz6oag3ultnf",
              complements: [
                {
                  id: "cmjhsiem60003j56ozyj74b7w",
                  groupId: "cmjhsiem10002j56oqvlhuhci",
                  name: "Nutella",
                  description: null,
                  price: 150,
                  isAvailable: true,
                  photoUrl: null,
                },
                {
                  id: "cmjhsiem60004j56o0jkgzsqc",
                  groupId: "cmjhsiem10002j56oqvlhuhci",
                  name: "Ovomaltine",
                  description: null,
                  price: 100,
                  isAvailable: true,
                  photoUrl: null,
                },
                {
                  id: "cmjhsiem60005j56ox3vxr4o7",
                  groupId: "cmjhsiem10002j56oqvlhuhci",
                  name: "Ninho",
                  description: null,
                  price: 0,
                  isAvailable: true,
                  photoUrl: null,
                },
                {
                  id: "cmjhsiem60006j56ok1f6nh1g",
                  groupId: "cmjhsiem10002j56oqvlhuhci",
                  name: "Maracujá",
                  description: null,
                  price: 0,
                  isAvailable: true,
                  photoUrl: null,
                },
                {
                  id: "cmjhsiem60007j56ozz7jrv0z",
                  groupId: "cmjhsiem10002j56oqvlhuhci",
                  name: "Paçoca",
                  description: null,
                  price: 0,
                  isAvailable: true,
                  photoUrl: null,
                },
                {
                  id: "cmjhsiem60008j56ox66l05bg",
                  groupId: "cmjhsiem10002j56oqvlhuhci",
                  name: "Morango",
                  description: null,
                  price: 0,
                  isAvailable: true,
                  photoUrl: null,
                },
                {
                  id: "cmjhsiem60009j56o87xopy1u",
                  groupId: "cmjhsiem10002j56oqvlhuhci",
                  name: "Ninho color",
                  description: null,
                  price: 0,
                  isAvailable: true,
                  photoUrl: null,
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
export default function Home() {
  return (
    <>
      <header className="bg-primary ">
        <div className="bg-primary/90 backdrop-blur pt-1.5 px-4 ">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Loja aberta
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Image
              src="/vercel.svg"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-white font-semibold text-lg leading-tight">
              Nome da loja
            </h1>
            <span className="text-white/80 text-xs">
              Pipocas gourmet & degustações
            </span>
          </div>
        </div>
      </header>

      <Menu categories={categories} />

      <footer>
        {/* <Drawer
          dismissible={false}
          closeThreshold={1}
          activeSnapPoint={1}
          disablePreventScroll={false}
          modal={false}
          defaultOpen={true}
          snapPoints={[1, 2]}
          snapToSequentialPoint={true}
        >
        
          <DrawerContent className="rounded-t-3xl p-4">
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mb-4" />

            <h2 className="text-lg font-semibold mb-4">Seu carrinho</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Pipoca de Ninho</span>
                <span>R$ 12,80</span>
              </div>
            </div>

            <button className="mt-6 w-full bg-primary text-white py-4 rounded-2xl font-semibold">
              Finalizar pedido
            </button>
          </DrawerContent>
        </Drawer> */}
        <div className="px-3 pb-3">
          <div className="w-full bg-primary text-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
            {/* Ícone */}
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={18} />
            </div>

            {/* Totais */}
            <div className="flex-1 leading-tight">
              <span className="text-sm text-white/80">Total com entrega</span>
              <div className="font-semibold text-base">R$ 29,00 / 1 tem</div>
          
            </div>

            {/* Botão */}
            {/* <button className="bg-white text-primary font-semibold text-sm px-4 py-2 rounded-xl">
              Ver carrinho
            </button> */}
             <Button className="bg-white text-primary font-semibold text-sm px-4 py-2 rounded-xl">
              Ver carrinho
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}
