import { MultipartFile } from "@fastify/multipart";
import { ImageRepository } from "../repositorires/image.repository";




export interface UploadResponse {
    data: UploadData;
    success: boolean;
    status: number;
}

export interface UploadData {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: UploadImage;
    thumb: UploadImage;
    medium: UploadImage;
    delete_url: string;
}

export interface UploadImage {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
}

export class ImageService {
    constructor(private repo: ImageRepository) { }

    async uploadImage({ imageBuffer, storeId }: { imageBuffer: MultipartFile, storeId: string }) {

        const buffer = await imageBuffer.toBuffer();
        const form = new FormData();
        form.append("image", buffer.toString("base64"));

        const res = await fetch(
            "https://api.imgbb.com/1/upload?key=03005b514667c4284b7616242ce6754b",
            {
                method: "POST",
                body: form,
            }
        );

        const json = await res.json() as UploadResponse;

        if (!res.ok) {
            return { success: false, error: json };
        }
        return this.repo.saveImage({
            url: json.data.url,
            storeId
        })

    }
    async getImagesByStoreId({ storeId }: { storeId: string }) {
        return this.repo.getImagesByStoreId({ storeId });
    }
    async deleteImage({ imageId }: { imageId: string }) {
        return this.repo.deleteImage({ imageId });
    }
}