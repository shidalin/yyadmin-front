<template>
    <div>
        <div class="layout-button">
            <Row>
                <Col span="10">
                <Input>
                <Select slot="prepend" style="width: 80px">
                    <Option value="userName">用户名</Option>
                    <Option value="userCode">用户密码</Option>
                </Select>
                <Button slot="append" icon="ios-search"></Button>
                </Input>
                </Col>
                <Col span="12" offset="1">
                <div>
                    <Button type="info" @click="btnPrint">打印</Button>
                    <Button type="error" @click="btnListRemove">批量删除</Button>
                    <Button type="error" @click="btnListDeploy">批量部署</Button>
                    <Button type="error" @click="btnSynUserAndRole">同步人员角色信息</Button>
                </div>
                </Col>
            </Row>
        </div>

        <!--数据表格  -->
        <Table :data="processDefinitions" :columns="processDefinitionTableColumns" height="500" stripe></Table>
        <!--分页  -->
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <!--  show-elevator 跳转页-->
                <!-- show-sizer 每页显示多少条-->
                <!--show-total 显示总页数  -->
                <Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer show-total></Page>
            </div>
        </div>
    </div>
</template>
<script>
import Util from '../../../libs/util';
import Vue from 'vue';
import iView from 'iview';
export default {
    data() {
        let tableColumns = [{
            type: 'selection',
            width: 60,
            fixed: 'left'
        }, {
            title: '#',
            key: 'id',
            width: 200
        },
        {
            title: 'category',
            key: 'category',
            width: 400
        },
        {
            title: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'key',
            key: 'key',
            width: 200
        },
        {
            title: 'description',
            key: 'description',
            width: 200
        },
        {
            title: 'version',
            key: 'version',
            width: 200
        },
        {
            title: 'resourceName',
            key: 'resourceName',
            width: 400
        },
        {
            title: 'deploymentId',
            key: 'deploymentId',
            width: 200
        },
        {
            title: 'diagramResourceName',
            key: 'diagramResourceName',
            width: 800


        },
        {
            title: 'hasStartFormKey',
            key: 'hasStartFormKey',
            width: 200
        },
        {
            title: 'hasGraphicalNotation',
            key: 'hasGraphicalNotation',
            width: 200
        },
        {
            title: 'isSuspended',
            key: 'isSuspended',
            width: 200
        },
        {
            title: 'tenantId',
            key: 'tenantId',
            width: 200
        },
        {
            title: 'engineVersion',
            key: 'engineVersion',
            width: 200
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Tooltip', {
                        props: {
                            content: '激活'
                        }
                    }, [
                            h('Button', {
                                props: {
                                    type: 'text'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.btnActivi(params)
                                    }
                                }
                            }, [//子节点
                                    h('Icon', {
                                        props: {
                                            type: 'key',
                                            color: '#3399ff'
                                        }
                                    })
                                ])
                        ])
                    ,
                    h('Tooltip', {
                        props: {
                            content: '挂起'
                        }
                    }, [
                            h('Button', {
                                props: {
                                    type: 'text'
                                },
                                on: {
                                    click: () => {
                                        this.btnSuspend(params)
                                    }
                                }
                            }, [
                                    h('Icon', {
                                        props: {
                                            type: 'locked',
                                            color: '#ff3300'
                                        }
                                    })
                                ])
                        ]),
                    h('Tooltip', {
                        props: {
                            content: '部署'
                        }
                    }, [
                            h('Button', {
                                props: {
                                    type: 'text'
                                },
                                on: {
                                    click: () => {
                                        this.btnDeploy(params)
                                    }
                                }
                            }, [
                                    h('Icon', {
                                        props: {
                                            type: 'arrow-graph-up-right',
                                            color: '#ff3300'
                                        }
                                    })
                                ])
                        ])

                ]);
            }
        }];
        return {
            processDefinitions: [],
            //数据总数
            total: 0,
            //当前页码
            current: 1,
            //每页条数
            pageSize: 10,
            //table表格
            processDefinitionTableColumns: tableColumns,
        }
    },
    //子组件
    components: {
    },
    computed: {
    },
    //钩子方法，页面渲染结束后加载
    created() {
        this.list_processDefinition(this.current, this.pageSize);
    },
    methods: {
        //远程请求数据
        list_processDefinition(current, pageSize) {
            //参数
            let params = {
                'page': current,
                'size': pageSize
            };
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/processDefinition/list',
                    method: 'post',
                    params: params
                }).then((response) => {
                    resolve(response.data);
                })
            });
            promise.then((result) => {
                this.processDefinitions = result.data.list;
                this.total = result.data.total;
            })
        },
        //跳转页
        changePage(current) {
            this.current = current;
            this.list_processDefinition(this.current, this.pageSize);
        },
        //切换每页条数
        changePageSize(pageSize) {
            this.pageSize = pageSize;
            this.list_processDefinition(this.current, this.pageSize);
        },
        btnDetail(index) {

        },
        btnPrint() {
            //打印
            // this.$router.push("http://localhost:8088/activiti-explorer/");
            Util.ajax({
                url: "/activiti-explorer/"
            })
        },
        btnActivi(params) {
            //操作行主键
            let self = this;
            let id = params.row.id;
            //远程加载数据
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/processDefinition/active',
                    method: 'post',
                    data: { 'processDefinitionId': id }
                }).then((response) => {
                    resolve(response.data);
                })
            });
            promise.then((result) => {
                //刷新页面数据
                self.pageRefreshEvent(self.current, self.pageSize);
            });
        },
        btnSuspend(params) {
            let self = this;
            //操作行主键
            let id = params.row.id;
            //远程加载数据
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/processDefinition/suspend',
                    method: 'post',
                    data: { 'processDefinitionId': id }
                }).then((response) => {
                    resolve(response.data);
                })
            });
            promise.then((result) => {
                //刷新页面数据
                self.pageRefreshEvent(self.current, self.pageSize);
            });
        },
        btnDeploy(params) {
            let self = this;
            //操作行主键
            let id = params.row.id;
            //远程加载数据
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/processDefinition/deploy',
                    method: 'post',
                    data: { 'ids': id }
                }).then((response) => {
                    resolve(response.data);
                })
            });
            promise.then((result) => {
                //刷新页面数据
                self.pageRefreshEvent(self.current, self.pageSize);
            });
        },
        btnListRemove() {
            //批量删除
        },
        btnListDeploy() {
            //批量部署

        },
        btnSynUserAndRole() {
            //人员角色信息同步
            //远程加载数据
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/processDefinition/synUserAndRole',
                    method: 'post'
                }).then((response) => {
                    resolve();
                })
            });
            promise.then(() => {
                //刷新页面数据
                iView.Message.info("人员角色信息同步成功");
            });
        },
        pageRefreshEvent(current, pageSize) {
            this.list_processDefinition(current, pageSize);
        }

    }
}
</script>
