import APIClient from "../../lib/services/APIClient.js";
import { withEventBus } from "../../components/EventBusProvider.js";
import CloudinaryFolder from "../../components/CloudinaryFolder.js";
import { withShareContext } from "../../components/ShareContextProvider.js";

const retrieveFromCache = (uid) => {
	if (typeof window === "undefined") return;
	let cached = window.localStorage.getItem(uid);
	if (!cached) return null;
	cached = JSON.parse(cached);
	if (cached.timeStamp > Date.now() - 10 * 60 * 1000) {
		// expired
		return null;
	} else {
		console.log(`Loaded from cache`, cached);
		return cached;
	}
};

const storeInCache = (uid, data) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		uid,
		JSON.stringify({
			...data,
			timeStamp: Date.now()
		})
	);
};

/**
 * Retrieve the folder content /share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const uid = params.uid;
	console.log(`getServerSideProps(${uid.join("/")})`);

	let folders = retrieveFromCache(uid);

	if (!folders) {
		folders = await APIClient.get(`/api/share/${uid[0]}`);
		storeInCache(uid, folders);
	}

	return {
		props: {
			folders,
			path: uid.join("/")
		}
	};
};

export default withEventBus(withShareContext(CloudinaryFolder));
