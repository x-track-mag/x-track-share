import ArrayExtensions from "../utils/Arrays.js";

const audio_formats = ["wav", "mp3", "aac", "ogg"];
const video_formats = ["mp4", "mpg", "mpeg", "avi", "mov", "mkv", "qt", "wmv", "asf"];

function isVideo(media) {
	return video_formats.includes(media.format);
}
function isAudio(media) {
	return audio_formats.includes(media.format);
}

function SharedFolder(path, options = {}) {
	console.log(`Creation of playlist ${path}`);
	this.path = path;
	this.label = path.split("/").last();
	this.subfolders = [];
	this.audios = [];
	this.videos = [];
	Object.assign(this, options);
}

SharedFolder.prototype = {
	addMedia: function (media) {
		if (isAudio(media)) {
			return this.addAudio(media);
		} else if (isVideo(media)) {
			return this.addVideo(media);
		}
		return this;
	},
	addAudio: function (media) {
		media.index = this.audios.length;
		this.audios.push(media);
		console.log(`Add audio to ${this.path}`, this);
		return this;
	},
	addVideo: function (media) {
		media.index = this.videos.length;
		this.videos.push(media);
		console.log(`Add video to ${this.path}`, this);
		return this;
	},
	removeMedia: function (media) {
		console.log(`Remove media`, media);
		if (isAudio(media)) {
			return this.removeAudio(media);
		} else if (isVideo(media)) {
			return this.removeVideo(media);
		}
		return this;
	},
	removeAudio: function (media) {
		const pos = this.audios.findIndex((row) => row.assetId === media.assetId);
		this.audios.splice(pos, 1);
		return this;
	},
	removeVideo: function (media) {
		const pos = this.videos.findIndex((row) => row.assetId === media.assetId);
		this.videos.splice(pos, 1);
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

export default SharedFolder;
