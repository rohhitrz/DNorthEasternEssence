import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload an image to Cloudinary with preset transformations.
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = "maison-oudh/products"
) {
  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:image/webp;base64,${file.toString("base64")}`,
    {
      folder,
      transformation: [
        { quality: "auto", fetch_format: "auto", width: 1200, crop: "limit" },
      ],
      resource_type: "image",
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

/**
 * Delete an image from Cloudinary.
 */
export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

/**
 * Validate image file before upload.
 */
export function validateImage(file: {
  size: number;
  type: string;
}): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "Image must be smaller than 5MB" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPG, PNG, and WebP images are allowed" };
  }

  return { valid: true };
}
