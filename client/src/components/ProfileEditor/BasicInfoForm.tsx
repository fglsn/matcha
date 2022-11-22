// prettier-ignore
import { validateFirstame, validateLastname, validateBio, validateProfileEditorForm } from '../../utils/inputValidators';
import React, { useContext, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
// prettier-ignore
import { Button, Box, TextField, Grid, Stack, ToggleButton, styled, ToggleButtonGroup, Typography, Link, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useControlledField } from '../../hooks/useControlledField';
import { NewUserDataWithoutId, UserDataWithoutId } from '../../types';
import { useToggleButton } from '../../hooks/useToggleButton';
import type {} from '@mui/x-date-pickers/themeAugmentation';

import Tags from './Tags';
import profileService from '../../services/profile';
import { useStateValue } from '../../state';
import { AlertContext } from '../AlertProvider';

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

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11
	}
}));

const BasicInfoForm: React.FC<{ userData: UserDataWithoutId }> = ({ userData }) => {
	const [{ loggedUser }] = useStateValue();
	const { success: successCallback, error: errorCallback } = useContext(AlertContext);

	const firstname = useControlledField('text', userData.firstname, validateFirstame);
	const lastname = useControlledField('text', userData.lastname, validateLastname);
	const birthday = userData.birthday ? dayjs(userData.birthday) : null;
	const [date, setDateValue] = useState<Dayjs | null>(birthday);
	const gender = useToggleButton(userData.gender);
	const orientation = useToggleButton(userData.orientation);
	const [selectedTags, setSelectedTags] = useState<string[] | undefined>(userData.tags);
	const bio = useControlledField('text', userData.bio, validateBio);

	const handleDateChange = (newValue: Dayjs | null) => setDateValue(newValue);

	let eighteenYearsAgo = dayjs().subtract(18, 'year');

	//rm later
	console.log(`
		${firstname.value} &&
		${lastname.value} &&
		${date} &&
		${gender.value} &&
		${orientation.value} &&
		${selectedTags} &&
		${bio.value}`);

	const updateUserData = async (newUserData: NewUserDataWithoutId) => {
		try {
			loggedUser && (await profileService.updateProfile(loggedUser, newUserData));
			successCallback(`Profile settings were updated!.`);
		} catch (err) {
			console.log('Error in updateUserData (BasicInfoSection on Profile) ' + err); //rm later
			errorCallback(
				err.response?.data?.error ||
					'Unable to update profile settings. Please try again.'
			);
		}
	};

	const handleUserDataUpdate = (event: any) => {
		event.preventDefault();
		const newUserData: NewUserDataWithoutId = {
			firstname: firstname.value,
			lastname: lastname.value,
			birthday: date,
			gender: gender.value,
			orientation: orientation.value,
			tags: selectedTags,
			bio: bio?.value?.replace(/\s\s+/g, ' ')
		};
		updateUserData(newUserData);
	};

	return (
		<>
			<Box component="form" noValidate sx={{ mt: 3, ml: 2, mr: 2 }}>
				<LightTooltip title="Visit own profile page" placement="top-start">
					<Typography variant="h5" mb={3}>
						<Link href={`/profile/${loggedUser?.id}`} underline="none">
							@{loggedUser?.username.toUpperCase()}
						</Link>
					</Typography>
				</LightTooltip>
				<Grid container spacing={2}>
					<Grid item xs={12} mt={1}>
						<strong>First name*</strong>
						<TextField
							{...firstname}
							required
							fullWidth
							autoComplete="given-name"
						/>
					</Grid>
					<Grid item xs={12} mt={1}>
						<strong>Surname*</strong>
						<TextField
							{...lastname}
							required
							fullWidth
							autoComplete="family-name"
						/>
					</Grid>
					{/* <Grid item xs={12}>
						<strong>Email*</strong>
						<TextField
							{...email}
							required
							fullWidth
							autoComplete="username"
						/>
					</Grid> */}
					<Grid item xs={12} mt={1}>
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
					<Grid item xs={12} sm={6} mt={1}>
						<strong>Gender*</strong>
						<Box sx={{ flexDirection: 'column' }}>
							<StyledToggleButtonGroup exclusive {...gender}>
								<ToggleButton value="male">BOY</ToggleButton>
								<ToggleButton value="female">GIRL</ToggleButton>
							</StyledToggleButtonGroup>
						</Box>
					</Grid>
					<Grid item sm={'auto'} mt={1}>
						<strong>Orientation*</strong>
						<Box sx={{ flexDirection: 'column' }}>
							<StyledToggleButtonGroup exclusive {...orientation}>
								<ToggleButton value="straight">STRAIGHT</ToggleButton>
								<ToggleButton value="gay">GAY</ToggleButton>
								<ToggleButton value="bi">BI</ToggleButton>
							</StyledToggleButtonGroup>
						</Box>
					</Grid>
					<Grid container>
						<Tags
							selectedTags={selectedTags}
							setSelectedTags={setSelectedTags}
						/>
					</Grid>
					<Grid item xs={12}>
						<strong>Bio*</strong>
						<TextField {...bio} required fullWidth multiline rows={4} />
					</Grid>
				</Grid>
				{firstname.value &&
				lastname.value &&
				date &&
				gender.value &&
				orientation.value &&
				selectedTags && selectedTags.length &&
				bio.value &&
				validateProfileEditorForm(
					firstname.value,
					lastname.value,
					date,
					bio.value
				) ? (
					<Button
						type="submit"
						onClick={handleUserDataUpdate}
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Update Info
					</Button>
				) : (
					<Button disabled variant="contained" sx={{ mt: 3, mb: 2 }}>
						Update Info
					</Button>
				)}
			</Box>
		</>
	);
};

export default BasicInfoForm;
