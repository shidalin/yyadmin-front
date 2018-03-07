<style lang="less">
@import "./login.less";
</style>

<template>
<div class="login" @keydown.enter="handleSubmit">
  <div class="login-con">
    <Card :bordered="false">
      <p slot="title">
        <Icon type="log-in"></Icon>
        欢迎登录
      </p>
      <div class="form-con">
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="userName">
            <Input v-model="form.userName" placeholder="请输入用户名">
            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码">
            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                              </span>
            </Input>
          </FormItem>
          <FormItem>
            <Button @click="handleSubmit" type="primary" long>登录</Button>
          </FormItem>
        </Form>
        <p class="login-tip">输入admin和admin即可</p>
      </div>
    </Card>
  </div>
</div>
</template>

<script>
import Cookies from "js-cookie";
import sha256 from "../libs/sha256.js";
export default {
  data() {
    return {
      form: {
        userName: "admin",
        password: ""
      },
      rules: {
        userName: [{
          required: true,
          message: "账号不能为空",
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: "密码不能为空",
          trigger: "blur"
        }]
      }
    };
  },
  methods: {
    handleSubmit() {
      let self = this;
      self.$refs.loginForm.validate(valid => {
        if (valid) {
          //调用远程登录接口,password需要加密
          self.$http
            .post("/login", {
              username: self.form.userName,
              password: sha256.sha256_digest(self.form.password)
            })
            .then(function(response) {
              Cookies.set("user", self.form.userName);
              // cookie存储jwt
              Cookies.set("jwt", response.data.data.jwt);
              //cookie存储菜单
              Cookies.set("menus", response.data.data.menus);
              self.$store.commit(
                "setAvator",
                "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
              );
              if (self.form.userName === "admin") {
                Cookies.set("access", 0);
              } else {
                Cookies.set("access", 1);
              }
              self.$router.push({
                name: "home_index"
              });
            });
        }
      });
    }
  }
};
</script>

<style>

</style>
