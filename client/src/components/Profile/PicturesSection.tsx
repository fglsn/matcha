
import { Box, ImageListItem } from "@mui/material";

const gridContainer = {
	display: "grid",
	gridTemplateColumns: "repeat(4, 1fr)"
};

const gridItem = {
	margin: "8px",
	border: "1px solid red",

};

const mainGridItem = {
	height: "fit-content",
	margin: "25px 100px 0 100px",
	border: "1px solid red"
};
function srcset(image: string) {
	return {
		src: `${image}`,
		srcSet: `${image}`,
	};
}

export default function PicturesSection() {
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
				<Box sx={gridItem}>
					<ImageListItem key={itemData[0].img}>
						<img
							{...srcset(itemData[0].img)}
							alt={itemData[0].title}
							loading="lazy"
						/>
					</ImageListItem>
				</Box>
				<Box sx={gridItem}>
					<ImageListItem key={itemData[0].img}>
						<img
							{...srcset(itemData[1].img)}
							alt={itemData[1].title}
							loading="lazy"
						/>
					</ImageListItem>
				</Box>
				<Box sx={gridItem}>
					<ImageListItem key={itemData[0].img}>
						<img
							{...srcset(itemData[2].img)}
							alt={itemData[2].title}
							loading="lazy"
						/>
					</ImageListItem>
				</Box>
				<Box sx={gridItem}>
					Item #4 has a long text inside. Lorem ipsum dolor sit amet, consectetur
					adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
					laboris nisi ut aliquip ex ea commodo consequat.
				</Box>
			</Box>
		</>
	);
};


const itemData = [
	{
		img: 'https://sun9-north.userapi.com/sun9-87/s/v1/ig2/CG3_vcWxjQlqhj-gJwOuM8QT58rwd5-h6kdxwfUmHhlCjVgXOp2kF5p5eaTsK1xeY4VunQ5nHCV_wPDzV1xXDsAI.jpg?size=810x1080&quality=96&type=album',
		title: 'Breakfast',
		author: '@bkristastucchio',
		featured: true,
	},
	{
		img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
		title: 'Burger',
		author: '@rollelflex_graphy726',
	},
	{
		img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
		title: 'Camera',
		author: '@helloimnik',
	},
	{
		img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
		title: 'Coffee',
		author: '@nolanissac',
	},
	{
		img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
		title: 'Hats',
		author: '@hjrc33',
	},
	{
		img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
		title: 'Honey',
		author: '@arwinneil',
		featured: true,
	},
	{
		img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
		title: 'Basketball',
		author: '@tjdragotta',
	},
	{
		img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
		title: 'Fern',
		author: '@katie_wasserman',
	},
	{
		img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
		title: 'Mushrooms',
		author: '@silverdalex',
	},
	{
		img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
		title: 'Tomato basil',
		author: '@shelleypauls',
	},
	{
		img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
		title: 'Sea star',
		author: '@peterlaster',
	},
	{
		img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
		title: 'Bike',
		author: '@southside_customs',
	},
];
