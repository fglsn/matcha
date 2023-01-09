import { Box, Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';

const FameRating: React.FC<{ fameRating: number }> = ({ fameRating }) => {
	const value = (5 / 100) * fameRating;
	return (
		<Tooltip title={`Fame rating score: ${fameRating}/100`} arrow placement="bottom">
			<Box sx={{mr:2}} display="inline-block">
				<Rating
					name="size-small"
					value={value}
					readOnly
					precision={0.1}
					size="small"
				/>
			</Box>
		</Tooltip>
	);
};

export default FameRating;
