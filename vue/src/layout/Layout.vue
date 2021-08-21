<template>
  <div>
    <!-- 頭部 -->
    <Header/>
    <!-- 主體 -->
    <div style="display: flex">
      <!-- 側邊欄 -->
      <Aside  />
      <!-- 內容 -->
      <el-config-provider :locale="locale">
        <router-view style="flex: 1"/>
      </el-config-provider>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import Aside from "@/components/Aside";
import { ElConfigProvider } from 'element-plus'
import zhTw from 'element-plus/lib/locale/lang/zh-tw'

export default {
  name: "Layout",
  components: {
    Header,
    Aside,
    [ElConfigProvider.name]: ElConfigProvider,
  },
  data(){
    return{
      locale:zhTw,
    }
  }
}
</script>

<style scoped>

</style>