import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";

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

export const withShareContext = (Component) => ({ folders, path, props }) => {
	const [current, setCurrent] = useState(path);
	const router = useRouter();

	const navigate = (path) => (evt) => {
		evt.preventDefault();
		setCurrent(path);
		router.push(`/share/${path}`, undefined, { shallow: true });
	};

	return (
		<ShareContext.Provider value={{ folders, current, setCurrent, navigate }}>
			<Component folders={folders} current={current} {...props} />
		</ShareContext.Provider>
	);
};
