import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

const GenderIcon: React.FC<{ gender: string }> = ({ gender }) => {
	switch (gender) {
		case 'male':
			return <MaleIcon color="primary" />;
		case 'female':
			return <FemaleIcon color="primary" />;
		default:
			return <></>;
	}
};

export default GenderIcon;
