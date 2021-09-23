import {
	FacebookAuthProvider,
	GithubAuthProvider,
	GoogleAuthProvider,
	OAuthProvider
} from "firebase/auth";

export const getGoogleProvider = () => {
	return new GoogleAuthProvider();
};

export const getGithubProvider = (params) => {
	const provider = new GithubAuthProvider();
	if (params) {
		provider.setCustomParameters(params);
	}
	return provider;
};

export const getFacebookProvider = (params) => {
	const provider = new FacebookAuthProvider();
	if (params) {
		provider.setCustomParameters(params);
	}
	return provider;
};

export const getMicrosoftProvider = (params = {}) => {
	const provider = new OAuthProvider("microsoft.com");
	const { tenant } = params;

	provider.setCustomParameters({
		// Optional "tenant" parameter in case you are using an Azure AD tenant.
		// eg. '8eaef023-2b34-4da1-9baa-8bc8c9d6a490' or 'contoso.onmicrosoft.com'
		// or "common" for tenant-independent tokens.
		// The default value is "common".
		tenant: "x-track.net"
	});
	// if (tenant) {
	// }

	return provider;
};

const ProviderFactory = {
	getProvider: (name, params) => {
		switch (name) {
			case "facebook":
				return getFacebookProvider(params);
			case "google":
				return getGoogleProvider(params);
			case "github":
				return getGithubProvider(params);
			case "microsoft":
				return getMicrosoftProvider(params);

			default:
				break;
		}
	}
};

export default ProviderFactory;
