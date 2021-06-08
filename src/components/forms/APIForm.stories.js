import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import APIForm from "./APIForm.js";
import Text from "./inputs/Text.js";

export const SendMailReport = () => (
	<Box w="20rem" h="100%">
		<APIForm method="POST" action="/api/mailreport">
			<Text name="fullName" placeHolder="John DOE" />
			<Text name="email" placeHolder="john.doe@x.org" />
			<Text name="message" placeHolder="Hello" />
			<Input type="submit" value="Envoyer" bgColor="lightgray" color="blue" />
		</APIForm>
	</Box>
);

export default {
	title: "API Form"
};
