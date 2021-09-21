// Icon.stories.js
import Icon, {
	Bin,
	FacebookLogo,
	GithubLogo,
	GoogleLogo,
	LinkedInLogo,
	LinkIcon,
	MicrosoftLogo,
	PlusIcon,
	Triangle,
	TwitterLogo,
	UploadIcon
} from "./index";

// This default export determines where your story goes in the story list
export default {
	title: "SVG Icons",
	component: Icon,
	args: {
		name: "Bin",
		size: 256
	},
	argTypes: {
		name: {
			control: {
				type: "select",
				options: [
					"Bin",
					"LinkIcon",
					"Logo",
					"Triangle",
					"Plus",
					"Upload",
					"GithubLogo",
					"FacebookLogo",
					"LinkedInLogo",
					"GoogleLogo",
					"MicrosoftLogo",
					"TwitterLogo"
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
export const DisplayFacebookLogoIcon = ({ ...args }) => <FacebookLogo {...args} />;
export const DisplayMicrosoftLogoIcon = ({ ...args }) => <MicrosoftLogo {...args} />;
export const DisplayLinkedInLogoIcon = ({ ...args }) => <LinkedInLogo {...args} />;
export const DisplayTwitterLogoIcon = ({ ...args }) => <TwitterLogo {...args} />;
export const DisplayBinIcon = ({ ...args }) => <Bin {...args} />;
export const DisplayLinkIcon = ({ ...args }) => <LinkIcon {...args} />;
export const DisplayUploadIcon = ({ ...args }) => <UploadIcon {...args} />;
export const DisplayPlusIcon = ({ ...args }) => <PlusIcon {...args} />;

// export const DisplaySVGIcon = ({ ...args }) => (
// 	<Center>
// 		<Icon name="Bin" size={256} {...args} />{" "}
// 	</Center>
// );
