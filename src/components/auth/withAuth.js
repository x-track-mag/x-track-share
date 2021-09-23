import { Center, Spinner, Stack } from "@chakra-ui/react";
import Button from "../forms/inputs/Button.js";
import FirebaseAuthProvider, { useAuth } from "./FirebaseAuthProvider.js";
import LoginForm from "./LoginForm.js";

export const withAuthContext = (Component) => (props) => (
	<FirebaseAuthProvider>
		<Component {...props} />
	</FirebaseAuthProvider>
);

export const withAuthentication = (Component) => (props) => {
	const { user, loading, error, clear } = useAuth(); // Retrieve FirebaseAuthProvider context

	if (error) {
		return (
			<Center h="100vh">
				<Stack color="yellow">
					<h3>LOGIN ERROR</h3>
					<code color="red">{error}</code>
					<Button primary={false} onClick={clear}>
						OK
					</Button>
				</Stack>
			</Center>
		);
	}

	if (loading) {
		return (
			<Center h="100vh">
				<Spinner
					thickness="5px"
					speed="0.75s"
					emptyColor="brand.blue"
					color="brand.yellow"
					size="xl"
				/>
			</Center>
		);
	}

	if (!user) {
		return <LoginForm choices={["microsoft"]} />;
	}

	// Yep
	return <Component user={user} {...props} />;
};
