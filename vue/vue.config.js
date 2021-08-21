// 跨域配置
module.exports = {
    devServer: {                //記住，別寫錯了devServer//設置本地默認端口  選填
        port: 9876,
        proxy: {                 //設置代理，必須填
            '/api': {              //設置攔截器  攔截器格式   斜杠+攔截器名字，名字可以自己定
                target: 'http://localhost:9090',     //代理的目標地址
                changeOrigin: true,              //是否設置同源，輸入是的
                pathRewrite: {                   //路徑重寫
                    '/api': ''                     //选選擇忽略攔截器裡面的單詞
                }
            }
        }
    }
}
