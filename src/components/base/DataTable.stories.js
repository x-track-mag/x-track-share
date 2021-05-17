import { DataTable } from "./DataTable";
import theme from "../../theme.js";
import { addDecorator } from "@storybook/react";
import { Center, ChakraProvider } from "@chakra-ui/react";

const newTheme = {
	...theme,
	config: {
		initialColorMode: "dark",
		useSystemColorMode: false
	}
};

const Chakra = ({ children }) => (
	<ChakraProvider theme={newTheme}>
		<Center bg="pink">{children}</Center>
	</ChakraProvider>
);

addDecorator((StoryFn) => (
	<Chakra>
		<StoryFn />
	</Chakra>
));

const columns = [
	{ Header: "First Name", accessor: "firstName" },
	{ Header: "First Name", accessor: "lastName" },
	{ Header: "City", accessor: "city" },
	{ Header: "Genre", accessor: "genre" },
	{ Header: "Age", accessor: "age", isNumeric: true }
];
const data = [
	{ firstName: "John", lastName: "DOE", city: "LA", genre: "M", age: 38 },
	{ firstName: "Jane", lastName: "DOE", city: "LA", genre: "F", age: 34 },
	{ firstName: "Lou", lastName: "REDDE", city: "NYC", genre: "M", age: 44 },
	{ firstName: "Dave", lastName: "BRONSON", city: "Chicago", genre: "M", age: 42 },
	{ firstName: "James", lastName: "WILLIAMSON", city: "NYC", genre: "M", age: 40 }
];

export default {
	title: "Sortable Data Table"
};

export const SortableDataTable = () => <DataTable data={data} columns={columns} />;
