/**
 * Group of required types needed to represent a table in the format the SimplifyTable library supports.
 */
export namespace Model {

	/**
	 * Represents a cell in the format the SimplifyTable library supports
	 */
	export type Cell = {
		/**
		 * Content of cell in plain text without formatting code
		 */
		text: string,
		/**
		 * Content of cell with code included for formatting purpose. This is the content of the cell verbatim.
		 */
		rawContent: string,
		/**
		 * Number of rows this cell spawns. For HTML table cells this equals to the `rowspan` HTML attribute on <td> or <th> HTML elements.
		 */
		rowSpan: number,
		/**
		 * Number of columns this cell spawns. For HTML table cells this equals to the `colspan` HTML attribute on <td> or <th> HTML elements.
		 */
		colSpan: number,
		/**
		 * SimplifyTable type of the cell. It does not specify if this cell represents a heading or a normal cell.
		 * Value `normal`: The cell really exists and existed before the conversion into a SimplifyTable cell and before executing a SimplifyTable normalizer function like {@link TableModelUtils.addShadowCellsAndHeaderInformationToEachCell}.
		 * 
		 * Value `shadow`: This cell has been created to normalize the table so each row has the same amount of columns. It is the consequence of previous cells having a `rowSpan` or `colSpan` attribute greater than 1 and therefore creating an inbalance of the amount of columns in rows affected by those cells.
		 */
		type: "normal" | "shadow",
		/**
		 * Contains attributes only meaingful for cells of type `shadow`.
		 */
		shadowAttributes: {
			/**
			 * If `true`, then it tells converters that this shadow cell is a duplication of a row level header cell with {@link Model.Cell.rowSpan} greater than 1. This information is used internally to prevent duplication of information in {@link Model.Cell.rowHeaders} by nomalizer functions.
			 */
			duplicatedRowHeading: boolean,
			/**
			 * If `true`, then it tells converters that this shadow cell is a duplication of a column level header cell with {@link Model.Cell.colSpan} greater than 1. This information is used internally to prevent duplication of information in {@link Model.Cell.columnHeaders} by nomalizer functions.
			 */
			duplicatedColumnHeading: boolean
		},
		/**
		 * This represenzs a heading cell if value is set to `true`.
		 */
		isHeading: boolean,
		/**
		 * Array of text of row level headers applying to this cell
		 */
		rowHeaders: string[],
		/**
		 * Array of text of column level headers applying to this cell
		 */
		columnHeaders: string[],
		/**
		 * Array of strings representing tags. It is up to converters to decide how to interpret this property.
		 */
		tags?: string[]
	}

	export type Row = {
		cells: Cell[],
		/**
		 * Array of row level headers applying to this row. It contsins all row level header cells this row has in the order of their definition in the model.
		 */
		rowHeaders: string[],
		tags?: string[]
	}

	export type Table = {
		/**
		 * Title of the table
		 */
		caption: string | null,
		thead: Row[],
		tbody: Row[],
		tfoot: Row[],
		/**
		 * Array of strings representing tags. It is up to converters to decide how to interpret this property.
		 */
		tags: string[]
	}

}

export enum LogConstraints {
	LOG_OFF = 0,
	// LOG_FATAL = 1,
	LOG_ERROR = 2,
	LOG_WARN = 3,
	LOG_INFO = 4,
	LOG_DEBUG = 5,
	// LOG_TRACE = 6,
	// LOG_ALL = 7
}

export type WorkData = {
	headerTitlesByColumn: [string[]],
	headerTitlesByRow: [string[]],
	currentRowIndex: number
}