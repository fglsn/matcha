// prettier-ignore
import { validateFirstame, validateLastname, validateUsername, validateEmail, validateProfileForm } from '../../utils/inputValidators';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
// prettier-ignore
import { Button, Box, TextField, Grid, Stack, MenuItem, Select, SelectChangeEvent, FormControl } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useControlledField } from '../../hooks/useControlledField';
import { UserDataWithoutId } from '../../types';

import type {} from '@mui/x-date-pickers/themeAugmentation';

const style = {
	box: {
		margin: '1rem'
	},
	paper: {
		backgroundColor: '#b5bec6ff',
		padding: '5rem'
	}
};

const BasicInfo: React.FC<{ userData: UserDataWithoutId }> = ({ userData }) => {
	const firstname = useControlledField('text', userData.firstname, validateFirstame);
	const lastname = useControlledField('text', userData.lastname, validateLastname);
	const username = useControlledField('text', userData.username, validateUsername);
	const email = useControlledField('text', userData.email, validateEmail);
	const bio = useControlledField('text', userData.bio, validateLastname);

	const [date, setDateValue] = useState<Dayjs | null>(dayjs(userData.birthday));
	const [gender, setGender] = useState('');
	const [orientation, setOrientation] = useState('');

	const handleGenderChange = (event: SelectChangeEvent) => {
		setGender(event.target.value as string);
	};

	const handleOrientationChange = (event: SelectChangeEvent) => {
		setOrientation(event.target.value as string);
	};

	const handleDateChange = (newValue: Dayjs | null) => {
		setDateValue(newValue);
	};

	return (
		<>
			<Box component="form" noValidate sx={{ mt: 3 }} style={style.box}>
				<h1>ACCOUNT DETAILS</h1>
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
									renderInput={(params) => (
										<>
											<strong>Birthday*</strong>
											<TextField required {...params} />
										</>
									)}
								/>
							</Stack>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12} sm={6}>
						<strong>Gender*</strong>
						<FormControl fullWidth>
							<Select value={gender} onChange={handleGenderChange}>
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
					<Grid item xs={12}>
						<strong>Bio*</strong>
						{/*prettier-ignore*/}
						<TextField 
							{...bio} 
							required 
							fullWidth 
							multiline 
							rows={4} 
						/>
					</Grid>
				</Grid>
				{username.value &&
				email.value &&
				firstname.value &&
				lastname.value &&
				bio.value &&
				date &&
				orientation &&
				gender &&
				validateProfileForm(
					username.value,
					email.value,
					firstname.value,
					lastname.value,
					bio.value
				) ? (
					<Button
						type="submit"
						variant="contained"
						sx={{ mt: 3, mb: 2, ml: 2 }}
					>
						Update Info
					</Button>
				) : (
					<Button disabled variant="contained" sx={{ mt: 3, mb: 2, ml: 2 }}>
						Update Info
					</Button>
				)}
			</Box>
		</>
	);
};

export default BasicInfo;
