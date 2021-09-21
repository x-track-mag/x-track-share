import { LoginForm } from "./LoginForm";

export default {
	title: "Auth/LoginForm",
	component: LoginForm,
	argTypes: {
		choices: {
			options: ["facebook", "github", "google", "linkedin", "microsoft"],
			control: { type: "check" }
		}
	}
};

const Template = (args) => <LoginForm {...args} />;

export const ChooseYourProvider = Template.bind({});
ChooseYourProvider.args = {};
