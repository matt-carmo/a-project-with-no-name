import { GroupsComplementsRepository } from "../repositorires/groups-complements.repository";
import { ImageService } from "./image-service";
import { streamToBuffer } from "../utils/streamToBuffer";
export default class GroupsComplementsService {
  constructor(
    private repository: GroupsComplementsRepository,
    private imageService: ImageService
  ) {}


  async create({ data, storeId }: { 
    data: any;
    storeId: string;
    files: any[];
  }) {
    // return console.log('normalizedData', data.files);


   
    
const imagesWithUrls = await Promise.all(
  data.files.map(async (file: any) => {
    if (file?.fieldname !== "images") {
      return { ...file, imageUrl: null };
    }

    // 1. Stream -> Buffer
    const buffer = await file.toBuffer();

    // 2. Buffer -> Base64
    const base64 = buffer.toString("base64");

    // 3. Upload para seu serviço
    const uploadResult = await this.imageService.uploadImage({
      imageBuffer: base64
    });

    if (!uploadResult.success) {
      return {
        imageUrl: null,
      };
    }

    return {
      imageUrl: uploadResult.data.data.url,
    };
  })
);
 const normalizedData = {
        name: data.group.name,
        
      minSelected: Number(data.group.minSelected),
      maxSelected: Number(data.group.maxSelected),
      isRequired: data.group.isRequired === "true" || data.group.isRequired === true,
      complements: data.group.complements.map((c, index) => ({
        
        price: Number(c.price),
        name: c.name,
        description: c.description,
        photoUrl: imagesWithUrls[index]?.imageUrl || null,
      })),
    };



    

    return this.repository.create({
      ...normalizedData,
      storeId,
    });
  }
}
