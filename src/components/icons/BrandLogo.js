export { default as GithubLogo } from "./SvgGithubLogo.js";
export { default as GoogleLogo } from "./SvgGoogleLogo.js";
export { default as MicrosoftLogo } from "./SvgMicrosoftLogo.js";
export { default as TwitterLogo } from "./SvgTwitterLogo.js";

/**
 *
 * @param {String} name In lowercase. ie.  "google"
 */
const BrandLogo = ({ name, ...props }) => {
	switch (name) {
		case "google":
			return <GoogleLogo {...props} />;
		case "github":
			return <GithubLogo {...props} />;
		case "microsoft":
			return <MicrosoftLogo {...props} />;
		case "twitter":
			return <TwitterLogo {...props} />;

		default:
			return null;
	}
};
export default BrandLogo;
