<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="tabs">
        <ul class="header">
          <li
            v-for="(tab, index) in paymentMethod"
            :key="index"
            class="tab"
            :class="{'selected': (index == selectedIndex)}"
            @click="selectTab(index); select(tab); category = tab"
          >
            {{ tab }}
          </li>
        </ul>
        <div v-show="isActive" class="tabcontent">
          <div class="order-filter-container">
            <input
              v-model="listQuery.invoice"
              type="text"
              :placeholder="$t('order.reference_id')"
              class="input-style"
              @keyup.enter.native="handleFilter"
            >
            <!-- <el-select v-model="listQuery.status" placeholder="Order Status" clearable class="filter-item"> -->
            <!--  <el-option v-for="item in statusOptions" :key="item.key" class="filter-item-status" :label="item" :value="item"/> -->
            <!-- </el-select> -->
            <input
              v-model="listQuery.name"
              type="text"
              :placeholder="$t('order.name')"
              class="input-style"
              @keyup.enter.native="handleFilter"
            >
            <el-date-picker
              v-model="listQuery.daterange"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              class="filter-item-daterange"
            />
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              {{ $t('table.search') }}
            </el-button>
            <json-excel
              v-waves
              class="filter-item"
              :fetch="fetchData"
              :fields="json"
            >
              <el-button type="primary" icon="el-icon-document">Unduh</el-button>
            </json-excel>
          </div>
          <div class="table-wrapper">
            <el-table
              :key="tableKey"
              v-loading="listLoading"
              :data="list"
              fit
              highlight-current-row
            >
              <el-table-column v-if="!isMobile" :label="$t('order.number')" prop="id" align="center" width="50">
                <template slot-scope="scope">
                  <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.reference_id')" prop="id" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.invoice }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.name')" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Channel Pembayaran">
                <template slot-scope="{ row }">
                  <span>{{ row.payment_method }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Alasan Refund">
                <template slot-scope="{ row }">
                  <span>{{ row.status }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Total Pembayaran">
                <template slot-scope="{ row }">
                  <span>{{ row.total | price_format }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="false" :label="$t('table.date_time')" align="center">
                <template slot-scope="{row}">
                  <span>{{ convertTZ(row.created_date, 'Asia/Jakarta') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('refund.action')"
                align="left"
                class-name="small-padding"
              >
                <template slot-scope="{ row }">
                  <el-button type="secondary" size="mini" @click="seeDetail(row)">
                    <svg-icon icon-class="eye-open" class-name="card-panel-icon" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @pagination="changePage(tab)"
            />
          </div>
          <el-dialog
            :visible.sync="dialogPvVisible"
            :title="'Refund Detail Order : ' + referenceId"
            :custom-class="'rounded-border'"
            width="90%"
          >
            <h3>Summary :</h3>
            <el-table :data="order" :show-header="false">
              <el-table-column label="Name" width="150">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('refund.bank_name')" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.value }}</span>
                </template>
              </el-table-column>
            </el-table>
            <br>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary">
                <download-csv
                  class="btn btn-default"
                  :data="json_data"
                  :name="referenceId + '.csv'"
                >
                  {{ $t('table.download') }}
                </download-csv>
              </el-button>
              <!-- <el-button @click="submitApprove(referenceId)"> -->
              <!--  {{ $t('refund.approve') }} -->
              <!-- </el-button> -->
              <el-button type="primary" @click="dialogPvVisible = false">{{
                $t('table.confirm')
              }}</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchOrder, updateDelivery, updateOrderStatus, acceptOrder, rejectOrder } from '@/api/order';
// import {
//   fetchList,
//   fetchOrder,
//   updateDelivery,
//   updateOrderStatus,
//   acceptOrder,
// } from '@/api/order';
import { RefundVA, RefundEW, approveRefund } from '@/api/refund';
import waves from '@/directive/waves'; // Waves directive
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import moment from 'moment';
import JsonExcel from 'vue-json-excel';

export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    JsonExcel,
  },
  directives: { waves },
  filters: {
  //  statusFilter(status) {
  //    const statusMap = {
  //      published: 'success',
  //      draft: 'info',
  //      deleted: 'danger',
  //    };
  //    return statusMap[status];
  //  },
    price_format(value) {
      const currency = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      });
      // console.info(value);
      return currency.format(value);
    },
  },
  data() {
    return {
      isActive: true,
      selectedIndex: 0,
      tabs: [],
      paymentMethod: ['Virtual Account', 'E-Wallet'],
      json: {
        'Date Ordered': 'created_date',
        'Order ID': 'invoice',
        'WhatsApp Pembeli': 'phone_number',
        'Name Pembeli': 'name',
        'Channel Pembayaran': 'payment_method',
        'Alasan Pembayaran': 'status',
        'Total Pembayaran': 'total',
      },
      json_data: [
        {
          'ID Pesanan': '',
          'Nama': '',
          'Metode Pembayaran': '',
          'Date Orde': '',
          'Total Pembayaran': '',
        },
      ],
      // sendOrderNumber: '',
      // sendTrackingLink: '',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        invoice: undefined,
        // status: undefined,
        daterange: undefined,
        start_date: undefined,
        end_date: undefined,
        store_id: undefined,
      },
      // statusOptions: {
      //  0: 'INITIATED',
      //  1: 'SUCCESS',
      //  2: 'PENDING',
      //  3: 'FAILED',
      // },
      statusOptions: {
        1: 'REJECTED',
        2: 'REFUNDED',
      },
      dialogPvVisible: false,
      referenceId: '',
      // driverName: '',
      // driverPhoneNumber: '',
      order: [],
      // selectedOrder: {},
      // orderHistory: [],
      orderItems: [],
      orderItemsTotal: [],
      // downloadLoading: false,
      // dashboardData: 0,
      timerCount: 0,
      category: '',
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
  },
  watch: {
    timerCount: {
      handler() {
        if (this.timerCount >= 0) {
          setTimeout(() => {
            const tmpStoreId = atob(localStorage.getItem('store_id'));
            if (tmpStoreId !== this.listQuery.store_id) {
              this.select(this.tab);
            }
            this.timerCount++;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
  async created() {
    // this.getList();
    this.listQuery.store_id = atob(localStorage.getItem('store_id'));
    this.tab = 'Virtual Account';
    this.listLoading = true;
    const { data } = await RefundVA(this.listQuery);
    this.list = data.data;
    this.total = data?.total || 0;
    this.listLoading = false;
  },
  mounted() {
    this.selectTab(0);
    this.tabs = this.$children;
  },
  methods: {
    async fetchData(){
      console.log(this.tab);
      if (this.tab === 'E-Wallet') {
        const { data } = await RefundEW(this.listQuery);
        return data.data;
      } else {
        const { data } = await RefundVA(this.listQuery);
        return data.data;
      }
    },
    selectTab(i) {
      this.selectedIndex = i;
      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === i);
      });
    },
    async changePage(tab) {
      this.listQuery.store_id = atob(localStorage.getItem('store_id'));
      this.listLoading = true;
      this.tab = tab;
      if (this.tab === 'E-Wallet') {
        const { data } = await RefundEW(this.listQuery);
        this.list = data.data;
        this.total = data?.total || 0;
      } else {
        const { data } = await RefundVA(this.listQuery);
        this.list = data.data;
        this.total = data?.total || 0;
      }
      this.listLoading = false;
    },
    async select(tab, isFilter) {
      if (!isFilter) {
        this.listQuery.invoice = '';
        this.listQuery.name = '';
        this.listQuery.daterange = '';
        this.listQuery.start_date = '';
        this.listQuery.end_date = '';
      }
      this.listQuery.page = 1;
      this.listQuery.store_id = atob(localStorage.getItem('store_id'));
      this.listLoading = true;
      this.tab = tab;
      if (this.tab === 'E-Wallet') {
        const { data } = await RefundEW(this.listQuery);
        this.list = data.data;
        this.total = data?.total || 0;
      } else {
        const { data } = await RefundVA(this.listQuery);
        this.list = data.data;
        this.total = data?.total || 0;
      }
      this.listLoading = false;
    },
    // async getList() {
    //  this.listQuery.store_id = atob(localStorage.getItem('store_id'));
    //  this.listLoading = true;
    //  const { data } = await fetchList(this.listQuery);
    //  this.list = data;
    //  fetchDashboard(this.listQuery.store_id)
    //    .then((response) => {
    //      this.dashboardData = response.data;
    //    })
    //    .catch((err) => {
    //      this.$message({
    //        message: err,
    //        type: 'warning',
    //      });
    //    });
    //  this.listLoading = false;
    // },
    handleFilter() {
      if (this.listQuery.daterange) {
        this.listQuery.start_date =
          moment(this.listQuery.daterange[0]).format('YYYY-MM-DD') + ' 00:00';
        this.listQuery.end_date =
          moment(this.listQuery.daterange[1]).format('YYYY-MM-DD') + ' 23:59';
      } else {
        this.listQuery.start_date = '';
        this.listQuery.end_date = '';
      }
      this.listQuery.page = 1;
      this.select(this.tab, true);
    },
    convertTZ(date, tzString) {
      return moment
        .utc(date, 'YYYY-MM-DD HH:mm:ss')
        .tz(tzString)
        .format('YYYY-MM-DD HH:mm');
    },
    handleFetchPv(pv) {},
    // handleUpdateOrderStatus(row) {
    // updateOrderStatus(row.ReferenceId, row.OrderStatus)
    //   .then((response) => {
    //     console.log(response);
    //     if (!response.error) {
    //       this.$message({
    //         message:
    //           'Order status for ' + row.ReferenceId + ' has been updated.',
    //         type: 'success',
    //         duration: 5 * 1000,
    //       });
    //     } else {
    //       this.$message({
    //         message: response.message,
    //         type: 'error',
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     this.$message({
    //       message: err,
    //       type: 'warning',
    //     });
    //   })
    //   .finally(() => {
    //     this.getList();
    //   });
    // },
    // acceptOrder(row) {
    // acceptOrder(row.ReferenceId, row.PaymentStatus)
    //   .then((response) => {
    //     if (!response.error) {
    //       this.$message({
    //         message: 'Accept for ' + row.ReferenceId + ' success.',
    //         type: 'success',
    //         duration: 5 * 1000,
    //       });
    //     } else {
    //       this.$message({
    //         message: response.message,
    //         type: 'error',
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     this.$message({
    //       message: err,
    //       type: 'warning',
    //     });
    //   })
    //   .finally(() => {
    //     this.getList();
    //   });
    // },
    // rejectOrder(row) {
    // const statusOrder = 'REJECTED';
    // updateOrderStatus(row.ReferenceId, statusOrder)
    //   .then((response) => {
    //     console.log(response);
    //     if (!response.error) {
    //       this.$message({
    //         message: 'Reject for ' + row.ReferenceId + ' success.',
    //         type: 'success',
    //         duration: 5 * 1000,
    //       });
    //     } else {
    //       this.$message({
    //         message: response.message,
    //         type: 'error',
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     this.$message({
    //       message: err,
    //       type: 'warning',
    //     });
    //   })
    //   .finally(() => {
    //     this.getList();
    //   });
    // },
    // deliveryOrder(row) {
    // updateDelivery(row.ReferenceId, row.PaymentStatus)
    //   .then((response) => {
    //     if (!response.error) {
    //       this.$message({
    //         message:
    //           'Delivery status for ' + row.ReferenceId + ' has been updated.',
    //         type: 'success',
    //         duration: 5 * 1000,
    //       });
    //     } else {
    //       this.$message({
    //         message: response.message,
    //         type: 'error',
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     this.$message({
    //       message: err,
    //       type: 'warning',
    //     });
    //   })
    //   .finally(() => {
    //     this.getList();
    //   });
    // },
    changeFormatPrice(value) {
      const currency = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      });
      return currency.format(value);
    },
    async submitApprove(referenceId) {
      const dataApprove = await approveRefund(referenceId);
      console.log(dataApprove);
    },
    seeDetail(row) {
      this.orderItems = [];
      this.orderItemsTotal = [];
      this.dialogPvVisible = true;
      this.referenceId = row.invoice;
      this.order = [
        {
          name: 'ID Pesanan',
          value: row.invoice,
        },
        {
          name: 'Nama',
          value: row.name,
        },
        {
          name: 'Metode Pembayaran',
          value: row.payment_method,
        },
        {
          name: 'Date Order',
          value: this.convertTZ(row.created_date, 'Asia/Jakarta'),
        },
        {
          name: 'Total Pembayaran',
          value: this.changeFormatPrice(row.total),
        },
      ];

      this.json_data = [
        {
          'ID Pesanan': row.invoice,
          'Nama': row.name,
          'Metode Pembayaran': row.payment_method,
          'Date Orde': this.convertTZ(row.created_date, 'Asia/Jakarta'),
          'Total Pembayaran': this.changeFormatPrice(row.total),
        },
      ];
    },
  },
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Style the tabs */
.tabs {
  overflow: hidden;
  margin-bottom: -2px; /* hide bottom border */
}

.el-button {
  margin: 2px;
}

ul.tab header {
  display: block;
  list-style: none;
}

.tab, .tabcontent{
  display: inline-block;
}

.tabs .tab{
  cursor: pointer;
  padding: 15px 15px;
  transition: background-color 0.2s;
  border: 1px solid #ccc;
  border-right: none;
  background-color: #f1f1f1;
  border-radius: 10px 10px 0 0;
}

.tabs .tab:last-child {
  border-right: 1px solid #ccc;
}

/* Change background color of tabs on hover */
.tabs .tab:hover {
  background-color: #aaa;
  color: #fff;
}

/* Styling for selected tab */
.tabs .tab.selected {
  background-color: #f8f8f8;
  color: #484848;
  border-bottom: none;
  cursor: default;
}

/* Style the tab content */
.tabcontent {
  background-color: #f8f8f8;
  padding: 30px 40px;
  border: 1px solid #ccc;
  border-top:none;
  box-shadow: 4px 4px 8px #e1e1e1;
  width: 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.order-filter-container{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.order-filter-container {
  margin-bottom: 24px;
  @media screen and (max-width: 540px) {
     margin-bottom: 16px;
  }
}

.filter-item-id {
  width: 300px;
}

.filter-item-id,
.filter-item-status,
.filter-item-daterange {
  margin-right: 16px;
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

.filter-item-daterange {
  width: 400px;
  @media screen and (max-width: 540px) {
    display: none !important;
  }
}

@media screen and (max-width: 768px) {
  .order-filter-container {
    display: block;
    text-align: right;
  }

  .filter-item-id {
    width: 100%;
    margin-bottom: 16px;
  }

  .filter-item-status {
    width: 50%;
    margin-right: 0px;
    margin-left: 10px;
  }

  .filter-item-daterange {
    width: 100% !important;
    margin: 16px 0 !important;
  }
}

.input-style {
  border: 1.11111px solid rgb(220, 223, 230);
  border-radius: 9px;
  color: rgb(96, 98, 102);
  width: 250px;
  min-width: 200px;
  height: 33.7px;
  padding: 0 15px;
  margin-right: 16px;
}
.input-style:focus {
  outline: 1.11111px solid rgb(24, 124, 255);
}

.input-style::placeholder {
  color: rgb(192, 196, 207);
}
</style>
