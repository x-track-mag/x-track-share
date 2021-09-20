import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgTwitterLogoProps
 * @property {CSSColor} [bgColor="#1da1f2"]
 * @property {CSSColor} [color="white"]
 * @property {CSSSize} [size="24px"] Size of the rendered viewport
 */

/**
 * Render the Twitter Logo
 * @param {SvgTwitterLogoProps} props
 */
const SvgTwitterLogo = ({
	bgColor = "#1da1f2",
	color = "white",
	size = "24px",
	...props
}) => (
	<Icon height={size} width={size} viewBox="0 0 512 512" {...props}>
		<rect width="512" height="512" fill={bgColor} rx="15%" />
		<path
			fill={color}
			d="M437 152c-12 6-26 10-40 12 15-9 26-23 32-40-14 8-29 14-45 17a72 72 0 0 0-122 65c-56-3-110-29-145-74a68 68 0 0 0 22 94c-11 0-22-2-32-7 1 33 24 62 56 69-10 3-21 3-32 1 10 29 37 49 67 50-29 24-68 35-105 29a199 199 0 0 0 309-179c14-10 26-22 35-37"
		/>
	</Icon>
);

export default SvgTwitterLogo;
