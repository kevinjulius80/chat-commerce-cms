<template>
  <div class="app-container">
    <h1 class="global-title">{{ $t('tax_fee.index') }}</h1>
    <div class="global-container">
      <h3 class="global-subtitle">{{ $t('tax_fee.tax') }} (%)</h3>
      <div class="input-container">
        <el-input v-model="list.tax" />
      </div>

      <h3>{{ $t('tax_fee.delivery') }}</h3>
      <div class="input-container">
        <el-input v-model="deliveryFee" class="input-with-prefix" @input="handleInputDelivery">
          <template slot="prepend">Rp</template>
        </el-input>
      </div>

      <el-button class="global-btn" style="margin-top: 16px;" type="primary" @click="handleUpdate">
        {{ $t('table.update') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchListFee, updateFee } from '@/api/setting';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import currencyFormated from '@/utils/currencyFormated';
import i18n from '@/lang';

export default {
  name: 'UserList',
  directives: { waves, permission },
  data() {
    return {
      storeId: 0,
      list: {},
      deliveryFee: 0,
      loading: true,
      timerCount: 0,
    };
  },
  watch: {
    timerCount: {
      handler() {
        if (this.timerCount >= 0) {
          setTimeout(() => {
            const tmpStoreId = atob(localStorage.getItem('store_id'));
            if (tmpStoreId !== this.storeId) {
              this.getList();
            }
            this.timerCount++;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getList();
  },
  methods: {
    handleInputDelivery(value) {
      this.deliveryFee = currencyFormated(value);
      this.list.delivery_fee = this.deliveryFee.replace(/[^,\d]/g, '');
    },
    validate() {
      if (!this.validateNumber(this.list.tax)) {
        return i18n.t('tax_fee.toaster.not_valid.tax');
      }
      return '';
    },
    validateNumber(numString) {
      return /^\d+$/.test(numString);
    },
    async getList() {
      this.storeId = atob(localStorage.getItem('store_id'));
      this.loading = true;
      fetchListFee(this.storeId).then(response => {
        this.list = {
          tax: response.tax,
          delivery_fee: response.delivery_fee,
        };
        this.deliveryFee = currencyFormated(response.delivery_fee);
      });
      this.loading = false;
    },
    handleUpdate() {
      const errorMessage = this.validate();
      if (errorMessage !== '') {
        this.$message({
          message: errorMessage,
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      updateFee(this.storeId, this.list).then(response => {
        this.$message({
          message: i18n.t('tax_fee.toaster.update.success'),
          type: 'success',
          duration: 5 * 1000,
        });
        this.getList();
      })
        .catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('tax_fee.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
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
.input-container {
  .el-input {
    width: 200px;
  }
}
</style>
