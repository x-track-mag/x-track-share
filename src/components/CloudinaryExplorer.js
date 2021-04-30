import { createContext, useState } from "react";
import CloudinaryFolder from "./CloudinaryFolder";

const ShareContext = createContext();

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
