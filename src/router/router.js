import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () =>
        import ('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () =>
        import ('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () =>
        import ('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () =>
        import ('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () =>
        import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
            path: 'home',
            title: "主页",
            name: 'home_index',
            component: () =>
                import ('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () =>
                import ('@/views/own-space/own-space.vue')
        },
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () =>
                import ('@/views/message/message.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/system',
        icon: 'key',
        name: 'system',
        title: '系统管理',
        component: Main,
        children: [{
                path: 'user',
                title: '用户',
                access: 'system_user',
                name: 'system_user',
                component: () =>
                    import ('@/views/modules/system/user.vue')
            },
            {
                path: 'role',
                title: '角色',
                access: 'system_role',
                name: 'system_role',
                component: () =>
                    import ('@/views/modules/system/role.vue')
            },
            {
                path: 'menu',
                title: '菜单',
                access: 'system_menu',
                name: 'system_menu',
                component: () =>
                    import ('@/views/modules/system/menu.vue')
            },
            {
                path: 'organization',
                title: '组织',
                access: 'system_organization',
                name: 'system_organization',
                component: () =>
                    import ('@/views/modules/system/organization.vue')
            },
            {
                path: 'user_role',
                title: '用户角色',
                access: 'system_user_role',
                name: 'system_user_role',
                component: () =>
                    import ('@/views/modules/system/userRole.vue')
            },
            {
                path: 'role_menu',
                title: '角色菜单',
                access: 'system_role_menu',
                name: 'system_role_menu',
                component: () =>
                    import ('@/views/modules/system/roleMenu.vue')
            },
            {
                path: 'system_log',
                title: '系统日志',
                access: 'system_log',
                name: 'system_log',
                component: () =>
                    import ('@/views/modules/system/systemLog.vue')
            },
            {
                path: 'system_druid',
                title: '数据库分析',
                access: 'system_druid',
                name: 'system_druid',
                component: () =>
                    import ('@/views/modules/system/druid.vue')
            }
        ]
    },
    {
        path: '/order',
        icon: 'key',
        name: 'order',
        title: '订单管理',
        component: Main,
        children: [{
                path: 'material',
                title: '商品',
                access: 'order_material',
                name: 'order_material',
                component: () =>
                    import ('@/views/modules/order/material.vue')
            },
            {
                path: 'dealer',
                title: '经销商',
                access: 'order_dealer',
                name: 'order_dealer',
                component: () =>
                    import ('@/views/modules/order/dealer.vue')
            },
            {
                path: 'order',
                title: '采购订单',
                access: 'order_po_order',
                name: 'order_po_order',
                component: () =>
                    import ('@/views/modules/order/poOrder.vue')
            },
            {
                path: 'orderItem',
                title: '采购订单子表',
                access: 'order_po_orderItem',
                name: 'order_orderItem',
                component: () =>
                    import ('@/views/modules/order/poOrderItem.vue')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];