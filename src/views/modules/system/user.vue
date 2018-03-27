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
  <Table :data="users" :columns="userTableColumns" height="500" stripe border ></Table>
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
    <Modal :mask-closable="false" :closable="false" v-model="modalShow" width="800" title="用户信息" ok-text="保存" @on-cancel="modalClosedEvent" @on-ok="modalConfirmEvent">
      <Form label-position="left" :label-width="80" ref="modalForm" :model="modalForm" :rules="modalRule">
        <Row>
          <Col span="11">
          <Form-item label="用户名" prop="userName">
            <Input v-model="modalForm.userName" type="text" placeholder="请输入用户名"></Input>
          </Form-item>
          </Col>
          <Col span="11" offset="2">
          <Form-item label="用户编码" prop="userCode">
            <Input v-model="modalForm.userCode" type="text" placeholder="请输入用户编码"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="11">
          <Form-item label="用户邮箱" prop="userEmail">
            <Input v-model="modalForm.userEmail" type="text" placeholder="请输入用户邮箱"></Input>
          </Form-item>
          </Col>
          <Col span="11" offset="2">
          <Form-item label="用户电话" prop="userPhone">
            <Input v-model="modalForm.userPhone" type="text" placeholder="请输入用户电话"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="11">
          <Form-item label="用户类型" prop="userType">
            <Select v-model="modalForm.userType" placeholder="请输入用户类型">
                <Option value="0">普通用户</Option>
                <Option value="1">管理员</Option>
              </Select>
          </Form-item>
          </Col>
          <Col span="11" offset="2">
          <Form-item label="用户状态" prop="status">
            <Select v-model="modalForm.status" placeholder="请输入用户状态">
                <Option value="true">暂停状态</Option>
                <Option value="false">正常状态</Option>
              </Select>
          </Form-item>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</div>
</template>
<script>
import Vue from "vue";
export default {
  data() {
    let tableColumns = [
      {
        type: "selection",
        width: 60
        // align: 'center',
        // fixed: "left"
      },
      {
        title: "#",
        key: "id",
        width: "60",
        ellipsis: true
      },
      {
        title: "用户名",
        key: "userName"
      },
      {
        title: "用户编码",
        key: "userCode"
      },
      {
        title: "用户邮箱",
        key: "userEmail",
        width: "200"
      },
      {
        title: "用户电话",
        key: "userPhone"
      },
      {
        title: "用户类型",
        key: "userType",
        render: (h, params) => {
          const row = params.row;
          const color =
            row.userType === "0"
              ? "blue"
              : row.userType === "1" ? "green" : "red";
          const text =
            row.userType === "0"
              ? "普通用户"
              : row.userType === "1" ? "管理员用户" : "未知状态";
          return h(
            "Tag",
            {
              props: {
                type: "dot",
                color: color
              }
            },
            text
          );
        }
      },
      {
        title: "用户状态",
        key: "status",
        render: (h, params) => {
          const row = params.row;
          const color = row.status ? "blue" : "green";
          const text = row.status ? "暂停状态" : "正常状态";
          return h(
            "Tag",
            {
              props: {
                type: "dot",
                color: color
              }
            },
            text
          );
        }
      },
      {
        title: "创建时间",
        key: "gmtCreate",
        width: "150"
      },
      {
        title: "最后修改时间",
        key: "gmtModified"
      },
      {
        title: "操作",
        key: "action",
        width: 160,
        align: "center",
        // fixed: "right",
        render: (h, params) => {
          return h("div", [
            h(
              "Button",
              {
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
              "Button",
              {
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
    return {
      users: [],
      //数据总数
      total: 0,
      //当前页码
      current: 1,
      //每页条数
      pageSize: 10,
      //table表格
      userTableColumns: tableColumns,
      //父子通信属性
      modalShow: false,
      modalForm: {},
      modalRule: {},
      modalIndex: 0
    };
  },
  //子组件
  components: {},
  computed: {},
  //钩子方法，页面渲染结束后加载
  created() {
    this.list_user(this.current, this.pageSize);
  },
  methods: {
    //远程请求数据
    list_user(current, pageSize) {
      let self = this;
      self.$http
        .post("/system/user/list", {
          current: current,
          size: pageSize
        })
        .then(response => {
          self.users = response.data.data.records;
          self.total = response.data.data.total;
        });
    },
    //跳转页
    changePage(current) {
      this.current = current;
      this.list_user(this.current, this.pageSize);
    },
    //切换每页条数
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.list_user(this.current, this.pageSize);
    },
    btnDetail(index) {},
    btnPrint() {
      //打印
      // this.$router.push("http://localhost:8088/activiti-explorer/");
      let self = this;
      self.$http.get("/activiti-explorer/");
    },
    btnUpdate(params) {
      //显示界面
      this.modalShow = true;
      //操作行主键
      let id = params.row.id;
      this.modalIndex = params.index;
      //远程加载数据
      let promise = new Promise((resolve, reject) => {
        self
          .$http({
            url: "/system/user/detail/" + id,
            method: "post"
          })
          .then(response => {
            resolve(response.data);
          });
      });
      promise.then(result => {
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
        self
          .$http({
            url: "/system/user/remove",
            method: "post",
            data: ids
          })
          .then(result => {
            resolve(result);
          });
      });
      promise.then(result => {
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
        self.$Message.success("删除成功");
      });
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
      if (
        self.modalForm.id == undefined ||
        self.modalForm.id == null ||
        self.modalForm.id == ""
      ) {
        // 远程持久化数据-新增
        let promise = new Promise((resolve, reject) => {
          self
            .$http({
              url: "/system/user/add",
              method: "post",
              data: self.modalForm
            })
            .then(response => {
              resolve();
            });
        });
        promise.then(() => {
          //刷新数据，跳转到最后一页
          self.current = Math.trunc(self.total / self.pageSize) + 1;
          self.pageRefreshEvent(this.current, this.pageSize);
          self.$Message.info("保存成功");
        });
      } else {
        //远程持久化数据-更新
        let promise = new Promise((resolve, reject) => {
          self
            .$http({
              url: "/user/update",
              method: "post",
              data: self.modalForm
            })
            .then(result => {
              resolve(result);
            });
        });
        promise.then(result => {
          //局部更新数据
          Vue.set(self.users, self.modalIndex, result.data.data);
          self.$Message.success("保存成功");
        });
      }
    },
    pageRefreshEvent(current, pageSize) {
      this.list_user(current, pageSize);
    }
  }
};
</script>
