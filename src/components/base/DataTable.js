import { Table, Tbody, Th, Thead, Tr, Td } from "@chakra-ui/table";
import { useTable, useSortBy, Column } from "react-table";
import { ColumnHeader } from "./Typography.js";
import SvgTriangle from "../icons/SvgTriangle.js";

/**
 * @typedef Column
 * @see https://react-table.tanstack.com/docs/api/useTable#column-properties
 * @property {String} id Unique identifiant of the column
 * @property {String} Header The header label
 * @property {String|Function} accessor How to access the data of a row
 * @property {Boolean} isVisible
 */
/**
 * @typedef DataTableProps
 * @property {Array<Column>} columns
 * @property {Array<Object>} data
 */

/**
 * Build a sortable table rendered with Chakra-UI Table elements and react-table hooks
 * @param {DataTableProps} props
 */
export const DataTable = ({ columns, data }) => {
	// Use the hook
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{ columns, data, disableSortRemove: true },
		useSortBy
	);

	return (
		<Table {...getTableProps()} variant="simple">
			<Thead>
				{headerGroups.map((headerGroup) => (
					<Tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<Th
								{...column.getHeaderProps(column.getSortByToggleProps())}
								isNumeric={column.isNumeric}
								minW={column.width || "15rem"}
								position="relative"
								lineHeight="1"
								pr="2rem" // space for the sorting indicator
							>
								<ColumnHeader>
									{column.render("Header")}&nbsp;
									<SvgTriangle
										className="sort-indicator"
										aria-label={
											column.isSorted
												? column.isSortedDesc
													? "sorted descending"
													: "sorted ascending"
												: "unsorted"
										}
										size="24px"
										direction={
											column.isSorted
												? column.isSortedDesc
													? "down"
													: "up"
												: "dunno"
										}
									/>
								</ColumnHeader>
							</Th>
						))}
					</Tr>
				))}
			</Thead>
			<Tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row);
					return (
						<Tr
							{...row.getRowProps()}
							_hover={{ backgroundColor: "yellow", cursor: "pointer" }}
						>
							{row.cells.map((cell) => (
								<Td
									{...cell.getCellProps()}
									lineHeight="1"
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
