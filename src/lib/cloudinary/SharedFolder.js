import ArrayExtensions from "../utils/Arrays.js";
ArrayExtensions();

export const SHARED_SETTINGS_DEFAULTS = {
	download_links: false,
	download_zip: false,
	download_form: false
};

// These are the formats that are accepted by Cloudinary as upload
const UPLOAD_AUDIO_FORMATS = ["wav", "mp3", "m4a", "ogg"];
const UPLOAD_VIDEO_FORMATS = [
	"mp4",
	"mpg",
	"mpeg",
	"avi",
	"mov",
	"mkv",
	"qt",
	"wmv",
	"asf"
];

// Exported audio formats are the same
export const DOWNLOAD_AUDIO_FORMATS = UPLOAD_AUDIO_FORMATS;
// But we only allow mp4 video download
export const DOWNLOAD_VIDEO_FORMATS = ["mp4"];

function isVideo(media) {
	return UPLOAD_VIDEO_FORMATS.includes(media.format);
}
function isAudio(media) {
	return UPLOAD_AUDIO_FORMATS.includes(media.format);
}

/**
 * @typedef SharedFolder
 * @property {Function} addMedia
 * @property {Function} getAllMediaIds
 * @property {Function} addAudio
 * @property {Function} addVideo
 */

/**
 * Access the media shared in a folder
 * @param {String} path
 * @param {Object} options
 */
function SharedFolder(path, options = {}) {
	this.path = path;
	this.label = path.split("/").last();
	this.subfolders = [];
	this.audios = [];
	this.videos = [];
	this.others = [];
	this.settings = { ...SHARED_SETTINGS_DEFAULTS };
	Object.assign(this, options);
}

SharedFolder.prototype = {
	addResource: function (file) {
		if (isAudio(file) && !this.containsAudio(file)) {
			return this.addAudio(file);
		} else if (isVideo(file) && !this.containsVideo(file)) {
			return this.addVideo(file);
		} else {
			return this.addOtherFile(file);
		}
	},
	getAllMediaIds: function () {
		return [
			...this.audios.map((audio) => audio.public_id),
			...this.videos.map((video) => video.public_id),
			...this.others.map((file) => file.public_id)
		];
	},
	addAudio: function (media) {
		media.index = this.audios.length;
		this.audios.push(media);
		return this;
	},
	addVideo: function (media) {
		media.index = this.videos.length;
		this.videos.push(media);
		return this;
	},
	addOtherFile: function (somethingElse) {
		this.others.push(somethingElse);
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
