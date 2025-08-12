<template>
  <div class="app-container">
    <panel-group :data="orderData" />
    <div class="wrapper">
      <div class="tabs">
        <ul class="header">
          <li
            v-for="(tab, index) in statusOptions"
            :id="tab.value"
            :key="tab.key"
            class="tab"
            :class="{'selected': (index == selectedIndex)}"
            @click="selectTab(index); select(tab.value); category = tab.value"
          >
            {{ tab.name }}
          </li>
        </ul>
        <div v-show="isActive" class="tabcontent">
          <div class="order-filter-container">
            <input
              v-model="listQuery.order_reference_id"
              type="text"
              :placeholder="$t('order.reference_id')"
              class="input-style"
              @keyup.enter.native="handleFilter"
            >
            <input
              v-model="listQuery.phone_number"
              type="text"
              :placeholder="$t('order.phone_number')"
              class="input-style"
              @keyup.enter.native="handleFilter"
            >
            <!-- <div class="filter-item-container"> -->
            <!--<el-select v-model="listQuery.order_status" :placeholder="$t('order.status.index')" clearable class="filter-item-status">-->
            <!--  <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.value" />-->
            <!--</el-select> -->
            <!-- </div> -->
            <!--<el-select v-model="listQuery.order_payment_method" :placeholder="$t('order.payment_method.index')" clearable class="filter-item-status"> -->
            <!--  <el-option v-for="item in paymentMethod" :key="item" :label="item" /> -->
            <!--</el-select> -->
            <!--<el-select v-model="listQuery.order_delivery_method" :placeholder="$t('order.payment_method.index')" clearable class="filter-item-status"> -->
            <!--  <el-option v-for="item in deliveryMethod" :key="item" :label="item" /> -->
            <!--</el-select> -->
            <div class="filter-item-date">
              <el-date-picker
                v-model="listQuery.start_date"
                type="date"
                :placeholder="$t('table.start_date')"
              />
              <span>To</span>
              <el-date-picker
                v-model="listQuery.end_date"
                type="date"
                :placeholder="$t('table.end_date')"
              />
            </div>
            <el-date-picker
              v-model="listQuery.daterange"
              type="daterange"
              range-separator="To"
              :start-placeholder="$t('table.start_date')"
              :end-placeholder="$t('table.end_date')"
              class="filter-item-daterange"
              @input="handleChangeDate"
            />
            <el-button
              v-waves
              class="filter-item-button"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              {{ $t('table.search') }}
            </el-button>
          </div>
          <!-- TABLE -->
          <div class="table-wrapper">
            <div v-if="category === 'PAYMENT_CONFIRMED'" class="flex-parent jc-right">
              <el-button
                v-waves
                class="filter-item-button"
                type="success"
                @click="accepts"
              >
                Process Selected Items
              </el-button>
              <!-- <el-button v-waves class="filter-item-button" type="success" @click="accept">
                Process Selected Items
              </el-button>
              -->
              <!-- <el-button v-waves class="filter-item-button" type="danger" @click="reject">
                Reject Selected Items
              </el-button>
              -->
              <el-button
                v-waves
                class="filter-item-button"
                type="danger"
                @click="rejects"
              >
                Reject Selected Items
              </el-button>
            </div>
            <div v-if="category === 'ACCEPTED'" class="flex-parent jc-right">
              <!--<el-button v-waves class="filter-item-button" type="success" @click="delivery">
                Process Selected Items
              </el-button>
              -->
              <el-button
                v-waves
                class="filter-item-button"
                type="success"
                @click="deliveries"
              >
                Process Selected Items
              </el-button>
            </div>
            <el-table
              :key="tableKey"
              ref="multipleTable"
              v-loading="listLoading"
              :data="list"
              fit
              highlight-current-row
              style="width: 100%;"
              class="order__table-list table-order"
              @selection-change="handleSelectionChange"
            >
              <el-table-column v-if="category === 'PAYMENT_CONFIRMED' || category === 'ACCEPTED'" type="selection" disabled="{ isDisable }" />
              <el-table-column v-if="!isMobile" :label="$t('order.number')" prop="id" align="center" width="50">
                <template slot-scope="scope">
                  <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.reference_id')" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.ReferenceId }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.name')">
                <template slot-scope="{row}">
                  <span>{{ row.UserName }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="!isMobile" :label="$t('table.date_time')" align="center">
                <template slot-scope="{row}">
                  <span>{{ convertTZ(row.CreatedAt, 'Asia/Jakarta') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.phone_number')">
                <template slot-scope="{row}">
                  <span>{{ row.PhoneNumber }}</span>
                </template>
              </el-table-column>
              <!--      <el-table-column label="Status" align="center">-->
              <!--        <template slot-scope="{row}">-->
              <!--          <el-select-->
              <!--            v-model="row.OrderStatus"-->
              <!--            :placeholder="Status"-->
              <!--            clearable-->
              <!--            class="filter-item"-->
              <!--            @change="handleUpdatePayment(row)"-->
              <!--          >-->
              <!--            <el-option v-for="item in statusOptions" :key="item.key" :label="item" :value="item" />-->
              <!--          </el-select>-->
              <!--        </template>-->
              <!--      </el-table-column>-->
              <!--<el-table-column :label="$t('order.status.index')" align="center" :width="isMobile ? '96' : ''">-->
              <!--  <template slot-scope="{row}">-->
              <!--    <span v-if="row.OrderStatus === 'SUCCESSFUL'">Sukses</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'INITIATED'">Inisiasi</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'PAYMENT_CONFIRMED'">Konfirmasi Pembayaran</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'ACCEPTED'">Diproses</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'REJECTED'">Ditolak</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'FAILED'">Gagal</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'ON_THE_WAY'">Diperjalanan</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'DELIVERED'">Terkirim</span>-->
              <!--    <span v-else-if="row.OrderStatus === 'REFUNDED'">Dana Dikembalikan</span>-->
              <!--  </template>-->
              <!--</el-table-column>-->
              <el-table-column :label="$t('order.Payment')">
                <template slot-scope="{row}">
                  <span>{{ row.PaymentMethod }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('order.Delivery')">
                <template slot-scope="{row}">
                  <span>{{ row.DeliveryMethod }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.actions')" align="left" class-name="small-padding" :width="isMobile ? '200' : ''">
                <template slot-scope="{row}">
                  <el-button type="secondary" size="mini" @click="seeDetail(row)">
                    <svg-icon icon-class="eye-open" class-name="card-panel-icon" />
                  </el-button>
                  <el-button v-if="row.OrderStatus === 'PAYMENT_CONFIRMED'" type="success" size="mini" @click="acceptOrder(row)">
                    <svg-icon icon-class="check-solid" class-name="card-panel-icon" />
                  </el-button>
                  <el-button v-if="row.OrderStatus === 'PAYMENT_CONFIRMED'" type="danger" size="mini" @click="rejectOrder(row)">
                    <svg-icon icon-class="x-solid" class-name="card-panel-icon" />
                  </el-button>
                  <el-button v-if="row.OrderStatus === 'ACCEPTED' && row.DeliveryMethod === 'PICKUP'" class="btn-delivery-action" type="primary" size="mini" @click="deliveryOrder(row)">
                    <svg-icon icon-class="fast-food" class-name="card-panel-icon" />
                    Pesanan Siap Diambil
                  </el-button>
                  <el-button v-if="row.OrderStatus === 'ACCEPTED' && row.DeliveryMethod === 'INHOUSE'" class="btn-delivery-action" type="primary" size="mini" @click="deliveryOrder(row)">
                    <svg-icon icon-class="person-biking-solid" class-name="card-panel-icon" />
                    Kirim Pesanan
                  </el-button>
                  <div v-if="timestamp >= row.MinPickup && timestamp <= row.MaxPickup">
                    <el-button v-if="row.OrderStatus === 'ACCEPTED' && row.DeliveryMethod != 'INHOUSE' && row.DeliveryMethod != 'PICKUP'" class="btn-delivery-action" type="primary" size="mini" @click="deliveryOrder(row)">
                      <svg-icon icon-class="person-biking-solid" class-name="card-panel-icon" />
                      Order Kurir
                    </el-button>
                  </div>
                  <div v-else>
                    <el-button v-if="row.OrderStatus === 'ACCEPTED' && row.DeliveryMethod != 'INHOUSE' && row.DeliveryMethod != 'PICKUP'" class="btn-delivery-action btn-disable" type="info" size="mini" disabled>
                      <svg-icon icon-class="person-biking-solid" class-name="card-panel-icon" />
                      Order Kurir
                    </el-button>
                  </div>
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

          <!-- Detail -->
          <el-dialog
            :visible.sync="dialogPvVisible"
            :title="$t('order.reference_id2')+ referenceId"
            :custom-class="'rounded-border'"
            width="90%"
          >
            <h3> {{ $t('order.summary') }} : </h3>
            <el-table :data="order" :show-header="false">
              <el-table-column :label="$t('table.name')" width="160">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.count')" align="left">
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.row.name === 'Status' && isAdminRole"
                    v-model="selectedOrder.OrderStatus"
                    :placeholder="$t('table.status')"
                    class="filter-item"
                    @change="handleUpdateOrderStatus(selectedOrder)"
                  >
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.key"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                  <span v-else>
                    {{ scope.row.value }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <p v-if="sendTrackingLink"><a target="_blank" :href="sendTrackingLink">
              <el-button type="success">Track</el-button>
            </a></p>
            <br>
            <h3>{{ $t('order.items') }} : </h3>
            <el-table :data="orderItems">
              <el-table-column :label="$t('table.name')">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.qty')" align="center">
                <template slot-scope="scope">
                  {{ scope.row.count }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.count')" align="left">
                <template slot-scope="scope">
                  {{ scope.row.price | price_format }}
                </template>
              </el-table-column>
            </el-table>
            <el-divider />
            <el-table :data="orderItemsTotal" :show-header="false">
              <el-table-column :label="$t('table.name')">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.qty')">
                <template slot-scope="scope">
                  {{ scope.row.count }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.count')" align="left">
                <template slot-scope="scope">
                  {{ scope.row.price }}
                </template>
              </el-table-column>
            </el-table>
            <br>
            <h3>{{ $t('order.history') }} </h3>
            <el-table :data="orderHistory" class="order__table-history">
              <el-table-column
                :label="$t('table.description')"
                class="table-history__description"
                width="200"
              >
                <template slot-scope="scope">
                  {{ scope.row.description }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.status')" width="120">
                <template slot-scope="scope">
                  {{ scope.row.status }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.date_time')" width="150" align="left">
                <template slot-scope="scope">
                  {{ convertTZ(scope.row.timestamp, 'Asia/Jakarta') }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('table.metadata')"
                align="left"
                :width="isMobile ? '300' : ''"
              >
                <template slot-scope="scope">
                  <el-collapse style="border: none">
                    <el-collapse-item title="Metadata" name="1">
                      <pre>{{ JSON.stringify(scope.row.metadata, null, 2) }}</pre>
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>
              <!--        <el-table-column label="Metadata" align="left">-->
              <!--          <template slot-scope="scope">-->
              <!--            <span v-for="(value, key) in scope.row.metadata" :key="key">-->
              <!--              {{ key }} : {{ value }}<br>-->
              <!--            </span>-->
              <!--          </template>-->
              <!--        </el-table-column>-->
            </el-table>
            <br>
            <!--      <el-table :data="orderDeliveries">-->
            <!--        <el-table-column label="Payment" width="150">-->
            <!--          <template slot-scope="scope">-->
            <!--            {{ scope.row.delivery }}-->
            <!--          </template>-->
            <!--        </el-table-column>-->
            <!--        <el-table-column label="Status" width="200">-->
            <!--          <template slot-scope="scope">-->
            <!--            {{ scope.row.status }}-->
            <!--          </template>-->
            <!--        </el-table-column>-->
            <!--        <el-table-column label="Timestamp" align="left">-->
            <!--          <template slot-scope="scope">-->
            <!--            {{ convertTZ(scope.row.timestamp, 'Asia/Jakarta') }}-->
            <!--          </template>-->
            <!--        </el-table-column>-->
            <!--        &lt;!&ndash;        <el-table-column label="Metadata" align="left">&ndash;&gt;-->
            <!--        &lt;!&ndash;          <template slot-scope="scope">&ndash;&gt;-->
            <!--        &lt;!&ndash;            <span v-for="(value, key) in scope.row.metadata" :key="key">&ndash;&gt;-->
            <!--        &lt;!&ndash;              {{ key }} : {{ value }}<br>&ndash;&gt;-->
            <!--        &lt;!&ndash;            </span>&ndash;&gt;-->
            <!--        &lt;!&ndash;          </template>&ndash;&gt;-->
            <!--        &lt;!&ndash;        </el-table-column>&ndash;&gt;-->
            <!--      </el-table>-->
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
              <el-button type="primary" @click="dialogPvVisible = false">
                {{ $t('table.confirm') }}
              </el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchList, fetchOrder,
  updateDelivery, createDeliveries,
  updateOrderStatus,
  acceptOrder, acceptOrders,
  rejectOrder, rejectOrders,
  confirmCourier, rejectCourier,
} from '@/api/order';
import waves from '@/directive/waves'; // Waves directive
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import moment from 'moment';
// import { fetchDashboard } from '@/api/dashboard';
import { OrderStatus } from '@/api/dashboard';
import { fetchListDelivery } from '@/api/delivery';
import PanelGroup from './components/PanelGroup';
import i18n from '@/lang';

export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    PanelGroup,
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      };
      return statusMap[status];
    },
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
      isActive: true,
      selectedIndex: 0,
      tabs: [],
      json_data: [
        {
          'Merchant Name': '',
          'Store Name': '',
          'Reference ID': '',
          'Deliver From': '',
          'Deliver To': '',
          'Item Quantity': '',
          'Fee Before Tax': '',
          'Tax': '',
          'Delivery Fee': '',
          'Payment Fee': '',
          'Platform Fee': '',
          'Total Fee': '',
          'Payment Status': '',
          'Payment Channel': '',
          'Delivery': '',
          'Delivery Status': '',
          'Date Order': '',
          'Date Deliver': '',
        },
      ],
      sendOrderNumber: '',
      sendTrackingLink: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        order_number: undefined,
        delivery_status: undefined,
        payment_status: undefined,
        daterange: undefined,
        start_date: undefined,
        end_date: undefined,
        store_id: undefined,
      },
      // deliveryOptions: ['INITIATED', 'ONGOING', 'DELIVERED', 'EXPIRED'],
      // statusOptions: ['INITIATED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'REJECTED', 'SUCCESSFUL', 'FAILED', 'ON_THE_WAY', 'DELIVERED', 'REFUNDED'],
      deliveryQuery: {
        page: 1,
        limit: 15,
        name: '',
      },
      deliveryList: [],
      paymentMethod: ['BNI_VA', 'SHOPEEPAY', 'BRI-VA', 'PERMATA_VA', 'DOKU_VA', 'MANDIRI-VA', 'BCA-VA', 'OVO'],
      deliveryMethod: ['INHOUSE', 'paxel', 'lalamove', 'lion', 'anteraja', 'rpx', 'idexpress', 'grab', 'wahana', 'mrspeedy', 'GOSEND', 'PICKUP', 'jnt', 'jne', 'ninja', 'sicepat'],
      statusOptions: [
        {
          'name': i18n.t('order.status.initiated'),
          'value': 'INITIATED',
        },
        {
          'name': i18n.t('order.status.payment_confirmation'),
          'value': 'PAYMENT_CONFIRMED',
        },
        {
          'name': i18n.t('order.status.accepted'),
          'value': 'ACCEPTED',
        },
        {
          'name': i18n.t('order.status.pickup'),
          'value': 'ON_PICK_UP',
        },
        {
          'name': i18n.t('order.status.otw'),
          'value': 'ON_THE_WAY',
        },
        {
          'name': i18n.t('order.status.delivered'),
          'value': 'DELIVERED',
        },
        {
          'name': i18n.t('order.status.successful'),
          'value': 'SUCCESSFUL',
        },
        {
          'name': i18n.t('order.status.failed'),
          'value': 'FAILED',
        },
        {
          'name': i18n.t('order.status.rejected'),
          'value': 'REJECTED',
        },
        // {
        //  'name': i18n.t('order.status.refunded'),
        //  'value': 'REFUNDED',
        // },
      ],
      dialogPvVisible: false,
      referenceId: '',
      driverName: '',
      driverPhoneNumber: '',
      order: [],
      selectedOrder: {},
      orderHistory: [],
      orderItems: [],
      orderItemsTotal: [],
      // downloadLoading: false,
      timerCount: 0,
      category: '',
      orderData: {},
      timestamp: '',
    };
  },
  computed: {
    isAdminRole() {
      return this.$store.state.user.roles.includes('admin');
    },
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
    this.tab = 'INITIATED';
    this.listQuery.order_status = this.tab;
    this.listLoading = true;
    const { data, total } = await fetchList(this.listQuery);
    this.list = data.items;
    this.total = total || 0;
    OrderStatus(this.listQuery.store_id).then(response => {
      this.orderData = response.data;
    })
      .catch(err => {
        this.$message({
          message: err,
          type: 'warning',
        });
      });
    this.deliveryQuery.merchant_id = atob(localStorage.getItem('merchant_id'));
    this.deliveryQuery.store_id = atob(localStorage.getItem('store_id'));
    fetchListDelivery(this.deliveryQuery).then(res => {
      this.deliveryList = res.data.data.filter(item => item.active === true);
    }).catch(err => {
      this.$message({
        message: err.message,
        type: 'warning',
      });
    });
    this.listLoading = false;
    setInterval(this.getNow, 1000);
  },
  mounted() {
    this.selectTab(0);
    this.tabs = this.$children;
  },
  methods: {
    selectTab(i) {
      this.selectedIndex = i;
      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === i);
      });
    },
    // async getList() {
    //  this.listQuery.store_id = atob(localStorage.getItem('store_id'));
    //  this.listLoading = true;
    //  const { data } = await fetchList(this.listQuery);
    //  this.list = data.items;
    //
    //  fetchDashboard(this.listQuery.store_id).then(response => {
    //    this.dashboardData = response.data;
    //  })
    //    .catch(err => {
    //      this.$message({
    //        message: err,
    //        type: 'warning',
    //      });
    //    });
    //  this.deliveryQuery.merchant_id = atob(localStorage.getItem('merchant_id'));
    //  this.deliveryQuery.store_id = atob(localStorage.getItem('store_id'));
    //  fetchListDelivery(this.deliveryQuery).then(res => {
    //    this.deliveryList = res.data.data.filter(item => item.active === true);
    //  }).catch(err => {
    //    this.$message({
    //      message: err.message,
    //      type: 'warning',
    //    });
    //  });
    //  this.listLoading = false;
    // },
    handleChangeDate(event) {
      if (!event) {
        this.listQuery.start_date = '';
        this.listQuery.end_date = '';
      }
    },
    async getList() {
      this.listQuery.store_id = atob(localStorage.getItem('store_id'));
      this.listLoading = true;
      const { data } = await fetchList(this.listQuery);
      this.list = data.items;
      this.listLoading = false;
    },
    async changePage(tab) {
      this.listQuery.store_id = atob(localStorage.getItem('store_id'));
      this.tab = tab;
      this.listQuery.order_status = this.tab;
      this.listLoading = true;
      const { data, total } = await fetchList(this.listQuery);
      this.list = data.items;
      this.total = total || 0;
      this.listLoading = false;
    },
    async select(tab, isFilter) {
      if (!isFilter) {
        this.listQuery.order_reference_id = '';
        this.listQuery.phone_number = '';
        this.listQuery.invoice = '';
        this.listQuery.daterange = '';
        this.listQuery.start_date = '';
        this.listQuery.end_date = '';
      }
      this.listQuery.page = 1;
      this.listQuery.store_id = atob(localStorage.getItem('store_id'));
      this.tab = tab;
      this.listQuery.order_status = this.tab;
      this.listLoading = true;
      const { data, total } = await fetchList(this.listQuery);
      this.list = data.items;
      this.total = total || 0;
      this.listLoading = false;
    },
    isDisable() {
      return this.list.length < 0;
    },
    handleSelectionChange(selection) {
      console.log(selection);
      this.selected = [];
      for (const i in selection) {
        this.selected.push(selection[i].ReferenceId);
      }
    },
    handleFilter() {
      const isMobile = window.innerWidth < 768;

      if (isMobile && this.listQuery.start_date && this.listQuery.end_date) {
        this.listQuery.start_date = moment(this.listQuery.start_date).format('YYYY-MM-DD') + ' 00:00';
        this.listQuery.end_date = moment(this.listQuery.end_date).format('YYYY-MM-DD') + ' 23:59';
      } else {
        if (this.listQuery.daterange) {
          this.listQuery.start_date = moment(this.listQuery.daterange[0]).format('YYYY-MM-DD') + ' 00:00';
          this.listQuery.end_date = moment(this.listQuery.daterange[1]).format('YYYY-MM-DD') + ' 23:59';
        }
      }

      this.listQuery.page = 1;
      // this.getList();
      this.select(this.tab, true);
    },
    convertTZ(date, tzString) {
      // if date is not in utc format, convert it first
      if (date.indexOf('Z') === -1) {
        date = moment(date).utc();
      }

      return moment.tz(date, tzString).format('YYYY-MM-DD HH:mm');
    },
    formatDate(dateString, dateFormat) {
      const returned_endate = moment(dateString).add(7, 'hours');
      const formattedDate = moment(returned_endate).format(dateFormat);
      return formattedDate;
    },
    changeFormatPrice(value) {
      const currency = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      });
      return currency.format(value);
    },
    handleFetchPv(pv) {
    },
    handleUpdateOrderStatus(row) {
      updateOrderStatus(row.ReferenceId, row.OrderStatus).then(response => {
        console.log(response);
        if (!response.error) {
          this.$message({
            message: i18n.t('order.updateStatus.success', { referenceId: row.ReferenceId }),
            type: 'success',
            duration: 5 * 1000,
          });
        } else {
          this.$message({
            message: i18n.t('order.updateStatus.failed', { referenceId: row.ReferenceId }),
            type: 'error',
          });
        }
      })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning',
          });
        }).finally(() => {
          // this.getList();
          this.select(this.tab);
        });
    },
    acceptOrder(row) {
      acceptOrder(row.ReferenceId, row.PaymentStatus).then(response => {
        if (!response.error) {
          this.$message({
            message: i18n.t('order.accepted.success', { referenceId: row.ReferenceId }),
            type: 'success',
            duration: 5 * 1000,
          });
        } else {
          this.$message({
            message: i18n.t('order.accepted.failed', { referenceId: row.ReferenceId }),
            type: 'error',
          });
        }
      })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning',
          });
        }).finally(() => {
          // this.getList();
          this.select(this.tab);
        });
    },
    accepts() {
      var ids = this.selected;
      var search = new URLSearchParams(ids.map(s => ['reference_ids', s]));
      var searchString = search.toString();
      const data = new FormData();
      data.append('reference_ids', searchString);
      acceptOrders(data).then((response) => {
        console.log(response.data);
        if (!response.error) {
          response.data.map(v => {
            if (v.success === true){
              this.$message({
                message: i18n.t('order.accepted.success', { referenceId: v.reference_id }),
                type: 'success',
                duration: 5 * 1000,
              });
            } else if (v.success === false){
              this.$message({
                message: i18n.t('order.accepted.failed', { referenceId: v.reference_id }),
                type: 'error',
              });
            }
          })
            .catch(err => {
              this.$message({
                message: err,
                type: 'warning',
              });
            }).finally(() => {
              this.select(this.tab);
            });
        }
      }).finally(() => {
        this.select(this.tab);
      });
    },
    // accept() {
    //  this.multipleSelection.map(v => {
    //    return acceptOrder(v.ReferenceId, v.PaymentStatus).then(response => {
    //      console.log(response);
    //      if (!response.error) {
    //        this.$message({
    //          message: i18n.t('order.accepted.success', { referenceId: v.ReferenceId }),
    //          type: 'success',
    //          duration: 5 * 1000,
    //        });
    //      } else {
    //        this.$message({
    //          message: i18n.t('order.accepted.failed', { referenceId: v.ReferenceId }),
    //          type: 'error',
    //        });
    //      }
    //    })
    //      .catch(err => {
    //        this.$message({
    //          message: err,
    //          type: 'warning',
    //        });
    //      }).finally(() => {
    //        this.select(this.tab);
    //      });
    //  });
    // },
    rejectOrder(row) {
      rejectCourier(row.ReferenceId).then(res => console.log(res)).catch(err => {
        this.$message({
          message: err,
          type: 'warning',
        });
      });
      rejectOrder(row.ReferenceId, row.PaymentStatus).then(response => {
        if (!response.error) {
          this.$message({
            message: i18n.t('order.orderRejected.success', { referenceId: row.ReferenceId }),
            type: 'success',
            duration: 5 * 1000,
          });
        } else {
          this.$message({
            message: i18n.t('order.orderRejected.failed', { referenceId: row.ReferenceId }),
            type: 'error',
          });
        }
      })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning',
          });
        }).finally(() => {
          // this.getList();
          this.select(this.tab);
        });
    },
    rejects() {
      var ids = this.selected;
      var search = new URLSearchParams(ids.map(s => ['reference_ids', s]));
      var searchString = search.toString();
      const data = new FormData();
      data.append('reference_ids', searchString);
      rejectOrders(data).then((response) => {
        console.log(response.data);
        if (!response.error) {
          response.data.map(v => {
            if (v.success === true){
              this.$message({
                message: i18n.t('order.orderRejected.success', { referenceId: v.reference_id }),
                type: 'success',
                duration: 5 * 1000,
              });
            } else if (v.success === false){
              this.$message({
                message: i18n.t('order.orderRejected.failed', { referenceId: v.reference_id }),
                type: 'error',
              });
            }
          })
            .catch(err => {
              this.$message({
                message: err,
                type: 'warning',
              });
            }).finally(() => {
              this.select(this.tab);
            });
        }
      }).finally(() => {
        this.select(this.tab);
      });
    },
    // reject() {
    //  this.multipleSelection.map(v => {
    //    rejectCourier(v.ReferenceId).then(res => console.log(res)).catch(err => {
    //      this.$message({
    //        message: err,
    //        type: 'warning',
    //      });
    //    });
    //    rejectOrder(v.ReferenceId, v.PaymentStatus).then(response => {
    //      if (!response.error) {
    //        this.$message({
    //          message: i18n.t('order.orderRejected.success', { referenceId: v.ReferenceId }),
    //          type: 'success',
    //          duration: 5 * 1000,
    //        });
    //      } else {
    //        this.$message({
    //          message: i18n.t('order.orderRejected.failed', { referenceId: v.ReferenceId }),
    //          type: 'error',
    //        });
    //      }
    //    })
    //      .catch(err => {
    //        this.$message({
    //          message: err,
    //          type: 'warning',
    //        });
    //      }).finally(() => {
    //        this.select(this.tab);
    //      });
    //  });
    // },
    // delivery() {
    //  this.selected.map(v => {
    //     if (v.DeliveryMethod === 'grab' || v.DeliveryMethod === 'PICKUP' || v.DeliveryMethod === 'INHOUSE') {
    //       updateDelivery(v.ReferenceId, v.PaymentStatus).then(response => {
    //        if (!response.error) {
    //          this.$message({
    //            message: i18n.t('order.updateDeliveryStatus.success', { referenceId: v.ReferenceId }),
    //            type: 'success',
    //            duration: 5 * 1000,
    //          });
    //        } else {
    //          this.$message({
    //            message: i18n.t('order.updateDeliveryStatus.failed', { referenceId: v.ReferenceId }),
    //            type: 'error',
    //          });
    //        }
    //      })
    //        .catch(err => {
    //          this.$message({
    //            message: err,
    //            type: 'warning',
    //          });
    //        }).finally(() => {
    //          this.select(this.tab);
    //        });
    //    } else {
    //      confirmCourier(v.ReferenceId).then(res => {
    //        console.log(res);
    //        if (res.code === 200) {
    //          this.$message({
    //            message: i18n.t('order.updateDeliveryStatus.success', { referenceId: v.ReferenceId }),
    //            type: 'success',
    //            duration: 5 * 1000,
    //          });
    //        } else {
    //          this.$message({
    //            message: i18n.t('order.updateDeliveryStatus.failed', { referenceId: v.ReferenceId }),
    //            type: 'error',
    //          });
    //        }
    //      }).catch(err => {
    //        this.$message({
    //          message: err.message,
    //          type: 'warning',
    //        });
    //      }).finally(() => {
    //        this.select(this.tab);
    //      });
    //    }
    //  });
    // },
    deliveries() {
      var ids = this.selected;
      var search = new URLSearchParams(ids.map(s => ['reference_ids', s]));
      var searchString = search.toString();
      const data = new FormData();
      data.append('reference_ids', searchString);
      createDeliveries(data).then((response) => {
        console.log(response.data);
        if (!response.error) {
          response.data.map(v => {
            if (v.success === true){
              this.$message({
                message: i18n.t('order.updateDeliveryStatus.success', { referenceId: v.reference_id }),
                type: 'success',
                duration: 5 * 1000,
              });
            } else if (v.success === false){
              this.$message({
                message: i18n.t('order.updateDeliveryStatus.failed', { referenceId: v.reference_id }),
                type: 'error',
              });
            }
          })
            .catch(err => {
              this.$message({
                message: err,
                type: 'warning',
              });
            }).finally(() => {
              this.select(this.tab);
            });
        }
      }).finally(() => {
        this.select(this.tab);
      });
    },
    deliveryOrder(row) {
      if (row.DeliveryMethod === 'PICKUP' || row.DeliveryMethod === 'INHOUSE') {
        updateDelivery(row.ReferenceId, row.PaymentStatus).then(response => {
          console.log(response);
          if (!response.error) {
            this.$message({
              message: i18n.t('order.updateDeliveryStatus.success', { referenceId: row.ReferenceId }),
              type: 'success',
              duration: 5 * 1000,
            });
          } else {
            this.$message({
              message: i18n.t('order.updateDeliveryStatus.failed', { referenceId: row.ReferenceId }),
              type: 'error',
            });
          }
        })
          .catch(err => {
            this.$message({
              message: err,
              type: 'warning',
            });
          }).finally(() => {
            // this.getList();
            this.select(this.tab);
          });
      } else {
        confirmCourier(row.ReferenceId).then(res => {
          console.log(res);
          if (res.code === 200) {
            console.log(res);
            this.$message({
              message: i18n.t('order.updateDeliveryStatus.success', { referenceId: row.ReferenceId }),
              type: 'success',
              duration: 5 * 1000,
            });
          } else {
            this.$message({
              message: i18n.t('order.updateDeliveryStatus.failed', { referenceId: row.ReferenceId }),
              type: 'error',
            });
          }
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'warning',
          });
        }).finally(() => {
          // this.getList();
          this.select(this.tab);
        });
      }
    },
    seeDetail(row) {
      this.order = [];
      this.orderItems = [];
      this.orderItemsTotal = [];
      this.dialogPvVisible = true;
      this.referenceId = row.ReferenceId;
      this.driverName = '';
      this.driverPhoneNumber = '';
      const flattenJSON = (obj = {}, res = {}, extraKey = '') => {
        for (const k in obj) {
          if (typeof obj[k] !== 'object') {
            res[extraKey + k] = obj[k];
          } else {
            flattenJSON(obj[k], res, `${extraKey}${k}.`);
          }
        }
        return res;
      };
      fetchOrder(row.ReferenceId).then(response => {
        // console.log(row.ReferenceId);
        // console.log(response.data);
        this.selectedOrder = row;
        if (response.data){
          this.order = [
            {
              'name': i18n.t('order.reference_id'),
              'value': row.ReferenceId,
            },
            {
              'name': i18n.t('table.status'),
              'value': response.data?.status,
            },
            {
              'name': i18n.t('table.date'),
              'value': this.formatDate(response.data?.date, 'YYYY-MM-DD H:mm'),
            },
            {
              'name': i18n.t('order.payment.method'),
              'value': response.data?.payment,
            },
            {
              'name': i18n.t('order.payment.status'),
              'value': response.data?.is_paid ? i18n.t('order.payment.paid') : i18n.t('order.payment.not_paid'),
            },
            {
              'name': i18n.t('order.delivery.method'),
              'value': response.data?.delivery + `${response.data.delivery_service ? ` - ${response.data?.delivery_service.toUpperCase()}` : ''}`,
            },
            {
              'name': i18n.t('order.delivery.id'),
              'value': row.DeliveryMethod !== 'GOSEND' ? ' - ' : response.data?.delivery_ref_id,
            },
            {
              'name': i18n.t('order.delivery.biteship'),
              'value': row.DeliveryMethod === 'GOSEND' ? ' - ' : response.data?.delivery_ref_id,
            },
            {
              'name': i18n.t('order.delivery.tracking'),
              'value': response.data?.tracking_id ? response.data?.tracking_id : ' - ',
            },
            {
              'name': i18n.t('order.delivery.resi'),
              'value': response.data?.resi ? response.data.resi : ' - ',
            },
            {
              'name': i18n.t('order.delivery.from'),
              'value': response.data?.deliver_from,
            },
            {
              'name': i18n.t('order.delivery.to'),
              'value': response.data?.deliver_to,
            },
            {
              'name': i18n.t('order.delivery.time'),
              'value': response.data?.delivery_date === '-' ? '-' : this.formatDate(response.data?.delivery_date, 'YYYY-MM-DD H:mm'),
            },
          ];
          this.orderItemsTotal = [
            {
              'name': i18n.t('order.tax_percentage'),
              'count': '',
              'price': response.data.raw_tax + '%',
            },
            {
              'name': i18n.t('tax_fee.tax'),
              'count': '',
              'price': this.changeFormatPrice(response.data.tax),
            },
            {
              'name': i18n.t('tax_fee.delivery'),
              'count': '',
              'price': this.changeFormatPrice(response.data.delivery_fee),
            },
            {
              'name': i18n.t('order.payment.transaction'),
              'count': '',
              'price': this.changeFormatPrice(response.data.payment_fee),
            },
            {
              'name': i18n.t('tax_fee.platform'),
              'count': '',
              'price': this.changeFormatPrice(response.data.order_fee),
            },
            {
              'name': i18n.t('order.payment.total'),
              'count': '',
              'price': this.changeFormatPrice(response.data.total_fee),
            },
          ];
          var itemQty = 0;
          if (response.data?.order_items) {
            for (const orderItem of response.data.order_items) {
              this.orderItems.push(
                {
                  'name': orderItem.item_name,
                  'count': orderItem.qty,
                  'price': orderItem.price,
                }
              );
              itemQty += orderItem.qty;
            }
          } else {
            this.orderItems = [];
          }
          if (response.data?.order_history) {
            this.orderHistory = [];
            for (const orderHistory of response.data.order_history) {
              const metadata = JSON.parse(orderHistory.metadata);
              let newStatus = '';
              switch (orderHistory.status) {
                case 'SUCCESSFUL':
                  newStatus = i18n.t('order.status.successful');
                  break;
                case 'INITIATED':
                  newStatus = i18n.t('order.status.initiated');
                  break;
                case 'PAYMENT_CONFIRMED':
                  newStatus = i18n.t('order.status.payment_confirmation');
                  break;
                case 'ACCEPTED':
                  newStatus = i18n.t('order.status.accepted');
                  break;
                case 'REJECTED':
                  newStatus = i18n.t('order.status.rejected');
                  break;
                case 'FAILED':
                  newStatus = i18n.t('order.status.failed');
                  break;
                case 'ON_PICK_UP':
                  newStatus = i18n.t('order.status.pickup');
                  break;
                case 'ON_THE_WAY':
                  newStatus = i18n.t('order.status.otw');
                  break;
                case 'DELIVERED':
                  newStatus = i18n.t('order.status.delivered');
                  break;
                case 'REFUNDED':
                  newStatus = i18n.t('order.status.refunded');
                  break;
              }
              this.orderHistory.push(
                {
                  'description': orderHistory.description,
                  'status': newStatus,
                  'timestamp': orderHistory.timestamp,
                  'metadata': flattenJSON(metadata),
                }
              );
              if (orderHistory.status === 'ON_THE_WAY') {
                if (metadata.driver_name) {
                  this.driverName = metadata.driver_name;
                }
                if (metadata.driver_phone) {
                  this.driverPhoneNumber = metadata.driver_phone;
                }
              }
            }
          } else {
            this.orderHistory = [];
          }
          this.order.push({
            'name': i18n.t('order.delivery.driver.name'),
            'value': this.driverName ? this.driverName : response.data.courier_driver_name,
          });
          this.order.push({
            'name': i18n.t('order.delivery.driver.phone_number'),
            'value': this.driverPhoneNumber ? this.driverPhoneNumber : response.data.courier_driver_phone,
          });
          const deliveredDate = response.data.delivery_date;
          this.sendOrderNumber = response.data.delivery_ref_id;
          this.sendTrackingLink = response.data.delivery_tracking_url;
          this.json_data = [
            {
              'Merchant Name': localStorage.getItem('merchant_name'),
              'Store Name': response.data.deliver_from,
              'Reference ID': row.ReferenceId,
              'Deliver From': response.data.deliver_from,
              'Deliver To': response.data.deliver_to,
              'Item Quantity': itemQty,
              'Fee Before Tax': parseInt(response.data.total_fee) - parseInt(response.data.tax) - parseInt(response.data.delivery_fee) - parseInt(response.data.order_fee) - parseInt(response.data.payment_fee),
              'Tax': response.data.tax,
              'Delivery Fee': response.data.delivery_fee,
              'Payment Fee': response.data.payment_fee,
              'Platform Fee': response.data.order_fee,
              'Total Fee': response.data.total_fee,
              'Payment Status': response.data.is_paid ? 'PAID' : 'UNPAID',
              'Payment Channel': response.data.payment,
              'Delivery': response.data.delivery,
              'Date Order': this.formatDate(response.data.date, 'YYYY-MM-DD H:mm'),
              'Date Deliver': deliveredDate === '-' ? '-' : this.formatDate(deliveredDate, 'YYYY-MM-DD H:mm'),
            },
          ];
        }
      }).catch(err => {
        this.$message({
          message: err,
          type: 'warning',
        });
      });
    },
    getNow: function() {
      const today = new Date();
      var time = '';
      if (today.getHours() > 10) {
        time = today.getHours() + ':' + today.getMinutes();
      } else {
        time = '0' + today.getHours() + ':' + today.getMinutes();
      }
      const dateTime = time;
      this.timestamp = dateTime;
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

ul.tab header {
  display: block;
  list-style: none;
}

.tab, .tabcontent{
  display: inline-block;
}

.tabs .tab{
  cursor: pointer;
  padding: 15px 10px;
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
  border-bottom: 2px solid #f8f8f8;
  cursor: default;
}

/* Style the tab content */
.tabcontent {
  background-color: #f8f8f8;
  padding: 30px 40px;
  border: 1px solid #ccc;
  border-top: none;
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

.flex-parent {
  display: flex;
}

.jc-right {
  justify-content: flex-end;
  margin-bottom : 10px;
}

.order-filter-container,
.filter-item-container {
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

.filter-item-phone {
  width: 250px;
}

.filter-item-id,
.filter-item-phone,
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

  .filter-item-phone,
  .filter-item-status {
    width: 50%;
    margin-right: 0px;
  }

  .filter-item-status {
    margin-left: 10px;
  }

  .filter-item-daterange {
    width: 100% !important;
    margin: 16px 0 !important;
  }
}

.order {
  &__table-history {
    pre {
      overflow: auto;
    }
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
