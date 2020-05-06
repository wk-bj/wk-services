import axios from "axios";
import Qs from "qs";
import "./expromise";
import Message from "./msgbox";

const toString = Object.prototype.toString;
const service = axios.create({
    baseURL: "",
    timeout: 60000,
    transformRequest: function(data, config, test) {
        return Qs.stringify(data);
    },
    headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest"
    }
});
const showMessage = (message, type = "error") => {
    Message({
        showClose: true,
        type: type,
        duration: 4000,
        message
    });
};

/**
 * 服务端接口empty字符串跟null返回的结果不同，过滤掉empty字符串
 * @param params
 */
function filterEmptyKey(params) {
    Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null) {
        delete params[key];
    }
});
}
function getQueryString(url,name) {
    var varsArr = url;
    var vars= '' ;
    varsArr.forEach(item=>{
        if(item.indexOf(name)!=-1){
        vars= item ;
    }
})
    let final='';
    if(vars.indexOf('&')>-1){
        var pair = vars.split("&");
        pair.map(item=>{
            var curItem= item.split("=");
        if(curItem[0]==name){
            console.log('curItem',curItem[1],name)
            final=curItem[1]
        }
    })
    }else {
        var curItem= vars.split("=");
        if(curItem[0]==name){
            console.log('curItem',curItem[1],name)
            final= curItem[1]
        }
    }
    return final
}

service.interceptors.request.use(
    config => {
    let tokenStr= localStorage.getItem(CONSTANT.LOGIN_TOKE + `_${localStorage.getItem(CONSTANT.TENANT_ID)}`);
if(tokenStr){
    config.headers[CONSTANT.POST_LOGIN_TOKE_STRING] = tokenStr;
}
if (config.method === "post") {
    const params = {
        ...config.data
};
    // filterEmptyKey(params);
    // params._t = Date.parse(new Date()) / 1000;
    config.data = params;
} else if (config.method === "get") {
    config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
}
}
return config;
},
function(error) {
    return Promise.reject(error);
}
);

service.interceptors.response.use(
    res => {
    console.log('res====response',res)
const { data, config } = res;
if ((!data.success || data.success === "false") && data.code !== 200) {
    const msg = data.errorMessage || data.message || "未知错误";
    const code = data.errorCode || data.code || -1000;

    //未手动配置 隐藏 消息提示时，公共提醒错误
    if (!config.hidden) {
        showMessage(`${config.action}失败：${msg}`);
    }

    //登录权限跳转
    if (code === 401) {
        message = "暂无权限，请先登录";
        showMessage(`${error.config.action}失败：${message}`);
        var path =window.location.pathname;
        var hash=decodeURIComponent(window.location.hash.replace('#',''));
        // var redirect = decodeURIComponent(path+hash);
        var curSeachUrl = window.location.href.split('?');
        let curTid= getQueryString(curSeachUrl,'tid');
        localStorage.setItem(CONSTANT.TENANT_ID,curTid)
        window.location.href = `${window.location.origin}${path}#/login?redirect=${hash}`;

    }

    //return Promise.reject(new Error('请求失败'))
    return Promise.reject({
        code: code,
        message: msg
    });
}

return data || {};
},
error => {
    if (!error.config.hidden) {
        let message = error.message;
        if (error.response && error.response.status === 403) {
            message = "您没有该权限";
        } else if (error.response && error.response.status === 502) {
            message = "系统升级中，请稍后重试";
        } else if (error.response && error.response.status === 504) {
            message = "系统超时，请重试";
        } else if (error.response && error.response.status === 401) {
            message = "暂无权限，请先登录";
            showMessage(`${error.config.action}失败：${message}`);
            // var path =window.location.pathname;
            // var search=window.location.search;
            // var redirect = decodeURIComponent(path+search);
            // window.top.location.href = `${window.location.origin}?redirect=${redirect}`;
            showMessage(`${error.config.action}失败：${message}`);
            var path =window.location.pathname;
            var hash=decodeURIComponent(window.location.hash.replace('#',''));
            // var redirect = decodeURIComponent(path+hash);
            var curSeachUrl = window.location.href.split('?');
            let curTid= getQueryString(curSeachUrl,'tid');
            localStorage.setItem(CONSTANT.TENANT_ID, curTid)
            window.location.href = `${window.location.origin}${path}#/login?redirect=${hash}`;

        }
        showMessage(`${error.config.action}失败：${message}`);
    }
    return Promise.reject(error);
}
);

/**
 * 以json格式向后端提交数据
 *
 * @param {String} url 请求的url
 * @param {Object} params 参数
 * @param {Object} config 配置
 *
 * @returns promise对象
 */
service.json = (url, params, config) => {
    let isArray = Object.prototype.toString.call(params) === "[object Array]";
    const defaultConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        transformRequest: function(data, requestConfig) {
            if (isArray) {
                return JSON.stringify(params);
            }
            return JSON.stringify(data);
        }
    };
    const newConfig = Object.assign(defaultConfig, config);
    return service.post(url, params, newConfig);
};

var services = {
    install: function(Vue) {
        if (!Vue.prototype.$services) {
            Object.defineProperties(Vue.prototype, {
                $services: {
                    get: function() {
                        return services;
                    },
                },
            });
        }
    },
    get: function (key) {
        return service;
    },
};

export default services;

if (typeof window !== 'undefined' && !window.$services) {
    window.$services = services;
}