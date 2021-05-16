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

	const handlePathChange = (path) => {
		const sharedPath = path.replace("/share/", "");
		console.log(`router handlePathChange() : ${current} => ${sharedPath} `);
		if (sharedPath !== current) {
			setCurrent(sharedPath);
		}
	};

	const navigate = (path) => (evt) => {
		evt.preventDefault();
		router.push(`/share/${path}`, undefined, { shallow: true });
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
