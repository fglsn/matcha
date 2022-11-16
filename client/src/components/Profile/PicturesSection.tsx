import { Box, Button, Container } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { ImageType, UserDataWithoutId } from '../../types';
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
	return new Promise((resolve) => {
		image.addEventListener('load', () => resolve(image));
		image.src = URL.createObjectURL(file);
	});
};

export const getListFiles = (files: FileList): Promise<ImageType[]> => {
	const promiseFiles: Array<Promise<string>> = [];
	for (let i = 0; i < files.length; i += 1) {
		promiseFiles.push(getBase64(files[i]));
	}
	return Promise.all(promiseFiles).then((fileListBase64: Array<string>) => {
		const fileList: ImageType[] = fileListBase64.map((base64, index) => ({
			dataURL: base64,
			file: files[index]
		}));
		return fileList;
	});
};

const PicturesSection: React.FC<{ userData: UserDataWithoutId }> = ({ userData }) => {
	const [images, setImages] = useState<ImageType[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);
	const [keyUpdate, setKeyUpdate] = useState<number>(-1);

	console.log('IMages ', images);

	const handleChange = async (files: FileList | null) => {
		if (!files) return;

		const fileList = await getListFiles(files);
		if (!fileList.length) return;

		let updatedFileList: ImageType[];
		const updatedIndexes: number[] = [];

		if (keyUpdate > -1) {
			const [firstFile] = fileList;
			updatedFileList = [...images];
			updatedFileList[keyUpdate] = firstFile;
			updatedIndexes.push(keyUpdate);
		} else {
			updatedFileList = [...images, ...fileList];
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
		keyUpdate > -1 && setKeyUpdate(-1);
		if (inputRef.current) inputRef.current.value = '';
	};

	const handleClickInput = useCallback(() => openFileDialog(inputRef), [inputRef]);

	const uploadImage = useCallback((): void => {
		setKeyUpdate(-1);
		handleClickInput();
	}, [handleClickInput]);

	const replaceImage = (index: number): void => {
		setKeyUpdate(index);
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
				accept="image/png, image/jpeg"
				ref={inputRef}
				multiple
				onChange={onInputChange}
				style={{ display: 'none' }}
			/>
			<Container style={pictureSectionWrapper}>
				<Button
					// disabled={images.length >= maxNumber ? true : false}
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
								<Button
									onClick={() => replaceImage(0)}
									sx={singlePicBtn}
								>
									<ChangeCircleIcon sx={icon} />
								</Button>
								<Button
									onClick={() => removeImage(0)}
									sx={singlePicBtn}
								>
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
