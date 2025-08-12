<template>
  <div class="app-container">
    <div class="filter-container filter-container--menu">
      <div>
        <h2>{{ $t('stock.title.setting') }}</h2>
      </div>
    </div>
    <div class="input-wrapper">
      <el-form
        ref="updateForm"
        :model="updateSetting"
        label-position="left"
        label-width="150px"
        style="max-width: 700px"
      >
        <el-form-item
          :label="$t('stock.setting.threshold.label')"
          :rules="[
            { type: 'number', message: 'threshold must be a number'}
          ]"
        >
          <el-input
            v-model.number="updateSetting.min_stock"
            v-loading="loading"
          />
          <span>{{ $t('stock.setting.threshold.details') }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('stock.setting.periode.label')"
          :rules="[
            { type: 'number', message: 'periode must be a number'}
          ]"
        >
          <el-input
            v-model.number="updateSetting.max_sales_days"
            v-loading="loading"
          >
            <template #append>hari</template>
          </el-input>
          <span>{{ $t('stock.setting.periode.details') }}</span>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="currentSetting.min_stock == updateSetting.min_stock && currentSetting.max_sales_days == updateSetting.max_sales_days"
            @click="cancelUpdate()"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            :disabled="currentSetting.min_stock == updateSetting.min_stock && currentSetting.max_sales_days == updateSetting.max_sales_days"
            @click="update()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import i18n from '@/lang';
import { fetchSettingStock, setSettingStock } from '@/api/stock.js';

export default {
  name: 'UserList',
  components: { },
  directives: { waves, permission },
  filters: {
    price_format(value) {
      const currency = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      });

      return currency.format(value);
    },
  },
  data() {
    return {
      total: 0,
      tableKey: 0,
      loading: true,
      dummyQuery: {
        store_id: 0,
      },
      currentSetting: {},
      dialogFormVisible: false,
      dialogUploadFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      updateSetting: {
        store_id: 0,
        min_stock: 0,
        max_sales_days: 0,
      },
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
  },
  created() {
    this.loading = true;
    this.dummyQuery.store_id = parseInt(atob(localStorage.getItem('store_id')));
    this.getCurrentSetting();
  },
  methods: {
    getCurrentSetting() {
      fetchSettingStock(this.dummyQuery).then(res => {
        this.currentSetting.min_stock = res.data.min_stock;
        this.currentSetting.max_sales_days = res.data.max_sales_days;
        this.updateSetting = res.data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    cancelUpdate() {
      this.updateSetting.min_stock = this.currentSetting.min_stock;
      this.updateSetting.max_sales_days = this.currentSetting.max_sales_days;
    },
    update() {
      this.$refs['updateForm'].validate((valid) => {
        const parsedMaxSalesDays = parseInt(this.updateSetting.max_sales_days);
        const parsedMinStock = parseInt(this.updateSetting.min_stock);
        if (valid && !isNaN(parsedMaxSalesDays) && !isNaN(parsedMinStock)) {
          this.updateSetting.store_id = parseInt(atob(localStorage.getItem('store_id')));
          this.updateSetting.max_sales_days = parsedMaxSalesDays;
          this.updateSetting.min_stock = parsedMinStock;
          setSettingStock(this.updateSetting)
            .then((reponse) => {
              this.$message({
                message: i18n.t('stock.toaster.updateSetting.success'),
                type: 'success',
                duration: 5 * 1000,
              });
              this.getCurrentSetting();
            }).catch(() => {});
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
  },
};
</script>

<style lang="scss" scoped>

</style>
