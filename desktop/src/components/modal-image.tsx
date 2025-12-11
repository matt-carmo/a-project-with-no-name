import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { BiPhotoAlbum } from "react-icons/bi";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./ui/tabs";
import { useState } from "react";
import api from "@/api/axios";
import { useParams } from "react-router";

import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";

interface imageData {
  url: string;
  id: string;
}
export default function ModalImage({
  onImageSelect,
}: {
  onImageSelect: (file: imageData) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [imagesData, setImagesdata] = useState<imageData[]>([]); // For gallery tab
  const [loadingImages, setLoadingImages] = useState(false);
  const { id: storeId } = useParams();

  const [loading, setLoading] = useState(false);
  const getImages = async () => {
    setLoadingImages(true);
    const res = await api.get(`stores/${storeId}/images`);
    setImagesdata(res.data.data);
    setLoadingImages(false);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      setSelectedFile(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    const res = await api.post(
      `stores/${storeId}/images`,
      {
        image: selectedFile,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.status === 201) {
      console.log(res.data.data);
      onImageSelect(res.data.data);
    }
    setLoading(false);
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        onClick={() => setOpen(true)}
        render={<Button variant='outline' />}
      >
        Selecionar Imagem
      </DialogTrigger>

      <DialogPopup className='max-w-lg'>
        <DialogHeader>
          {storeId && <div>Loja: {storeId}</div>}
          <DialogTitle>Selecione ou adicione uma imagem</DialogTitle>
          <DialogDescription>
            As imagens ajudam a identificar visualmente os produtos.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='tab-1' className=''>
          <DialogPanel>
            <TabsList>
              <TabsTab value='tab-1'>Upload</TabsTab>
              <TabsTab onClick={getImages} value='tab-2'>
                Galeria
              </TabsTab>
            </TabsList>
          </DialogPanel>
          {/* Upload */}
          <TabsPanel value='tab-1'>
            <DialogPanel className='grid gap-4'>
              <Empty className='border border-dashed p-8 rounded-md relative'>
                {selectedImage ? (
                  <EmptyContent>
                    <img
                      src={selectedImage}
                      alt='Selected'
                      className='max-h-60 mx-auto'
                    />
                  </EmptyContent>
                ) : (
                  <EmptyHeader>
                    <EmptyMedia variant='icon'>
                      <BiPhotoAlbum />
                    </EmptyMedia>
                    <EmptyTitle>Clique ou arraste para adicionar</EmptyTitle>
                  </EmptyHeader>
                )}

                <input
                  onChange={handleImageChange}
                  name='image'
                  type='file'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50'
                />
              </Empty>
              <DialogFooter className="border-0 bg-transparent px-0 pt-1 pb-4">
                <DialogClose render={<Button variant='ghost' />}>
                  Cancelar
                </DialogClose>
                <Button onClick={uploadImage} disabled={loading} type='submit'>
                  {loading ? "Carregando..." : "Adicionar Imagem"}
                </Button>
              </DialogFooter>
            </DialogPanel>
          </TabsPanel>

          {/* Galeria */}
          <TabsPanel value='tab-2' className="">
            <ScrollArea className='flex-1 max-h-[400px] -mt-4'>
              <DialogPanel className='grid grid-cols-3 gap-4'>
                {loadingImages && (
                  <>
                    <Skeleton className='flex-1 aspect-4/3' />
                    <Skeleton className='flex-1 aspect-4/3' />
                    <Skeleton className='flex-1 aspect-4/3' />
                    <Skeleton className='flex-1 aspect-4/3' />
                    <Skeleton className='flex-1 aspect-4/3' />
                    <Skeleton className='flex-1 aspect-4/3' />
                  </>
                )}
                {!loadingImages && imagesData.length < 1 && (
                  <Empty className='border rounded-md'>
                    <EmptyHeader>
                      <EmptyTitle>Nenhuma imagem na galeria</EmptyTitle>
                      <EmptyDescription>
                        Adicione imagens para que elas apareçam aqui.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
                {!loadingImages &&
                  imagesData.length > 0 &&
                  imagesData.map((img, index) => (
                    <div key={index} className='flex-1 aspect-4/3 mx-auto '>
                      <Button
                        className='w-full h-full p-0 m-0 rounded-md overflow-hidden hover:opacity-80'
                        onClick={() => {onImageSelect(img); setOpen(false)} }
                      >
                        <img
                          key={index}
                          src={img.url}
                          alt='Selected'
                          className='object-cover w-full h-full  cursor-pointer'
                        />
                      </Button>
                    </div>
                  ))}
              </DialogPanel>
            </ScrollArea>
          </TabsPanel>
        </Tabs>
      </DialogPopup>
    </Dialog>
  );
}
