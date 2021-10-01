import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import clsx from "clsx";
import { Column, useRowState, useSortBy, useTable } from "react-table";
import SvgTriangle from "../icons/SvgTriangle.js";
import { ColumnHeader } from "./Typography.js";

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
export const DataTable = ({ columns, data, styles = {}, ...props }) => {
	// Use the hook
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{ columns, data, disableSortRemove: true },
		useSortBy,
		useRowState
	);

	return (
		<Table {...getTableProps()} variant="simple" {...props}>
			<Thead>
				{headerGroups.map((headerGroup) => (
					<Tr {...headerGroup.getHeaderGroupProps()} {...styles.headers}>
						{headerGroup.headers.map((column) => (
							<Th
								{...column.getHeaderProps(column.getSortByToggleProps())}
								isNumeric={column.isNumeric}
								minW={column.minWidth}
								maxW={column.maxWidth}
								position="relative"
								lineHeight="1"
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
					// Extract className from the possible custom styles properties
					const { className, ...moreStyles } = styles.rows;
					return (
						<Tr
							{...row.getRowProps()}
							className={clsx(className, {
								// so that we can add the active class when it is
								active: row.original.active
							})}
							{...moreStyles}
							onClick={(evt) => row.original.onClick(evt)}
						>
							{row.cells.map((cell) => (
								<Td
									{...cell.getCellProps()}
									// lineHeight="1"
									isNumeric={cell.column.isNumeric}
									textAlign={cell.column.align}
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
