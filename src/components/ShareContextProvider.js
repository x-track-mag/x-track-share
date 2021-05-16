import { createContext, useContext, useEffect, useState } from "react";
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

	/**
	 * Use this to navigate between folders inside a shared context root
	 * @param {String} path
	 */
	const navigate = (path) => (evt) => {
		evt.preventDefault();
		router.push(`/share/${path}`, undefined, { shallow: true });
	};

	/**
	 * Detect the path changes to set the new current path inside the shared context root
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
		router.events.on("routeChangeComplete", handlePathChange);
		return () => {
			console.log(`Unregistering router event handler`);
			router.events.off("routeChangeComplete", handlePathChange);
		};
	}, [current]);

	return (
		<ShareContext.Provider value={{ folders, current, setCurrent, navigate }}>
			<Component folders={folders} current={current} {...props} />
		</ShareContext.Provider>
	);
};
