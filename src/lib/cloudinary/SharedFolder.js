import ArrayExtensions from "../utils/Arrays.js";

const audio_formats = ["wav", "mp3", "aac", "ogg"];
const video_formats = ["mp4", "mpg", "mpeg", "avi", "mov", "mkv", "qt", "wmv", "asf"];

function isVideo(media) {
	return video_formats.includes(media.format);
}
function isAudio(media) {
	return audio_formats.includes(media.format);
}

/**
 * Access the media shared in a folder
 * @param {*} path
 * @param {*} options
 */
function SharedFolder(path, options = {}) {
	this.path = path;
	this.label = path.split("/").last();
	this.subfolders = [];
	this.audios = [];
	this.videos = [];
	Object.assign(this, options);
}

SharedFolder.prototype = {
	addMedia: function (media) {
		if (isAudio(media) && !this.containsAudio(media)) {
			return this.addAudio(media);
		} else if (isVideo(media) && !this.containsVideo(media)) {
			return this.addVideo(media);
		}
		return this;
	},
	addAudio: function (media) {
		media.index = this.audios.length;
		this.audios.push(media);
		return this;
	},
	addVideo: function (media) {
		media.index = this.videos.length;
		(media.publicId = media.public_id), // GLITCH : The Video Player require publicId instead of public_id !
			this.videos.push(media);
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
		const pos = this.audios.findIndex((row) => row.public_id === media.public_id);
		this.audios.splice(pos, 1);
		return this;
	},
	removeVideo: function (media) {
		const pos = this.videos.findIndex((row) => row.public_id === media.public_id);
		this.videos.splice(pos, 1);
		return this;
	},
	containsAudio: function (search) {
		return Boolean(this.audios.find((media) => media.public_id === search.public_id));
	},
	containsVideo: function (search) {
		return Boolean(this.videos.find((media) => media.public_id === search.public_id));
	},
	containsMedia: function (media) {
		return isAudio(media) ? this.containsAudio(media) : this.containsVideo(media);
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
