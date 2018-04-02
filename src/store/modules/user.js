// import Cookies from 'js-cookie';
import Util from '@/libs/util';

const user = {
    state: {},
    mutations: {
        logout (state, vm) {
            // Cookies.remove('user');
            // Cookies.remove('jwt');
            // Cookies.remove('access');
            // 清除所有的cookie
            Util.clearAllCookie();
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    }
};

export default user;
