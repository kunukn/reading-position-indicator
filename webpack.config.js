const webpack = require('webpack'),
    path = require('path'),
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {

    // Variables set by npm scripts in package.json
    const isProduction = env.production === true;
    const platform = env.platform; // 'default' by default

    return {
        devtool: 'eval',
        context: path.resolve('./'),
        entry: {
            demo: ['./src/assets/demo'],
            rpi: ['./src/assets/rpi'],            
        },
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '',
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js',
            libraryTarget: "var",        
            library: "readingPositionIndicator"
        },
        devServer: {
            open: true,
            contentBase: './',
            noInfo: true,
            port: 3333,
        },
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(isProduction),
                PLATFORM: JSON.stringify(platform)
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
            }),
             new ExtractTextPlugin({
                filename: '[name].bundle.css',
                allChunks: true,
            }),
        ],
        module: {
            rules: [                
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [/node_modules/],
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                    exclude: [/node_modules/],
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        loader: 'css-loader?importLoaders=1',
                    }),
                    exclude: [/node_modules/],
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ]
                },
                {
                    test: /\.(png|gif|jpg)$/,
                    loader: 'url-loader',
                    options: { limit: '25000' },
                    exclude: [/node_modules/],
                },
                {
                    test: /\.(ttf|eot|svg)$/,
                    loader: 'file-loader',
                    exclude: [/node_modules/],
                }
            ]
        },
        resolve: {
            extensions: ['.js'],
        },
        externals: {},
    }
};