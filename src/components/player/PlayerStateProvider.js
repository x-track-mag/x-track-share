import { useState, createContext, useContext } from "react";

/**
 * @typedef PlayerState
 * @property {Array} playlist
 * @property {Number} selectedIndex
 * @property {Boolean} playing
 * @property {Function} setPlayerState
 */

const PlayerContext = createContext();

const PlayerStateProvider = ({ children }) => {
	const [playerState, setPlayerState] = useState({
		selectedIndex: 0,
		playing: false // play/pause
	});

	const merge = (newValues) =>
		setPlayerState({
			...playerState,
			...newValues
		});

	return (
		<PlayerContext.Provider value={{ merge, ...playerState }}>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerStateProvider;

/**
 * Make en PlayerState accessible inside this component
 * with the usePlayerState() hook
 * @param {JSX.Element} Component
 */
export const withPlayerState = (Component) => (props) => {
	return (
		<PlayerStateProvider>
			<Component {...props} />
		</PlayerStateProvider>
	);
};

/**
 * usePlayerState() Hook
 * @return {PlayerState}
 */
export const usePlayerState = () => {
	const ps = useContext(PlayerContext);
	if (!ps) {
		throw new ReferenceError(`usePlayerState() called without a PlayerStateProvider`);
	}
	return ps;
};
