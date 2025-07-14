import { expect, describe, test } from "@jest/globals"

import complicatedTableModel from "./assets/conceptual_complicated-table-model.json"
import normalizedComplicatedTableModel from "./assets/conceptual_complicated-table-model-normalized.json"
import simpleTableModelList from "./assets/conceptual_simple-table-models.json";
import { TableModelUtils} from "../src/index";

test("shadow cells and header information for each cell table model are available", () => {
	expect(function() {
		// @ts-expect-error
		TableModelUtils.addShadowCellsAndHeaderInformationToEachCell(complicatedTableModel);
		return complicatedTableModel;
	}()).toEqual(normalizedComplicatedTableModel);
});

test("simple table models out of a complicated table model can be generated", () => {
	expect(function() {
		// @ts-expect-error
		return TableModelUtils.generateSimpleTabelModelsOutOfComplicatedTableModel(normalizedComplicatedTableModel);
	}()).toEqual(simpleTableModelList);
})