import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgPlusProps
 * @property {CSSColor} [color="inherit"]
 * @property {CSSSize} [size="64px"] Size of the rendered viewport
 */

/**
 * Render a rectangle with and upload arrow
 * @param {SvgPlusProps} props
 */
const SvgPlus = ({ color = "inherit", size = "64px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 32 32" {...props}>
		<path
			fill={color}
			d="m 14,2 h 4 v 12 h 12 v 4 H 18 v 12 h -4 v -12 H 2 v -4 h 12 z"
		/>
	</Icon>
);

export default SvgPlus;
