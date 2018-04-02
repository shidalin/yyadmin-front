<template>
<div>
    <div class="layout-button">
        <Row>
            <Col span="10">
            <Input v-model="queryValue">
            <Select slot="prepend" style="width: 80px" v-model="queryField">
                    <Option v-for="item in queryConditions" :value="item.value" :label="item.label"></Option>
                </Select>
            <Button slot="append" icon="ios-search" type="primary" @click="btnQuery"></Button>
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
    <Table :data="poOrders" :columns="poOrderTableColumns" height="500" @on-selection-change="selectionChange" stripe border ref="poOrderDataTable"></Table>
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
        <Modal :mask-closable="false" :closable="false" v-model="modalShow" width="1200" title="订单信息" ok-text="保存" @on-cancel="modalClosedEvent" @on-ok="modalConfirmEvent">
            <Form label-position="left" :label-width="100" ref="modalForm" :model="modalForm" :rules="modalRule">
                <Row>
                    <Col span="11">
                    <Form-item label="订单编号" prop="orderCode">
                        <Input v-model="modalForm.orderCode" type="text" placeholder="请输入订单编号"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                    <Col span="11">
                    <Form-item label="经销商编码" prop="dealerId">
                        <Input v-model="modalForm.dealerId" type="text" placeholder="请输入经销商编码"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                    <Form-item label="经销商名称" prop="dealerName">
                        <Input v-model="modalForm.dealerName" type="text" placeholder="请输入经销商名称"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                    <Col span="11">
                    <Form-item label="业务员" prop="busiman">
                        <Input v-model="modalForm.busiman" type="text" placeholder="请输入业务员"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                    <Form-item label="部门" prop="dept">
                        <Input v-model="modalForm.dept" type="text" placeholder="请输入部门"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                    <Col span="11">
                    <Form-item label="制单日期" prop="dbilldate">
                        <Input v-model="modalForm.dbilldate" type="text" placeholder="请输入制单日期"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                    <Form-item label="收货单位" prop="recvunit">
                        <Input v-model="modalForm.recvunit" type="text" placeholder="请输入收货单位"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                    <Col span="11">
                    <Form-item label="收货地址" prop="recvadr">
                        <Input v-model="modalForm.recvadr" type="text" placeholder="请输入收货地址"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                    <Form-item label="开票单位" prop="invcunit">
                        <Input v-model="modalForm.invcunit" type="text" placeholder="请输入开票单位"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                    <Col span="11">
                    <Form-item label="起运数量" prop="transnum">
                        <Input v-model="modalForm.transnum" type="text" placeholder="请输入起运数量"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                    <Form-item label="要求交货日期" prop="dreqdate">
                        <Input v-model="modalForm.dreqdate" type="text" placeholder="请输入要求交货日期"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                    <Col span="11">
                    <Form-item label="预定出货日期" prop="dpredate">
                        <Input v-model="modalForm.dpredate" type="text" placeholder="请输入预定出货日期"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                    <Form-item label="币种" prop="currency">
                        <Input v-model="modalForm.currency" type="text" placeholder="请输入币种"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                    <Col span="11">
                    <Form-item label="备注" prop="vmemo">
                        <Input v-model="modalForm.vmemo" type="text" placeholder="请输入备注"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1"> &nbsp;
                    </Col>
                </Row>
                <Row>
                </Row>
            </Form>
        </Modal>
    </div>
</div>
</template>
<script>
import printJS from "print-js";
import html2canvas from "html2canvas";

export default {
    data() {
        let tableColumns = [{
                type: 'selection',
                width: 60,
                // align: 'center',
                // fixed: 'left'
            },

            {
                title: '订单编号',
                key: 'orderCode',
                width: 120
            },
            {
                title: '经销商编码',
                key: 'dealerId',
                width: 120
            },
            {
                title: '经销商名称',
                key: 'dealerName',
                width: 120
            },
            {
                title: '业务员',
                key: 'busiman',
                width: 120
            },
            {
                title: '部门',
                key: 'dept',
                width: 120
            },
            {
                title: '制单日期',
                key: 'dbilldate',
                width: 120
            },
            {
                title: '收货单位',
                key: 'recvunit',
                width: 120
            },
            {
                title: '收货地址',
                key: 'recvadr',
                width: 120
            },
            {
                title: '开票单位',
                key: 'invcunit',
                width: 120
            },
            {
                title: '起运数量',
                key: 'transnum',
                width: 120
            },
            {
                title: '要求交货日期',
                key: 'dreqdate',
                width: 120
            },
            {
                title: '预定出货日期',
                key: 'dpredate',
                width: 120
            },
            {
                title: '币种',
                key: 'currency',
                width: 120
            },
            {
                title: '备注',
                key: 'vmemo',
                width: 120
            },

            {
                title: '操作',
                key: 'action',
                width: 160,
                align: 'center',
                fixed: 'right',
                render:
                    (h, params) => {

                        return h("div", [
                            h(
                                "Button", {
                                    props: {
                                        type: "primary"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.btnUpdate(params);
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "Button", {
                                    props: {
                                        type: "error"
                                    },
                                    on: {
                                        click: () => {
                                            this.btnRemove(params);
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
            }
        ];
        let queryConditions = [{
            value: "",
            label: ""
        }];
        return {
            poOrders: [],
            //数据总数
            total: 0,
            //当前页码
            current: 1,
            //每页条数
            pageSize: 10,
            //table表格
            poOrderTableColumns: tableColumns,
            //父子通信属性
            modalShow: false,
            modalForm: {},
            modalRule: {},
            modalIndex: 0,
            //多选选中的数据
            selectedIndex: [],
            //查询条件参数
            queryConditions: queryConditions,
            //查询条件
            queryField: "",
            //查询字段值
            queryValue: ""
        }
    },
    //子组件
    components: {},
    computed: {},
    //钩子方法，页面渲染结束后加载
    created() {
        let self = this;
        self.list_poOrder(self.current, self.pageSize);
    },
    methods: {
        btnAdd() {
            //数据新增
            let self = this;
            self.modalForm = {};
            self.modalShow = true;
        },
        btnRemove(params) {
            //单行删除
            let self = this;
            self.modalIndex = params.index;
            //远程持久化数据
            self.$http.post("/order/poOrder/remove/" + params.row.id).then(result => {
                //计算当前页数
                //向下取整函数 Math.trunc()
                //删除页数
                let removePageCount = Math.trunc(1 / self.pageSize);
                //最后一页尾数全部删除掉，后退一页
                if (
                    self.total % self.pageSize != 0 &&
                    self.total % self.pageSize == 1 % self.pageSize
                ) {
                    removePageCount += 1;
                }
                self.current -= removePageCount;
                //刷新页面数据
                self.pageRefreshEvent(self.current, self.pageSize);
                self.$Message.success("删除成功");
            });
        },
        btnListRemove() {
            //批量删除
            let self = this;
            //删除
            let ids = self.selectedIndex;
            //远程持久化数据
            self.$http.post("/order/poOrder/remove", ids).then(result => {
                //计算当前页数
                //向下取整函数 Math.trunc()
                //删除页数
                let removePageCount = Math.trunc(ids.length / self.pageSize);
                //最后一页尾数全部删除掉，后退一页
                if (
                    self.total % self.pageSize != 0 &&
                    self.total % self.pageSize == ids.length % self.pageSize
                ) {
                    removePageCount += 1;
                }
                self.current -= removePageCount;
                //刷新页面数据
                self.pageRefreshEvent(self.current, self.pageSize);
                self.$Message.success("批量删除成功");
            });
        },
        btnUpdate(params) {
            //数据更新
            let self = this;
            //显示界面
            self.modalShow = true;
            //操作行主键
            let id = params.row.id;
            self.modalIndex = params.index;
            //远程加载数据
            self.$http.post("/order/poOrder/detail/" + id).then(response => {
                self.modalForm = response.data.data;
            });
        },
        //远程请求数据
        list_poOrder(current, pageSize) {
            //分页查询
            let self = this;
            //远程请求数据
            self.$http
                .post("/order/poOrder/list", {
                    current: self.current,
                    size: self.pageSize
                })
                .then(response => {
                    self.poOrders = response.data.data.records;
                    self.total = response.data.data.total;
                });
        },
        btnQuery() {
            //查询事件
            let self = this;
            let condition = {};
            if (self.queryField !== "" && self.queryValue !== "") {
                //动态构造查询条件
                let conditionKey = self.queryField;
                let conditionValue = self.queryValue;
                condition[conditionKey] = conditionValue;
                self.$http.post("/order/poOrder/list", {
                    current: self.current,
                    size: self.pageSize,
                    //构造查询条件
                    condition: condition
                }).then(response => {
                    self.poOrders = response.data.data.records;
                    self.total = response.data.data.total;
                });
            } else {
                self.list_poOrder(self.current, self.pageSize);
            }
        },
        btnPrint() {
            let self = this;
            let table = this.$refs.poOrderDataTable.$el;
            /* 这部分代码用来解决生成的图片不清晰的问题 */
            let tableWidth = table.offsetWidth;
            let tableHeight = table.offsetHeight;
            let canvas = document.createElement("canvas");
            canvas.width = tableWidth * 2;
            canvas.height = tableHeight * 2;
            canvas.style.width = tableWidth + "px";
            canvas.style.height = tableHeight + "px";
            document.body.appendChild(canvas);
            var context = canvas.getContext("2d");
            context.scale(2, 2);
            /* 这部分代码用来解决生成的图片不清晰的问题 */
            //曲线救国，先转换成图片，再进行打印
            html2canvas(table, {
                // canvas: canvas,
                onrendered(image) {
                    let url = image.toDataURL();
                    printJS({
                        printable: url,
                        type: "image",
                        header: "订单信息"
                    });
                }
            });
        },
        modalConfirmEvent() {
            //数据保存
            let self = this;
            self.modalShow = false;
            //modal确认事件
            if (
                self.modalForm.id == undefined ||
                self.modalForm.id == null ||
                self.modalForm.id == ""
            ) {
                // 远程持久化数据-新增
                self.$http.post("/order/poOrder/add", self.modalForm).then(response => {
                    //刷新数据，跳转到最后一页
                    self.current = Math.trunc(self.total / self.pageSize) + 1;
                    self.pageRefreshEvent(self.current, self.pageSize);
                    self.$Message.info("新增保存成功");
                });
            } else {
                //远程持久化数据-更新
                self.$http.post("/order/poOrder/update", self.modalForm).then(result => {
                    //局部更新数据
                    self.pageRefreshEvent(self.current, self.pageSize);
                    self.$Message.success("修改保存成功");
                });
            }
        },
        //跳转页
        changePage(current) {
            //跳转页
            let self = this;
            self.current = current;
            self.list_poOrder(self.current, self.pageSize);
            this.list_poOrder(this.current, this.pageSize);
        },
        //切换每页条数
        changePageSize(pageSize) {
            //切换每页条数
            let self = this;
            self.pageSize = pageSize;
            self.list_poOrder(self.current, self.pageSize);
        },
        modalClosedEvent() {
            //modal关闭事件
            this.modalShow = false;
        },
        pageRefreshEvent(current, pageSize) {
            //数据刷新
            let self = this;
            self.list_poOrder(self.current, self.pageSize);
        },
        selectionChange(selection) {
            //选中更改事件
            let self = this;
            //selection 已选中数据
            self.selectedIndex = [];
            if (selection instanceof Array) {
                selection.forEach(function(v, k) {
                    self.selectedIndex.push(v.id);
                });
            } else {
                self.selectedIndex.push(selection.id);
            }
        }

    }
}
</script>
