import {
	browserSessionPersistence,
	getAuth,
	onAuthStateChanged,
	setPersistence,
	signInWithPopup
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import firebaseApp from "../../lib/firebase/app";

const FirebaseAuthContext = createContext({
	app: firebaseApp,
	user: null,
	loading: false,
	error: null,
	signIn: async (provider) => {},
	signOut: async () => {}
});

const formatUser = (user) => ({
	uid: user.uid,
	email: user.email,
	name: user.displayName,
	avatar: user.photoURL,
	token: null
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
		if (!authState) {
			setLoading(true);
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
		if (!user) {
			clear();
			setError("No User");
		}
		setUser(formatUser(user));
		setLoading(false);
	};

	const clear = () => {
		setUser(null);
		setLoading(false);
	};

	const signIn = async (provider) => {
		const auth = getAuth();
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
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				clear();
			})
			.catch((err) => {
				clear();
				setError(err.message);
			});
	};

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
		return () => unsubscribe();
	}, []);

	return {
		auth: user,
		loading,
		error,
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

export const useAuth = () => {
	const authContext = useContext(FirebaseAuthContext);

	if (!authContext) {
		throw new Error(
			"useAuth() hook should only be used from inbside a <FirebaseAuthProvider>"
		);
	}
	return authContext;
};
