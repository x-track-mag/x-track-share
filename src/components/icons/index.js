export { default as Bin } from "./SvgBin.js";
export { default as GithubLogo } from "./SvgGithubLogo.js";
export { default as GoogleLogo } from "./SvgGoogleLogo.js";
export { default as LinkIcon } from "./SvgLink.js";
export { default as XtrackLogo } from "./SvgLogo.js";
export { default as MicrosoftLogo } from "./SvgMicrosoftLogo.js";
export { default as PlusIcon } from "./SvgPlus.js";
export { default as Triangle } from "./SvgTriangle.js";
export { default as TwitterLogo } from "./SvgTwitterLogo.js";
export { default as UploadIcon } from "./SvgUpload.js";

const Icon = ({ name, ...props }) => {
	switch (name) {
		case "Bin":
			return <Bin {...props} />;
		case "GithubLogo":
			return <GithubLogo {...props} />;
		case "GoogleLogo":
			return <GoogleLogo {...props} />;
		case "MicrosoftLogo":
			return <MicrosoftLogo {...props} />;
		case "TwitterLogo":
			return <TwitterLogo {...props} />;
		case "Triangle":
			return <Triangle {...props} />;
		case "UploadIcon":
			return <UploadIcon {...props} />;
		case "PlusIcon":
			return <PlusIcon {...props} />;
		case "LinkIcon":
			return <LinkIcon {...props} />;

		default:
			return null;
	}
};
export default Icon;
