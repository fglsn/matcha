import { Alert, Box, Button, Container } from '@mui/material';
import { useState } from 'react';
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading';
import { UserDataWithoutId } from '../../types';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';

const PicturesSection: React.FC<{ userData: UserDataWithoutId }> = ({ userData }) => {
	const [images, setImages] = useState<ImageType[]>([]);
	const maxNumber = 5;
	const maxFileSize = 25000000;
	const acceptTypes = ['jpg', 'png', 'jpeg'];
	const resolutionType = 'absolute';

	const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
		console.log(imageList, 'array index: ' + addUpdateIndex); //rm later
		setImages(imageList);
	};

	return (
		<>
			<ImageUploading
				value={images}
				multiple
				onChange={onChange}
				maxNumber={maxNumber}
				acceptType={acceptTypes}
				maxFileSize={maxFileSize}
				resolutionType={resolutionType}
			>
				{({
					onImageUpload,
					onImageUpdate,
					onImageRemove,
					isDragging,
					dragProps,
					errors
				}) => {
					return (
						<Container style={pictureSectionWrapper}>
							{errors && (
								<div>
									{errors.maxNumber && (
										<Alert variant="filled" severity="warning">
											Maximum 5 pictures can be uploaded at once.
										</Alert>
									)}
									{errors.acceptType && (
										<Alert variant="filled" severity="warning">
											Not allowed format.
										</Alert>
									)}
									{errors.maxFileSize && (
										<Alert variant="filled" severity="warning">
											Selected picture is too big (Max. 25Mb)
										</Alert>
									)}
									{errors.resolution && (
										<Alert variant="filled" severity="warning">
											Selected picture is too big (Max. 25Mb)
										</Alert>
									)}
								</div>
							)}
							<Button
								disabled={images.length >= maxNumber ? true : false}
								variant={isDragging ? 'contained' : undefined}
								onClick={onImageUpload}
								{...dragProps}
								style={{ margin: '10px 0 5px 0' }}
							>
								Click to upload or Drop your image here
							</Button>
							<Box sx={mainGridItem}>
								<div key={placeholder.img}>
									<img
										src={
											images.length
												? images[0].dataURL
												: placeholder.img
										}
										alt="Main profile pic"
										style={{ maxWidth: '100%' }}
									/>
									{images[0]?.dataURL ? (
										<div style={btnWrapper}>
											<Button
												onClick={() => onImageUpdate(0)}
												sx={singlePicBtn}
											>
												<ChangeCircleIcon sx={icon} />
											</Button>
											<Button
												onClick={() => onImageRemove(0)}
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
												src={
													images[i + 1]?.dataURL
														? images[i + 1].dataURL
														: placeholder.img
												}
												alt={`Profile pic #${i + 1} by ${
													userData.username
												}`}
												loading="lazy"
												style={{ maxWidth: '100%' }}
											/>
											{images[i + 1]?.dataURL ? (
												<div style={btnWrapper}>
													<Button
														onClick={() =>
															onImageUpdate(i + 1)
														}
														sx={singlePicBtn}
													>
														<ChangeCircleIcon sx={icon} />
													</Button>
													<Button
														onClick={() =>
															onImageRemove(i + 1)
														}
														sx={singlePicBtn}
													>
														<RemoveCircleRoundedIcon
															sx={icon}
														/>
													</Button>
												</div>
											) : null}
										</div>
									</Box>
								))}
							</Box>
							<Button
								disabled={!images.length ? true : false}
								style={applyBtn}
							>
								Apply
							</Button>
						</Container>
					);
				}}
			</ImageUploading>
		</>
	);
};

const applyBtn = {
	margin: '10px 0 5px 0'
};

const gridContainer = {
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)'
};

const pictureSectionWrapper = {
	display: 'grid'
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

const placeholder = {
	img: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
	title: 'Placeholder',
	featured: true
};

export default PicturesSection;
