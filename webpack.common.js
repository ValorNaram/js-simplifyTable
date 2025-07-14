// const path = require("path");
import * as path from "path";
import { fileURLToPath } from "url";
// import * as HtmlWebpackPlugin from "html-webpack-plugin";
// import * as CopyPlugin from "copy-webpack-plugin";


// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// module.exports = {
export default {
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
				resolve: {
					fullySpecified: false,
				},
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
		fullySpecified: false
	},
	devServer: {
		host: "0.0.0.0",
		port: 8080,
		allowedHosts:
			- "*"
	},
	output: {
		filename: "jssimplifytable-bundle.js",
		path: path.resolve(__dirname, "dist_browser"),
		globalObject: "this",
		publicPath: "/",
		library: {
			name: "SimplifyTable",
			type: "umd",
			//export: "default",
		},
		clean: true,
	},
	entry: "./src/index.ts",
};
