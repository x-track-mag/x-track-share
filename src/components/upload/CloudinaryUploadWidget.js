function showUploadWidget() {
	cloudinary.openUploadWidget(
		{
			cloudName: "zipang",
			uploadPreset: "hd",
			sources: ["local", "url", "google_drive", "dropbox"],
			googleApiKey: "<image_search_google_api_key>",
			showAdvancedOptions: false,
			cropping: false,
			multiple: true,
			defaultSource: "local",
			styles: {
				palette: {
					window: "#000000",
					sourceBg: "#0000FF",
					windowBorder: "#FFFFFF",
					tabIcon: "#FFFFFF",
					inactiveTabIcon: "#8E9FBF",
					menuIcons: "#2AD9FF",
					link: "#FFFF00",
					action: "#FFFF00",
					inProgress: "#8484FF",
					complete: "#0000FF",
					error: "#EA2727",
					textDark: "#000000",
					textLight: "#FFFFFF"
				},
				fonts: {
					default: null,
					"'Poppins', sans-serif": {
						url: "https://fonts.googleapis.com/css?family=Poppins",
						active: true
					}
				}
			}
		},
		(err, info) => {
			if (!err) {
				console.log("Upload Widget event - ", info);
			}
		}
	);
}
