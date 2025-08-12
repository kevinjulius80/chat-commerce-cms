<template>
  <div class="app-container">
    <panel-group :month="dashboardData.month" :top-dashboard="dashboardData.top_dashboard" />
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <h4>Hari ini</h4>
        <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">
          <el-table
            :data="todayData"
            style="width: 100%;"
          >
            <el-table-column
              prop="key"
              label="Pesanan"
            />>
            <el-table-column
              prop="value"
              label="Total"
            />
          </el-table>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <h4>Satu Minggu kebelakang</h4>
        <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">
          <el-table
            :data="weeklyData"
            style="width: 100%; border-radius: 12px;"
          >
            <el-table-column
              prop="key"
              label="Pesanan"
            />
            <el-table-column
              prop="value"
              label="Total"
            />
          </el-table>
        </div>
      </el-col>
    </el-row>
    <stock :count-empty="stockCount.empty" :count-low="stockCount.low" :count-not-sold="stockCount.not_sold" />
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup';
import Stock from './components/Stock';
import { fetchDashboard, fetchCountEmptyStock, fetchCountLowStock, fetchCountNoSalesStock } from '@/api/dashboard';

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    Stock,
  },
  data() {
    return {
      dashboardData: {
        top_dashboard: {},
        today_summary: {},
        week_summary: {},
      },
      stockCount: {
        empty: {},
        low: {},
        not_sold: {},
      },
      todayData: [],
      weeklyData: [],
      storeId: '',
      timerCount: 0,
    };
  },
  watch: {
    storeId(newValue) {
      this.getDashboardData();
    },
    timerCount: {
      handler() {
        if (this.timerCount >= 0) {
          setTimeout(() => {
            const tmpStoreId = atob(localStorage.getItem('store_id'));
            if (tmpStoreId !== this.storeId) {
              this.getDashboardData();
            }
            this.timerCount++;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getDashboardData();
  },
  methods: {
    getDashboardData() {
      const lcStorage = localStorage.getItem('store_id');
      if (!lcStorage) {
        return;
      }
      this.storeId = atob(lcStorage);
      fetchDashboard(this.storeId).then(response => {
        this.dashboardData = response.data;
        this.todayData = [
          {
            key: 'Pesanan Baru',
            value: response.data.today_summary.new_orders,
          }, {
            key: 'Pesanan Diproses',
            value: response.data.today_summary.pending_orders,
          }, {
            key: 'Pesanan Lagi Diantar',
            value: response.data.today_summary.on_the_way_orders,
          }, {
            key: 'Pesanan Terkirim',
            value: response.data.today_summary.delivered_orders,
          }, {
            key: 'Pesanan Ditolak',
            value: response.data.today_summary.rejected_orders,
          }, {
            key: 'Pesanan Gagal',
            value: response.data.today_summary.failed_orders,
          }, {
            key: 'Total',
            value: response.data.today_summary.total_orders,
          },
        ];
        this.weeklyData = [
          {
            key: 'Pesanan Baru',
            value: response.data.week_summary.new_orders,
          }, {
            key: 'Pesanan Diproses',
            value: response.data.week_summary.pending_orders,
          }, {
            key: 'Pesanan Lagi Diantar',
            value: response.data.week_summary.on_the_way_orders,
          }, {
            key: 'Pesanan Terkirim',
            value: response.data.week_summary.delivered_orders,
          }, {
            key: 'Pesanan Ditolak',
            value: response.data.week_summary.rejected_orders,
          }, {
            key: 'Pesanan Gagal',
            value: response.data.week_summary.failed_orders,
          }, {
            key: 'Total',
            value: response.data.week_summary.total_orders,
          },
        ];
      })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning',
          });
        });
      fetchCountEmptyStock(this.storeId).then(response => {
        this.stockCount.empty = response.data;
      }).catch(() => {
        this.stockCount.empty = {
          count: 0,
          monitoring_name: undefined,
        };
      });
      fetchCountLowStock(this.storeId).then(response => {
        this.stockCount.low = response.data;
      }).catch(() => {
        this.stockCount.low = {
          count: 0,
          monitoring_name: undefined,
        };
      });
      fetchCountNoSalesStock(this.storeId).then(response => {
        this.stockCount.not_sold = response.data;
      }).catch(() => {
        this.stockCount.not_sold = {
          count: 0,
          monitoring_name: undefined,
        };
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
</style>
