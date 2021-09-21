import FacebookLogo from "./SvgFacebookLogo.js";
import GithubLogo from "./SvgGithubLogo.js";
import GoogleLogo from "./SvgGoogleLogo.js";
import LinkedInLogo from "./SvgLinkedInLogo.js";
import MicrosoftLogo from "./SvgMicrosoftLogo.js";
import TwitterLogo from "./SvgTwitterLogo.js";

/**
 *
 * @param {String} name In lowercase. ie.  "google"
 */
const BrandLogo = ({ name, ...props }) => {
	switch (name) {
		case "facebook":
			return <FacebookLogo {...props} />;
		case "google":
			return <GoogleLogo {...props} />;
		case "github":
			return <GithubLogo {...props} />;
		case "linkedin":
			return <LinkedInLogo {...props} />;
		case "microsoft":
			return <MicrosoftLogo {...props} />;
		case "twitter":
			return <TwitterLogo {...props} />;

		default:
			return null;
	}
};
export default BrandLogo;
