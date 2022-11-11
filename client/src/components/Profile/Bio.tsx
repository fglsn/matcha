import { Box, TextField } from "@mui/material";

const style = {
	box: {
		margin: '1rem'
	},
	paper: {
		backgroundColor: '#b5bec6ff',
		padding: '5rem'
	}
};

const Bio: React.FC<{ bio: string | undefined }> = ({ bio }) => {
	return (<>
		<Box
			component="form"
			noValidate
			sx={{ mt: 3 }}
			style={style.box}
		>
			<strong>Bio*</strong>
			<TextField
				required
				multiline
				rows={4}
				fullWidth
				autoComplete="username"
			/>
		</Box>
	</>)
};


export default Bio;
