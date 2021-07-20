import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgUploadProps
 * @property {CSSColor} [color="inherit"]
 * @property {CSSSize} [size="64px"] Size of the rendered viewport
 */

/**
 * Render an equilateral triangle pointing up, down, right or left
 * @param {SvgUploadProps} props
 */
const SvgUpload = ({ color = "inherit", size = "64px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 48 48" {...props}>
		<rect x="5" y="13" width="38" height="25" style="fill:#0000ff;" />
		<path
			style="fill:#ffff00;stroke:#ffff00;stroke-width:1px;"
			d="m 24,25 -6,6 1,1 4,-4 v 12 h 2 v -12 l 4,4 1,-1 z"
		/>
	</Icon>
);

export default SvgUpload;
