<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="el-col-6">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate()">{{ $t('payment.add') }}</el-button>
      </div>
      <div class="el-col-18" style="text-align: right" />
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
        <el-table-column align="center" :label="$t('payment.bankID.merchant')" prop="merchant_bank_id" />
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
          label-width="150px"
        >
          <el-form-item :label="$t('table.name')">
            <el-select v-model="addPayment.channel" :placeholder="$t('payment.type_placeholder')" clearable style="width: 150px" class="filter-item" value-key="code">
              <el-option v-for="st in paymentOptions" :key="st.code" :label="st.code" :value="st" />
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
          <el-form-item :label="$t('payment.bankID.merchant')">
            <el-input v-model="addPayment.merchant_bank_id" />
            <p class="input-helper">{{ $t('payment.helper.bankID.merchant') }}</p>
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
          label-width="150px"
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
          <el-form-item :label="$t('payment.bankID.merchant')">
            <el-input v-model="detailPayment.merchant_bank_id" />
            <p class="input-helper">{{ $t('payment.helper.bankID.merchant') }}</p>
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
import { deletePayments, fetchPayments, fetchPaymentsOption, updatePayments } from '@/api/setting';
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
      addPayment: {
        channel: {
          pg_code: '',
        },
      },
      detailPayment: [],
      paymentOptions: [],
    };
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
      const merchantId = atob(localStorage.getItem('merchant_id'));
      fetchPayments(merchantId).then(response => {
        this.list = response.data;
      });
      fetchPaymentsOption(merchantId).then(response => {
        this.paymentOptions = response.data;
      });
      this.loading = false;
    },
    handleReset() {
      this.getList();
    },
    handleCreate() {
      this.addPayment = {
        channel: {
          pg_code: '',
        },
      };
      this.dialogAddVisible = true;
    },
    handleUpdate(row) {
      this.detailPayment = {
        code: row.code,
        type: row.type,
        value: row.value,
        internal_bank_id: row.internal_bank_id,
        merchant_bank_id: row.merchant_bank_id,
      };
      this.dialogDetailVisible = true;
    },
    doCreate(row) {
      var item = {};
      item.value = parseFloat(row.value);
      item.code = row.channel.code;
      item.type = row.type;
      item.internal_bank_id = row.internal_bank_id;
      item.merchant_bank_id = row.merchant_bank_id;
      if (!item.code) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.payment'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      if (!item.type) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.type'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      if (!item.value) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.value'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      if (!item.internal_bank_id) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.internal'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      if (!item.merchant_bank_id) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.merchant'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      item.merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
      updatePayments(item).then(response => {
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
      row.value = parseFloat(row.value);
      if (!row.type) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.type'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      if (!row.value) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.value'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      if (!row.internal_bank_id) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.internal'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      if (!row.merchant_bank_id) {
        this.$message({
          message: i18n.t('payment.toaster.create.failed.merchant'),
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      row.merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
      updatePayments(row).then(response => {
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
        const merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
        deletePayments(row.code, merchant_id).then(response => {
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
