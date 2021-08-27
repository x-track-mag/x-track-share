import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useEventBus } from "./EventBusProvider";
import SharedFolder from "../lib/cloudinary/SharedFolder";

/**
 * @typedef SharedOptions
 * @property {Boolean} addToSelection Show the checkboxes to add track to a private selection
 * @property {Boolean} directDownload Allow direct download on all tracks
 * @property {Boolean} displayDownloadForm Display the download form to download a zip of the selected tracks
 */

/**
 * @typedef SharedFolderContext
 * @property {Object} folders the navigable shared folders
 * @property {SharedOptions} sharedOptions
 * @property {String} current Current path
 * @property {Function} navigate Change the current folder path
 * @property {SharedFolder} selectedTracks A virtual folder containing what the user added to
 * @property {Number} timestamp  Latest modification timestamp (only selected tracks change)
 * @property {Function} refresh  Force the refresh of the components
 */

const SharedFolderContext = createContext();

/**
 * useShareContext() Hook
 * @return {SharedFolderContext}
 */
export const useSharedFolderContext = () => {
	return useContext(SharedFolderContext);
};

export const withSharedFolderContext = (Component) => ({
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
	const [timestamp, setTimestamp] = useState(Date.now());
	const router = useRouter();
	const eb = useEventBus();

	const refresh = () => setTimestamp(Date.now());
	const addToSelectedTracks = (track) => {
		selectedTracks.addMedia(track);
		refresh();
	};
	const removeFromSelectedTracks = (track) => {
		selectedTracks.removeMedia(track);
		refresh();
	};

	/**
	 * Use this to navigate between folders inside a shared context root
	 * @param {String} path
	 */
	const navigate = (path) => (evt) => {
		evt.preventDefault();
		console.log(`NAVIGATE TO ${path}`);
		router.push(path, undefined, { shallow: true }); // shallow TRUE will not call getServerSideProps
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
		<SharedFolderContext.Provider
			value={{
				folders,
				sharedOptions,
				current,
				selectedTracks,
				navigate,
				timestamp,
				refresh
			}}
		>
			<Component {...props} />
		</SharedFolderContext.Provider>
	);
};
