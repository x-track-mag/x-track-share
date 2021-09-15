import ArrayExtensions from "../utils/Arrays.js";
ArrayExtensions();

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
function AdminFolder(path, options = {}) {
	this.path = path;
	this.label = path.split("/").last();
	this.subfolders = [];
	this.playlist = {};
	this.playlistIndex = [];
	Object.assign(this, options);
}

AdminFolder.prototype = {
	addMedia: function (media) {
		const mediaName = media.path.split("/").pop();
		this.playlist[mediaName] = media;
		this.playlistIndex.push(mediaName);
		return this;
	},
	reorderMedia: function (fromIndex, toIndex) {
		if (isAudio(media)) {
			return this.removeAudio(media);
		} else if (isVideo(media)) {
			return this.removeVideo(media);
		}
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

export default AdminFolder;
