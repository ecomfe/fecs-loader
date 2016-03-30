var webpack = require('webpack');

module.exports = {
    entry: {
        main: './main.js'
    },
    output: {
        path: './build',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.(less|css|js)$/, loader: 'fecs-loader'} // 要把fecs-loader放在语言处理loader之前
        ]
    }
};