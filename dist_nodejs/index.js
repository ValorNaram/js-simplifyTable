import { LogConstraints } from "./types";
export class TableModelUtils {
    static debug(message) {
        (this.logLevel >= LogConstraints.LOG_DEBUG ? console.debug(message) : false);
    }
    static convertUtilArrayDynamicAddChildArray(arr, index, content) {
        if (arr[index] === undefined) {
            arr.push([content]);
        }
        else {
            arr[index].push(content);
        }
    }
    static normalizeCellsAndAddHeaderInformationToEach(category, rows, workData) {
        function _copyCellWithChanges(oldCell, propertiesToChange) {
            return Object.assign(Object.assign(Object.assign({}, structuredClone(oldCell)), { colSpan: 1, rowSpan: 1 }), propertiesToChange);
        }
        for (let row_index = 0; rows.length > row_index; row_index++) {
            const row = rows[row_index];
            this.debug(`Starting with first cell of row ${workData.currentRowIndex} (${category} row index ${row_index})`);
            this.debug(`Cells: [${row.cells.map((cell) => cell.type === "shadow" ? `"Cell [SHADOW CELL]: ${cell.text}"` : `"${cell.text}"`)}]`);
            let cell_index = 0;
            while (true) {
                this.debug(`Current cell index ${cell_index}, Amount of cells: ${row.cells.length}`);
                if (cell_index >= row.cells.length) {
                    this.debug("  cell index out of range, proceeding with next row");
                    break;
                }
                let cell = row.cells[cell_index];
                this.debug(`  index of cell ${cell_index}, cell content:${cell.type === "shadow" ? " Cell [SHADOW CELL]:" : ""} ${cell.text}`);
                if (cell.type === "shadow") {
                    this.debug("    is virtual column added by cells from previous rows spawning into the current row");
                }
                // deal with heading cells
                // # TODO: fix duplication like `ch_a - ch_a - ch_aa` (two level deep column headings where one spawns two rows) to `ch_a - ch_aa` (target) in the headers_titles_by_column
                //  this bug arises when AsciiDoc starts supporting more than just one header column inside thead
                //   developers can add a second row in thead array inside `convert_table` function to debug and fix this bug before it arises
                //   this bug has probably been fixed by introducing variable 'workData.shadow_attributes.duplicated_column_heading'
                if (category === "head" || cell.isHeading) {
                    // cell is a heading cell so we need to add their text to our lists of column and row level headings.
                    // this condition probably prevents duplications like this `ch_a - ch_a` - ch_aa` in column headers (header_titles_by_column)
                    if (cell.shadowAttributes.duplicatedColumnHeading == false) {
                        this.debug(`    add "${cell.text}" at column index position ${cell_index} to header_titles_by_column`);
                        this.convertUtilArrayDynamicAddChildArray(workData.headerTitlesByColumn, cell_index, cell.text);
                    }
                    // this condition prevents duplications like this `rh_a - rh_a - rh_ad` in row headers (header_titles_by_row)
                    if (cell.shadowAttributes.duplicatedRowHeading == false) {
                        this.debug(`      add "${cell.text}" at row index position ${workData.currentRowIndex} to header_titles_by_row`);
                        this.convertUtilArrayDynamicAddChildArray(workData.headerTitlesByRow, workData.currentRowIndex, cell.text);
                    }
                }
                // deal with virtual/shadow cells/columns to create
                if (cell.type === "normal") {
                    if (cell.colSpan > 1) {
                        // account for cells spawning multiple columns by resolving their colspan value to separate cells internally
                        for (let index = 1; cell.colSpan > index; index++) {
                            this.debug(`      add virtual cell before column index ${cell_index + index} to the current row`);
                            rows[row_index].cells.splice(cell_index + index, 0, _copyCellWithChanges(cell, {
                                type: "shadow",
                                shadowAttributes: {
                                    duplicatedColumnHeading: false,
                                    duplicatedRowHeading: (index == 0 ? false : true)
                                }
                            }));
                            this.debug(`      Cells: [${row.cells.map((cell) => cell.type === "shadow" ? `"Cell [SHADOW CELL]: ${cell.text}"` : `"${cell.text}"`)}]`);
                        }
                    }
                    if (cell.rowSpan > 1) {
                        // account for cells spawning multiple rows by resolving their rowspan value to separate cells internally
                        for (let rowspan_index = 1; cell.rowSpan > rowspan_index; rowspan_index++) {
                            for (let colspan_index = 0; cell.colSpan > colspan_index; colspan_index++) {
                                if (rows.length > row_index + rowspan_index) {
                                    this.debug(`        add it to next ${category} row ${row_index + rowspan_index} before column index ${cell_index + colspan_index}`);
                                    rows[row_index + rowspan_index].cells.splice(cell_index + colspan_index, 0, _copyCellWithChanges(cell, {
                                        colSpan: 1,
                                        rowSpan: 1,
                                        type: "shadow",
                                        shadowAttributes: {
                                            duplicatedColumnHeading: (rowspan_index == 0 ? false : true),
                                            duplicatedRowHeading: (colspan_index == 0 ? false : true)
                                        },
                                    }));
                                }
                            }
                        }
                    }
                }
                // It is not necessary to equip header cells with data about their relative column and row headers
                if (cell.isHeading) {
                    cell_index++;
                    continue;
                }
                if (workData.headerTitlesByColumn[cell_index] !== undefined) {
                    cell.columnHeaders = workData.headerTitlesByColumn[cell_index];
                }
                if (workData.headerTitlesByRow[workData.currentRowIndex] !== undefined) {
                    cell.rowHeaders = workData.headerTitlesByRow[workData.currentRowIndex];
                }
                cell_index++;
            }
            if (workData.headerTitlesByRow[workData.currentRowIndex] !== undefined && category !== "head") {
                row.rowHeaders = workData.headerTitlesByRow[workData.currentRowIndex];
            }
            workData.currentRowIndex += 1;
        }
    }
    static generateSimpleTabelModelsOutOfTableModelRows(rows) {
        let simpleTables = [];
        for (let row of rows) {
            let simpleTable = {
                caption: null,
                thead: [],
                tbody: [],
                tfoot: [],
                tags: [],
            };
            if (row.rowHeaders.length > 0) {
                simpleTable.caption = row.rowHeaders.join(this.tableCellDataRowHeaderSeparator);
            }
            for (let cell of row.cells) {
                if (cell.isHeading) {
                    continue;
                }
                let simpleTableRow = {
                    rowHeaders: [],
                    cells: []
                };
                simpleTableRow.cells.push({
                    isHeading: true,
                    type: "normal",
                    text: cell.columnHeaders.join(this.tableCellDataColumnHeaderSeparator),
                    rawContent: cell.columnHeaders.join(this.tableCellDataColumnHeaderSeparator),
                    colSpan: 1,
                    rowSpan: 1,
                    columnHeaders: [],
                    rowHeaders: [],
                    shadowAttributes: {
                        duplicatedColumnHeading: false,
                        duplicatedRowHeading: false
                    },
                    tags: (cell.tags !== undefined ? cell.tags : [])
                });
                simpleTableRow.cells.push({
                    isHeading: false,
                    type: "normal",
                    text: cell.text,
                    rawContent: cell.rawContent,
                    colSpan: 1,
                    rowSpan: 1,
                    columnHeaders: cell.columnHeaders,
                    rowHeaders: cell.rowHeaders,
                    shadowAttributes: {
                        duplicatedColumnHeading: false,
                        duplicatedRowHeading: false
                    },
                    tags: (cell.tags !== undefined ? cell.tags : [])
                });
                simpleTable.tbody.push(simpleTableRow);
            }
            simpleTables.push(simpleTable);
        }
        return simpleTables;
    }
    static generateSimpleTabelModelsOutOfComplicatedTableModel(table) {
        let tableModels = [];
        tableModels.push(...this.generateSimpleTabelModelsOutOfTableModelRows(table.tbody));
        tableModels.push(...this.generateSimpleTabelModelsOutOfTableModelRows(table.tfoot));
        return tableModels;
    }
    static addShadowCellsAndHeaderInformationToEachCell(table) {
        let workData = {
            // @ts-expect-error
            headerTitlesByColumn: [],
            // @ts-expect-error
            headerTitlesByRow: [],
            currentRowIndex: 0
        };
        this.normalizeCellsAndAddHeaderInformationToEach("head", table.thead, workData);
        this.normalizeCellsAndAddHeaderInformationToEach("body", table.tbody, workData);
        this.normalizeCellsAndAddHeaderInformationToEach("foot", table.tfoot, workData);
    }
}
TableModelUtils.logLevel = LogConstraints.LOG_INFO;
TableModelUtils.tableCellDataColumnHeaderSeparator = " - ";
TableModelUtils.tableCellDataRowHeaderSeparator = " - ";
//# sourceMappingURL=index.js.map