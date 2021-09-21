import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgMicrosoftLogoProps
 * @property {CSSColor} [bgColor]
 * @property {CSSSize} [size="24px"] Size of the rendered viewport
 */

/**
 * Render the Microsoft Logo
 * @param {SvgMicrosoftLogoProps} props
 */
const SvgMicrosoftLogo = ({ size = "24px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 128 128" {...props}>
		<path d="M4,4v58h58v-58Z" fill="#F25022" />
		<path d="M66,4v58h58v-58Z" fill="#7FBA00" />
		<path d="M4,66v58h58v-58Z" fill="#00A4EF" />
		<path d="M66,66v58h58v-58Z" fill="#FFB900" />
	</Icon>
);

export default SvgMicrosoftLogo;
