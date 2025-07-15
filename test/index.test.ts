import { expect, describe, test } from "@jest/globals";

import complicatedTableModel from "./assets/conceptual_complicated-table-model.json";
import complicatedTableModel_normalized from "./assets/conceptual_complicated-table-model-normalized.json";
import complicatedTableModel_simplified from "./assets/conceptual_simple-table-models.json";

import cityRankingTableModel from "./assets/fairy-city-ranking-table-model.json";
import cityRankingTableModel_normalized from "./assets/fairy-city-ranking-table-normalized.json";
import cityRankingTableModel_simplified from "./assets/fairy-city-ranking-table-simple-models.json";

import { TableModelUtils} from "../src/index";

test.concurrent.each([
	[complicatedTableModel, complicatedTableModel_normalized],
	[cityRankingTableModel, cityRankingTableModel_normalized]
])("%s: shadow cells and header information for each cell table model are available", async (inputTableModel, expectedNormalizedOutputTableModel) => {
	expect(function() {
		// @ts-expect-error
		TableModelUtils.addShadowCellsAndHeaderInformationToEachCell(inputTableModel);
		return inputTableModel;
	}()).toEqual(expectedNormalizedOutputTableModel);
});

test.concurrent.each([
	[complicatedTableModel_normalized, complicatedTableModel_simplified],
	[cityRankingTableModel_normalized, cityRankingTableModel_simplified]
])("%s: simple table models out of a complicated table model can be generated", async (normalizedInputTableModel, expectedSimplifiedOutputTableModel) => {
	expect(function() {
		// @ts-expect-error
		return TableModelUtils.generateSimpleTabelModelsOutOfComplicatedTableModel(normalizedInputTableModel);
	}()).toEqual(expectedSimplifiedOutputTableModel);
});