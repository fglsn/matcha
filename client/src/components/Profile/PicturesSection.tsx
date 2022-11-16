import { useCallback, useContext, useRef, useState } from 'react';
import { ImageType, UserDataWithoutId } from '../../types';
import { AlertContext } from '../AlertProvider';
import { Box, Button, Container } from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';

export const openFileDialog = (inputRef: React.RefObject<HTMLInputElement>): void => {
	if (inputRef.current) inputRef.current.click();
};

export const getAcceptTypeString = (
	acceptType?: Array<string>,
	allowNonImageType?: boolean
) => {
	if (acceptType?.length) return acceptType.map((item) => `.${item}`).join(', ');
	if (allowNonImageType) return '';
	return 'image/*';
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

export const getListFiles = async (
	files: FileList
): Promise<[ImageType[], string | undefined]> => {
	const validFiles: File[] = [];
	const promiseFiles: Array<Promise<string>> = [];
	const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

	for (let i = 0; i < files.length; i++) {
		try {
			const image = await getImage(files[i]);
			console.log(image.width); //rm later
			console.log(image.height); //rm later

			if (allowedImageTypes.indexOf(files[i].type) > -1) {
				promiseFiles.push(getBase64(files[i]));
				validFiles.push(files[i]);
			}
		} catch (e) {
			console.log('Error decoding image');
		}
	}

	const base64Files = await Promise.all(promiseFiles);

	const fileList: ImageType[] = base64Files.map((base64, index) => ({
		dataURL: base64,
		file: validFiles[index]
	}));

	if (fileList.length < files.length) return [fileList, 'File must be a valid image.'];
	return [fileList, undefined];
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
				'Maximum 5 pictures can be uploaded. Please remove some pictures to upload new ones or use replace buttons.'
			];
		} else {
			return [newImageList, 'Maximum 5 pictures can be added to profile pictures.'];
		}
	}

	return [newImageList, undefined];
};

const PicturesSection: React.FC<{ userData: UserDataWithoutId }> = ({ userData }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { error: errorCallback } = useContext(AlertContext);
	const [images, setImages] = useState<ImageType[]>([]);
	const [imageIndex, setImageIndex] = useState<number>(-1);

	const handleChange = async (files: FileList | null) => {
		if (!files) return;

		const [fileList, error] = await getListFiles(files);
		if (error) errorCallback(error);
		if (!fileList.length) return;

		let updatedFileList: ImageType[];
		const updatedIndexes: number[] = [];

		if (imageIndex > -1) {
			const [firstFile] = fileList;
			updatedFileList = [...images];
			updatedFileList[imageIndex] = firstFile;
			updatedIndexes.push(imageIndex);
		} else {
			const [newImageList, error] = await validateAddingFiles(fileList, images);
			if (error) errorCallback(error);
			updatedFileList = [...images, ...newImageList];
			for (let i = images.length as number; i < updatedFileList.length; i += 1) {
				updatedIndexes.push(i);
			}
		}
		setImages(updatedFileList);
	};

	const onInputChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	): Promise<void> => {
		await handleChange(e.target.files);
		imageIndex > -1 && setImageIndex(-1);
		if (inputRef.current) inputRef.current.value = '';
	};

	const handleClickInput = useCallback(() => openFileDialog(inputRef), [inputRef]);

	const uploadImage = useCallback((): void => {
		setImageIndex(-1);
		handleClickInput();
	}, [handleClickInput]);

	const replaceImage = (index: number): void => {
		setImageIndex(index);
		handleClickInput();
	};

	const removeImage = (index: number | Array<number>): void => {
		const updatedList = [...images];
		if (Array.isArray(index)) {
			index.forEach((i) => {
				updatedList.splice(i, 1);
			});
		} else {
			updatedList.splice(index, 1);
		}
		setImages(updatedList);
	};

	return (
		<>
			<input
				type="file"
				accept="image/png, image/jpeg, image/jpg"
				ref={inputRef}
				multiple
				onChange={onInputChange}
				style={{ display: 'none' }}
			/>
			<Container style={pictureSectionWrapper}>
				<Button
					disabled={images.length >= 5 ? true : false}
					onClick={uploadImage}
					style={uploadApplyBtn}
				>
					Add pictures
				</Button>
				<Box sx={mainGridItem}>
					<div key={placeholder.img}>
						<img
							src={images[0]?.dataURL || placeholder.img}
							alt="Main profile pic"
							style={imgStyle}
						/>
						{images[0]?.dataURL ? (
							<div style={btnWrapper}>
								<Button onClick={() => replaceImage(0)} sx={singlePicBtn}>
									<ChangeCircleIcon sx={icon} />
								</Button>
								<Button onClick={() => removeImage(0)} sx={singlePicBtn}>
									<RemoveCircleRoundedIcon sx={icon} />
								</Button>
							</div>
						) : null}
					</div>
				</Box>
				<Box sx={gridContainer}>
					{[...Array(4)].map((e, i) => (
						<Box key={i} sx={gridItem}>
							<div>
								<img
									src={images[i + 1]?.dataURL || placeholder.img}
									alt={`Profile pic #${i + 1} by ${userData.username}`}
									loading="lazy"
									style={imgStyle}
								/>
								{images[i + 1]?.dataURL ? (
									<div style={btnWrapper}>
										<Button
											onClick={() => replaceImage(i + 1)}
											sx={singlePicBtn}
										>
											<ChangeCircleIcon sx={icon} />
										</Button>
										<Button
											onClick={() => removeImage(i + 1)}
											sx={singlePicBtn}
										>
											<RemoveCircleRoundedIcon sx={icon} />
										</Button>
									</div>
								) : null}
							</div>
						</Box>
					))}
				</Box>
				<Button disabled={true} style={uploadApplyBtn}>
					Upload
				</Button>
			</Container>
		</>
	);
};

const uploadApplyBtn = {
	margin: '10px 0 5px 0'
};

const gridContainer = {
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)'
};

const pictureSectionWrapper = {
	display: 'grid',
	maxWidth: '600px!important',
	minHeight: '600px!important'
};

const gridItem = {
	margin: '10px 10px 0 10px'
};

const mainGridItem = {
	height: 'fit-content',
	margin: '10px 10px 0 10px'
};

const btnWrapper = {
	display: 'flex',
	justifyContent: 'space-between'
};

const singlePicBtn = {
	backgroundColor: 'white!important',
	margin: '0 0.3rem',
	minWidth: 'fit-content',
	minHeight: 'fit-content',
	position: 'relative',
	borderRadius: 28,
	bottom: '1.75rem',
	padding: '0'
};

const icon = {
	fontSize: 'large',
	transform: 'scale(1.4)'
};

const imgStyle = {
	maxWidth: '100%',
	maxHeight: '100%'
};

const placeholder = {
	img: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
	title: 'Placeholder',
	featured: true
};

export default PicturesSection;
