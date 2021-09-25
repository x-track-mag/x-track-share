import { Center, ChakraProvider } from "@chakra-ui/react";
import { addDecorator } from "@storybook/react";
import theme from "../../theme.js";
import { DataTable } from "./DataTable";

addDecorator((StoryFn) => (
	<ChakraProvider resetCSS theme={theme}>
		<Center>
			<StoryFn />
		</Center>
	</ChakraProvider>
));
const genres = {
	M: "Male",
	F: "Female"
};
const columns = [
	{ Header: "First Name", accessor: "firstName" },
	{ Header: "First Name", accessor: "lastName" },
	{ Header: "City", accessor: "city" },
	{ Header: "Genre", accessor: (row) => genres[row.genre] },
	{ Header: "Age", accessor: "age", isNumeric: true, width: "4rem" }
];
const data = [
	{ firstName: "John", lastName: "DOE", city: "LA", genre: "M", age: 38 },
	{ firstName: "Jane", lastName: "DOE", city: "LA", genre: "F", age: 34 },
	{ firstName: "Lou", lastName: "REDDE", city: "NYC", genre: "M", age: 44 },
	{ firstName: "Dave", lastName: "BRONSON", city: "Chicago", genre: "M", age: 42 },
	{ firstName: "James", lastName: "WILLIAMSON", city: "NYC", genre: "M", age: 40 }
];

export default {
	title: "Data Table",
	component: DataTable
};

export const SortableDataTable = () => <DataTable data={data} columns={columns} />;
