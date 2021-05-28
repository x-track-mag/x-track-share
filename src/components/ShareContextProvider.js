import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useEventBus } from "./EventBusProvider";
import SharedFolder from "../lib/cloudinary/SharedFolder";

/**
 * @typedef SharedFolderContext
 * @property {Object} folders the navigable shared folders
 * @property {String} current Current path
 * @property {SharedFolder} selectedTracks A virtual folder containing what the user choosed to add to
 * @property {Function} navigate Change the current folder path
 */

const ShareContext = createContext();

/**
 * useShareContext() Hook
 * @return {SharedFolderContext}
 */
export const useShareContext = () => {
	return useContext(ShareContext);
};

export const withShareContext = (Component) => ({
	folders,
	sharedOptions,
	path,
	props
}) => {
	const sharedRoot = path.split("/")[0];

	// There is an option to add selected tracks to a virtual playlist
	const [selectedTracks] = useState(
		new SharedFolder(`${sharedRoot}/selected-tracks`, {
			hidden: true,
			displaySelectedTracks: false
		})
	);
	const [current, setCurrent] = useState(path);
	const router = useRouter();
	const eb = useEventBus();

	const addToSelectedTracks = (track) => {
		selectedTracks.addMedia(track);
	};
	const removeFromSelectedTracks = (track) => {
		selectedTracks.removeMedia(track);
	};

	/**
	 * Use this to navigate between folders inside a shared context root
	 * @param {String} path
	 */
	const navigate = (path) => (evt) => {
		evt.preventDefault();
		router.push(`/share/${path}`, undefined, { shallow: true }); // shallow TRUE will not call getServerSideProps
	};

	/**
	 * Detect the router path changes to set the new current path inside the shared context root
	 * @param {String} path
	 */
	const handlePathChange = (path) => {
		const sharedPath = path.replace("/share/", "");
		console.log(`router handlePathChange() : ${current} => ${sharedPath} `);
		if (sharedPath !== current) {
			setCurrent(sharedPath);
		}
	};

	useEffect(() => {
		eb.on("selected-tracks:add", addToSelectedTracks);
		eb.on("selected-tracks:remove", removeFromSelectedTracks);
		router.events.on("routeChangeComplete", handlePathChange);
		return () => {
			console.log(`Unregistering SharedContext event handler`);
			eb.off("selected-tracks:add", addToSelectedTracks);
			eb.off("selected-tracks:remove", removeFromSelectedTracks);
			router.events.off("routeChangeComplete", handlePathChange);
		};
	}, [current]);

	return (
		<ShareContext.Provider
			value={{ folders, sharedOptions, current, selectedTracks, navigate }}
		>
			<Component {...props} />
		</ShareContext.Provider>
	);
};
