import { Box, TextField, Grid, Stack, MenuItem, Select, SelectChangeEvent, FormControl } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { useControlledField } from '../../hooks/useField';
import { BaseUser } from '../../types';
import { validateFirstame, validateLastname, validateUsername, validateEmail } from '../../utils/inputValidators';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { } from '@mui/x-date-pickers/themeAugmentation';

const style = {
	box: {
		margin: '1rem'
	},
	paper: {
		backgroundColor: '#b5bec6ff',
		padding: '5rem'
	}
};

const BasicInfo: React.FC<{ baseUserData: BaseUser }> = ({ baseUserData }) => {

	const firstname = useControlledField('text', 'Name', baseUserData.firstname, validateFirstame);
	const lastname = useControlledField('text', 'Surname', baseUserData.lastname, validateLastname);
	const username = useControlledField('text', 'Username', baseUserData.username, validateUsername);
	const email = useControlledField('text', 'Email', baseUserData.email, validateEmail);

	const [date, setValue] = useState<Dayjs | null>(null);
	const [gender, setGender] = useState('');
	const [orientation, setOrientation] = useState('');

	const handleGenderChange = (event: SelectChangeEvent) => {
		setGender(event.target.value as string);
	};

	const handleOrientationChange = (event: SelectChangeEvent) => {
		setOrientation(event.target.value as string);
	};

	const handleDateChange = (newValue: Dayjs | null) => {
		setValue(newValue);
	};

	return (
		<>
			<Box
				component="form"
				noValidate
				sx={{ mt: 3 }}
				style={style.box}
			>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<strong>Username*</strong>
						<TextField
							{...username}
							required
							fullWidth
							autoComplete="username"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<strong>First name*</strong>
						<TextField
							{...firstname}
							required
							fullWidth
							autoFocus
							autoComplete="given-name"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<strong>Surname*</strong>
						<TextField
							{...lastname}
							required
							fullWidth
							autoComplete="family-name"
						/>
					</Grid>
					<Grid item xs={12}>
						<strong>Email*</strong>
						<TextField
							{...email}
							required
							fullWidth
							autoComplete="username"
						/>
					</Grid>
					<Grid item xs={12}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<Stack>
								<DesktopDatePicker
									inputFormat="DD/MM/YYYY"
									value={date}
									onChange={handleDateChange}
									renderInput={(params) =>
										<>
											<strong>Birthday*</strong>
											<TextField required {...params} />
										</>}
								/>
							</Stack>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12} sm={6}>
						<strong>Gender*</strong>
						<FormControl fullWidth>
							<Select

								value={gender}
								onChange={handleGenderChange}
							>
								<MenuItem value={'Male'}>Male</MenuItem>
								<MenuItem value={'Female'}>Female</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<strong>Orientation*</strong>
						<FormControl fullWidth>
							<Select
								value={orientation}
								onChange={handleOrientationChange}
							>
								<MenuItem value={'Hetero'}>Hetero</MenuItem>
								<MenuItem value={'Gay'}>Gay</MenuItem>
								<MenuItem value={'Bi'}>Bi</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default BasicInfo;
