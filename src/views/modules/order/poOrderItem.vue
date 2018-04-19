<template>
<div>
    <div class="layout-button">
        <Row>
            <Col span="10">
            <div :hidden="itemPageHidden">
                <Input v-model="queryValue">
                <Select slot="prepend" style="width: 80px" v-model="queryField">
                    <Option v-for="item in queryConditions" :value="item.value" :label="item.label"></Option>
                </Select>
                <Button slot="append" icon="ios-search" type="primary" @click="btnQuery"></Button>
                </Input>
            </div>
            </Col>
            <Col span="12" offset="1">
            <div>
                <Button type="success" @click="btnAdd">增行</Button>
                <Button type="error" @click="btnListRemove">删行</Button>
            </div>
            </Col>
        </Row>
    </div>
    <!--数据表格  -->
    <Table :data="poOrderItems" :columns="poOrderItemTableColumns" height="500" @on-selection-change="selectionChange" stripe border ref="poOrderItemDataTable"></Table>
    <!--分页  -->
    <div style="margin: 10px;overflow: hidden;" :hidden="itemPageHidden">
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
import printJS from "print-js";
import html2canvas from "html2canvas";

export default {
    data() {
        // let currentRow = {};
        let tableColumns = [{
                type: "selection",
                width: 60
                // align: 'center',
                // fixed: 'left'
            },
            {
                title: "主表主键",
                key: "pid",
                width: 120
            },
            {
                title: "商品编码",
                key: "materialId",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                //父子通信 显示触发更新事件，通知父组件数据状态改变
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "商品名称",
                key: "materialName",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "数量",
                key: "nnum",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "重量",
                key: "nweight",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "单位",
                key: "castunitid",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "含税单价",
                key: "nqtorigtaxprice",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "价税合计",
                key: "norigtaxmny",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "分类",
                key: "marbasclass",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "规格",
                key: "materialspec",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "text",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            },
            {
                title: "备注",
                key: "vmemo",
                width: 120,
                render: (h, param) => {
                    //文本输入框渲染器
                    let self = this;
                    return h("Input", {
                        props: {
                            type: "textarea",
                            value: self.poOrderItems[param.index][param.column.key]
                        },
                        on: {
                            "on-change" (event) {
                                let key = param.column.key;
                                self.poOrderItems[param.index][key] = event.target.value;
                                self.$emit('update:propItemData', self.poOrderItems);
                            }
                        }
                    });
                }
            }
        ];
        let queryConditions = [{
            value: "",
            label: ""
        }];
        return {
            poOrderItems: [],
            //父子通信，单向数据传输，用父组件传递的prop进行数据初始化
            //  parentRowID: this.propParentRowID,
            //数据总数
            total: 0,
            //当前页码
            current: 1,
            //每页条数
            pageSize: 10,
            //table表格
            poOrderItemTableColumns: tableColumns,
            //多选选中的数据
            selectedIndex: [],
            //查询条件参数
            queryConditions: queryConditions,
            //查询条件
            queryField: "",
            //查询字段值
            queryValue: "",
            //当前编辑行
            currentRow: {}
        };
    },
    watch: {
        parentRowID: function(val, oldVal) {
            let self = this;
            if (val !== "") {
                //修改状态，加载子表数据
                self.list_poOrderItem(self.current, self.pageSize);
            } else {
                // 新增状态下清空数据
                self.poOrderItems = [];
            }
        }
    },
    props: {
        propItemData: Array,
        propItemPageHidden: Boolean,
        propParentRowID: String
    },
    //子组件
    components: {},
    computed: {
        itemPageHidden: function() {
            let self = this;
            return self.propItemPageHidden;
        },
        parentRowID: function() {
            let self = this;
            return self.propParentRowID;
        }
    },
    //钩子方法，页面渲染结束后加载
    created() {
        let self = this;
    },
    methods: {
        btnAdd() {
            //数据新增
            let self = this;
            //加载新的行到table
            let param = {};
            self.poOrderItems.push(param);
        },
        btnListRemove() {
            //批量删除
            let self = this;
            //删除
            let ids = self.selectedIndex;
            //远程持久化数据
            //界面数据处理
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
        },
        //远程请求数据
        list_poOrderItem(current, pageSize) {
            //分页查询
            let self = this;
            //查询条件，关联主表主键
            let condition = {};
            condition['pid'] = self.parentRowID;
            //远程请求数据
            self.$http
                .post("/order/poOrderItem/list", {
                    current: self.current,
                    size: self.pageSize,
                    condition: condition
                })
                .then(response => {
                    self.poOrderItems = response.data.data.records;
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
                self.$http
                    .post("/order/poOrderItem/list", {
                        current: self.current,
                        size: self.pageSize,
                        //构造查询条件
                        condition: condition
                    })
                    .then(response => {
                        self.poOrderItems = response.data.data.records;
                        self.total = response.data.data.total;
                    });
            } else {
                self.list_poOrderItem(self.current, self.pageSize);
            }
        },
        //跳转页
        changePage(current) {
            //跳转页
            let self = this;
            self.current = current;
            self.list_poOrderItem(self.current, self.pageSize);
        },
        //切换每页条数
        changePageSize(pageSize) {
            //切换每页条数
            let self = this;
            self.pageSize = pageSize;
            self.list_poOrderItem(self.current, self.pageSize);
        },
        pageRefreshEvent(current, pageSize) {
            //数据刷新
            let self = this;
            self.list_poOrderItem(self.current, self.pageSize);
        },
        selectionChange(selection) {
            //选中更改事件
            let self = this;
            //selection 已选中数据
            self.selectedIndex = [];
            if (selection instanceof Array) {
                selection.forEach(function(v, k) {
                    self.selectedIndex.push(v);
                });
            } else {
                self.selectedIndex.push(selection);
            }
        }
    }
};
</script>
