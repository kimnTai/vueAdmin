<template>
  <div class="">

    <el-menu
        style="width: 200px; min-height: 95vh"
        :default-active="path"
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">

      <el-submenu index="1" v-if="user.role === 1">
        <template #title>系統管理</template>
        <el-menu-item index="/user">用戶管理</el-menu-item>
      </el-submenu>

      <el-menu-item index="/book">書籍管理</el-menu-item>
      <el-menu-item index="/news">新聞管理</el-menu-item>

    </el-menu>

  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Aside",
  data() {
    return {
      user: {},
      path: this.$route.path   // 設置默認高亮的菜單
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  created() {
    console.log(this.$route.path)
    let userStr = sessionStorage.getItem("user") || "{}"
    this.user = JSON.parse(userStr)
    // 請求服務端，確認當前登錄用戶的 合法信息
    request.get("/user/" + this.user.id).then(res => {
      if (res.code === '0') {
        this.user = res.data
      }
    })
  }

}
</script>

<style scoped>

</style>