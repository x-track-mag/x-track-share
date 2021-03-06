import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgLinkProps
 * @property {CSSColor} [color="currentColor"]
 * @property {CSSSize} [size="18px"] Size of the rendered viewport
 */

/**
 * Render a link symbol
 * @param {SvgLinkProps} props
 */
const SvgLink = ({ color = "currentColor", size = "18px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 32 32" {...props}>
		<g
			style={{
				fill: "none",
				stroke: color,
				strokeWidth: 2.5
			}}
		>
			<rect x="2" y="12" height="8" width="16" ry="5" />
			<rect x="14.5" y="12" height="8" width="16" ry="5" />
		</g>
	</Icon>
);

export default SvgLink;
