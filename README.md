# YYAdmin 管理系统前端

## 1.文件结构
```shell
.
├── build  项目构建配置
└── src
    ├── images  图片文件
    ├── libs  工具方法
    ├── router  路由配置
    ├── store  状态管理
    ├── styles  样式文件
    ├── template  模板文件
    ├── vendors  公共库文件
    └── views
        ├── error-page  错误页面
        ├── group  带二级目录的页面
        │   ├── page1  二级页面1
        │   ├── page2  二级页面2
        ├── home  首页
        ├── main-components  主组件
        ├── page  一级目录页面
```  
## 2.功能设计  
###  2.1权限设计  
1.登录时后台认证授权，返回jwt,存储至localStorage，避免cookie数据泄露；    
2.解析jwt,判断router的accessCode是否有权限(Util.showThisRoute)；  
3.