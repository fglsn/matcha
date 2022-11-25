import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, Marker, useMapEvents } from 'react-leaflet';
import { Box, Button, Typography } from '@mui/material';
import { getCoordinates, checkIsLocationEnabled } from '../../utils/location';
import { LightTooltip } from './BasicInfoForm';
import profileService from '../../services/profile';

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

const Location = ({
	coordinates,
	setCoordinates,
	locationString,
	setLocationString
}: {
	coordinates: [number, number];
	setCoordinates: React.Dispatch<React.SetStateAction<[number, number]>>;
	locationString: string;
	setLocationString: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
	const [locationError, setError] = useState<boolean>(false);

	useEffect(() => {
		checkIsLocationEnabled(setIsLocationEnabled);
	}, []);

	useEffect(() => {
		if (!coordinates[0] || !coordinates[1]) getCoordinates(setCoordinates, setError);
	}, [coordinates, setCoordinates]);

	const getGeoPosition = useCallback(
		async (coordinates: [number, number]) => {
			let res;
			try {
				res = await profileService.requestLocation(coordinates);
				console.log('coord res ', res);

				const neighbourhood = res.neighbourhood ? `${res.neighbourhood}, ` : '';
				const city = res.locality ? `${res.locality}, ` : '';
				const country = res.country ? `${res.country}` : '';

				setLocationString(neighbourhood + city + country);
			} catch (err) {
				console.log(err); //rm later
			}
		},
		[setLocationString]
	);

	useEffect(() => {
		getGeoPosition(coordinates);
	}, [coordinates, getGeoPosition]);

	const SetMarkerOnClick = ({
		setCoordinates
	}: {
		setCoordinates: React.Dispatch<React.SetStateAction<[number, number]>>;
	}) => {
		useMapEvents({
			click(e) {
				setCoordinates([e.latlng.lat, e.latlng.lng]);
			}
		});
		return null;
	};

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
				scrollWheelZoom={true}
				style={{ height: '30vh', width: '100wh' }}
			>
				<ChangeView center={coordinates} zoom={13} />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<DraggableMarker coords={coordinates} setCoordinates={setCoordinates} />
				<SetMarkerOnClick setCoordinates={setCoordinates} />
			</MapContainer>
			<Typography>{locationString}</Typography>
		</Box>
	);
};

export default Location;
