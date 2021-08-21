<template>
  <div class="bg-light">
    <div class="container mt-5">

      <el-form class="row justify-content-center" ref="form" :model="form" size="normal">
        <div class="col-md-6">
          <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
          <el-form-item class="mb-2">
            <label class="sr-only">帳號</label>
            <el-input prefix-icon="el-icon-user-solid" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item class="mb-2">
            <label class="sr-only">密碼</label>
            <el-input prefix-icon="el-icon-lock" v-model="form.password" show-password></el-input>
          </el-form-item>
          <el-form-item class="text-end mt-4">
            <el-button class="btn btn-lg btn-primary btn-block" @click="login">登入</el-button>
          </el-form-item>
        </div>
      </el-form>


    </div>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "Login",
  data() {
    return {
      form: {},
    }
  },
  methods: {
    login() {
      request.post("/api/user/login", this.form).then(res => {
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "登入成功",
          })
          this.$router.push("/")    // 登入成功之後，跳轉到主頁
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>