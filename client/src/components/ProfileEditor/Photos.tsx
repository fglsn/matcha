/* eslint-disable react-hooks/exhaustive-deps */
//prettier-ignore
import {Box, Button, Container, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
//prettier-ignore
import { getValidImages, openFileDialog, validateAddingFiles} from '../../utils/imageUploaderAndValidor';
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Images, ImageType } from '../../types';
import { useStateValue } from '../../state';
import { AlertContext } from '../AlertProvider';
import profileService from '../../services/profile';
import { LightTooltip } from './BasicInfoForm';

const Photos: React.FC<{ photos: ImageType[] }> = ({ photos }) => {
	const [{ loggedUser }] = useStateValue();
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [imageIndex, setImageIndex] = useState<number>(-1);
	const [images, setImages] = useState<ImageType[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		photos && setImages(photos);
	}, []);

	const handleChange = async (files: FileList | null) => {
		if (!files) return;

		const [newImages, error] = await getValidImages(files);
		if (error) errorCallback(error);

		if (!newImages.length) return;

		let updatedImages: ImageType[];
		const updatedIndexes: number[] = [];

		if (imageIndex > -1) {
			const [firstImage] = newImages;
			updatedImages = [...images];
			updatedImages[imageIndex] = firstImage;
			updatedIndexes.push(imageIndex);
		} else {
			const [addedImages, error] = await validateAddingFiles(newImages, images);
			if (error) errorCallback(error);
			updatedImages = [...images, ...addedImages];
			for (let i = images.length as number; i < updatedImages.length; i += 1) {
				updatedIndexes.push(i);
			}
		}
		setImages(updatedImages);
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

	const uploadPhotos = async (images: Images) => {
		try {
			setIsUploading(true);
			loggedUser && (await profileService.uploadPhotos(loggedUser.id, images));
			successCallback(`Profile photos were updated!.`);
			setIsUploading(false);
		} catch (err) {
			console.log('Error in uploadPhotos (Photos on Profile) ' + err); //rm later
			errorCallback(
				err.response?.data?.error || 'Unable to upload photos. Please try again.'
			);
			setIsUploading(false);
		}
	};

	const handleUserPhotosUpload = (event: any) => {
		event.preventDefault();
		uploadPhotos({ images: images });
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
				<HtmlTooltip
					title={
						<Fragment>
							<Typography color="inherit">
								<strong>
									Valid picture should be: <br />
								</strong>
							</Typography>
							{'Of jpeg, jpg or png format.'}
							<br />
							{'At least 450 x 450 pixels'}
							<br />
							{'Not larger than 6000x4000 pixels'}
							<br />
							{'Not bigger than 25Mb'}
							<br />
							{'Maximum 5 pictures.'}
						</Fragment>
					}
				>
					<span style={{ maxWidth: '100%', textAlign: 'center' }}>
						<Button
							disabled={images.length >= 5 ? true : false}
							onClick={uploadImage}
							style={uploadApplyBtn}
						>
							Add pictures
						</Button>
					</span>
				</HtmlTooltip>

				<Box sx={mainGridItem}>
					<div key={placeholder.img}>
						<Photo
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
								<Photo
									src={images[i + 1]?.dataURL || placeholder.img}
									alt={`Profile pic #${i + 1} by ${
										loggedUser?.username
									}`}
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
				<LightTooltip
					title={
						isUploading || !images || !images.length
							? 'Add at least one picture!'
							: "Don't forget to upload if you changed something!"
					}
					placement="top"
				>
					<span>
						<Button
							fullWidth
							onClick={handleUserPhotosUpload}
							disabled={isUploading || !images || !images.length}
							style={uploadApplyBtn}
						>
							Upload
						</Button>
					</span>
				</LightTooltip>
			</Container>
		</>
	);
};

const Photo = styled('img')`
	max-width: 100%;
	max-height: 100%;
	margin: auto;
	border-radius: 7px;
	object-fit: scale-down;
`;

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: '#fcc810',
		color: 'white',
		maxWidth: 300,
		padding: '25px',
		fontSize: theme.typography.pxToRem(16),
		borderRadius: 7
	}
}));

const uploadApplyBtn = {
	margin: '10px 0 5px 0',
	padding: '5px 25px',
	maxWidth: '100%'
};

const gridContainer = {
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)',
	alignItems: 'center'
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

export default Photos;
