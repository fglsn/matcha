//prettier-ignore
import { Box, Chip, Collapse, Grid, List, ListItemButton, styled, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';

const TagList = styled(List)({
	'& .MuiListItemButton-root:hover': {
		backgroundColor: 'white',
		'&, & .MuiListItemIcon-root': {
			color: '#fcc810ba'
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
	const [expanded, setExpanded] = useState(false);
	const [tagList] = useState<string[]>([
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

	const tooManySelected = selectedTags && selectedTags.length >= 5;
	const isSelected = (tag: string) => selectedTags && selectedTags.indexOf(tag) > -1;

	const handleSelect = (tag: string) => () => {
		let selected: string[] = [];
		if (selectedTags && selectedTags.length) selected = [...selectedTags];
		if (selected.indexOf(tag) === -1) selected.push(tag);
		setSelectedTags(selected);
	};

	const handleDeselect = (tagToDeselect: string) => () =>
		setSelectedTags((tags) => tags?.filter((tag) => tag !== tagToDeselect));

	const handleExpand = () => setExpanded(!expanded);

	return (
		<Box sx={tagSectionBox}>
			<strong>Interests*</strong>
			<TagList sx={{ maxWidth: '100%' }}>
				<ListItemButton onClick={handleExpand}>
					{!selectedTags && <Typography>Select here</Typography>}
					<Grid sx={selectedTagsListGrid}>
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
					{expanded ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton>
							<Grid sx={tagListGrid}>
								{tagList?.map((tag) => {
									return !tooManySelected ? (
										<Chip
											sx={{ m: 0.4 }}
											key={tag}
											color="primary"
											variant={
												isSelected(tag) ? 'filled' : 'outlined'
											}
											label={tag}
											onClick={handleSelect(tag)}
											onDelete={
												isSelected(tag)
													? handleDeselect(tag)
													: undefined
											}
										/>
									) : (
										<Chip
											sx={{ m: 0.4 }}
											key={tag}
											color={
												isSelected(tag) ? 'primary' : 'default'
											}
											variant="filled"
											label={tag}
											onDelete={
												isSelected(tag)
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
			</TagList>
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

const selectedTagsListGrid = {
	display: 'flex',
	flexWrap: 'wrap',
	listStyle: 'none',
	flexDirection: 'row',
	pt: 1,
	pl: 0.5,
	m: 0
};

const tagListGrid = {
	display: 'flex',
	flexWrap: 'wrap',
	listStyle: 'none',
	justifyContent: 'center',
	flexDirection: 'row',
	pt: 1,
	pl: 0.5,
	m: 0
};

export default Tags;
