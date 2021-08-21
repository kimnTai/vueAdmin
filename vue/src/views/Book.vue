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
          prop="name"
          label="名稱">
      </el-table-column>
      <!--資料庫 nick_name 前台自動轉駝峰，mybaitPlus做的-->
      <el-table-column
          prop="price"
          label="單價">
      </el-table-column>
      <el-table-column
          prop="author"
          label="作者">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="出版時間">
      </el-table-column>
      <el-table-column label="封面">
        <template #default="scope">
          <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover"
              :preview-src-list="[scope.row.cover]">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
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
      <el-dialog title="提示" v-model="dialogVisible" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="名稱">
            <el-input v-model="form.name" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="價格">
            <el-input v-model="form.price" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="form.author" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="出版時間">
            <el-date-picker v-model="form.createTime" value-format="YYYY-MM-DD" type="date" style="width: 80%"
                            clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="封面">
            <el-upload action="http://localhost:9090/files/upload" :on-success="filesUploadSuccess">
              <el-button type="primary">點擊上傳</el-button>
            </el-upload>
          </el-form-item>

        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">確 認</el-button>
          </span>
        </template>
      </el-dialog>


    </div>
  </div>
</template>

<script>


import request from "../utils/request";

export default {
  name: 'Book',
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
      tableData: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    filesUploadSuccess(res) {
      console.log(res)
      this.form.cover = res.data
    },
    load() {
      this.isLoading = true;
      request.get("/book", {
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
      if (this.$refs['upload']) {
        this.$refs['upload'].clearFiles()  // 清除歷史文件列表
      }
    },
    save() {
      if (this.form.id) {   // 如果 form 有 id  => 更新
        request.put("/book", this.form).then(res => {
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
      } else {                      // 新增
        request.post("/book", this.form).then(res => {
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
        if (this.$refs['upload']) {
          this.$refs['upload'].clearFiles()  // 清除歷史文件列表
        }
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
      request.delete("/book/" + id).then(res => {
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
