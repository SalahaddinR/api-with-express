const path = require("path");
const nodeExternals = require("webpack-node-externals");
const handlebarsWebpackPlugin = require("handlebars-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    target: 'node',
    mode: 'development',
    entry: {
        server: path.resolve(__dirname, 'index.js')
    },
    resolve: {
        extensions: ['.js', '.json', '.hbs']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(css|sass|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    externals: [nodeExternals()],
    plugins: [
        new handlebarsWebpackPlugin({
            entry: path.resolve("src/public/views/*.hbs"),
            output: path.resolve("dist/static/views/[name].hbs")
        }),
        new copyWebpackPlugin({
            patterns: [
                { 
                    from: path.resolve(__dirname, 'src/public/styles'),
                    to: path.resolve(__dirname, 'dist/static/styles')
                },
                {
                    from: path.resolve(__dirname, 'src/public/assets'),
                    to: path.resolve(__dirname, 'dist/static/assets' )
                }
            ]
        })
    ]
}