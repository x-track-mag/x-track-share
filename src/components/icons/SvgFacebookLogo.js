import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgFacebookLogoProps
 * @property {CSSColor} [bgColor="#1da1f2"]
 * @property {CSSColor} [color="white"]
 * @property {CSSSize} [size="24px"] Size of the rendered viewport
 */

/**
 * Render the Facebook Logo
 * @param {SvgFacebookLogoProps} props
 */
const SvgFacebookLogo = ({
	bgColor = "#4267B2",
	color = "white",
	size = "24px",
	...props
}) => (
	<Icon height={size} width={size} viewBox="0 0 500 500" {...props}>
		<rect x="45" y="45" height="420" width="420" rx="40" fill={bgColor} />
		<path
			d="M332 465V299h56l8.4-65h-64.5v-41.5c0-18.8 5.2-31.6 32.18-31.61h34.17v-58c-5.95-.79-26.34-2.55-50.07-2.55-49.55 0-83.4636 30.23-83.46 85.78v47.9h-55.85v65h55.85V465h67.1875z"
			fill={color}
		/>
	</Icon>
);

export default SvgFacebookLogo;
