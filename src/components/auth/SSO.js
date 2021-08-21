import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../../lib/firebase/client.js";

// Configure FirebaseUI.
const _DEFAULT_CONFIG = {
	// Redirect to / after successful sign-in. Alternatively you can provide a callbacks.signInSuccess function.
	signInSuccessUrl: "/_admin",
	// Will display every auth providers.
	signInOptions: [firebase.auth.GithubAuthProvider.PROVIDER_ID]
};

/**
 * Single Sign On component
 * using Github authentification
 * @param {firebaseui.auth.Config} ssoConfig
 */
const SSO = (ssoConfig) => {
	return (
		<StyledFirebaseAuth
			uiConfig={{ ..._DEFAULT_CONFIG, ...ssoConfig }}
			firebaseAuth={firebase.auth()}
		/>
	);
};

export default SSO;
