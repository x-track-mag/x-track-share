import Icon from "@chakra-ui/icon";

/**
 * @typedef SvgGoogleLogoProps
 * @property {CSSColor} [bgColor]
 * @property {CSSSize} [size="24px"] Size of the rendered viewport
 */

/**
 * Render a bin (trashcan) symbol
 * @param {SvgGoogleLogoProps} props
 */
const SvgGoogleLogo = ({ bgColor, size = "24px", ...props }) => (
	<Icon height={size} width={size} viewBox="0 0 48 48" {...props}>
		{bgColor && <path fill={bgColor} d="M0 0h48v48H0z" />}
		<path
			d="M39.057 24.353c0-1.315-.106-2.275-.335-3.27H23.845v5.937h8.733c-.176 1.475-1.127 3.697-3.24 5.19l-.03.199 4.705 3.679.326.033c2.992-2.791 4.718-6.897 4.718-11.768z"
			fill="#4285F4"
		/>
		<path
			d="M23.845 39.996c4.278 0 7.87-1.422 10.493-3.875l-5-3.911c-1.338.942-3.134 1.6-5.493 1.6-4.19 0-7.746-2.79-9.014-6.648l-.186.016L9.754 31l-.064.18c2.606 5.225 7.958 8.816 14.155 8.816z"
			fill="#34A853"
		/>
		<path
			d="M14.831 27.162a9.935 9.935 0 0 1-.528-3.164c0-1.102.193-2.169.51-3.164l-.008-.212-4.953-3.883-.162.078A16.139 16.139 0 0 0 8 23.997c0 2.578.616 5.014 1.69 7.182l5.141-4.017z"
			fill="#FBBC05"
		/>
		<path
			d="M23.845 14.186c2.975 0 4.983 1.297 6.127 2.382l4.472-4.409C31.697 9.582 28.124 8 23.845 8c-6.197 0-11.55 3.59-14.155 8.817l5.123 4.017c1.286-3.857 4.842-6.648 9.032-6.648z"
			fill="#EB4335"
		/>
	</Icon>
);

export default SvgGoogleLogo;