<template>
  <div class="app-container">
    <div class="report-filter-container">
      <el-select v-model="query.report_type" :placeholder="$t('table.status')" clearable class="filter-item-transaction" @change="handleFilter">
        <el-option v-for="st in reportTypeFilter" :key="st.value" :label="st.name" :value="st.value" />
      </el-select>
      <div class="filter-item-container">
        <el-select v-model="query.merchant_id" :placeholder="$t('table.merchant')" clearable class="filter-item-merchant" @change="selectMerchant">
          <el-option v-for="st in merchantFilter" :key="st.id" :label="st.name" :value="st.id" />
        </el-select>
        <el-select v-model="query.store_id" :placeholder="$t('table.store')" clearable class="filter-item-store">
          <el-option v-for="st in selectedStoreFilter" :key="st.id" :label="st.name" :value="st.id" />
        </el-select>
      </div>
      <div class="filter-item-date">
        <el-date-picker
          v-model="query.startDate"
          type="date"
          :placeholder="$t('table.start_date')"
        />
        <span>To</span>
        <el-date-picker
          v-model="query.endDate"
          type="date"
          :placeholder="$t('table.end_date')"
        />
      </div>

      <el-date-picker
        v-model="query.daterange"
        type="daterange"
        range-separator="To"
        :start-placeholder="$t('table.start_date')"
        :end-placeholder="$t('table.end_date')"
        class="filter-item-daterange"
      />
      <el-button v-waves class="filter-item-button" type="primary" icon="el-icon-search" @click="handleFilter" />
    </div>
    <!-- TABLE -->
    <div class="table-wrapper">
      <div ref="printMe">
        <el-table v-if="query.report_type === 'ORDER_REPORT'" ref="table" v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">

          <el-table-column align="center" :label="$t('report.date_time')">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.created_at, 'YYYY-MM-DD H:mm') }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('order.reference_id')">
            <template slot-scope="scope">
              <span>{{ scope.row.reference_id }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('report.user_whatsapp')">
            <template slot-scope="scope">
              <span>{{ scope.row.phone_number }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('report.username')">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('report.merchant_name')">
            <template slot-scope="scope">
              <span>{{ scope.row.merchant_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('report.store_name')">
            <template slot-scope="scope">
              <span>{{ scope.row.store_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('report.transaction_status')">
            <template slot-scope="scope">
              <span>{{ scope.row.order_status }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('report.channel_payment')">
            <template slot-scope="scope">
              <span>{{ scope.row.payment_method }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('report.total_payment')">
            <template slot-scope="scope">
              <span>{{ scope.row.total | price_format }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">
          <el-table-column align="center" :label="$t('table.date_time')">
            <template slot-scope="scope">
              <span>{{ scope.row.key }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('table.total_transaction')">
            <template slot-scope="scope">
              <span>{{ scope.row.count }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('table.count')">
            <template slot-scope="scope">
              <span>{{ scope.row.total | price_format }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <br>
    <div class="report-download-buttons">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-picture" @click="toimage">
        {{ $t('report.download.png') }}
      </el-button>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-picture" @click="toJPG">
        {{ $t('report.download.jpg') }}
      </el-button>

      <json-excel
        v-if="query.report_type === 'ORDER_REPORT'"
        class="filter-item"
        :fetch="fetchData"
        :fields="json_field_order"
        name="Detail Order.xls"
      >
        <el-button type="primary" icon="el-icon-document">
          {{ $t('report.download.xlsx') }}
        </el-button>
      </json-excel>
      <json-excel
        v-else
        class="filter-item"
        :fetch="fetchData"
        :fields="json_fields"
      >
        <el-button type="primary" icon="el-icon-document">
          {{ $t('report.download.xlsx') }}
        </el-button>
      </json-excel>
      <div>
        <img hidden :src="output">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchReport } from '@/api/report';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission';
import moment from 'moment'; // Permission directive
import JsonExcel from 'vue-json-excel';
import { fetchListMerchant } from '@/api/merchant';
import i18n from '@/lang';

export default {
  name: 'UserList',
  components: { JsonExcel },
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
      list: null,
      reportTypeFilter: [{
        name: i18n.t('report.time.hourly'),
        value: 'HOURLY_REPORT',
      }, {
        name: i18n.t('report.time.daily'),
        value: 'DAILY_REPORT',
      }, {
        name: i18n.t('report.time.weekly'),
        value: 'WEEKLY_REPORT',
      }, {
        name: i18n.t('report.time.monthly'),
        value: 'MONTHLY_REPORT',
      }, {
        name: i18n.t('report.time.order'),
        value: 'ORDER_REPORT',
      }],
      storeFilter: [],
      merchantFilter: [],
      selectedStoreFilter: [],
      stores: [],
      total: 0,
      loading: true,
      query: {
        report_type: 'DAILY_REPORT',
        daterange: undefined,
        startDate: null,
        endDate: null,
        store_id: null,
        merchant_id: null,
      },
      json_fields: {
        'Aggregate': 'key',
        'Total Order': 'count',
        'Total Sales': 'total',
      },
      json_field_order: {
        'Date Time': 'created_at',
        'Order ID': 'reference_id',
        'Whatsapp Pembeli': 'phone_number',
        'Nama Pembeli': 'username',
        'Nama Merchant': 'merchant_name',
        'Nama Store': 'store_name',
        'Alamat Penjual': 'store_address',
        'Alamat Detail Pembeli': 'user_address',
        'Status Transaksi': 'order_status',
        'Channel Payment': 'payment_method',
        'ID Pengiriman': 'biteship_order_id',
        'Delivery Services': 'delivery_method',
        'Harga Barang': 'total_before_tax',
        'Tax': 'total_tax',
        'Delivery Fee': 'delivery_fee',
        'Payment Fee': 'payment_fee',
        'Platform Fee': 'order_fee',
        'Total Pembayaran': 'total',
        'Fee Toko': 'store_fee',
        'Fee Jatis': 'jatis_fee',
        'Date payment': 'date_payment',
        'Date delivered': 'date_delivered',
      },
      output: null,
    };
  },
  created() {
    const allowedStores = this.$store.getters.stores;
    const allowedMerchant = this.$store.getters.merchants;
    const query = {
      page: 1,
      limit: 9999999999999,
    };
    fetchListMerchant(query).then(response => {
      const tmp = [];
      for (const tmpElement of response.data) {
        if (allowedMerchant.includes('' + tmpElement.id)) {
          tmp.push(tmpElement);
          if (tmpElement.stores) {
            for (const store of tmpElement.stores) {
              if (allowedStores.includes('' + store.id)) {
                this.stores.push({
                  id: '' + store.id,
                  name: store.name,
                  label: store.name,
                  merchant: tmpElement.id,
                });
                if (tmpElement.id === this.query.merchant_id) {
                  this.selectedStoreFilter.push({
                    id: '' + store.id,
                    name: store.name,
                    label: store.name,
                    merchant: tmpElement.id,
                  });
                }
              }
            }
          }
        }
      }
      this.merchantFilter = tmp;
    });
    this.loading = false;
  },
  methods: {
    selectMerchant() {
      this.merchant_id = this.query.merchant_id;
      this.selectedStoreFilter = [];
      for (const store of this.stores) {
        if (store.merchant === this.query.merchant_id) {
          this.selectedStoreFilter.push(store);
        }
      }
      if (this.$store.state.user.roles.includes('admin')) {
        this.selectedStoreFilter.splice(0, 0, {
          id: '' + 0,
          name: 'Semua Toko',
          label: 'Semua Toko',
          merchant: this.merchant_id,
        });
      }
    },
    toimage() {
      this.$html2canvas(this.$refs.printMe, {
        backgroundcolor: null,
      }).then((canvas) => {
        this.output = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = this.output;
        a.download = 'image.png';
        a.click();
      });
    },
    toJPG() {
      this.$html2canvas(this.$refs.printMe, {
        backgroundcolor: '#000',
      }).then((canvas) => {
        this.output = canvas.toDataURL('image/jpg');
        const a = document.createElement('a');
        a.href = this.output;
        a.download = 'image.jpg';
        a.click();
      });
    },
    async getList() {
      this.list = [];
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        if (this.query.startDate && this.query.endDate) {
          this.query.start_date = moment(this.query.startDate).format('YYYY-MM-DD') + ' 00:00';
          this.query.end_date = moment(this.query.endDate).format('YYYY-MM-DD') + ' 23:59';
        } else {
          this.$message({
            message: i18n.t('toaster.date'),
            type: 'error',
            duration: 5 * 1000,
          });
          return;
        }
      } else {
        if (this.query.daterange) {
          this.query.start_date = moment(this.query.daterange[0]).format('YYYY-MM-DD') + ' 00:00';
          this.query.end_date = moment(this.query.daterange[1]).format('YYYY-MM-DD') + ' 23:59';
        } else {
          this.$message({
            message: i18n.t('toaster.date'),
            type: 'error',
            duration: 5 * 1000,
          });
          return;
        }
      }

      this.loading = true;
      fetchReport(this.query).then(response => {
        this.list = response.data;
      });
      this.loading = false;
    },
    handleFilter() {
      this.getList();
    },
    async fetchData(){
      var tmp = this.query;
      if (this.query.daterange) {
        tmp.start_date = moment(tmp.daterange[0]).format('YYYY-MM-DD') + ' 00:00';
        tmp.end_date = moment(tmp.daterange[1]).format('YYYY-MM-DD') + ' 23:59';
      }
      return fetchReport(this.query).then(response => {
        if (this.query.report_type === 'ORDER_REPORT') {
          const result = response.data.map((item) => {
            let date_delivered = '';
            let date_payment = '';
            if (item.date_delivered === '0001-01-01T00:00:00Z'){
              date_delivered = '';
            } else {
              date_delivered = this.formatDate(item.date_delivered, 'YYYY-MM-DD H:mm');
            }
            if (item.date_payment === '0001-01-01T00:00:00Z'){
              date_payment = '';
            } else {
              date_payment = this.formatDate(item.date_payment, 'YYYY-MM-DD H:mm');
            }
            return {
              biteship_order_id: item.biteship_order_id,
              created_at: this.formatDate(item.created_at, 'YYYY-MM-DD H:mm'),
              date_delivered: date_delivered,
              date_payment: date_payment,
              delivery_fee: item.delivery_fee,
              delivery_method: item.delivery_method,
              jatis_fee: item.jatis_fee,
              merchant_name: item.merchant_name,
              order_fee: item.order_fee,
              order_status: item.order_status,
              payment_fee: item.payment_fee,
              payment_method: item.payment_method,
              phone_number: item.phone_number,
              reference_id: item.reference_id,
              store_address: item.store_address,
              store_fee: item.store_fee,
              store_name: item.store_name,
              total: item.total,
              total_before_tax: item.total_before_tax,
              total_tax: item.total_tax,
              user_address: item.user_address,
              username: item.username,
            };
          });
          return result;
        } else {
          return response.data;
        }
      });
    },
    formatDate(dateString, dateFormat) {
      // const returned_endate = moment(dateString).add(7, 'hours');
      const returned_endate = moment(dateString);
      const formattedDate = moment(returned_endate).format(dateFormat);
      return formattedDate;
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

.report-filter-container,
.report-download-buttons,
.filter-item-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.report-download-buttons {
  button {
    margin-left: 0px;
    margin-right: 10px;
  }
}

.report-filter-container {
  margin-bottom: 24px;
  @media screen and (max-width: 540px) {
     margin-bottom: 16px;
  }
}

.filter-item-transaction,
.filter-item-merchant,
.filter-item-store {
  width: 200px;
}

.filter-item-date {
  display: none;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
  span {
    display: inline-block;
    margin: 0 6px;
  }
  @media screen and (max-width: 540px) {
    display: flex;
  }
}

.filter-item-transaction,
.filter-item-merchant,
.filter-item-store,
.filter-item-daterange {
  margin-right: 16px;
}

.filter-item-daterange {
  width: 400px;
  @media screen and (max-width: 540px) {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .report-filter-container,
  .report-download-buttons {
    display: block;
    text-align: right;
  }

  .filter-item-transaction {
    width: 100%;
    margin-bottom: 16px;
  }

  .filter-item-merchant,
  .filter-item-store {
    width: 50%;
    margin-right: 0px;
  }

  .filter-item-daterange {
    width: 100%;
    margin: 16px 0;
  }

  .filter-item-store {
    margin-left: 10px;
  }

  .report-download-buttons {
    button {
      width: 100%;
      margin-bottom: 12px;
      &:last-child {
         margin-bottom: 0px;
      }
    }
  }
}
</style>
