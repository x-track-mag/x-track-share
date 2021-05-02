import { createContext, useContext, useState } from "react";
import CloudinaryFolder from "./CloudinaryFolder";

/**
 * @typedef SharedFolderContext
 * @property {Object} folders
 * @property {String} current Current path
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

const CloudinaryExplorer = ({ folders, path = "" }) => {
	const [current, setCurrent] = useState(path);
	const currentFolder = folders[current];
	console.log(`Exploring ${current}`, currentFolder);
	return (
		<ShareContext.Provider value={{ folders, current, setCurrent }}>
			<CloudinaryFolder {...currentFolder} />
		</ShareContext.Provider>
	);
};

export default CloudinaryExplorer;
