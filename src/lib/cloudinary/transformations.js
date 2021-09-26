import { ImageTransformation } from "@cloudinary/base";
import { format, quality } from "@cloudinary/base/actions/delivery";
import { limitFill } from "@cloudinary/base/actions/resize";
import { auto as autoFormat } from "@cloudinary/base/values/format";
import { auto as autoQuality } from "@cloudinary/base/values/quality";

/**
 * @typedef ImageWithRatioProps
 * @property {Number} width
 * @property {Number} ratio
 */

/**
 * Deliver an image that will fit inside the desired width and with the specified ratio
 * @param ImageWithRatioProps
 * @return {ImageTransformation}
 */
export const imageWithRatio = ({ width, ratio = 4 / 3 }) =>
	new ImageTransformation()
		.delivery(format(autoFormat()))
		.delivery(quality(autoQuality()))
		.resize(limitFill(width, width / ratio));
