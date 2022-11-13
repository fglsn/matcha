// prettier-ignore
import { validateFirstame, validateLastname, validateUsername, validateEmail, validateProfileForm } from '../../utils/inputValidators';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
// prettier-ignore
import { Button, Box, TextField, Grid, Stack, ToggleButton, styled, ToggleButtonGroup } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useControlledField } from '../../hooks/useControlledField';
import { UserDataWithoutId } from '../../types';
import { useToggleButton } from '../../hooks/useToggleButton';
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	'& .MuiToggleButtonGroup-grouped': {
		margin: theme.spacing(0.5),
		border: 3,
		'&.Mui-disabled': {
			border: 3
		},
		'&:not(:first-of-type)': {
			borderRadius: theme.shape.borderRadius
		},
		'&:first-of-type': {
			borderRadius: theme.shape.borderRadius
		}
	}
}));

const BasicInfo: React.FC<{ userData: UserDataWithoutId }> = ({ userData }) => {
	const firstname = useControlledField('text', userData.firstname, validateFirstame);
	const lastname = useControlledField('text', userData.lastname, validateLastname);
	const username = useControlledField('text', userData.username, validateUsername);
	const email = useControlledField('text', userData.email, validateEmail);
	const bio = useControlledField('text', userData.bio, validateLastname);
	const gender = useToggleButton(userData.gender);
	const orientation = useToggleButton(userData.orientation);

	const [date, setDateValue] = useState<Dayjs | null>(dayjs(userData.birthday));
	const handleDateChange = (newValue: Dayjs | null) => {
		setDateValue(newValue);
	};

	let eighteenYearsAgo = dayjs().subtract(18, 'year');

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
									maxDate={eighteenYearsAgo}
									minDate={dayjs('01/01/1900')}
									onChange={handleDateChange}
									renderInput={(params) => (
										<>
											<strong>Birthday*</strong>
											<TextField
												required
												error
												helperText="User must be at least 18 years old"
												{...params}
											/>
										</>
									)}
								/>
							</Stack>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12} sm={6}>
						<strong>Gender*</strong>
						<Box sx={{ flexDirection: 'column' }}>
							<StyledToggleButtonGroup exclusive {...gender}>
								<ToggleButton value="male">BOY</ToggleButton>
								<ToggleButton value="female">GIRL</ToggleButton>
							</StyledToggleButtonGroup>
						</Box>
					</Grid>
					<Grid item sm={'auto'}>
						<strong>Orientation*</strong>
						<Box sx={{ flexDirection: 'column' }}>
							<StyledToggleButtonGroup exclusive {...orientation}>
								<ToggleButton value="straight">STRAIGHT</ToggleButton>
								<ToggleButton value="gay">GAY</ToggleButton>
								<ToggleButton value="bi">BI</ToggleButton>
							</StyledToggleButtonGroup>
						</Box>
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
				date &&
				gender.value &&
				orientation.value &&
				bio.value &&
				validateProfileForm(
					username.value,
					email.value,
					firstname.value,
					lastname.value,
					date,
					bio.value
				) ? (
					<Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
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
