var path = require('path');

var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = {

    entry: "./app/App.jsx",

    output: {

        filename: "app.js",

        path: path.join(__dirname, "public")
    },
    resolve: {

        extensions: [".js", ".jsx", ".json"]
    },
    module: {

        rules: [

            { test: /\.jsx?$/, loader: ["babel-loader"] },
            {
                test: /\.css$/,
                include: /node_modules/,
                loaders: ['style-loader', 'css-loader'],
            }
        ]
    },
    
    
};
module.exports = {
  plugins: [
    new HardSourceWebpackPlugin()
  ]
};
module.exports = config;