// const { merge } = require("webpack-merge");
import { merge } from "webpack-merge"
// import * as path from "path";
// const path = require("path");
import common from "./webpack.common.js"

// const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		static: "./assets",
		historyApiFallback: {
			disableDotRule: true,
		},
	allowedHosts: ["*"]
	},
});
