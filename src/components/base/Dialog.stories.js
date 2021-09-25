import Button from "../forms/inputs/Button";
import { Dialog, OK, useDialogContext, withDialogContext, YES_NO } from "./Dialog";

export default {
	title: "Base/Dialog",
	component: Dialog
};

const Template = withDialogContext((args) => {
	const { confirm } = useDialogContext();
	const waitForConfirmation = async () => {
		const resp = await confirm(args);
		console.log(`${resp} was choosen`);
	};
	return (
		<Button onClick={waitForConfirmation} primary={true}>
			Open Dialog
		</Button>
	);
});

export const ConfirmOK = Template.bind({});
ConfirmOK.args = { title: "INFO", message: "Something happened", choices: OK };

export const YesOrNo = Template.bind({});
YesOrNo.args = { title: "DO YOU AGREE", message: "Please confirm : ", choices: YES_NO };

export const MoreChoices = Template.bind({});
MoreChoices.args = {
	title: "NEWSLETTER (step 6/7)",
	message: "Avant de payer, voulez-vous vous abonner à notre newsletter ? : ",
	choices: ["Oui", "Non", "Annuler"],
	focusOn: 1
};
