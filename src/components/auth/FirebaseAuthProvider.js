import {
	browserSessionPersistence,
	getAuth,
	onAuthStateChanged,
	setPersistence,
	signInWithPopup,
	signOut as authSignOut
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import initFirebase from "../../lib/firebase/app";

initFirebase();

/**
 * @typedef AuthenticatedUser
 * @type {Object}
 * @property {String} email
 * @property {String} username
 * @property {String} avatar URL of an image
 */

/**
 * @typedef FirebaseAuthContext
 * @type {Object}
 * @property {AuthenticatedUser} user
 * @property {Boolean} loading
 * @property {String} [error]
 * @property {Function} signIn
 * @property {Function} signOut
 * @property {Function} clear
 */

/**
 * @type FirebaseAuthContext
 */
const FirebaseAuthContext = createContext();

const formatUser = (user) => ({
	email: user.email,
	username: user.displayName,
	avatar: user.photoURL
});

/**
 *
 * @returns {FirebaseAuthContext}
 */
function createAuthContext() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const auth = getAuth();
	setPersistence(auth, browserSessionPersistence);

	const handleAuthChange = async (authState = null) => {
		console.log("handleAuthChange()", authState);
		if (!authState) {
			return;
		}
		const formattedAuth = formatUser(authState);
		setUser(formattedAuth);
		setLoading(false);
	};

	/**
	 * Callback when a user gets signed in
	 * @param {*} response
	 * @param {*} provider
	 */
	const signedIn = async ({ user }, provider) => {
		clear();
		if (!user) {
			setError("No user was returned from the authentication process");
		} else {
			setUser(formatUser(user));
			console.log("Successfully logged", user);
		}
	};

	const clear = () => {
		setError(null);
		setUser(null);
		setLoading(false);
	};

	const signIn = async (provider) => {
		const auth = getAuth();
		console.log("signIn", auth);
		setLoading(true);
		return signInWithPopup(auth, provider)
			.then(signedIn)
			.catch((err) => {
				console.error("AUTHENTIFICATION POPUP FAILED", err);
				clear();
				setError(err.message);
			});
	};

	const signOut = async () => {
		clear();
		const auth = getAuth();
		authSignOut(auth).catch((err) => {
			setError(err.message);
		});
	};

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
		return () => unsubscribe();
	}, []);

	return {
		user,
		loading,
		error,
		clear,
		signIn,
		signOut
	};
}

const FirebaseAuthProvider = ({ children }) => {
	const authContext = createAuthContext();
	return (
		<FirebaseAuthContext.Provider value={authContext}>
			{children}
		</FirebaseAuthContext.Provider>
	);
};

export default FirebaseAuthProvider;

/**
 *
 * @returns {FirebaseAuthContext}
 */
export const useAuth = () => {
	const authContext = useContext(FirebaseAuthContext);

	if (!authContext) {
		throw new Error(
			"useAuth() hook should only be used from inbside a <FirebaseAuthProvider>"
		);
	}
	return authContext;
};
