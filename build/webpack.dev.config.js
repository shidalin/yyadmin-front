const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'yyadmin v' + package.version,
            filename: '../index.html',
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/views/main-components/theme-switch/theme'
            },
            {
                from: 'src/views/my-components/text-editor/tinymce'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        })
    ]
});

/**********************跨域请求虚拟服务器设置************************************/
/**
 * cors跨域解决方案
 * 1.前端访问node服务器：浏览器访问地址http://localhost:8080
 * 2.前端访问服务器接口请求API数据，产生跨域访问问题
 * 3.增加express服务进行请求代理转发，配置跨域相关配置
 * 4.增加htp-proxy-middleware请求中间件，配置代理相关配置
 * 5.访问流程：前端访问虚拟服务器express，虚拟服务器express对前端请求进行代理转发，访问实际后端
 */
//服务端模拟转发请求，使用expres
var express = require('express');
var app = express();
//虚拟服务器设置跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

//代理请求中间件
var proxyMiddleware = require('http-proxy-middleware');

//代理转发配置：远程服务器实际访问地址
var proxyTable = {
    '/api': { //用 （/api）代替 （http://127.0.0.1:8080/api）
        target: "http://127.0.0.1:8089",
        changeOrigin: true, //是否跨域
        pathRewrite: {
            '/api': '' //路径重写，替换 （/api）,替换后实际访问地址为（http://127.0.0.1:8089）
        }
    }
};

Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = {
            target: options
        };
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

//启动虚拟服务器(中间层)
var server = app.listen(8888, function () {
    var host = server
        .address()
        .address;
    var port = server
        .address()
        .port;
    console.log('app listening at http://%s:%s', host, port);
});