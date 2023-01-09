import { ImageType } from '../types';

export const openFileDialog = (inputRef: React.RefObject<HTMLInputElement>): void => {
	if (inputRef.current) inputRef.current.click();
};

export const getBase64 = (file: File): Promise<string> => {
	const reader = new FileReader();
	return new Promise((resolve) => {
		reader.addEventListener('load', () => resolve(String(reader.result)));
		reader.readAsDataURL(file);
	});
};

export const getImage = (file: File): Promise<HTMLImageElement> => {
	const image = new Image();
	return new Promise((resolve, reject) => {
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', () => {
			reject('Error creating');
		});
		image.src = URL.createObjectURL(file);
	});
};

export const getValidImages = async (
	files: FileList
): Promise<[ImageType[], string | undefined]> => {
	const validImages = Array<ImageType>();
	const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

	for (let i = 0; i < files.length; i++) {
		try {
			const image = await getImage(files[i]);

			const type = files[i].type;
			const height = image.height;
			const width = image.width;
			const size = files[i].size;

			if (allowedImageTypes.indexOf(type) < 0) continue;
			if (width < 450 || height < 450) continue;
			if (width > 6000 || height > 4000) continue;
			if (!size || size > 25000000) continue;
			if (width > height && height / width < 0.6) continue;
			if (height > width && width / height < 0.6) continue;

			validImages.push({
				dataURL: await getBase64(files[i])
			});
		} catch (e) {
			//console.log('Error decoding image', e);
		}
	}

	if (validImages.length < files.length) return [validImages, 'File must be a valid image'];

	return [validImages, undefined];
};

export const validateAddingFiles = async (
	newImages: ImageType[],
	existingImages: ImageType[]
): Promise<[ImageType[], string | undefined]> => {
	let newImageList: ImageType[] = [];

	for (let i = 0; i < 5 - existingImages.length; i++) {
		if (newImages[i]) {
			newImageList.push(newImages[i]);
		}
	}

	if (existingImages.length + newImages.length > 5) {
		if (existingImages.length === 5) {
			return [
				[],
				'Maximum 5 pictures can be uploaded. Please remove some pictures to upload new ones or use replace button.'
			];
		} else {
			return [newImageList, 'Maximum 5 pictures can be added to profile.'];
		}
	}

	return [newImageList, undefined];
};
