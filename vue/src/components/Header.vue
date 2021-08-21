<template>
  <div class="k-header">
    <div class="k-header-1">後台管理</div>
    <div class="k-header-2"></div>
    <div class="k-header-3">
      <el-dropdown>
        <span class="el-dropdown-link">
          使用者名稱<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>個人資料</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/login')">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>


  </div>
</template>

<script>
export default {
  name: "Header.vue"
}
</script>

<style scoped>

.k-header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  display: flex;
}

.k-header-1 {
  width: 200px;
  padding-left: 30px;
  font-weight: bold;
  color: dodgerblue;
}

.k-header-2 {
  flex: 1
}

.k-header-3 {
  width: 100px;
  margin-right: 30px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}


</style>