<template>
  <div class="data">
    <div class="data-input">
      <div class="data-input-title">Select Your Data</div>
      <el-card class="box-card">
        <div class="user-file-list">
          <el-table class="mlt-table" ref="userFileTable" :data="filesInfo" highlight-current-row height="220" max-height="220" :default-sort="{prop: 'uploadDate', order: 'descending'}" @row-click="handleRowClick">
            <el-table-column property="filename" label="File Name" sortable>
              <template slot-scope="scope">
                <img class="file-table-icon" src="../assets/csv-icon.png" alt="">
                <span>{{ scope.row.filename }}</span>
              </template>
            </el-table-column>
            <el-table-column property="length" label="Size" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.length | filesize }}</span>
              </template>
            </el-table-column>
            <el-table-column property="uploadDate" label="Upload Date" sortable></el-table-column>
          </el-table>
        </div>
        <div class="user-file-upload">
          <div class="upload-switch">
            <div>Upload new data</div>
            <el-switch v-model="enableUpload" active-color="#13ce66" inactive-color="#e6e6e6"></el-switch>
          </div>
          <div class="upload-files" v-show="enableUpload">
            <div v-if="user?user.admin:false">
              <el-checkbox v-model="isDemo">Public</el-checkbox>
            </div>
            <el-upload drag multiple accept=".csv" ref="upload" :action="uploadUrl" :before-upload="beforeFileUpload" :on-remove="handleRemove" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleError" :auto-upload="false">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">drag file here or
                <em>Click to upload</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                <div class="data-imput-upoad-warn-text">only support csv file</div>
              </div>
            </el-upload>
            <div class="data-imput-btn-upoad" v-if="showUploadBtn">
              <el-button size="small" type="danger" @click="clearUploadList">Clear</el-button>
              <el-button size="small" type="success" @click="submitUpload">Upload</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="data-content">
      <div class="data-content-title">View Content</div>
      <div class="data-content-subtitle">{{currentSource.filename}}</div>
      <el-card class="box-card">
        <div class="user-file-list">
          <data-tables ref="userFileContentTable" :data="userFileContentList" :table-props="tableProps" :search-def="searchDef" :pagination-def="paginationDef" v-loading="isContentLoading" element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
            <!-- <el-table-column type="index"></el-table-column> -->
            <el-table-column v-for="field in userFileContentfields" :key="field" :label="field" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row[field] }}</span>
              </template>
            </el-table-column>
          </data-tables>
        </div>
        <div class="content-info">
          <span>
            <em>Row Size: </em>{{userFileContentList.length}}</span>
          <span>
            <em>Column Size: </em>{{userFileContentfields.length}}</span>
          <span>
            <em>Blank Row Size: </em>{{blankRowCount}}</span>
          <div class="content-info-btns">
            <el-button size="small" type="warning" @click="handleCleanEmpty">Clean</el-button>
            <el-button size="small" type="primary" @click="handleDownload">Download</el-button>
            <el-button v-if="isDeleteFileBtnShow" class="content-delete-btn" size="small" type="danger" @click="handleDelete">Delete</el-button>
          </div>
        </div>
        <el-dialog class="clean-confirm-dlg" title="Clean Confirm" :visible.sync="isCleanConfirmDlgShow" center>
          <span>Do you really want to clean the rows with empty data?</span>
          <span slot="footer" class="dialog-footer">
            <el-alert type="warning" title="Notice: After clean, upload again with your cleaned data" show-icon :closable="false"></el-alert>
            <el-button @click="isCleanConfirmDlgShow = false">Cancel</el-button>
            <el-button type="primary" @click="onCleanYes">Yes</el-button>
          </span>
        </el-dialog>
        <el-dialog class="delete-confirm-dlg" title="Delete Confirm" :visible.sync="isDeleteConfirmDlgShow" center>
          <span>Do you really want to delete the file
            <em>{{currentSource.filename}}</em>?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isDeleteConfirmDlgShow = false">Cancel</el-button>
            <el-button type="primary" @click="onDeleteYes">Yes</el-button>
          </span>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CsvExport from '@/util/csv-export'

export default {
  name: 'Data',

  data() {
    return {
      isDemo: false,
      tableProps: {
        'row-class-name': 'mlt-table-no-hover',
        border: false,
        stripe: true,
        style: 'width: 100%',
        height: '300',
        'max-height': '300'
      },
      searchDef: {
        show: true
      },
      paginationDef: {
        pageSize: 50
      },
      showUploadBtn: false,
      enableUpload: true,
      isContentLoading: false,
      isCleanConfirmDlgShow: false,
      isDeleteConfirmDlgShow: false
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'currentSource',
      'filesInfo',
      'fileContent'
    ]),
    uploadUrl: function () {
      return this.isDemo ? '/api/file/upload?demo=true' : '/api/file/upload/';
    },
    userFileContentList: function () {
      return this.fileContent || [];
    },
    userFileContentfields: function () {
      let fileContent = this.fileContent;
      if (fileContent && fileContent.length) {
        this.isContentLoading = false;
        return Object.keys(fileContent[0]);
      }
      this.isContentLoading = false;
      return [];
    },
    blankRowCount: function () {
      let count = 0
      let fileContent = this.fileContent;
      if (fileContent && fileContent.length) {
        let keys = Object.keys(fileContent[0]);
        fileContent.forEach(it => {
          if (keys.every(key => it[key] === '')) {
            count++;
          }
        });
      }
      return count;
    },
    isDeleteFileBtnShow: function () {
      if (this.currentSource) {
        if (!this.user) {
          return false;
        }
        if (this.user.admin) {
          return true;
        }
        if (this.currentSource.metadata !== 'demo') {
          return true;
        }
      }
      return false;
    }
  },

  watch: {
    'filesInfo'(val) {
      if (val.length) {
        let t = val.slice().sort((a, b) => (new Date(b.uploadDate) - new Date(a.uploadDate)));
        let finfo = t.find(it => it._id === this.currentSource._id);
        this.$store.commit('updateCurrentSource', finfo || t[0]);
      }
    },
    'currentSource'(val) {
      if (!val._id) {
        return;
      }
      let finfo = this.filesInfo.find(it => it._id === val._id);
      this.$store.dispatch('getUserFileById', { id: val._id });
      this.isContentLoading = true;
      this.$nextTick(function () {
        this.$refs.userFileTable.setCurrentRow(finfo);
      });
    }
  },

  mounted() {
    this.clearUploadList();
    if (!this.filesInfo || !this.filesInfo.length) {
      this.$store.dispatch('getUserFilesInfo');
    }
  },

  activated() {
    if (this.currentSource._id) {
      if (!this.userFileContentList.length) {
        this.$store.dispatch('getUserFileById', { id: this.currentSource._id });
      }
      let finfo = this.filesInfo.find(it => it._id === this.currentSource._id);
      this.$nextTick(function () {
        this.$refs.userFileTable.setCurrentRow(finfo);
        this.$refs.userFileTable.doLayout();
        this.$refs.userFileContentTable.$refs.elTable.doLayout();
      });
    } else {
      if (this.filesInfo && this.filesInfo.length) {
        this.$store.commit('updateCurrentSource', this.filesInfo[0]);
      }
    }
  },

  filters: {
    filesize: function (value) {
      const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const STEP = 1024;
      value = parseFloat(value, 10);
      for (var i = 0; i < UNITS.length; i++) {
        if (value < Math.pow(STEP, i)) {
          if (UNITS[i - 1]) {
            return (value / Math.pow(STEP, i - 1)).toFixed(2) + UNITS[i - 1];
          }
          return value + UNITS[i];
        }
      }
      return (value / Math.pow(STEP, i - 1)).toFixed(2) + UNITS[i - 1];
    }
  },

  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleChange(file, fileList) {
      this.showUploadBtn = !!fileList.length;
    },
    handleRemove(file, fileList) {
      this.showUploadBtn = !!fileList.length;
    },
    handleSuccess(response, file, fileList) {
      if (fileList.every(f => f.status === 'success')) {
        this.clearUploadList();
        this.$store.dispatch('getUserFilesInfo');
      }
      this.$notify({
        title: file.name,
        message: 'Complete uploaded data',
        type: 'success'
      });
    },
    handleError(err, file, fileList) {
      this.$notify.error({
        title: 'Error ',
        message: err
      });
    },
    beforeFileUpload(file) {
      const isCsv = file.name.slice(-3).toLowerCase() === 'csv';
      if (!isCsv) {
        this.$message.error('File only support CSV format!');
      }
      return isCsv;
    },
    handleRowClick(val) {
      if (!val) {
        return;
      }
      this.$store.commit('updateCurrentSource', val);
    },
    handleDownload() {
      var fields,
        fieldNames
      if (this.userFileContentList && this.userFileContentList.length) {
        fields = fieldNames = Object.keys(this.userFileContentList[0]);
      }
      let filename = this.currentSource.filename || 'data';
      CsvExport(this.userFileContentList, fields, fieldNames, filename);
    },
    handleCleanEmpty() {
      this.isCleanConfirmDlgShow = true;
    },
    handleDelete() {
      this.isDeleteConfirmDlgShow = true;
    },
    clearUploadList() {
      this.$refs.upload.clearFiles();
      this.showUploadBtn = false;
    },
    onCleanYes() {
      var fields,
        fieldNames
      if (this.userFileContentList && this.userFileContentList.length) {
        fields = fieldNames = Object.keys(this.userFileContentList[0]);
      }
      let filename = this.currentSource.filename.replace('.csv', '_clean') || 'data_clean';
      let cleanContent = this.userFileContentList.filter(item => fieldNames.every(f => item[f]));
      CsvExport(cleanContent, fields, fieldNames, filename);
      this.isCleanConfirmDlgShow = false;
    },
    onDeleteYes() {
      this.$store.dispatch('deleteUserFileById', { id: this.currentSource._id });
      this.isDeleteConfirmDlgShow = false;
    },
    getIndex(index) {
      return index + 1;
    }
  }
}
</script>

<style lang="scss" >
.data {
  .el-card__header {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .el-card__body {
    padding: 0 3vh;
  }

  .el-upload-dragger {
    width: auto;
    height: auto;
    .el-icon-upload {
      font-size: 30px;
      margin: 0;
      line-height: auto;
    }
  }

  .el-upload__text,
  .el-upload-list__item-name {
    user-select: none;
  }

  .mlt-table {
    cursor: pointer;
  }

  .mlt-table-no-hover:nth-child(2n + 1):hover > td {
    background-color: white !important;
  }
  .mlt-table-no-hover:nth-child(2n):hover > td {
    background-color: #fafafa !important;
  }

  .clean-confirm-dlg {
    .el-dialog {
      width: 40%;
    }
  }
}

.box-card {
  max-width: 1200px;
  width: 100%;
}

.user-file-upload {
  display: flex;
  padding: 10px;
  justify-content: center;
}

.upload-switch {
  margin-right: 20px;
}

.data-input,
.data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3vh;
}
.data-content {
  .sc-table .tool-bar {
    margin-bottom: 0;
  }

  input.el-input__inner {
    border: none;
    border-bottom: 1px solid #e0e0e0;
  }
}

.data-input-title,
.data-content-title {
  font-family: "RobotoBold";
  font-size: 1.2em;
  font-weight: bold;
}

.data-imput-btn-upoad {
  display: flex;
  justify-content: space-around;
}

.data-imput-upoad-warn-text {
  text-align: left;
  color: #f56c6c;
  user-select: none;
}

.file-table-icon {
  height: 16px;
}

.content-info {
  span {
    color: #42b983;
    font-size: 0.9em;
    margin-top: 5px;
    margin-right: 5px;
    em {
      color: black;
    }
  }
}
.content-info-btns {
  text-align: center;
  margin: 10px 0;
  span {
    color: white;
  }
  .content-delete-btn {
    float: right;
  }
}

.data-content-subtitle {
  color: skyblue;
  font-size: 0.8em;
  font-style: italic;
}

@media (max-width: 768px) {
  .data {
    .clean-confirm-dlg {
      .el-dialog {
        width: 90%;
      }
    }
  }
}
</style>
