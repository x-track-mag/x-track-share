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
const SvgMicrosoftLogo = ({ bgColor, size = "24px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 48 48" {...props}>
		{bgColor && <path fill={bgColor} d="M0 0h48v48H0z" />}
		<path fill="#F25022" d="M10 10h13.263v13.263H10z" />
		<path fill="#00A4EF" d="M10 24.737h13.263V38H10z" />
		<path fill="#7FBA00" d="M24.737 10H38v13.263H24.737z" />
		<path fill="#FFB900" d="M24.737 24.737H38V38H24.737z" />
	</Icon>
);

export default SvgMicrosoftLogo;
