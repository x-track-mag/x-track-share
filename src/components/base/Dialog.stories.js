import { Stack } from "@chakra-ui/layout";
import { useState } from "react";
import Button from "../forms/inputs/Button";
import { Dialog, OK, useDialogContext, withDialogContext, YES_NO } from "./Dialog";

export default {
	title: "Base/Dialog",
	component: Dialog
};

const Template = withDialogContext((args) => {
	const { confirm } = useDialogContext();
	const [response, setResponse] = useState();

	// This is how we use a modal dialog : in an async function
	const waitForConfirmation = async () => {
		const resp = await confirm(args);
		setResponse(resp);
		console.log(`${resp} was choosen`);
	};
	return (
		<Stack color="white" bgColor="black" width="100%" height="100%">
			<Button onClick={waitForConfirmation} primary={true}>
				Open Dialog
			</Button>
			{response && <p>Response was : {response}</p>}
		</Stack>
	);
});

export const ConfirmOK = Template.bind({});
ConfirmOK.args = { title: "INFO", message: "Something happened", choices: OK };

export const YesOrNo = Template.bind({});
YesOrNo.args = {
	title: "DO YOU AGREE",
	message: "Please confirm : ",
	choices: YES_NO,
	focusOn: 1
};

export const MoreChoices = Template.bind({});
MoreChoices.args = {
	title: "NEWSLETTER (step 6/7)",
	message: "Avant de payer, voulez-vous vous abonner à notre newsletter ? : ",
	choices: ["Oui", "Non", "Annuler"],
	focusOn: 1
};
