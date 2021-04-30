import { useState } from "react";
import CloudinaryFolder from "./CloudinaryFolder";

const findCurrent = (root, p) => {
	const current = root.folders[p];
	if (!current) return root;
};

const ShareContext = createContext();

const CloudinaryExplorer = (rootFolder, path = "/") => {
	const [current, setCurrent] = useState(path);
	const currentFolder = findCurrent(root, current);
	return <CloudinaryFolder {...currentFolder} />;
};
