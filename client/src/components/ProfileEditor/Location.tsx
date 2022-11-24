import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import { Box, Button } from '@mui/material';
// import { useStateValue } from '../../state';
import { LightTooltip } from './BasicInfoForm';

const getCoordinates = (
	setCoordinates: React.Dispatch<React.SetStateAction<[number, number]>>,
	setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;
			setCoordinates([lat, lng]);
		},
		() => {
			setError(true);
		}
	);
};

const checkIsLocationEnabled = (
	setIsLocationEnabled: (isLocationEnabled: boolean) => void
) => {
	navigator.geolocation.getCurrentPosition(
		() => {
			setIsLocationEnabled(true);
		},
		() => {
			setIsLocationEnabled(false);
		}
	);
};

const DraggableMarker = ({
	coords,
	setCoordinates
}: {
	coords: any;
	setCoordinates: any;
}) => {
	const markerRef = useRef(null);
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker: any = markerRef.current;
				if (marker != null) {
					console.log(marker.getLatLng()); //rm later
					const latLng = marker.getLatLng();
					setCoordinates([latLng.lat, latLng.lng]);
				}
			}
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<Marker
			draggable={true}
			eventHandlers={eventHandlers}
			position={[coords[0], coords[1]]}
			ref={markerRef}
		></Marker>
	);
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
	const map = useMap();
	map.setView(center, zoom);
	return null;
}

const Location = () => {
	// const [{ loggedUser }] = useStateValue();
	const [coordinates, setCoordinates] = useState<[number, number]>([
		60.16678195339881, 24.941711425781254
	]);
	const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
	const [locationError, setError] = useState<boolean>(false);
	// const getGeoPosition = useCallback(
	// 	async (coordinates: number[] | undefined) => {
	// 		let res;
	// 		try {
	// 			if (!coordinates || !coordinates[0] || !coordinates[1]) {
	// 				res =
	// 					loggedUser &&
	// 					(await profileService.requestLocation(loggedUser.id, undefined));
	// 				console.log('ip res ', res);
	// 			} else {
	// 				res =
	// 					loggedUser &&
	// 					(await profileService.requestLocation(
	// 						loggedUser.id,
	// 						coordinates
	// 					));
	// 				console.log('coord res ', res);
	// 			}
	// 			setLocation(res);
	// 		} catch (err) {
	// 			console.log(err); //rm later
	// 		}
	// 		console.log(res);
	// 	},
	// 	[loggedUser]
	// );

	useEffect(() => {
		checkIsLocationEnabled(setIsLocationEnabled);
	}, []);

	useEffect(() => {
		if (!coordinates[0] || !coordinates[1]) getCoordinates(setCoordinates, setError);
	}, [coordinates]);

	// const handleClick = async (event: any) => {
	// 	event.preventDefault();
	// 	console.log(coordinates); //rm later
	// 	// if (coordinates[0] && coordinates[1]) getGeoPosition(coordinates);
	// 	// else getGeoPosition(undefined);
	// };

	return (
		<Box>
			<LightTooltip
				title={
					!isLocationEnabled || !!locationError
						? 'Please enable location first or reload the page'
						: ''
				}
				placement="top"
			>
				<span>
					<Button
						sx={{ marginTop: 1, marginRight: 2, width: '100%' }}
						onClick={() => getCoordinates(setCoordinates, setError)}
						disabled={!isLocationEnabled || !!locationError}
					>
						Locate me
					</Button>
				</span>
			</LightTooltip>
			<MapContainer
				center={coordinates}
				zoom={14}
				scrollWheelZoom={true}
				style={{ height: '30vh', width: '100wh' }}
			>
				<ChangeView center={coordinates} zoom={12} />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<DraggableMarker coords={coordinates} setCoordinates={setCoordinates} />
			</MapContainer>
			{/* <Button
				sx={{ marginTop: 1, marginRight: 2, width: '100%' }}
				variant="contained"
				onClick={handleClick}
			>
				Set selected location
			</Button> */}
		</Box>
	);
};

export default Location;
