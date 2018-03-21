import Vue from 'vue';

// 存储工具类
let storage = {};

/**
 * 存储localStorage
 */
storage.set = (name, content) => {
    if (!name) {
        return;
    }
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
storage.get = name => {
    if (!name) {
        return;
    }
    return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
storage.remove = name => {
    if (!name) {
        return;
    }
    window.localStorage.removeItem(name);
};

// 添加axios实例到vue原型属性，避免过多重复import
Vue.prototype.$storage = storage;

export default storage;
