import * as path from "path";
import * as webpack from "webpack";
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config: webpack.Configuration = {
    entry: {
        bundle: "./src/index.tsx"
    },
    target: "web",
    output: {
        path: path.resolve(__dirname, ".dist"),
        filename: "[name].js?date=" + Math.floor(new Date().getTime() / 1000),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test:  /.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env"
                            ]
                        }
                    }
                ]
            },
            {
                exclude: "/node_modules/",
                test: /\.(ts|tsx)/,
                use: "ts-loader"   
            },
            {
                test: /\.styl$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[path][name]-[local]"
                            }
                        }
                    },
                    "stylus-loader"
                ]
            },
            {
                test: /\.(png|svg)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "assets/",
                    esModule: false
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/public/index.html",
            chunks: ["bundle"]
        })
    ],
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        https: false,
        publicPath: "/",
        historyApiFallback: true,
        clientLogLevel: "debug"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".wav", ".opus", ".svg", ".flac"],
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    }
};

export default config;