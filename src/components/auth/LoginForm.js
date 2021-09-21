import { Button } from "@chakra-ui/button";
import { Box, Center, Stack } from "@chakra-ui/layout";
import { Info, Title } from "../base/Typography";
import BrandLogo from "../icons/BrandLogo";
import { useAuth } from "./FirebaseAuthProvider";
import ProviderFactory from "./ProviderFactory";

const defaultColors = { bg: "white", color: "inherit" };
const brandColors = {
	google: { bg: "white", color: "black" },
	github: { bg: "#b1bac4", color: "#24292f" },
	facebook: { bg: "#3a5997", color: "white" },
	microsoft: { bg: "#2f2f2F", color: "white" },
	twitter: { bg: "#1da1f2", color: "white" },
	linkedin: { bg: "#0a66c2", color: "white" }
};

const LoginButton = (providerName) => {
	const { signIn } = useAuth();
	const provider = ProviderFactory.getProvider(providerName);
	const onClick = () => {
		signIn(provider);
	};

	return (
		<Button
			border="4px solid transparent"
			_hover={{ border: "4px solid yellow" }}
			borderRadius={0}
			bgColor={brandColors[providerName]?.bg || defaultColors.bg}
			color={brandColors[providerName]?.color || defaultColors.color}
			textTransform="uppercase"
			onClick={onClick}
			key={`${providerName}-login`}
		>
			<BrandLogo name={providerName} size={4} mr={2} />
			Sign in with {providerName}
		</Button>
	);
};

/**
 * @typedef LoginFormProps
 * @property {String} title
 * @property {String} invitation
 * @property {Array<String>} choices
 */

/**
 * Display a login form with a list 3rd party Authentication providers
 * @param {LoginFormProps} props
 */
const LoginForm = ({
	title = "LOGIN",
	invitation = "Use your existing account to log in",
	choices = ["facebook", "github", "google", "linkedin", "microsoft"]
}) => (
	<Center minH="100vh">
		<Box bgColor="#333" color="white" p={5}>
			<Title>{title}</Title>
			<Info>{invitation}</Info>
			<Stack>{choices.map(LoginButton)}</Stack>
		</Box>
	</Center>
);

export default LoginForm;
