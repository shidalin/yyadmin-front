import Main from '@/views/Main.vue';

export const workflow = [{
    path: 'process_definition',
    icon: 'key',
    name: 'process_definition',
    access: 'workflow_process_definition',
    title: '流程定义',
    component: Main,
    children: [{
        path: 'index',
        title: '流程定义',
        name: 'process_definition_index',
        component: () =>
            import ('@/views/modules/workflow/processDefinition.vue')
    }]
}];