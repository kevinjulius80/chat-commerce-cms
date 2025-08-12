<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
          {{ $t('category.add') }}
        </el-button>
      </div>
      <div class="category__search">
        <el-input
          v-model="query.name"
          :placeholder="$t('table.keyword')"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves class="filter-item" type="secondary" @click="handleResetFilter">
          {{ $t('table.reset') }}
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-wrapper">
      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="!isMobile" align="center" :label="$t('table.picture')">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.picture"
              fit="fill"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.name')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.status')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_active"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="doChangeStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.actions')" width="250">
          <template slot-scope="scope">
            <!-- <el-button v-permission="['manage food']" type="warning" size="small" icon="el-icon-share" @click="handleCopy(scope.row)" /> -->
            <el-button
              v-permission="['manage food']"
              type="default"
              size="small"
              icon="el-icon-data-analysis"
              @click="handleDetail(scope.row)"
            />
            <el-button
              v-permission="['manage food']"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            />
            <el-button
              v-permission="['manage food']"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id, scope.row.name);"
            />
          </template>
        </el-table-column>
      </el-table>

      <pagination :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </div>
    <!-- CREATE -->
    <el-dialog :title="$t('category.create')" :visible.sync="dialogFormVisible" :custom-class="'rounded-border'">
      <div v-loading="categoryCreating" class="form-container">
        <el-form
          ref="categoryForm"
          :rules="rules"
          :model="newCategory"
          label-position="left"
          label-width="150px"
          style="max-width: 500px;"
        >
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input v-model="newCategory.name" />
          </el-form-item>
          <el-form-item :label="$t('table.picture')" prop="picture">
            <el-upload
              :class="newCategory.picture ? 'thumbnail-showed' : ''"
              action=""
              :on-remove="handleRemove"
              :http-request="handleRequest"
              :file-list="fileList"
              list-type="picture"
              :limit="1"
              :show-file-list="isShowImageThumbnail"
            >
              <el-button size="small" type="primary">{{ $t('table.upload.click') }}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="newCategory.is_active" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createCategory()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- UPDATE -->
    <el-dialog :title="$t('category.update')" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="categoryUpdating" class="form-container">
        <el-form
          ref="updateForm"
          :rules="rules"
          :model="updateCategory"
          label-position="left"
          label-width="150px"
          style="max-width: 500px;"
        >
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input v-model="updateCategory.name" />
          </el-form-item>
          <el-form-item :label="$t('table.picture')" prop="picture">
            <el-upload
              :class="updateCategory.picture ? 'thumbnail-showed' : ''"
              action=""
              :on-remove="handleRemove"
              :http-request="handleRequest"
              :file-list="fileListUpdate"
              list-type="picture"
              :limit="1"
              :show-file-list="isShowImageThumbnail"
            >
              <el-button size="small" type="primary">{{ $t('table.upload.click') }}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="updateCategory.is_active" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doUpdateCategory()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- DETAIL -->
    <el-dialog :title="$t('category.detail')" :visible.sync="dialogDetailVisible" :custom-class="'rounded-border'">
      <el-table :data="detailCategory" :show-header="false">
        <el-table-column :label="$t('table.name')" width="150">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.count')" align="left">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.name === $t('table.picture')"
              style="width: 300px; height: 300px"
              :src="scope.row.value"
              fit="contain"
              lazy
            />
            {{ scope.row.name === $t('table.picture') ? '' : scope.row.value }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { createCategory, deleteCategory, fetchListCategory, updateCategory } from '@/api/category';
import { compressImage, isAllowedImageSize, isValidImage } from '@/utils/validateImage';
import { uploadImage } from '@/api/uploadImage';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import i18n from '@/lang';

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      downloading: false,
      categoryCreating: false,
      categoryUpdating: false,
      query: {
        page: 1,
        limit: 15,
        name: '',
      },
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      rules: {
        name: [{ required: true, message: i18n.t('error_message.name'), trigger: 'blur' }],
        picture: [{ required: true, message: i18n.t('error_message.picture.required'), trigger: 'blur' }],
      },
      newCategory: {},
      updateCategory: {},
      detailCategory: [],
      isShowImageThumbnail: true,
      fileList: [],
      fileListUpdate: [],
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
  },
  created() {
    this.resetnewCategory();
    this.getList();
  },
  methods: {
    async handleCopy(row) {
      const textCopy = `Hai, kamu bisa temukan ${row.name} di ${row.store_name} melalui BerandaToko di link berikut loh ${process.env.MIX_MICROSITE_URL + '/a/' + row.reference_id}

Selamat berbelanja!`;
      try {
        await navigator.clipboard.writeText(textCopy);
        this.$message({
          message: i18n.t('category.toaster.copy.success'),
          type: 'success',
          duration: 5 * 1000,
        });
      } catch ($e) {
        this.$message({
          message: i18n.t('category.toaster.copy.failed'),
          type: 'error',
          duration: 5 * 1000,
        });
      }
    },
    async getList() {
      this.loading = true;
      this.query.merchant_id = atob(localStorage.getItem('merchant_id'));
      this.query.store_id = atob(localStorage.getItem('store_id'));
      fetchListCategory(this.query).then(response => {
        this.list = response.data;
      });
      this.loading = false;
    },
    handleUploadImage(file) {
      uploadImage(file).then(response => {
        this.newCategory.picture = response.url;
        this.updateCategory.picture = response.url;
        this.isShowImageThumbnail = true;
      })
        .catch(error => {
          console.log(error);
          this.isShowImageThumbnail = false;
          this.$message.error(i18n.t('error_message.picture.upload_failed'));
        });
    },
    handleRequest(request) {
      const { file } = request;

      if (isValidImage(file)) {
        this.isShowImageThumbnail = true;
        if (isAllowedImageSize(file)) {
          this.handleUploadImage(file);
        } else {
          // need to compress the image here
          compressImage(file).then(response => {
            this.handleUploadImage(response);
          });
        }
      } else {
        this.isShowImageThumbnail = false;
        this.fileList = [];
        this.fileListUpdate = [];
        this.$message.error(i18n.t('error_message.picture.format'));
      }
    },
    handleRemove() {
      this.newCategory.picture = '';
      this.updateCategory.picture = '';
    },
    handleResetFilter() {
      this.query = {
        page: 1,
        limit: 15,
        name: '',
      };
      this.getList();
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    handleCreate() {
      this.resetnewCategory();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['categoryForm'].clearValidate();
      });
    },
    handleUpdate(row) {
      if (row.picture) {
        this.isShowImageThumbnail = true;
        this.fileListUpdate = [{ name: '', url: row.picture }];
      } else {
        this.isShowImageThumbnail = false;
        this.fileListUpdate = [];
      }
      this.updateCategory = {
        id: row.id,
        name: row.name,
        picture: row.picture,
        is_active: row.is_active,
      };
      this.dialogUpdateFormVisible = true;
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate();
      });
    },
    handleDetail(row) {
      this.detailCategory = [
        {
          'name': i18n.t('table.name'),
          'value': row.name,
        },
        {
          'name': i18n.t('category.active'),
          'value': row.is_active,
        },
        {
          'name': i18n.t('table.picture'),
          'value': row.picture,
        },
      ];
      this.dialogDetailVisible = true;
    },
    handleDelete(id, name) {
      this.$confirm(i18n.t('category.toaster.delete.confirm', { categoryName: name }), 'Peringatan', {
        confirmButtonText: i18n.t('permission.ok'),
        cancelButtonText: i18n.t('permission.cancel'),
        type: 'warning',
      }).then(() => {
        deleteCategory(id).then(response => {
          this.$message({
            message: i18n.t('category.toaster.delete.success', { categoryName: name }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.handleFilter();
        })
          .catch(error => {
            console.log(error);
            this.$message({
              message: i18n.t('category.toaster.delete.failed'),
              type: 'error',
              duration: 5 * 1000,
            });
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('toaster.delete.cancel'),
        });
      });
    },
    createCategory() {
      this.$refs['categoryForm'].validate((valid) => {
        if (valid) {
          this.categoryCreating = true;
          this.newCategory.merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
          this.newCategory.store_id = parseInt(atob(localStorage.getItem('store_id')));
          createCategory(this.newCategory).then(response => {
            this.$message({
              message: i18n.t('category.toaster.create.success', { categoryName: this.newCategory.name }),
              type: 'success',
              duration: 5 * 1000,
            });
            this.resetnewCategory();
            this.handleFilter();
          })
            .catch(e => {
              const message = i18n.t('category.toaster.create.failed');
              this.$message({
                message: message,
                type: 'error',
                duration: 5 * 1000,
              });
            })
            .finally(() => {
              this.categoryCreating = false;
              this.dialogFormVisible = false;
            });
        } else {
          this.$message({
            message: i18n.t('error_message.form_not_valid'),
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
      });
    },
    doUpdateCategory() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.categoryUpdating = true;
          updateCategory(this.updateCategory)
            .then(reponse => {
              this.$message({
                message: i18n.t('category.toaster.update.success', { categoryName: this.updateCategory.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.dialogUpdateFormVisible = false;
              this.handleFilter();
            }).catch(e => {
              const message = i18n.t('category.toaster.update.failed');
              this.$message({
                message: message,
                type: 'error',
                duration: 5 * 1000,
              });
            }).finally(() => {
              this.categoryUpdating = false;
              this.dialogUpdateFormVisible = false;
            });
        } else {
          this.$message({
            message: i18n.t('error_message.form_not_valid'),
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
      });
    },
    doChangeStatus(row) {
      updateCategory(row)
        .then(reponse => {
          this.$message({
            message: i18n.t('category.toaster.update.success', { categoryName: row.name }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.dialogUpdateFormVisible = false;
          this.handleFilter();
        }).catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('category.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    resetnewCategory() {
      this.fileList = [];
      this.newCategory = {
        name: '',
        is_active: false,
        picture: '',
      };
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.dialog-footer {
  text-align: left;
  padding-top: 0;
  margin-left: 150px;
}

.app-container {
  flex: 1;
  justify-content: space-between;
  font-size: 14px;

  .block {
    float: left;
    min-width: 250px;
  }

  .clear-left {
    clear: left;
  }
}

.category {
  &__search {
    display: flex;

    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
