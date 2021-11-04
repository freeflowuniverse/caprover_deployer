const path = require("path")

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'fs': path.resolve(__dirname, 'src/polyfills/fs'),
                'ts-rmb-http-client': 'ts-rmb-http-client/dist/es6',
                'ts-rmb-redis-client': 'ts-rmb-redis-client/dist/es6',
                'grid3_client': 'grid3_client/dist/es6'
            }
        }
    }
}
