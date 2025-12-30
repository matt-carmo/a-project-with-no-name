import { fileTypeFromBuffer } from "file-type";
export async function streamToBuffer(stream:any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}


export async function processImage(fileStream: any) {
  const buffer = await streamToBuffer(fileStream);

  // Detecta tipo real do arquivo
  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    throw new Error("Formato de arquivo não reconhecido");
  }

  const base64 = buffer.toString("base64");
  const base64WithHeader = `data:${fileType.mime};base64,${base64}`;

  return base64WithHeader;
}
