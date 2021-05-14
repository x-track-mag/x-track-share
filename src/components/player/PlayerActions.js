const PlayerState = {
	ready: false, // When the player is ready to play
	playing: false, // Toggle between play/pause state
	selectedIndex: 0 // The selected track index in the playlist
};

const PlayerActions = {
	play: (state) => ({
		...state,
		playing: true
	}),
	pause: (state) => ({
		...state,
		playing: false
	})
};
