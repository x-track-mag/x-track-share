import { Center, Spinner, Stack } from "@chakra-ui/react";
import { Component } from "react";
import Button from "../forms/inputs/Button.js";
import FirebaseAuthProvider, { useAuth } from "./FirebaseAuthProvider.js";
import LoginForm from "./LoginForm.js";

/**
 * HOC : Provides the FirebaseAuthContext to wrapped <Component>
 * Allows to use the useAuth() Hook inside Component
 * @param {Component} Component
 * @return {Component}
 */
export const withAuthContext = (Component) => (props) => (
	<FirebaseAuthProvider>
		<Component {...props} />
	</FirebaseAuthProvider>
);

/**
 * HOC : restrict access to <Component> to authenticated users only
 * Displays a LoginForm when the user is not authenticated
 * @param {Component} Component
 * @return {Component}
 */
export const withAuthentication = (Component) => (props) => {
	const { user, loading, error, clear } = useAuth(); // Retrieved from FirebaseAuthProvider context

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
