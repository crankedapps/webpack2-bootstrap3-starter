// Import some required modules
const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// Check if in production, set associated CSS loader config
var isProd = process.env.NODE_ENV === 'production';
var cssDev = ['style-loader', 'css-loader', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader']
});
var cssConfig = isProd ? cssProd : cssDev;
// Import bootstrap config
var bootstrapEntryPoints = require('./webpack.bootstrap.config');
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

// Export config object
module.exports = {
    entry: {
        app: './src/app.js',
        contact: './src/contact.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    //'file-loader?name=[name]_[hash].[ext]&outputPath=images/&publicPath=images/',
                    'file-loader?name=images/[name]_[hash].[ext]',
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name]_[hash].[ext]'
            },
            {
                test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
                loader: 'imports-loader?jQuery=jquery'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        stats: "errors-only",
        hot: true,
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project',
            //minify: {
            //    collapseWhitespace: true
            //},
            hash: true,
            excludeChunks: ['contact'], // only exclude
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Contact Page',
            hash: true,
            filename: 'contact.html',
            chunks: ['contact'], // Only include
            template: './src/contact.html'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};