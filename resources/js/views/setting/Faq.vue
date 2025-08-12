<template>
  <div class="app-container">
    <div class="filter-container">
      <h1>{{ $t('faq.video') }}</h1>
      <el-button
        class="filter-item"
        style="margin-left: 10px; float: right;"
        type="primary"
        @click="handleUpdateVideo"
      >
        {{ $t('table.edit') }}
      </el-button>
    </div>
    <el-input v-model="videoUrl" placeholder="Mohon masukan embed URL dari youtube" />

    <div class="filter-container faq-container">
      <h1>{{ $t('faq.title') }}</h1>
      <el-button
        class="filter-item"
        style="margin-left: 10px; float: right;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        {{ $t('faq.add') }}
      </el-button>
    </div>

    <!-- TABLE FAQ -->
    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">
      <el-table
        v-if="faqList.length > 0"
        v-loading="loading"
        :data="faqList"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" :label="$t('faq.question')">
          <template slot-scope="scope">
            <span>{{ scope.row.key }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('faq.answer')">
          <template slot-scope="scope">
            <span>{{ scope.row.value }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.actions')" width="150">
          <template slot-scope="scope">
            <el-button
              v-permission="['manage food']"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(scope.$index)"
            />
            <el-button
              v-permission="['manage food']"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index);"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- TABLE SnK -->
    <div class="filter-container faq-container">
      <h1 style="margin: 0;">{{ $t('sk.title') }}</h1>
      <el-button
        class="filter-item"
        style="margin-left: 10px; float: right;"
        type="primary"
        icon="el-icon-plus"
        @click="handleSKCreate"
      >
        {{ $t('sk.add') }}
      </el-button>
    </div>
    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">
      <el-table
        v-if="skList.length > 0"
        v-loading="loading"
        :data="skList"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" :label="$t('sk.key')">
          <template slot-scope="scope">
            <span>{{ scope.row.key }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('sk.value')">
          <template slot-scope="scope">
            <span>{{ scope.row.value }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.actions')" width="150">
          <template slot-scope="scope">
            <el-button
              v-permission="['manage food']"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleSKUpdate(scope.$index)"
            />
            <el-button
              v-permission="['manage food']"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleSKDelete(scope.$index);"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- FAQ CREATED -->
    <el-dialog :title="$t('faq.create')" :visible.sync="dialogFormVisible" :custom-class="'rounded-border'">
      <div v-loading="faqCreating" class="form-container">
        <el-form :model="newFaqItem" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item :label="$t('faq.question')">
            <el-input v-model="newFaqItem.key" />
          </el-form-item>
          <el-form-item :label="$t('faq.answer')">
            <el-input v-model="newFaqItem.value" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createFaq()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- FAQ UPDATE -->
    <el-dialog :title="$t('faq.update')" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="faqUpdating" class="form-container">
        <el-form v-if="faqList[updateFaqId]" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item :label="$t('faq.question')">
            <el-input v-model="faqList[updateFaqId].key" />
          </el-form-item>
          <el-form-item :label="$t('faq.answer')">
            <el-input v-model="faqList[updateFaqId].value" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doUpdateFaq()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- SK CREATED -->
    <el-dialog :title="$t('sk.create')" :visible.sync="dialogFormSKVisible" :custom-class="'rounded-border'">
      <div v-loading="skCreating" class="form-container">
        <el-form :model="newSKItem" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item :label="$t('sk.key')">
            <el-input v-model="newSKItem.key" />
          </el-form-item>
          <el-form-item :label="$t('sk.value')">
            <el-input v-model="newSKItem.value" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormSKVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createSK()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- SK UPDATE -->
    <el-dialog :title="$t('sk.update')" :visible.sync="dialogUpdateSKFormVisible" :custom-class="'rounded-border'">
      <div v-loading="skUpdating" class="form-container">
        <el-form v-if="skList[updateSKId]" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item :label="$t('sk.key')">
            <el-input v-model="skList[updateSKId].key" />
          </el-form-item>
          <el-form-item :label="$t('sk.value')">
            <el-input v-model="skList[updateSKId].value" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateSKFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doUpdateSK()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchListFaq, updateFaq } from '@/api/setting';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import i18n from '@/lang';

export default {
  name: 'UserList',
  directives: { waves, permission },
  data() {
    return {
      faqList: [],
      skList: [],
      videoUrl: '',
      total: 0,
      loading: true,
      downloading: false,
      faqCreating: false,
      faqUpdating: false,
      skCreating: false,
      skUpdating: false,
      query: {
        page: 1,
        limit: 15,
        name: '',
        category_id: null,
        status: null,
      },
      dummyQuery: {
        page: 1,
        limit: 15,
      },
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogFormSKVisible: false,
      dialogUpdateSKFormVisible: false,
      newFaqItem: {},
      newSKItem: {},
      updateFaqId: 0,
      updateSKId: 0,
      fileList: [],
      fileListUpdate: [],
      value1: false,
    };
  },
  created() {
    this.resetNewItem();
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      this.query.merchant_id = atob(localStorage.getItem('merchant_id'));
      fetchListFaq(this.query).then(response => {
        this.faqList = response.data.faq;
        this.skList = response.data.sak;
        this.videoUrl = response.data.video;
      });
      this.loading = false;
    },
    handleCreate() {
      this.resetNewItem();
      this.dialogFormVisible = true;
    },
    handleUpdate(rowId) {
      this.updateFaqId = rowId;
      this.dialogUpdateFormVisible = true;
    },
    handleSKCreate() {
      this.resetNewItem();
      this.dialogFormSKVisible = true;
    },
    handleSKUpdate(rowId) {
      this.updateSKId = rowId;
      this.dialogUpdateSKFormVisible = true;
    },
    update: function() {
      const merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
      const tmp = {
        merchant_id: merchant_id,
        faq: this.faqList,
        sak: this.skList,
        video: this.videoUrl,
      };
      updateFaq(tmp).then(response => {
        this.$message({
          message: i18n.t('faq.toaster.update.success'),
          type: 'success',
          duration: 5 * 1000,
        });
        this.resetNewItem();
        this.getList();
      })
        .catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('faq.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        })
        .finally(() => {
          this.faqCreating = false;
          this.faqUpdating = false;
          this.dialogFormVisible = false;
          this.dialogUpdateFormVisible = false;
          this.skCreating = false;
          this.skUpdating = false;
          this.dialogFormSKVisible = false;
          this.dialogUpdateSKFormVisible = false;
        });
    },
    handleUpdateVideo() {
      if (this.videoUrl !== '') {
        this.update();
      } else {
        this.$message.error(i18n.t('error_message.form_not_valid'));
        return false;
      }
      this.dialogFormVisible = false;
    },
    createFaq() {
      if (this.newFaqItem.key !== '' && this.newFaqItem.value !== '') {
        this.faqCreating = true;
        this.faqList.push(this.newFaqItem);
        this.update();
      } else {
        this.$message.error(i18n.t('error_message.form_not_valid'));
        return false;
      }
      this.dialogFormVisible = false;
    },
    doUpdateFaq() {
      if (this.faqList[this.updateFaqId].key !== '' && this.faqList[this.updateFaqId].value !== '') {
        this.faqUpdating = true;
        this.update();
      } else {
        this.$message.error(i18n.t('error_message.form_not_valid'));
        return false;
      }
    },
    handleDelete(id) {
      this.$confirm(i18n.t('modal.delete.confirm.faq'), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        this.faqList.splice(id, 1);
        this.update();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('toaster.delete.cancel'),
        });
      });
    },
    createSK() {
      if (this.newSKItem.key !== '' && this.newSKItem.value !== '') {
        this.skCreating = true;
        this.skList.push(this.newSKItem);
        this.update();
      } else {
        this.$message.error(i18n.t('error_message.form_not_valid'));
        return false;
      }
      this.dialogFormVisible = false;
    },
    doUpdateSK() {
      if (this.skList[this.updateSKId].key !== '' && this.skList[this.updateSKId].value !== '') {
        this.skUpdating = true;
        this.update();
      } else {
        this.$message.error(i18n.t('error_message.form_not_valid'));
        return false;
      }
    },
    handleSKDelete(id) {
      this.$confirm(i18n.t('modal.delete.confirm.sk'), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        this.skList.splice(id, 1);
        this.update();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('toaster.delete.cancel'),
        });
      });
    },
    resetNewItem() {
      this.newFaqItem = {
        key: '',
        value: '',
      };
      this.newSKItem = {
        key: '',
        value: '',
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

.faq-container {
    margin-top: 32px;
}
</style>
