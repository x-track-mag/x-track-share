import { useLayoutEffect } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Heading } from "@chakra-ui/layout";
import { Drawer, DrawerOverlay, DrawerHeader, DrawerContent } from "@chakra-ui/modal";
import Breadcrumbs from "./Breadcrumbs.js";
import DownloadForm from "./forms/DownloadForm.js";
import { useShareContext } from "./ShareContextProvider.js";

const SharedFolderNavigation = ({ path }) => {
	const {
		navigate,
		selectedTracks,
		sharedOptions: { addToSelection, displayDownloadForm }
	} = useShareContext();

	// These variables will control the drawer to show the Download form
	const { isOpen, onOpen, onClose } = useDisclosure();

	const callbacks = {};
	/**
	 * The callback function is static and can be referenced by every components on mount
	 * But the real callbacks are dynamics and created later
	 * @param {String} method Name of the callback to invoke
	 * @return {Function}
	 */
	const callback = (method) => (...args) => {
		console.log(`Calling ${method} on `, callbacks);
		if (typeof callbacks[method] === "function") {
			callbacks[method](...args);
		} else {
			console.error(`callbacks[${method}] is not defined. Why ?`);
		}
	};

	useLayoutEffect(() => {
		// Show the drawer and resolve when the API call to submit the form data ha been called
		const showDownloadForm = () =>
			new Promise((resolve, reject) => {
				callbacks.onSuccess = (data) => {
					onClose();
					resolve(data);
				};
				callbacks.onError = reject;
				console.log(`Show the download form !`);
				onOpen();
			});
		callbacks.download = async (evt) => {
			evt.preventDefault();
			// Display the download form and get the download URL
			const downloadUrl = await showDownloadForm().catch(alert);
		};
		console.log("Defined callbacks", callbacks);
	}, [path]);

	return (
		<Box className="navigation-header" as="header">
			<Breadcrumbs path={path} />
			{addToSelection && selectedTracks.path !== path && (
				<Heading
					className="neon-text"
					display="inline-block"
					float="right"
					key={selectedTracks.path}
				>
					<a
						href={`/share/${selectedTracks.path}`}
						onClick={navigate(selectedTracks.path)}
					>
						Sélection
					</a>
				</Heading>
			)}
			{addToSelection && selectedTracks.path === path && (
				<>
					<Heading
						className="neon-text"
						display="inline-block"
						float="right"
						key={selectedTracks.path}
					>
						<a
							href={`/share/${selectedTracks.path}/download`}
							onClick={callback("download")}
						>
							Download
						</a>
					</Heading>
					{displayDownloadForm && (
						<Drawer isOpen={isOpen} onClose={onClose}>
							<DrawerOverlay />
							<DrawerHeader mt="50px">Merci de renseigner</DrawerHeader>
							<DrawerContent padding={2} bgColor="black">
								<DownloadForm
									maxWidth="40rem"
									selectedTracks={selectedTracks}
									onSuccess={callback("onSuccess")}
									onError={callback("onError")}
								/>
							</DrawerContent>
						</Drawer>
					)}
				</>
			)}
		</Box>
	);
};

export default SharedFolderNavigation;
