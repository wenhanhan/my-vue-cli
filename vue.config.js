const path =  require('path');
const resolve = (dir) => path.join(__dirname, dir);
const port = process.env.port||process.env.npm_config_port||8080
const name='vue-cli4框架';
module.exports={
    publicPath: process.env.NODE_ENV === 'production' ? '/': '/',
    outputDir: process.env.outputDir || 'dist',//生产环境构建文件的路径
    assetsDir: 'static',// 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: process.env.NODE_ENV==="development", // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    productionSourceMap:false,
    devServer:{
        host: "localhost",
        port: port,
        open:true,
        hotOnly: true,
        // proxy: 'http://localhost:8080' // 配置跨域处理,只有一个代理
        proxy:{
            [process.env.VUE_APP_BASE_API]:{
                target:'http://localhost:8080',//跨域后可改写
                changeOrigin: true,
                pathRewrite: {
                    ["^"+process.env.VUE_APP_BASE_API]: ""
                }
            }
        },
        disableHostCheck: true,
    },
    configureWebpack:{
        name:name,
        resolve:{
            alias:{
                "@":resolve("src")
            }
        }
    },
    chainWebpack(config){
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace=true
                return options
            })
            .end();
        config.when(process.env.NODE_ENV==="development",config=>config.devtool("cheap-source-map"));
        config.when(process.env.NODE_ENV!=="development",config=>{
            config
                .plugin("ScriptExtHtmlWebpackPlugin")
                .after("html")
                .use("script-ext-html-webpack-plugin",[
                    {
                        inline:/runtime\..*\.js$/
                    }
                ])
                .end();
            config.optimization.splitChunks({
                chuncks:"all",
                cacheGroups:{
                    libs:{
                        name:"chunk-libs",
                        test:/[\\/]node_modules[\\/]/,
                        priority:10,
                        chuncks:"initial"
                    },
                    elementUI:{
                        name:"chunk-elementUI",
                        priority:20,
                        test:/[\\/]node_modules[\\/]_?element-ui(.*)/,
                    },
                    commons:{
                        name:"chunk-commons",
                        test:resolve("src/components"),
                        minChunks:3,
                        priority:5,
                        reuseExistingChunk:true
                    }
                }
            });
            config.optimization.runtimeChunk("single")
        })
    }
}