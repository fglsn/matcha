import { Box, ImageListItem } from '@mui/material';

const gridContainer = {
	display: 'grid',
	gridTemplateColumns: 'repeat(4, 1fr)'
};

const gridItem = {
	margin: '15px',
};

const mainGridItem = {
	height: 'fit-content',
	margin: '15px 100px 0 100px',
};

function srcset(image: string) {
	return {
		src: `${image}`,
		srcSet: `${image}`
	};
}

const PicturesSection = () => {
	return (
		<>
			<Box sx={mainGridItem}>
				<ImageListItem key={itemData[0].img}>
					<img
						{...srcset(itemData[0].img)}
						alt={itemData[0].title}
						loading="lazy"
					/>
				</ImageListItem>
			</Box>
			<Box sx={gridContainer}>
				{[...Array(4)].map((e, i) => (
					<Box key={i} sx={gridItem}>
						<ImageListItem>
							<img
								{...srcset(itemData[0].img)}
								alt={itemData[0].title}
								loading="lazy"
							/>
						</ImageListItem>
					</Box>
				))}
			</Box>
		</>
	);
};

const itemData = [
	{
		img: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
		title: 'Placeholder',
		author: '@matcha',
		featured: true
	}
];

export default PicturesSection;
