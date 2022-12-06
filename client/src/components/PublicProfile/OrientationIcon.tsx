import TransgenderIcon from '@mui/icons-material/Transgender';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

const OrientationIcon = ({
	orientation,
	gender
}: {
	orientation: string;
	gender: string;
}) => {
	switch (orientation) {
		case 'straight':
			if (gender === 'male') return <FemaleIcon color="secondary" />;
			if (gender === 'female') return <MaleIcon color="secondary" />;
			return <></>;
		case 'gay':
			if (gender === 'male') return <MaleIcon color="secondary" />;
			if (gender === 'female') return <FemaleIcon color="secondary" />;
			return <></>;
		case 'bi':
			return <TransgenderIcon color="secondary" />;
		default:
			return <></>;
	}
};

export default OrientationIcon;
