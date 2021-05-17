import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import { Table, Th, Thead, Tr } from "@chakra-ui/table";
import { useTable, useSortBy, Column } from "react-table";
import SvgTriangle from "../icons/SvgTriangle";

/**
 * @typedef Column
 * @see https://react-table.tanstack.com/docs/api/useTable#column-properties
 * @param {String} id Unique identifiant of the column
 * @param {String|Function} accessor How to access the data of a row
 * @param {Boolean} isVisible
 */
/**
 * @typedef DataTableProps
 * @param {Array<Column>} columns
 * @param {Array<Object>} data
 */

/**
 * Build a sortable table rendered with Chakra-UI Table elements and react-table
 * @param {DataTableProps} props
 */
export const DataTable = ({ columns, data }) => {
	// Use the hook
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{ columns, data },
		useSortBy
	);

	return (
		<Table {...getTableProps()}>
			<Thead>
				{headerGroups.map((headerGroup) => (
					<Tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<Th
								{...column.getHeaderProps(column.getSortByToggleProps())}
								isNumeric={column.isNumeric}
							>
								{column.render("Header")}
								<Box as="span" pl="4">
									{column.isSorted ? (
										<SvgTriangle
											className="sort-indicator"
											aria-label=""
											color="blue"
											direction={
												column.isSortedDesc ? "down" : "up"
											}
										/>
									) : null}
								</Box>
							</Th>
						))}
					</Tr>
				))}
			</Thead>
			<Tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row);
					return (
						<Tr {...row.getRowProps()}>
							{row.cells.map((cell) => (
								<Td
									{...cell.getCellProps()}
									isNumeric={cell.column.isNumeric}
								>
									{cell.render("Cell")}
								</Td>
							))}
						</Tr>
					);
				})}
			</Tbody>
		</Table>
	);
};
