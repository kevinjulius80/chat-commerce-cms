<template>
  <div class="app-container">
    <div style="text-align: right">
      <el-input
        v-model="query.name"
        :placeholder="$t('customer.name')"
        style="width: 200px; margin-right: 12px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="query.phonenumber"
        :placeholder="$t('customer.phone_number_placeholder')"
        style="width: 200px; margin-right: 12px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="query.address"
        :placeholder="$t('customer.address')"
        style="width: 200px; margin-right: 12px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="secondary" @click="handleReset">
        {{ $t('table.reset') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
    </div>
    <br>
    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">
      <br>
      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%; border-collapse: collapse;">
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('customer.name')" prop="name" />

        <el-table-column align="center" :label="$t('customer.phone_number')" prop="phone_number" />

        <el-table-column align="center" :label="$t('customer.address')" prop="address" />

        <el-table-column align="center" :label="$t('customer.date')" prop="create_date" />

        <el-table-column align="center" :label="$t('table.actions')" width="280">
          <template slot-scope="scope">
            <el-button
              type="default"
              size="small"
              icon="el-icon-data-analysis"
              @click="handleDetail(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
      <br>
    </div>

    <el-dialog :visible.sync="dialogDetailVisible" :title="$t('customer.detail')" :custom-class="'rounded-border'">
      <el-table :data="detailCustomer" :show-header="false">
        <el-table-column :label="$t('table.name')" width="250">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.value')">
          <template slot-scope="scope">
            {{ scope.row.value }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission';
import { fetchCustomer, getCustomer } from '@/api/customer';
import i18n from '@/lang';

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      total: Infinity,
      loading: true,
      downloading: false,
      query: {
        page: 1,
        limit: 15,
        name: null,
        address: null,
        phonenumber: null,
      },
      dummyQuery: {
        page: 1,
        limit: 15,
      },
      dialogDetailVisible: false,
      currentId: 0,
      detailCustomer: [],
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
      fetchCustomer(this.query).then(response => {
        this.list = response.data;
      });
      this.loading = false;
    },
    handleReset() {
      this.query = {
        page: 1,
        limit: 15,
        name: null,
        city: null,
        address: null,
        status: null,
      };
      this.getList();
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    handleDetail(row) {
      getCustomer(row.id).then(response => {
        this.currentId = row.id;
        this.detailCustomer = [
          {
            'name': i18n.t('customer.name'),
            'value': response.data.name,
          },
          {
            'name': i18n.t('customer.phone_number'),
            'value': response.data.phone_number,
          },
          {
            'name': i18n.t('customer.address'),
            'value': response.data.address,
          },
          {
            'name': i18n.t('customer.is_admin'),
            'value': response.data.is_admin,
          },
          {
            'name': i18n.t('customer.date'),
            'value': response.data.create_date,
          },
        ];
        this.dialogDetailVisible = true;
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
