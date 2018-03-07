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
                    <Button type="success" @click="btnAdd">新增</Button>
                    <Button type="error" @click="btnListRemove">批量删除</Button>
                </div>
                </Col>
            </Row>
        </div>

        <!--数据表格  -->
        <Table :data="requirements" :columns="requirementTableColumns" height="500" stripe></Table>
        <!--分页  -->
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <!--  show-elevator 跳转页-->
                <!-- show-sizer 每页显示多少条-->
                <!--show-total 显示总页数  -->
                <Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage"
                      @on-page-size-change="changePageSize" show-elevator show-sizer show-total></Page>
            </div>
        </div>
        <!--明细信息  -->
        <div>
            <Modal :mask-closable="false" :closable="false" v-model="modalShow" width="800" title="需求信息" ok-text="保存"
                   @on-cancel="modalClosedEvent" @on-ok="modalConfirmEvent">
                <Form label-position="left" :label-width="80" ref="modalForm" :model="modalForm" :rules="modalRule">
                        <Row>
                            <Col span="11">
                            <Form-item label="需求主键" prop="id">
                                <Input v-model="modalForm.id" type="text"
                                       placeholder="请输入需求主键"></Input>
                            </Form-item>
                            </Col>
                                <Col span="11" offset="2">
                                <Form-item label="创建时间"
                                           prop="gmtCreate">
                                    <Input v-model="modalForm.gmtCreate" type="text"
                                           placeholder="请输入创建时间"></Input>
                                </Form-item>
                                </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                            <Form-item label="最后修改时间" prop="gmtModified">
                                <Input v-model="modalForm.gmtModified" type="text"
                                       placeholder="请输入最后修改时间"></Input>
                            </Form-item>
                            </Col>
                                <Col span="11" offset="2">
                                <Form-item label="需求名称"
                                           prop="requirementName">
                                    <Input v-model="modalForm.requirementName" type="text"
                                           placeholder="请输入需求名称"></Input>
                                </Form-item>
                                </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                            <Form-item label="需求编码" prop="requirementCode">
                                <Input v-model="modalForm.requirementCode" type="text"
                                       placeholder="请输入需求编码"></Input>
                            </Form-item>
                            </Col>
                                <Col span="11" offset="2">
                                <Form-item label="需求内容"
                                           prop="requirementContent">
                                    <Input v-model="modalForm.requirementContent" type="text"
                                           placeholder="请输入需求内容"></Input>
                                </Form-item>
                                </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                            <Form-item label="需求创建者" prop="requirementCreator">
                                <Input v-model="modalForm.requirementCreator" type="text"
                                       placeholder="请输入需求创建者"></Input>
                            </Form-item>
                            </Col>
                                <Col span="11" offset="2">
                                <Form-item label="需求人天"
                                           prop="requirementWorkDays">
                                    <Input v-model="modalForm.requirementWorkDays" type="text"
                                           placeholder="请输入需求人天"></Input>
                                </Form-item>
                                </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                            <Form-item label="上级需求" prop="requirementPid">
                                <Input v-model="modalForm.requirementPid" type="text"
                                       placeholder="请输入上级需求"></Input>
                            </Form-item>
                            </Col>
                                <Col span="11" offset="2">
                                <Form-item label="项目主键"
                                           prop="pkProject">
                                    <Input v-model="modalForm.pkProject" type="text"
                                           placeholder="请输入项目主键"></Input>
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
            },
                    {
                            title: '#',
                        key: 'id',
                        width: 120
                    },
                    {
                                title: '创建时间',
                        key: 'gmtCreate',
                        width: 120
                    },
                    {
                                title: '最后修改时间',
                        key: 'gmtModified',
                        width: 120
                    },
                    {
                                title: '需求名称',
                        key: 'requirementName',
                        width: 120
                    },
                    {
                                title: '需求编码',
                        key: 'requirementCode',
                        width: 120
                    },
                    {
                                title: '需求内容',
                        key: 'requirementContent',
                        width: 120
                    },
                    {
                                title: '需求创建者',
                        key: 'requirementCreator',
                        width: 120
                    },
                    {
                                title: '需求人天',
                        key: 'requirementWorkDays',
                        width: 120
                    },
                    {
                                title: '上级需求',
                        key: 'requirementPid',
                        width: 120
                    },
                    {
                                title: '项目主键',
                        key: 'pkProject',
                        width: 120
                    },
                {
                    title: '操作',
                    key:'action',
                    width:150,
                    align:'center',
                    fixed:'right',
                    render:
                            (h, params) =>
                {
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
        },
            [//子节点
                h('Icon', {
                    props: {
                        type: 'edit',
                        color: '#3399ff'
                    }
                })
            ]
        )
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
        },
            [
                h('Icon', {
                    props: {
                        type: 'trash-b',
                        color: '#ff3300'
                    }
                })
            ]
        )
        ])

        ])
            ;
        }
        }
        ]
            ;
            return {
                requirements: [],
                //数据总数
                total: 0,
                //当前页码
                current: 1,
                //每页条数
                pageSize: 10,
                //table表格
                requirementTableColumns: tableColumns,
                //父子通信属性
                modalShow: false,
                modalForm: {},
                modalRule: {},
                modalIndex: 0
            }
        },
        //子组件
        components: {},
        computed: {},
        //钩子方法，页面渲染结束后加载
        created() {
            this.list_requirement(this.current, this.pageSize);
        },
        methods: {
            //远程请求数据
            list_requirement(current, pageSize) {
                //参数
                let params = {
                    'page': current,
                    'size': pageSize
                };
                let promise = new Promise((resolve, reject) => {
                    Util.ajax({
                    url: '/requirement/list',
                    method: 'post',
                    params: params
                }).then((response) => {
                    resolve(response.data);
            })
            })
                ;
                promise.then((result) => {
                    this.requirements = result.data.list;
                this.total = result.data.total;
            })
            },
            //跳转页
            changePage(current) {
                this.current = current;
                this.list_requirement(this.current, this.pageSize);
            },
            //切换每页条数
            changePageSize(pageSize) {
                this.pageSize = pageSize;
                this.list_requirement(this.current, this.pageSize);
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
                    url: '/requirement/detail/' + id,
                    method: 'post'
                }).then((response) => {
                    resolve(response.data);
            })
            })
                ;
                promise.then((result) => {
                    this.modalForm = result.data;});
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
                    url: '/requirement/remove',
                    method: 'post',
                    data: ids
                }).then((result) => {
                    resolve(result)
                }
            )
            })
                ;
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
                        url: '/requirement/add',
                        method: 'post',
                        data: self.modalForm
                    }).then((response) => {
                        resolve();
                })
                })
                    ;
                    promise.then(() => {
                        //刷新数据，跳转到最后一页
                        self.current = Math.trunc(self.total / self.pageSize) + 1;
                    self.pageRefreshEvent(this.current, this.pageSize);
                    self.$Message.info("保存成功");
                })
                    ;
                } else {
                    //远程持久化数据-更新
                    let promise = new Promise((resolve, reject) => {
                        Util.ajax({
                        url: '/requirement/update',
                        method: 'post',
                        data: self.modalForm
                    }).then((result) => {
                        resolve(result)
                    }
                )
                })
                    ;
                    promise.then((result) => {
                        //局部更新数据
                        Vue.set(self.requirements, self.modalIndex, result.data.data);
                    self.$Message.success("保存成功");
                })
                }
            },
            pageRefreshEvent(current, pageSize) {
                this.list_requirement(current, pageSize);
            }

        }
    }
</script>
