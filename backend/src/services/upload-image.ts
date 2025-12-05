export async function uploadImage({ imageBuffer }: { imageBuffer: Buffer }) {
  const form = new FormData();
  form.append("image", imageBuffer.toString("base64"));

  const res = await fetch(
    "https://api.imgbb.com/1/upload?key=03005b514667c4284b7616242ce6754b",
    {
      method: "POST",
      body: form,
    }
  );

  const json = await res.json();

  if (!res.ok) {
    return { success: false, error: json };
  }

  return { success: true, data: json };
}
