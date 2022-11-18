//prettier-ignore
import { Box, Chip, Collapse, Grid, List, ListItemButton, styled, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';

const MyList = styled(List)({
	'& .MuiListItemButton-root:hover': {
		backgroundColor: 'white',
		'&, & .MuiListItemIcon-root': {
			color: '#fcfcfc'
		}
	}
});

const Tags = ({
	selectedTags,
	setSelectedTags
}: {
	selectedTags: string[] | undefined;
	setSelectedTags: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) => {
	const [tagList, setTagList] = useState<string[]>([
		'Sauna',
		'Swimming',
		'Yoga',
		'Boxing',
		'Family',
		'Children',
		'Friends',
		'Competing',
		'Vinyl',
		'Biking',
		'Recreation',
		'Makeup',
		'Queer',
		'Exercise',
		'Pets',
		'Roadtrip',
		'Cinema',
		'Antiques',
		'Pottery',
		'Music',
		'Boardgames',
		'Videogames',
		'Knitting',
		'Languages',
		'Dining',
		'Baking',
		'Climbing',
		'Interior',
		'Architecture',
		'Science',
		'Design',
		'Society',
		'Technologies',
		'Robotics',
		'Spa',
		'Gymnastics',
		'Meditation',
		'Sushi',
		'Hockey',
		'Basketball',
		'Theater',
		'Aquarium',
		'Sneakers',
		'Walking',
		'Running',
		'Travel',
		'Gym',
		'HipHop',
		'Skincare',
		'Shisha',
		'Freelance',
		'Skateboarding',
		'Gospel',
		'Photography',
		'Reading',
		'Singing',
		'Poetry',
		'StandUp',
		'Coffee',
		'Karaoke',
		'SelfDevelopment',
		'MentalHealthAwareness',
		'ClimateChange',
		'Exhibition',
		'LGBTQ+Rights',
		'Feminism',
		'Shopping',
		'Brunch',
		'Investment',
		'Jogging',
		'Inclusivity',
		'Football',
		'Investing',
		'Tennis',
		'Expositions',
		'Skiing',
		'Canoeing',
		'Snowboarding',
		'Pilates',
		'Pentathlon',
		'Broadway',
		'PlayStation',
		'Choir',
		'Festivals',
		'Catan',
		'Cosplay',
		'Tattoos',
		'Painting',
		'Padel',
		'Bowling',
		'Paragliding',
		'Upcycling',
		'Equality',
		'Astrology',
		'Motorcycles',
		'Entrepreneurship',
		'Cooking',
		'Dancing',
		'Gardening',
		'Art',
		'Politics',
		'Flamenco',
		'Museum',
		'Activism',
		'DAOs',
		'Podcasts',
		'Rave',
		'Pimms',
		'BBQ',
		'Drummer',
		'Tea',
		'Pubs',
		'Tango',
		'Drawing',
		'Volunteering',
		'Environmentalism',
		'Rollerskating',
		'Wine',
		'Vlogging',
		'Writing',
		'Xbox',
		'Literature',
		'Pride',
		'Marathon',
		'YouTube',
		'Marvel',
		'Volleyball',
		'Parties',
		'Ballet',
		'Band',
		'Nightlife',
		'Sailing',
		'Military',
		'Memes',
		'Motorcycling',
		'Mindfulness',
		'Acapella',
		'Hiking',
		'Mountains',
		'Archery',
		'Fishing',
		'Clubbing',
		'Concerts',
		'Blogging',
		'Collecting',
		'Cars',
		'Badminton',
		'Fashion',
		'Anime',
		'DIY',
		'Cycling',
		'Outdoors',
		'TikTok',
		'Twitch',
		'Comedy',
		'Triathlon',
		'Netflix',
		'Disney',
		'Tarot',
		'Stocks'
	]);

	// const [selectedTags, setSelectedTags] = useState<string[] | undefined>(userData.tags);

	const handleSelect = (tag: string) => () => {
		let selected: string[] = [];
		if (selectedTags && selectedTags.length) selected = [...selectedTags];
		if (selected.indexOf(tag) === -1) selected.push(tag);
		setSelectedTags(selected);
	};

	const handleDeselect = (tagToDeselect: string) => () => {
		setSelectedTags((tags) => tags?.filter((tag) => tag !== tagToDeselect));
	};

	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<Box sx={tagSectionBox}>
			<strong>Passions*</strong>
			<MyList sx={{ maxWidth: '100%' }}>
				<ListItemButton onClick={handleClick}>
					{!selectedTags && <Typography>Select here</Typography>}
					<Grid sx={tagListGrid}>
						{selectedTags?.map((tag) => {
							return (
								<Chip
									sx={{ m: 0.3 }}
									key={`selected-${tag}`}
									color="primary"
									label={tag}
									onDelete={handleDeselect(tag)}
								/>
							);
						})}
					</Grid>
					{open ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton>
							<Grid sx={tagListGrid}>
								{tagList?.map((tag) => {
									return (
										<Chip
											sx={{ m: 0.3 }}
											key={tag}
											color="primary"
											variant={
												selectedTags &&
												selectedTags.indexOf(tag) > -1
													? 'filled'
													: 'outlined'
											}
											label={tag}
											onClick={handleSelect(tag)}
											onDelete={
												selectedTags &&
												selectedTags?.indexOf(tag) > -1
													? handleDeselect(tag)
													: undefined
											}
										/>
									);
								})}
							</Grid>
						</ListItemButton>
					</List>
				</Collapse>
			</MyList>
		</Box>
	);
};

const tagSectionBox = {
	maxWidth: '100%',
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'column',
	pl: 2,
	pr: 2,
	pt: 2,
	m: 0
};

const tagListGrid = {
	display: 'flex',
	flexWrap: 'wrap',
	listStyle: 'none',
	flexDirection: 'row',
	pt: 1,
	pl: 0.5,
	m: 0
};

export default Tags;
