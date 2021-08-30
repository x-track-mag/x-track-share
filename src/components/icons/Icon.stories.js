// Icon.stories.js
import Icon, {
	UploadIcon,
	PlusIcon,
	Bin,
	Triangle,
	GithubLogo,
	GoogleLogo,
	MicrosoftLogo
} from "./index";

// This default export determines where your story goes in the story list
export default {
	title: "SVG Icons",
	component: Icon,
	args: {
		name: "Bin",
		size: 256,
		color: "#18b761",
		bgColor: null
	},
	argTypes: {
		name: {
			control: {
				type: "select",
				options: [
					"Bin",
					"Logo",
					"Triangle",
					"Plus",
					"Upload",
					"GithubLogo",
					"GoogleLogo",
					"MicrosoftLogo"
				]
			}
		},
		size: { control: { type: "number" } },
		color: { control: { type: "color" } },
		bgColor: { control: { type: "color" } }
	}
};

export const DisplayTriangleIcon = ({ ...args }) => <Triangle {...args} />;
export const DisplayGithubLogoIcon = ({ ...args }) => <GithubLogo {...args} />;
export const DisplayGoogleLogoIcon = ({ ...args }) => <GoogleLogo {...args} />;
export const DisplayMicrosoftLogoIcon = ({ ...args }) => <MicrosoftLogo {...args} />;
export const DisplayBinIcon = ({ ...args }) => <Bin {...args} />;
export const DisplayUploadIcon = ({ ...args }) => <UploadIcon {...args} />;
export const DisplayPlusIcon = ({ ...args }) => <PlusIcon {...args} />;

// export const DisplaySVGIcon = ({ ...args }) => (
// 	<Center>
// 		<Icon name="Bin" size={256} {...args} />{" "}
// 	</Center>
// );
