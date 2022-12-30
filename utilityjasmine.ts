import sharp from "sharp";

export async function resizeImage(input: Buffer, width: number, height: number): Promise<Buffer> {
  const image = sharp(input);
  const metadata = await image.metadata();

  if (width && !height) {
    height = Math.round((width * metadata.height) / metadata.width);
  } else if (height && !width) {
    width = Math.round((height * metadata.width) / metadata.height);
  }

  return image
    .resize({
      width,
      height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();
}
