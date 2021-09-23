import { Button, Center, Spinner, Stack } from "@chakra-ui/react";
import { useAuth } from "./FirebaseAuthProvider.js";
import LoginForm from "./LoginForm.js";

const withAuth = (Component) => (props) => {
	const { user, loading, error, clear } = useAuth();

	if (error) {
		return (
			<Center h="100vh">
				<Stack color="yellow">
					<h3>LOGIN ERROR</h3>
					<code color="red">{error}</code>
					<Button
						variant="solid"
						borderRadius={0}
						bgColor="#333"
						onClick={clear}
					>
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
		return <LoginForm />;
	}

	// Yep
	return <Component user={user} {...props} />;
};

export default withAuth;
