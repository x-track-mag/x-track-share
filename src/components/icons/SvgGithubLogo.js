import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgGithubLogoProps
 * @property {CSSColor} [color="#161514"]
 * @property {CSSColor} [bgColor]
 * @property {CSSSize} [size="24px"] Size of the rendered viewport
 */

/**
 * Render the Github Logo
 * @param {SvgGithubLogoProps} props
 */
const SvgGithubLogo = ({ bgColor, color = "#161514", size = "24px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 48 48" {...props}>
		{bgColor && <path fill={bgColor} d="M0 0h48v48H0z" />}
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M23.998 8C15.165 8 8 15.135 8 23.937c0 7.04 4.584 13.013 10.942 15.12.8.147 1.092-.345 1.092-.768 0-.377-.014-1.38-.021-2.71-4.45.963-5.39-2.136-5.39-2.136-.728-1.841-1.777-2.331-1.777-2.331-1.452-.988.11-.969.11-.969 1.606.113 2.451 1.643 2.451 1.643 1.427 2.435 3.745 1.731 4.657 1.323.145-1.029.559-1.731 1.015-2.13-3.552-.401-7.288-1.77-7.288-7.876 0-1.74.624-3.163 1.647-4.276-.165-.403-.714-2.024.158-4.218 0 0 1.342-.428 4.399 1.634A15.378 15.378 0 0 1 24 15.706c1.36.007 2.728.183 4.006.537 3.055-2.062 4.395-1.633 4.395-1.633.874 2.193.325 3.814.16 4.217 1.026 1.113 1.645 2.537 1.645 4.276 0 6.122-3.742 7.47-7.305 7.864.574.492 1.085 1.464 1.085 2.951 0 2.13-.02 3.85-.02 4.371 0 .427.29.923 1.1.767C35.42 36.944 40 30.977 40 23.937 40 15.136 32.836 8 23.998 8z"
			fill={color}
		/>
	</Icon>
);

export default SvgGithubLogo;
