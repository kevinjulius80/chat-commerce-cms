<template>
  <div class="app-container">
    <div class="filter-container filter-container--menu">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate()">{{ $t('payment.add') }}</el-button>
    </div>

    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">
      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%; border-collapse: collapse;">
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.name')" prop="code" />
        <el-table-column align="center" :label="$t('payment.type')" prop="type" />
        <el-table-column align="center" :label="$t('payment.value')" prop="value" />
        <el-table-column align="center" :label="$t('payment.bankID.internal')" prop="internal_bank_id" />
        <el-table-column align="center" :label="$t('payment.bankID.store')" prop="store_bank_id" />
        <el-table-column align="center" :label="$t('table.status')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_active"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="doUpdate(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.actions')" width="150">
          <template slot-scope="scope">
            <el-button type="default" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row);" />
          </template>
        </el-table-column>
      </el-table>
      <br>
    </div>
    <!-- CREATE -->
    <el-dialog :title="$t('payment.create')" :visible.sync="dialogAddVisible" :custom-class="'rounded-border'">
      <div v-loading="loading" class="form-container">
        <el-form
          ref="addForm"
          :model="addPayment"
          label-position="left"
          label-width="200px"
        >
          <el-form-item :label="$t('table.name')">
            <el-select v-model="addPayment.code" :placeholder="$t('payment.type_placeholder')" clearable style="width: 150px" class="filter-item">
              <el-option v-for="st in paymentOptions" :key="st.code" :label="st.code" :value="st.code" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('payment.type')">
            <el-select v-model="addPayment.type" :placeholder="$t('payment.type_placeholder')" clearable style="width: 150px" class="filter-item">
              <el-option v-for="st in feeType" :key="st" :label="st" :value="st" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('payment.value')">
            <el-input v-model="addPayment.value" />
            <p class="input-helper">{{ $t('payment.helper.value') }}</p>
          </el-form-item>
          <el-form-item :label="$t('payment.bankID.internal')">
            <el-input v-model="addPayment.internal_bank_id" />
            <p class="input-helper">{{ $t('payment.helper.bankID.internal') }}</p>
          </el-form-item>
          <div v-if="isGopayWhenCreate">
            <el-form-item :label="$t('payment.accountName.internal')">
              <el-input v-model="addPayment.internal_account_name" />
            </el-form-item>
            <el-form-item :label="$t('payment.bankName.internal')">
              <el-input v-model="addPayment.internal_bank_name" />
            </el-form-item>
          </div>
          <el-form-item :label="$t('payment.bankID.store')">
            <el-input v-model="addPayment.store_bank_id" />
            <p class="input-helper">{{ $t('payment.helper.bankID.store') }}</p>
          </el-form-item>
          <div v-if="isGopayWhenCreate">
            <el-form-item :label="$t('payment.accountName.store')">
              <el-input v-model="addPayment.store_account_name" />
            </el-form-item>
            <el-form-item :label="$t('payment.bankName.store')">
              <el-input v-model="addPayment.store_bank_name" />
            </el-form-item>
          </div>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="addPayment.is_active" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doCreate(addPayment)">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- UPDATE -->
    <el-dialog :title="$t('payment.update')" :visible.sync="dialogDetailVisible" :custom-class="'rounded-border'">
      <div v-loading="loading" class="form-container">
        <el-form
          ref="updateForm"
          :model="detailPayment"
          label-position="left"
          label-width="200px"
        >
          <el-form-item :label="$t('table.name')">
            <el-input v-model="detailPayment.code" disabled />
          </el-form-item>
          <el-form-item :label="$t('payment.type')">
            <el-select v-model="detailPayment.type" :placeholder="$t('payment.type_placeholder')" clearable style="width: 150px" class="filter-item">
              <el-option v-for="st in feeType" :key="st" :label="st" :value="st" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('payment.value')">
            <el-input v-model="detailPayment.value" />
            <p class="input-helper">{{ $t('payment.helper.value') }}</p>
          </el-form-item>
          <el-form-item :label="$t('payment.bankID.internal')">
            <el-input v-model="detailPayment.internal_bank_id" />
            <p class="input-helper">{{ $t('payment.helper.bankID.internal') }}</p>
          </el-form-item>
          <div v-if="isGopayWhenUpdate">
            <el-form-item :label="$t('payment.accountName.internal')">
              <el-input v-model="detailPayment.internal_account_name" />
            </el-form-item>
            <el-form-item :label="$t('payment.bankName.internal')">
              <el-input v-model="detailPayment.internal_bank_name" />
            </el-form-item>
          </div>
          <el-form-item :label="$t('payment.bankID.store')">
            <el-input v-model="detailPayment.store_bank_id" />
            <p class="input-helper">{{ $t('payment.helper.bankID.store') }}</p>
          </el-form-item>
          <div v-if="isGopayWhenUpdate">
            <el-form-item :label="$t('payment.accountName.store')">
              <el-input v-model="detailPayment.store_account_name" />
            </el-form-item>
            <el-form-item :label="$t('payment.bankName.store')">
              <el-input v-model="detailPayment.store_bank_name" />
            </el-form-item>
          </div>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="detailPayment.is_active" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDetailVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doUpdate(detailPayment)">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission';
import { deleteStorePayments, fetchStorePayments, fetchStorePaymentsOption, updateStorePayments } from '@/api/setting';
import i18n from '@/lang';

export default {
  name: 'UserList',
  directives: { waves, permission },
  data() {
    return {
      list: [],
      feeType: ['PERCENT', 'FIXED'],
      loading: true,
      downloading: false,
      dialogAddVisible: false,
      dialogDetailVisible: false,
      currentId: 0,
      addPayment: {},
      detailPayment: {},
      paymentOptions: [],
    };
  },
  computed: {
    isGopayWhenCreate() {
      if (this.addPayment.code) {
        return this.addPayment.code.toLowerCase() === 'gopay';
      }
      return false;
    },
    isGopayWhenUpdate() {
      if (this.detailPayment.code) {
        return this.detailPayment.code.toLowerCase() === 'gopay';
      }
      return false;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    setDescription(description) {
      this.description = description;
    },
    async getList() {
      this.loading = true;
      const storeId = atob(localStorage.getItem('store_id'));
      fetchStorePayments(storeId).then(response => {
        this.list = response.data;
      });
      fetchStorePaymentsOption(storeId).then(response => {
        this.paymentOptions = response.data;
      });
      this.loading = false;
    },
    handleReset() {
      this.getList();
    },
    handleCreate() {
      this.addPayment = {};
      this.dialogAddVisible = true;
    },
    handleUpdate(row) {
      if (row.code.toLowerCase() === 'gopay') {
        this.detailPayment = {
          code: row.code,
          type: row.type,
          value: row.value,
          internal_bank_id: row.internal_bank_id,
          internal_account_name: row.internal_account_name,
          internal_bank_name: row.internal_bank_name,
          store_bank_id: row.store_bank_id,
          store_account_name: row.store_account_name,
          store_bank_name: row.store_bank_name,
          is_active: row.is_active,
        };
      } else {
        this.detailPayment = {
          code: row.code,
          type: row.type,
          value: row.value,
          internal_bank_id: row.internal_bank_id,
          internal_account_name: row.internal_account_name,
          store_bank_id: row.store_bank_id,
          is_active: row.is_active,
        };
      }

      this.dialogDetailVisible = true;
    },
    doCreate(row) {
      if (this.isNotValid(row)) {
        return;
      }
      var item = {};
      item.value = parseFloat(row.value);
      item.code = row.code;
      item.type = row.type;
      item.internal_bank_id = row.internal_bank_id;
      item.store_bank_id = row.store_bank_id;
      item.is_active = row.is_active === undefined ? false : row.is_active;
      item.store_id = parseInt(atob(localStorage.getItem('store_id')));
      updateStorePayments(item).then(response => {
        this.$message({
          message: i18n.t('payment.toaster.create.success', { name: item.code }),
          type: 'success',
          duration: 5 * 1000,
        });
        this.dialogAddVisible = false;
        this.getList();
      })
        .catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('payment.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    doUpdate(row) {
      if (this.isNotValid(row)) {
        return;
      }
      row.value = parseFloat(row.value);
      row.store_id = parseInt(atob(localStorage.getItem('store_id')));
      updateStorePayments(row).then(response => {
        this.$message({
          message: i18n.t('payment.toaster.update.success', { name: row.code }),
          type: 'success',
          duration: 5 * 1000,
        });
        this.dialogDetailVisible = false;
        this.getList();
      })
        .catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('payment.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    handleDelete(row) {
      this.$confirm(i18n.t('modal.delete.confirm.payment', { name: row.code }), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        const store_id = parseInt(atob(localStorage.getItem('store_id')));
        deleteStorePayments(row.code, store_id).then(response => {
          this.$message({
            message: i18n.t('payment.toaster.delete.success', { name: row.code }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.getList();
        })
          .catch(error => {
            console.log(error);
            this.$message({
              message: i18n.t('payment.toaster.delete.failed'),
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
    isNotValid(row) {
      if (!row.type) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.type'),
          type: 'error',
          duration: 5 * 1000,
        });
        return true;
      }
      if (!row.value) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.value'),
          type: 'error',
          duration: 5 * 1000,
        });
        return true;
      }
      if (!row.internal_bank_id) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.internal.id'),
          type: 'error',
          duration: 5 * 1000,
        });
        return true;
      }
      if (!row.store_bank_id) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.store.id'),
          type: 'error',
          duration: 5 * 1000,
        });
        return true;
      }
      // check validation if code is gopay
      if (row.code.toLowerCase() === 'gopay') {
        if (!row.internal_account_name) {
          this.$message({
            message: i18n.t('payment.toaster.create.failed.internal.name'),
            type: 'error',
            duration: 5 * 1000,
          });
          return true;
        }
        if (!row.internal_bank_name) {
          this.$message({
            message: i18n.t('payment.toaster.create.failed.internal.bank'),
            type: 'error',
            duration: 5 * 1000,
          });
          return true;
        }
        if (!row.store_account_name) {
          this.$message({
            message: i18n.t('payment.toaster.create.failed.store.name'),
            type: 'error',
            duration: 5 * 1000,
          });
          return true;
        }
        if (!row.store_bank_name) {
          this.$message({
            message: i18n.t('payment.toaster.create.failed.store.bank'),
            type: 'error',
            duration: 5 * 1000,
          });
          return true;
        }
      }

      return false;
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
</style>
