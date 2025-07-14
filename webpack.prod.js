// const { merge } = require("webpack-merge");
import { merge } from "webpack-merge"
import common from "./webpack.common.js"


// const common = require("./webpack.common.js");

// module.exports = merge(common, {
export default merge(common, {
	mode: "production",
	devtool: "source-map",
});
