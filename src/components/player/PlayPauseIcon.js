import Icon from "@chakra-ui/icon";

const PlayPauseIcon = ({
	color = "currentColor",
	show = true,
	playing = false,
	size = "2rem",
	...props
}) => (
	<Icon viewBox="0 0 300 300" width={size} height={size} {...props}>
		{show && (
			<g stroke={color} fill="none">
				<circle cx="150" cy="150" r="140" strokeWidth="8" />
				{playing && (
					<path id="pause" d="M120,70v160M180,70v160" strokeWidth="40" />
				)}
				{!playing && (
					<path id="play" d="M100,70v160l130,-80z" fill={color} stroke="none" />
				)}
			</g>
		)}
	</Icon>
);

export default PlayPauseIcon;
