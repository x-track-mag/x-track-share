import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgBinProps
 * @property {CSSColor} [color="inherit"]
 * @property {CSSSize} [size="18px"] Size of the rendered viewport
 */

/**
 * Render a bin (trashcan) symbol
 * @param {SvgBinProps} props
 */
const SvgBin = ({ color = "inherit", size = "18px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 32 32" {...props}>
		<path fill={color} d="m 7,27 h 18 v -19 h 3 v -3 l -9,-1 h -6 l -9,1 v 3 h 3 z" />
	</Icon>
);

export default SvgBin;
