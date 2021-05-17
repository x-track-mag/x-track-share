/**
 * X-TRACK MAG LOGO
 * @param {JSXElement} props
 * @param {String} [props.color="#000"] a valid CSS color
 * @param {String} [props.size="300px"] a valid CSS size unit
 */
const SvgLogo = ({ size = "15rem", color = "#000" }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 480 80"
		width={size}
		height="auto"
	>
		<g transform="translate(-21 -62)" fill={color}>
			<g id="x-track-letters">
				<path
					id="x"
					d="M45.35 62.26L39 76.23l-6.32-14H22.9l11.4 21.98-12.51 24.87h9L39 91.89l8.24 17.19h9L43.72 84.21l11.4-21.95z"
				/>
				<path id="dot" d="M68.34 62.26h23.25v46.83H68.34z" />
				<path id="t" d="M104.36 62.26v8.63h9.71v38.2h8.18v-38.2h9.83v-8.63z" />
				<path
					id="r"
					d="M177 77.48c0-6.15-1.64-15.22-15.85-15.22H147.4v46.83h8.3V90.43l12.22 18.66H179l-13-17.34c9.54-.88 11-8.71 11-14.27m-21.3 6.58V70.89h5.79c5.85 0 7 3.66 7 6.73 0 3.07-1.17 6.44-7 6.44z"
				/>
				<path
					id="a"
					d="M203.36 62.26l-13.28 46.83h8.72l2.16-8.34H217l2.05 8.34h8.77l-13.18-46.83zM203 93.21l6.08-23 6 23z"
				/>
				<path
					id="c"
					d="M257.22 101c-7.6 0-9-6.73-9-15.37 0-8.64 1.34-15.36 9-15.36 5.9 0 7.95 3.87 8.48 9.58h8.48c0-9.66-4.57-18.22-17-18.22-14.1 0-17.31 11.2-17.31 24s3 24 17.31 24c12.57 0 17-8 17-18.29h-8.54c-.58 5.85-2.51 9.66-8.47 9.66"
				/>
				<path
					id="k"
					d="M316.82 109.09h9.42l-15.61-24.51 14.73-22.32h-9.47l-11.66 18.41h-4.73V62.26h-8.3v46.83h8.3V89.2h4.73z"
				/>
			</g>
		</g>
	</svg>
);

export default SvgLogo;
