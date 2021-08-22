<template>

  <div class="home bg-secondary">
    <!-- 功能區域 -->
    <!--    <Loading :active="isLoading"></Loading>-->
    <div>
      <el-button class="btn btn-primary" @click="add">新增</el-button>
      <el-button class="btn btn-primary">導入</el-button>
      <el-button class="btn btn-primary">導出</el-button>

    </div>
    <!-- 搜索區域 -->
    <div style="margin: 15px 0;">
      <el-input class="fs-5" v-model="search" placeholder="請輸入關鍵字" style="width: 20%" size="normal"
                clearable></el-input>
      <el-button class="btn btn-primary" style="margin-left: 10px" @click="load">查詢</el-button>
    </div>
    <el-table
        class="fs-5"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column
          prop="id"
          label="ID"
          sortable>
      </el-table-column>
      <el-table-column
          prop="title"
          label="標題">
      </el-table-column>
      <el-table-column
          prop="author"
          label="作者">
      </el-table-column>
      <el-table-column
          prop="time"
          label="時間">
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button class="btn btn-info" size="mini" @click="details(scope.row)">詳情</el-button>
          <el-button class="btn btn-secondary" size="mini" @click="handleEdit(scope.row)">編輯</el-button>
          <el-popconfirm title="確定刪除嗎？" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button size="mini" class="btn btn-danger">刪除</el-button>
            </template>
          </el-popconfirm>


        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 15px 0">
      <!--分頁-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!--新增-->
      <el-dialog title="提示" v-model="dialogVisible" width="50%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="標題">
            <el-input v-model="form.title" style="width: 50%"></el-input>
          </el-form-item>
          <div id="div1"></div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">確 認</el-button>
          </span>
        </template>
      </el-dialog>
      <!--詳情-->
      <el-dialog title="提示" v-model="vis" width="50%">
        <el-card>
          <div v-html="detail.content" style="min-height: 150px"></div>
        </el-card>
      </el-dialog>

    </div>
  </div>
</template>

<script>

import E from "wangeditor"
import request from "../utils/request";

let editor;

export default {
  name: 'News',
  components: {},
  data() {
    return {
      isLoading: false,
      form: {},
      dialogVisible: false,
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      vis: false,
      detail: {},
    }
  },
  created() {
    this.load()
  },
  methods: {
    details(row) {
      this.detail = row;
      this.vis = true;
    },
    filesUploadSuccess(res) {
      console.log(res)
      this.form.cover = res.data
    },
    load() {
      this.isLoading = true;
      request.get("/news", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        this.isLoading = false;
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },

    add() {
      this.dialogVisible = true
      this.form = {}  // 先清空表單

      this.$nextTick(() => {
        if (!editor) {
          editor = new E('#div1')

          // 配置 server 接口地址
          editor.config.uploadImgServer = 'http://localhost:9090/files/editor/upload'
          editor.config.uploadFileName = "file"  // 设置上传参数名称
          editor.create()
        }
      })

    },
    save() {
      this.form.content = editor.txt.html();  // 獲取編輯器裡面的值，然後賦值到實體

      if (this.form.id) {   // 如果 form 有 id  => 更新
        request.put("/news", this.form).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.$message({
              type: "success",
              message: "更新成功",
            })
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            })
          }
        })
        this.load()                 // 刷新表格數據
        this.dialogVisible = false  // 關閉彈窗
      } else {   // 新增
        let userStr = sessionStorage.getItem("user") || "{}"
        let user = JSON.parse(userStr)
        this.form.author = user.nickName
        request.post("/news", this.form).then(res => {
          console.log(res)
          this.$message({
            type: "success",
            message: "新增成功",
          })
        })
        this.load()                 // 刷新表格數據
        this.dialogVisible = false  // 關閉彈窗
      }

    },
    handleEdit(row) {
      this.form = {...row}
      this.dialogVisible = true
      this.$nextTick(() => {
        // 關聯彈窗內的 div，new一個 editor 物件
        if (!editor) {
          editor = new E('#div1')

          // 配置 server 接口地址
          editor.config.uploadImgServer = 'http://localhost:9090/files/editor/upload'
          editor.config.uploadFileName = "file"  // 設置上傳參數名稱
          editor.create()
        }

        editor.txt.html(row.content)
      })
    },
    handleSizeChange(pageSize) {
      // 改變當前頁面個數
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      // 改變當前頁碼
      this.currentPage = pageNum
      this.load()
    },
    handleDelete(id) {
      console.log(id)
      request.delete("/news/" + id).then(res => {
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "刪除成功",
          })
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          })
        }
        this.load()    // 刷新表格頁面
      })
    },
  },
}
</script>

<style>
.home {
  padding: 20px;
}
</style>
