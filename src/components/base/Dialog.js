import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button
} from "@chakra-ui/react";
import React from "react";
import { createContext, useContext, useRef, useState } from "react";

const DialogContext = createContext();

/**
 * useDialogContext() Hook
 * @return {DialogContext}
 */
export const useDialogContext = () => {
	return useContext(DialogContext);
};

// Let's provide some default dialog property values
const DEFAULT_DIALOG_STATE = {
	title: "Confirmation",
	message: "Are you sure ?",
	yes: "Yes",
	no: "No",
	show: false
};

/**
 * Wrap some copmponents inside the DialogContext
 */
export const DialogContextProvider = ({ children }) => {
	const [dialogState, changeDialogState] = useState(DEFAULT_DIALOG_STATE);

	// Now, enhance the state with some methods to alter it
	dialogState.open = (props) => {
		changeDialogState({
			...dialogState,
			...props,
			show: true
		});
	};
	dialogState.close = () => {
		changeDialogState({
			...dialogState,
			show: false,
			callback: null
		});
	};
	dialogState.confirm = async (props) => {
		return new Promise((callback) => {
			dialogState.open({ ...props, callback });
		});
	};

	return (
		<DialogContext.Provider value={dialogState}>
			{children}
			<Dialog {...dialogState} />
		</DialogContext.Provider>
	);
};

/**
 * HOC : Wrap a component with the Dialog Context Provider
 * @param {React.Component} Component
 * @returns HOC
 */
export const withDialogContextProvider = (Component) => (props) => (
	<DialogContextProvider>
		<Component {...props} />
	</DialogContextProvider>
);

/**
 * Modal Confirmation with two choices only (cancel=false, confirm=true)
 * @param {DialogProps} props
 */
export const Dialog = () => {
	const { show, title, message, yes, no, callback, close } = useDialogContext();
	const refToFocusOn = useRef();

	const answer = (choice) => () => {
		close();
		callback && callback(choice);
	};

	return (
		<AlertDialog
			isOpen={show}
			leastDestructiveRef={refToFocusOn} // The focus should be placed on the least dangerous choice
			onClose={answer(false)}
		>
			<AlertDialogOverlay>
				<AlertDialogContent
					bgColor="gray.700"
					borderRadius={0}
					borderStyle="double"
					borderColor="blue"
					borderWidth={10}
				>
					<AlertDialogHeader
						fontSize="lg"
						fontWeight="bold"
						textTransform="uppercase"
						bgColor="blackAlpha.500"
						p={2}
					>
						{title}
					</AlertDialogHeader>

					<AlertDialogBody>{message}</AlertDialogBody>

					<AlertDialogFooter>
						<Button
							borderRadius={0}
							bgColor="gray.500"
							ref={refToFocusOn}
							onClick={answer(false)}
							padding="0 2rem"
							textTransform="uppercase"
						>
							{no}
						</Button>
						<Button
							borderRadius={0}
							bgColor="blue"
							color="yellow"
							onClick={answer(true)}
							ml={3}
							padding="0 2rem"
							textTransform="uppercase"
						>
							{yes}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};
