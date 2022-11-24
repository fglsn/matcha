import { ValidationError } from '../errors';
import { Photo } from '../types';
import { isStringArray } from './basicTypeValidators';
import Jimp from 'jimp';

type Fields2 = {
	images: unknown;
};

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

export const parseImages = async ({ images }: Fields2): Promise<Photo[]> => {
	const imgArr = [];
	if (!images) throw new ValidationError(`Missing images`);
	if (!isStringArray(images)) throw new ValidationError(`Invalid images format: Array of 1 to 5 Images Data URIs expected`);
	if (images.length === 0 || images.length > 5) throw new ValidationError(`Invalid images format! Array of 1 to 5 Images Data URIs expected`);
	for (let i = 0; i < images.length; i++) {
		// const type = images[i];
		if (!/data:image\//.test(images[i])) throw new ValidationError(`Invalid images format! Image ${i + 1} is not an Image Data URI`);
		const [, type, dataBase64] = images[i].match('data:(image/.*);base64,(.*)') || [];
		if (!type) throw new ValidationError(`Invalid images format! Allowed types: 'image/jpeg', 'image/png', 'image/jpg'`);
		if (allowedImageTypes.indexOf(type) < 0) throw new ValidationError(`Invalid images format! Allowed types: 'image/jpeg', 'image/png', 'image/jpg'`);
		if (!dataBase64) throw new ValidationError(`Invalid images format! Image ${i + 1} is not valid Image Data URI`);
		const fileSizeInBytes = Math.ceil(dataBase64.length / 4) * 3;
		if (fileSizeInBytes - 2 > 2500000) throw new ValidationError(`Invalid images format! Image ${i + 1} is too big: 25mb max`);
		const imageBuffer = Buffer.from(dataBase64, 'base64');
		const jimpInstance = await Jimp.read(imageBuffer);
		const width = jimpInstance.bitmap.width;
		const height = jimpInstance.bitmap.height;
		if (width <= 0 || height <= 0) {
			throw new ValidationError(`Invalid images format! Image ${i + 1} is corrupted`);
		}
		if (width < 450 || height < 450) {
			throw new ValidationError(`Invalid images format! Image ${i + 1} is too small. Min 450x450 pixels`);
		}
		if (width > 6000 || height > 4000) {
			throw new ValidationError(`Invalid images format! Image ${i + 1} is too big. Max 2500x2500 pixels`);
		}
		if (width > height && height / width < 0.6) {
			throw new ValidationError(`Invalid images format! Image ${i + 1} is of unacceptable ratio.`);
		}
		if (height > width && width / height < 0.6) {
			throw new ValidationError(`Invalid images format! Image ${i + 1} is of unacceptable ratio.`);
		}
		console.log(height, width, fileSizeInBytes);

		imgArr.push({
			imageType: type,
			dataBase64: dataBase64
		});
	}
	return imgArr;
};
