import { createContext, useContext, useState, useEffect, useRef } from "react";
import useUniversalEffect from "../../hooks/useUniversalEffect";

const VScrollPositionContext = createContext();

const INITIAL_POSITION = {
	scrollY: 0,
	direction: "none"
};

/**
 * NOTE : Don't forget the {children} when writing a context provider !
 * @param props
 * @param
 */
const VScrollPositionProvider = ({ children }) => {
	// Save current viewport size in the state object
	let [vscrollPosition, setVScrollPosition] = useState(INITIAL_POSITION);
	const previous = useRef();

	/**
	 * Store the previous vscroll position value
	 * @see https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
	 */
	useEffect(() => {
		previous.current = vscrollPosition;
	});

	// This useLayoutEffect will execute only once because
	// it does not have any dependencies.
	useUniversalEffect(() => {
		// Listen to window scroll event
		const measureVScrollPosition = () => {
			requestAnimationFrame(() => {
				const updated = {
					scrollY: window.scrollY,
					direction: window.scrollY >= previous.current.scrollY ? "down" : "up"
				};

				setVScrollPosition(updated);
			});
		};
		window.addEventListener("scroll", measureVScrollPosition);

		// return the clean up function
		return () => {
			window.removeEventListener("scroll", measureVScrollPosition);
		};
	}, []);

	return (
		<VScrollPositionContext.Provider value={vscrollPosition}>
			{children}
		</VScrollPositionContext.Provider>
	);
};

/**
 * React Hook to retrieve an up-to-date version of the vertical scroll position
 * @return {Number}
 */
export const useVScrollPosition = () => {
	const vscrollPosition = useContext(VScrollPositionContext);
	if (vscrollPosition === undefined) {
		throw new Error(
			`useVScrollPosition() hook can only be used from inside a <VScrollPositionProvider/> parent`
		);
	}
	return vscrollPosition;
};

/**
 * Build a Higher Order Component that will allways receive
 * an updated `vscrollPosition` prop with the position and direction of the scroll
 * @param {JSX.Element} Component
 */
export const withVScrollPosition = (Component) => (props) => {
	return (
		<VScrollPositionProvider>
			<Component {...props} />
		</VScrollPositionProvider>
	);
};

export default VScrollPositionProvider;
