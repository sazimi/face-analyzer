module.exports = {
    module: {
        rules: [
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    resolve: {
        extensions: ['.json']
    }
};