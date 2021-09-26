import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay
} from "@chakra-ui/react";
import React, { createContext, useContext, useRef, useState } from "react";
import Button from "../forms/inputs/Button";

const DialogContext = createContext();

/**
 * useDialogContext() Hook
 * @return {DialogContext}
 */
export const useDialogContext = () => {
	return useContext(DialogContext);
};

// Let's provide some usual confirmation choices
export const OK = ["Ok"];
export const OK_CANCEL = ["Ok", "Cancel"];
export const YES_NO = ["Yes", "No"];

/**
 * @typedef DialogProps
 * @property {String} title Modal title
 * @property {String} message Modal message
 * @property {Array<String>} choices
 * @property {Number} [primary=0] Index of the primary (accented) choice (0-based)
 * @property {Number} [focusOn=0] Index of the button to focus on (0-based)
 * @property {Boolean} [show=false]
 */

/**
 * @type DialogProps
 * Let's provide some default dialog property values
 */
const DEFAULT_DIALOG_STATE = {
	title: "Confirmation",
	message: "Are you sure ?",
	choices: YES_NO,
	primary: 0, // Which choice should be the primary one ?
	focusOn: 0, // Focus on the 1st choice (index 0)
	show: false
};

/**
 * Wrap some copmponents inside the DialogContext
 */
export const DialogContextProvider = ({ children }) => {
	const [dialogState, changeDialogState] = useState({ ...DEFAULT_DIALOG_STATE });

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
	/**
	 *
	 * @param {DialogProps} props
	 * @return {Number|Boolean}
	 */
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
 * @return {React.Component}
 */
export const withDialogContext = (Component) => (props) => (
	<DialogContextProvider>
		<Component {...props} />
	</DialogContextProvider>
);

/**
 * Modal Confirmation with two choices only (cancel=false, confirm=true)
 * @param {DialogProps} props
 */
export const Dialog = () => {
	const {
		show,
		title,
		message,
		choices,
		primary,
		focusOn,
		callback,
		close
	} = useDialogContext();
	const refToFocusOn = useRef();

	const answer = (choice, idx) => () => {
		close();
		callback && callback(choice, idx);
	};

	return (
		<AlertDialog
			isOpen={show}
			leastDestructiveRef={refToFocusOn} // The focus should be placed on the least dangerous choice
			onClose={answer(false)}
		>
			<AlertDialogOverlay>
				<AlertDialogContent
					bgColor="gray.600"
					color="inherit"
					borderRadius={0}
					borderStyle="double"
					borderColor="blue"
					borderWidth={10}
				>
					<AlertDialogHeader
						fontSize="lg"
						fontWeight="bold"
						textTransform="uppercase"
						bgColor="blackAlpha.800"
						p={2}
					>
						{title}
					</AlertDialogHeader>

					<AlertDialogBody>{message}</AlertDialogBody>

					<AlertDialogFooter>
						{choices.map((label, idx) => {
							const props = {};
							if (idx === focusOn) {
								props.ref = refToFocusOn;
							}
							props.primary = idx === primary;

							return (
								<Button
									{...props}
									ml={4}
									key={`confirm-choice-${idx}`}
									textTransform="uppercase"
									onClick={answer(
										idx < 2 ? [true, false][idx] : idx,
										label
									)}
								>
									{label}
								</Button>
							);
						})}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};
