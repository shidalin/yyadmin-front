<template>
    <div>
        <div class="layout-button">
            <Row>
                <Col span="10">
                <Input>
                <Select slot="prepend" style="width: 80px">
                    <Option value="projectName">项目名</Option>
                    <Option value="projectCode">项目编码</Option>
                </Select>
                <Button slot="append" icon="ios-search"></Button>
                </Input>
                </Col>
                <Col span="12" offset="1">
                <div>
                    <Button type="info" @click="btnPrint">打印</Button>
                    <Button type="success" @click="btnAdd">新增</Button>
                    <Button type="error" @click="btnListRemove">批量删除</Button>
                    <Button type="success" @click="btnCommit">提交</Button>
                </div>
                </Col>
            </Row>
        </div>

        <!--数据表格  -->
        <Table :data="projects" :columns="projectTableColumns" height="500" stripe></Table>
        <!--分页  -->
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <!--  show-elevator 跳转页-->
                <!-- show-sizer 每页显示多少条-->
                <!--show-total 显示总页数  -->
                <Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer show-total></Page>
            </div>
        </div>
        <!--明细信息  -->
        <div>
            <Modal :mask-closable="false" :closable="false" v-model="modalShow" width="800" title="项目信息" ok-text="保存" @on-cancel="modalClosedEvent" @on-ok="modalConfirmEvent">
                <Form label-position="left" :label-width="80" ref="modalForm" :model="modalForm" :rules="modalRule">
                    <Row>
                        <Col span="11">
                        <Form-item label="项目名称" prop="projectName">
                            <Input v-model="modalForm.projectName" type="text" placeholder="请输入项目名称"></Input>
                        </Form-item>
                        </Col>
                        <Col span="11" offset="2">
                        <Form-item label="项目编码" prop="projectCode">
                            <Input v-model="modalForm.projectCode" type="text" placeholder="请输入项目编码"></Input>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Form-item label="合同编码" prop="contractCode">
                            <Input v-model="modalForm.contractCode" type="text" placeholder="请输入合同编码"></Input>
                        </Form-item>
                        </Col>
                        <Col span="11" offset="2">
                        <Form-item label="合同人天" prop="contractWorkDays">
                            <Input-number v-model="modalForm.contractWorkDays" type="text" placeholder="请输入合同人天"></Input-number>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Form-item label="上级项目" prop="projectPid">
                            <Input v-model="modalForm.projectPid" type="text" placeholder="请输入上级项目"></Input>
                        </Form-item>
                        </Col>
                        <Col span="11" offset="2">
                        <Form-item label="项目经理" prop="projectManager">
                            <Input v-model="modalForm.projectManager" type="text" placeholder="请输入项目经理"></Input>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                        <Form-item label="项目备注" prop="projectContent">
                            <Input v-model="modalForm.projectContent" type="textarea" placeholder="请输入项目备注"></Input>
                        </Form-item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    </div>
</template>
<script>
import Util from '../../../libs/util';
import Vue from 'vue';
export default {
    data() {
        let tableColumns = [{
            type: 'selection',
            width: 60,
            // align: 'center',
            fixed: 'left'
        }, {
            title: '#',
            key: 'id',
            width: '60'
        },
        {
            title: '项目名称',
            key: 'projectName'
        },
        {
            title: '项目编码',
            key: 'projectCode'
        },
        {
            title: '合同编码',
            key: 'contractCode'
        },
        {
            title: '合同人天',
            key: 'contractWorkDays'
        },
        {
            title: '上级项目',
            key: 'projectPid'
        },
        {
            title: '项目经理',
            key: 'projectManager'
        },
        {
            title: '创建时间',
            key: 'gmtCreate',
            width: '150'
        },
        {
            title: '最后修改时间',
            key: 'gmtModified'
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Tooltip', {
                        props: {
                            content: '编辑'
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
                                        this.btnUpdate(params)
                                    }
                                }
                            }, [//子节点
                                    h('Icon', {
                                        props: {
                                            type: 'edit',
                                            color: '#3399ff'
                                        }
                                    })
                                ])
                        ])
                    ,
                    h('Tooltip', {
                        props: {
                            content: '删除'
                        }
                    }, [
                            h('Button', {
                                props: {
                                    type: 'text'
                                },
                                on: {
                                    click: () => {
                                        this.btnRemove(params)
                                    }
                                }
                            }, [
                                    h('Icon', {
                                        props: {
                                            type: 'trash-b',
                                            color: '#ff3300'
                                        }
                                    })
                                ])
                        ]), h('Tooltip', {
                            props: {
                                content: '提交'
                            }
                        }, [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    on: {
                                        click: () => {
                                            this.btnCommit(params)
                                        }
                                    }
                                }, [
                                        h('Icon', {
                                            props: {
                                                type: 'chevron-up',
                                                color: '#ff3300'
                                            }
                                        })
                                    ])
                            ])

                ]);
            }
        }];
        return {
            projects: [],
            //数据总数
            total: 0,
            //当前页码
            current: 1,
            //每页条数
            pageSize: 10,
            //table表格
            projectTableColumns: tableColumns,
            //父子通信属性
            modalShow: false,
            modalForm: {},
            modalRule: {},
            modalIndex: 0
        }
    },
    //子组件
    components: {
    },
    computed: {
    },
    //钩子方法，页面渲染结束后加载
    created() {
        this.list_project(this.current, this.pageSize);
    },
    methods: {
        //远程请求数据
        list_project(current, pageSize) {
            //参数
            let params = {
                'page': current,
                'size': pageSize
            };
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/project/list',
                    method: 'post',
                    params: params
                }).then((response) => {
                    resolve(response.data);
                })
            });
            promise.then((result) => {
                this.projects = result.data.list;
                this.total = result.data.total;
            })
        },
        //跳转页
        changePage(current) {
            this.current = current;
            this.list_project(this.current, this.pageSize);
        },
        //切换每页条数
        changePageSize(pageSize) {
            this.pageSize = pageSize;
            this.list_project(this.current, this.pageSize);
        },
        btnDetail(index) {

        },
        btnPrint() {
            //打印
        },
        btnUpdate(params) {
            //显示界面
            this.modalShow = true;
            //操作行主键
            let id = params.row.id;
            this.modalIndex = params.index;
            //远程加载数据
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/project/detail/' + id,
                    method: 'post'
                }).then((response) => {
                    resolve(response.data);
                })
            });
            promise.then((result) => {
                this.modalForm = result.data;
            });
        },
        btnRemove(params) {
            let self = this;
            self.modalIndex = params.index;
            //删除
            let ids = [];
            ids.push(params.row.id);
            //远程持久化数据
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/project/remove',
                    method: 'post',
                    data: ids
                }).then((result) => {
                    resolve(result)
                })
            });
            promise.then((result) => {
                //计算当前页数
                //向下取整函数 Math.trunc()
                //删除页数
                let removePageCount = Math.trunc(ids.length / self.pageSize);
                //最后一页尾数全部删除掉，后退一页
                if (self.total % self.pageSize != 0 && self.total % self.pageSize == ids.length % self.pageSize) {
                    removePageCount += 1;
                }
                self.current -= removePageCount;
                //刷新页面数据
                self.pageRefreshEvent(self.current, self.pageSize);
                self.$Message.success("删除成功");
            })
        },
        btnAdd() {
            //新增
            let self = this;
            self.modalForm = {};
            self.modalShow = true;
        },
        btnListRemove() {
            //批量删除
        },
        btnCommit(params) {
            //提交
            let self = this;
            //获取选中的数据
            let processDefinitionKey = 'projectProcess';
            let businessType = 'project';
            let userID = self.$store.state.auth.current_user.id;
            let entityID = params.row.id;
            let data = {
                'processDefinitionKey': processDefinitionKey,
                'businessType': businessType,
                'userID': userID,
                'entityID': entityID
            };
            let promise = new Promise((resolve, reject) => {
                Util.ajax({
                    url: '/processDefinition/start',
                    method: 'post',
                    data: data
                }).then((resolve) => {
                    resolve()
                })
            }).then(() => {
                //刷新界面数据
                self.pageRefreshEvent(self.current, self.pageSize);
                //显示消息
                self.$Message.info("提交成功");
            })
        },
        modalClosedEvent() {
            //modal关闭事件
            this.modalShow = false;
        },
        modalConfirmEvent() {
            this.modalShow = false;
            //modal确认事件
            const self = this;
            if (self.modalForm.id == undefined || self.modalForm.id == null || self.modalForm.id == "") {
                // 远程持久化数据-新增
                let promise = new Promise((resolve, reject) => {
                    Util.ajax({
                        url: '/project/add',
                        method: 'post',
                        data: self.modalForm
                    }).then((response) => {
                        resolve();
                    })
                });
                promise.then(() => {
                    //刷新数据，跳转到最后一页
                    self.current = Math.trunc(self.total / self.pageSize) + 1;
                    self.pageRefreshEvent(self.current, self.pageSize);
                    self.$Message.info("保存成功");
                });
            } else {
                //远程持久化数据-更新
                let promise = new Promise((resolve, reject) => {
                    Util.ajax({
                        url: '/project/update',
                        method: 'post',
                        data: self.modalForm
                    }).then((result) => {
                        resolve(result)
                    })
                });
                promise.then((result) => {
                    //局部更新数据
                    Vue.set(self.projects, self.modalIndex, result.data.data);
                    self.$Message.success("保存成功");
                })
            }
        },
        pageRefreshEvent(current, pageSize) {
            this.list_project(current, pageSize);
        }

    }
}
</script>
