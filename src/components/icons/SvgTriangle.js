import Icon from "@chakra-ui/icon";

const shapes = {
	down: "M 41,9 24,39 7,9 Z",
	right: "M 9,7 39,24 9,41 Z",
	left: "M 39,41 9,24 39,7 Z",
	up: "M 7,39 24,9 41,39 Z"
};

/**
 * @typedef SvgTriangleProps
 * @property {String<up|down|right|left>} [direction="up"]
 * @property {CSSColor} [color="black"]
 * @property {CSSSize} [size="1rem"] Size of the rendered viewport
 */

/**
 * Render an equilateral triangle pointing up, down, right or left
 * @param {SvgTriangleProps} props
 */
const SvgTriangle = ({
	direction = "up",
	color = "inherit",
	size = "18px",
	...props
}) => (
	<Icon height={size} width={size} viewBox="0 0 48 48" {...props}>
		<path fill={color} d={shapes[direction]} />
	</Icon>
);

export default SvgTriangle;
