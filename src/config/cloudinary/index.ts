import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinary = async (fileBuffer: Buffer, fileName: string) => {
  const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: 'movieCollection/profile',
    public_id: fileName,
  });
  return result.secure_url;
};
