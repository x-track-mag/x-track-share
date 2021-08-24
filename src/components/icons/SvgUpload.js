import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgUploadProps
 * @property {CSSColor} [color="inherit"]
 * @property {CSSSize} [size="64px"] Size of the rendered viewport
 */

/**
 * Render a rectangle with and upload arrow
 * @param {SvgUploadProps} props
 */
const SvgUpload = ({ color = "inherit", bgColor = "#444", size = "64px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 48 48" {...props}>
		<rect x="5" y="13" width="38" height="25" fill={bgColor} />
		<path
			strokeWidth="1px"
			stroke={color}
			fill={color}
			d="m 24,25 -6,6 1,1 4,-4 v 12 h 2 v -12 l 4,4 1,-1 z"
		/>
	</Icon>
);

export default SvgUpload;
