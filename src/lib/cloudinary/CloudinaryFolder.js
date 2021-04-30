import ArrayExtensions from "../utils/Arrays.js";

const audio_formats = ["wav", "mp3", "aac", "ogg"];
const video_formats = ["mp4", "mpg", "mpeg", "avi", "mov", "mkv", "qt", "wmv", "asf"];

function isVideo(media) {
	return video_formats.includes(media.format);
}
function isAudio(media) {
	return audio_formats.includes(media.format);
}

function CloudinaryFolder(path) {
	this.path = path;
	this.label = path.split("/").last();
	this.subfolders = [];
	this.audios = [];
	this.videos = [];
}

CloudinaryFolder.prototype = {
	addMedia: function (media) {
		if (isAudio(media)) {
			return this.addAudio(media);
		} else if (isVideo(media)) {
			return this.addVideo(media);
		}
		return this;
	},
	addAudio: function (media) {
		this.audios.push(media);
		return this;
	},
	addVideo: function (media) {
		this.videos.push(media);
		return this;
	},
	/**
	 * @returns {String} the path to the parent folder
	 */
	getParentFolder: function () {
		const path = this.path.split("/");
		path.pop();
		return path.join("/");
	}
};

export default CloudinaryFolder;
