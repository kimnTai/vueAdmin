import axios from 'axios'
import router from "@/router";

const request = axios.create({
    baseURL: "/api",
    timeout: 5000
})

// 請求白名單，如果請求在白名單裡面，將不會被攔截校驗權限
const whiteUrls = ["/user/login", '/user/register']

// request 攔截器
// 可以自請求發送前對請求做一些處理
// 比如統一加token，對請求參數統一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    // config.headers['token'] = user.token;  // 設置請求頭

    if (!whiteUrls.includes(config.url)) {  // 校驗請求白名單
        // 取出sessionStorage裡面緩存的用戶信息
        let userJson = sessionStorage.getItem("user")
        if (!userJson) {
            router.push("/login")
        }
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 攔截器
// 可以在接口響應後統一處理結果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服務端返回的字符串數據
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

