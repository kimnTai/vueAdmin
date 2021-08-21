<template>
  <div class="bg-light">
    <div class="container mt-5">

      <el-form class="row justify-content-center" ref="form" :rules="rules" :model="form" size="normal">
        <div class="col-md-6">
          <h1 class="h3 mb-3 font-weight-normal">歡迎註冊</h1>
          <el-form-item class="mb-2" prop="username">
            <label class="sr-only">使用者名稱</label>
            <el-input prefix-icon="el-icon-user-solid" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item class="mb-2" prop="password">
            <label class="sr-only">密碼</label>
            <el-input prefix-icon="el-icon-lock" v-model="form.password" show-password></el-input>
          </el-form-item>
          <el-form-item class="mb-2" prop="confirm">
            <label class="sr-only">確認密碼</label>
            <el-input prefix-icon="el-icon-lock" v-model="form.confirm" show-password></el-input>
          </el-form-item>
          <el-form-item class="text-end mt-4">
            <el-button class="btn btn-lg btn-primary btn-block" @click="register">註冊</el-button>
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
      rules: {
        username: [{required: true, message: '請输入用戶名', trigger: 'blur'}],
        password: [{required: true, message: '請输入密碼', trigger: 'blur'}],
        confirm: [{required: true, message: '請確認密碼', trigger: 'blur'}],
      }
    }
  },
  methods: {
    register() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.form.password !== this.form.confirm) {
          this.$message({type: "error", message: "兩次密碼輸入不一致",})
          return
        }
        request.post("/user/register", this.form).then(res => {
          if (res.code !== '0') {
            this.$message({type: "error", message: res.msg,})
            return
          }
          this.$message({type: "success", message: "註冊成功",})
          this.$router.push("/login")    // 註冊成功之後，跳轉到主頁
        })
      })
    }
  }
}
</script>

<style scoped>

</style>