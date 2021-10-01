import { createContext, useContext, useState } from "react";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect.js";

const ScreenSizeContext = createContext();

/**
 * @typedef ScreenSize
 * @property {Number} screenWidth
 * @property {Number} screenHeight
 */

/**
 * @type ScreenSize
 */
const INITIAL_SIZE = {
	// For SSR
	screenWidth: 640,
	screenHeight: 480
};

/**
 * NOTE : Don't forget the {children} when writing a context provider !
 * @param props.children
 */
const ScreenSizeProvider = ({ children }) => {
	// Save current viewport size in the state object
	let [screenSize, setScreenSize] = useState(INITIAL_SIZE);

	// This useLayoutEffect will execute only once because
	// it does not have any dependencies.
	useIsomorphicLayoutEffect(() => {
		// Listen to window scroll event
		const measureScreenSize = () => {
			requestAnimationFrame(() => {
				const updated = {
					screenWidth: window.innerWidth,
					screenHeight: window.innerHeight
				};

				setScreenSize(updated);
			});
		};
		window.addEventListener("resize", measureScreenSize);
		// Do it now
		measureScreenSize();

		// return the clean up function
		return () => {
			window.removeEventListener("resize", measureScreenSize);
		};
	}, []);

	return (
		<ScreenSizeContext.Provider value={screenSize}>{children}</ScreenSizeContext.Provider>
	);
};

/**
 * React Hook to retrieve the current size of the screen
 * @return {ScreenSize}
 */
export const useScreenSize = () => {
	const screenSize = useContext(ScreenSizeContext);
	if (screenSize === undefined) {
		throw new Error(
			`useScreenSize() hook can only be used from inside a <ScreenSizeProvider/> parent`
		);
	}
	return screenSize;
};

/**
 * Build a Higher Order Component that will allways receive
 * an updated `screenSize` prop with the position and direction of the scroll
 * @param {JSX.Element} Component
 */
export const withScreenSize = (Component) => (props) => {
	return (
		<ScreenSizeProvider>
			<Component {...props} />
		</ScreenSizeProvider>
	);
};

export default ScreenSizeProvider;
