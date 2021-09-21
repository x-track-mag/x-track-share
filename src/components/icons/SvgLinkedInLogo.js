import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgLinkedInLogoProps
 * @property {CSSColor} [bgColor="#0a66c2"]
 * @property {CSSColor} [color="white"]
 * @property {CSSSize} [size="24px"] Size of the rendered viewport
 */

/**
 * Render the LinkedIn Logo
 * @param {SvgLinkedInLogoProps} props
 */
const SvgLinkedInLogo = ({
	bgColor = "#0a66c2",
	color = "white",
	size = "24px",
	...props
}) => (
	<Icon height={size} width={size} viewBox="0 0 512 512" {...props}>
		<rect x="0" y="0" width="512" height="512" fill={bgColor} rx="40" />
		<g fill={color} id="letters">
			<circle r="44" cy="114" cx="114" />
			<path d="m 76,191 h 76 V 432 H 76 Z" />
			<path
				id="n"
				d="M 342 185 C 294 185 275 210 272 224 L 271 191 H 199 V 432 H 274 V 302 C 274 293 275 251 319 251 C 360 251 358 301 358 301 V 432 H 433 C 433 432 433 321 434 288 C 433 230 411 210 411 210 C 411 210 395 185 342 185 z "
			/>
		</g>
	</Icon>
);

export default SvgLinkedInLogo;
