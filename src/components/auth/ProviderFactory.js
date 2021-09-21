import { GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const getGoogleProvider = () => {
	return new GoogleAuthProvider();
};

const getMicrosoftProvider = (params = {}) => {
	const provider = new OAuthProvider("microsoft.com");
	const { tenant } = params;

	if (tenant) {
		provider.setCustomParameters({
			// Optional "tenant" parameter in case you are using an Azure AD tenant.
			// eg. '8eaef023-2b34-4da1-9baa-8bc8c9d6a490' or 'contoso.onmicrosoft.com'
			// or "common" for tenant-independent tokens.
			// The default value is "common".
			tenant
		});
	}

	return provider;
};

const ProviderFactory = {
	getGoogleProvider,
	getMicrosoftProvider,
	getProvider: (name, params) => {
		switch (name) {
			case "google":
				return getGoogleProvider(params);
			case "microsoft":
				return getMicrosoftProvider(params);

			default:
				break;
		}
	}
};

export default ProviderFactory;
