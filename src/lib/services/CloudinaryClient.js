import { Cloudinary } from "@cloudinary/base";
import APIClient from "./APIClient";

export const getInstance = new Cloudinary({
	cloud: { cloudName: process.env.CLOUDINARY_CLOUD_NAME }
});

/**
 * Shared projects are stored inside cloudinary in the
 * /share/projects.json
 */
export const getSharedProjects = async () => {
	const projects = await APIClient.get(`https://`);
};

/**
 * Return the list of folders inside a shared project
 * @param {String} shareUID
 */
export const getFolders = async (shareUID) => {
	return [];
};

/**
 * Return the list of audio or video files inside a shared folder
 * @param {String} path
 */
export const getFolderContent = async (path) => {
	return {
		audios: [],
		videos: []
	};
};

const CloudinaryClient = {
	getInstance,
	getSharedProjects,
	getFolders,
	getFolderContent
};

export default CloudinaryClient;
