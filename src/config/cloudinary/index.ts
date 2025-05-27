import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: Bun.env.CLOUDINARY_CLOUD_NAME,
  api_key: Bun.env.CLOUDINARY_API_KEY,
  api_secret: Bun.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string
) => {
  const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: 'movieCollection/profile',
    public_id: fileName,
  });
  return result.secure_url;
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(`movieCollection/profile/${publicId}`);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
};
