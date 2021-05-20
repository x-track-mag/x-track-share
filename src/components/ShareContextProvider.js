import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useEventBus } from "./EventBusProvider";
import SharedFolder from "../lib/cloudinary/SharedFolder";

/**
 * @typedef SharedFolderContext
 * @property {Object} folders the navigable shared folders
 * @property {String} current Current path
 * @property {SharedFolder} playlist A virtual folder containing what the user choosed to add to
 * @property {Function} setCurrent Change the current folder path
 */

const ShareContext = createContext();

/**
 * useShareContext() Hook
 * @return {SharedFolderContext}
 */
export const useShareContext = () => {
	return useContext(ShareContext);
};

export const withShareContext = (Component) => ({ folders, path, props }) => {
	const sharedRoot = path.split("/")[0];
	Object.keys(folders).forEach((key) => (folders[key].displayPlaylist = true));
	const [playlist] = useState(
		new SharedFolder(`${sharedRoot}/playlist`, {
			hidden: true,
			displayPlaylist: false
		})
	);
	const [current, setCurrent] = useState(path);
	const router = useRouter();
	const eb = useEventBus();

	const addToPlaylist = (track) => {
		playlist.addMedia(track);
	};
	const removeFromPlaylist = (track) => {
		playlist.removeMedia(track);
	};

	/**
	 * Use this to navigate between folders inside a shared context root
	 * @param {String} path
	 */
	const navigate = (path) => (evt) => {
		evt.preventDefault();
		router.push(`/share/${path}`, undefined, { shallow: true });
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
		eb.on("playlist:add", addToPlaylist);
		eb.on("playlist:remove", removeFromPlaylist);
		router.events.on("routeChangeComplete", handlePathChange);
		return () => {
			console.log(`Unregistering SharedContext event handler`);
			eb.off("playlist:add", addToPlaylist);
			eb.off("playlist:remove", removeFromPlaylist);
			router.events.off("routeChangeComplete", handlePathChange);
		};
	}, [current]);

	return (
		<ShareContext.Provider value={{ folders, current, playlist, navigate }}>
			<Component {...props} />
		</ShareContext.Provider>
	);
};
