export default [{
    path: '/bug',
    component: resolve => require(['../views/modules/busi/bug.vue'], resolve)
}, {
    path: '/document',
    component: resolve => require(['../views/modules/busi/document.vue'], resolve)
}, {
    path: '/project',
    component: resolve => require(['../views/modules/busi/project.vue'], resolve)
}, {
    path: '/projectUser',
    component: resolve => require(['../views/modules/busi/projectUser.vue'], resolve)
}, {
    path: '/proplan',
    component: resolve => require(['../views/modules/busi/proplan.vue'], resolve)
}, {
    path: '/requirement',
    component: resolve => require(['../views/modules/busi/requirement.vue'], resolve)
}, {
    path: '/requirementUser',
    component: resolve => require(['../views/modules/busi/requirementUser.vue'], resolve)
}];
