const audio_formats = ["wav", "mp3", "aac", "ogg"];
const video_formats = ["mp4", "mpg", "mpeg", "avi", "mov", "mkv", "qt", "wmv", "asf"];

function isVideo(media) {
	return video_formats.includes(media.format);
}
function isAudio(media) {
	return audio_formats.includes(media.format);
}

function CloudinaryFolder(label) {
	this.label = label;
	this.folders = {};
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
	 *
	 * @param {String} name (or path)
	 * @param {Boolean} [create=true] Create the sub folder if it doesn't exist
	 * @returns {CloudinaryFolder}
	 */
	getFolder: function (name, create = true) {
		if (name.indexOf("/") !== -1) {
			// It's a path : take the first part of it
			const path = name.split("/");
			const firstStep = path.shift();
			const subFolder = this.getFolder(firstStep, true);
			return subFolder.getFolder(path.join("/"), true);
		} else if (this.folders[name] === undefined && create) {
			// If it doesn't exist : create it
			this.folders[name] = new CloudinaryFolder(name);
		}

		return this.folders[name];
	}
};

export default CloudinaryFolder;
