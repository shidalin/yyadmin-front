export default [{
        path: '/menu',
        component: resolve => require(['../views/modules/system/menu.vue'], resolve)
    },
    {
        path: '/organization',
        component: resolve => require(['../views/modules/system/organization.vue'], resolve)
    },
    {
        path: '/role',
        component: resolve => require(['../views/modules/system/role.vue'], resolve)
    },
    {
        path: '/roleMenu',
        component: resolve => require(['../views/modules/system/roleMenu.vue'], resolve)
    },
    {
        path: '/systemLog',
        component: resolve => require(['../views/modules/system/systemLog.vue'], resolve)
    },
    {
        path: '/user',
        component: resolve => require(['../views/modules/system/user.vue'], resolve)
    },
    {
        path: '/userRole',
        component: resolve => require(['../views/modules/system/userRole.vue'], resolve)
    },
    {
        path: '/druid',
        component: resolve => require(['../views/modules/system/druid.vue'], resolve)
    }
]