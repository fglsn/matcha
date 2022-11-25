export const checkIsLocationEnabled = (
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

export const getCoordinates = (
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
