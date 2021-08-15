import { Center, Spinner, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../lib/firebase/client.js";
import { Info, Subtitle } from "../base/Typography.js";
import SSO from "./SSO";

const withAuth = (Component) => (props) => {
	const [user, loading, error] = useAuthState(firebase.auth());
	const router = useRouter();

	if (!user && !loading) {
		return (
			<Center
				border="4px"
				borderColor="brand.yellow"
				bgColor="#333"
				padding="3rem"
				w="50vw"
				margin="20vh auto 0"
			>
				<Stack>
					<Subtitle textAlign="center">LOGIN</Subtitle>
					<Info>Authentifiez vous avec votre compte github</Info>
					<SSO signInSuccessUrl={router.asPath} />;
				</Stack>
			</Center>
		);
	}

	if (loading) {
		return (
			<Spinner
				thickness="5px"
				speed="0.75s"
				emptyColor="brand.blue"
				color="brand.yellow"
				size="xl"
			/>
		);
	}

	if (error) {
		return (
			<Stack>
				<h3>LOGIN ERROR</h3>
				<Box color="red">{error}</Box>
			</Stack>
		);
	}

	// Yep
	return <Component user={user} {...props} />;
};

export default withAuth;
