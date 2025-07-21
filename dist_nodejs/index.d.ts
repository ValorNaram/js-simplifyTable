import { Model, LogConstraints } from "./types";
export type { Model, LogConstraints };
export declare class TableModelUtils {
    static logLevel: LogConstraints;
    static tableCellDataColumnHeaderSeparator: string;
    static tableCellDataRowHeaderSeparator: string;
    private static debug;
    private static convertUtilArrayDynamicAddChildArray;
    private static normalizeCellsAndAddHeaderInformationToEach;
    static generateSimpleTabelModelsOutOfTableModelRows(rows: Model.Row[]): Model.Table[];
    static generateSimpleTabelModelsOutOfComplicatedTableModel(table: Model.Table): Model.Table[];
    static addShadowCellsAndHeaderInformationToEachCell(table: Model.Table): void;
}
