<template>
  <div class="app-container">
    <el-row>
      <el-col :xs="24" :sm="16" :md="16" :lg="5" class="filter-item-transaction">
        <el-input
          v-model="query.table_name"
          :placeholder="$t('table.table_name')"
        />
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="3" class="filter-item-transaction">
        <el-select
          v-model="query.action"
          :placeholder="$t('table.actions')"
          clearable
        >
          <el-option
            v-for="st in actionTypeFilter"
            :key="st.value"
            :label="st.name"
            :value="st.value"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="6" class="filter-item-transaction">
        <el-input
          v-model="query.field_value"
          :placeholder="$t('table.field_value')"
        />
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="5" class="filter-item-transaction">
        <el-input
          v-model="query.user_name"
          :placeholder="$t('table.user_name')"
        />
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="3" class="filter-item-transaction">
        <el-date-picker
          v-model="query.updated_date"
          type="date"
          :placeholder="$t('table.date')"
          style="margin: 0 16px 0 0; width: 135px;"
        />
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="1" class="filter-item-transaction">
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        />
      </el-col>
    </el-row>
    <!-- TABLE -->
    <div class="table-wrapper">
      <div ref="printMe">
        <el-table
          ref="table"
          v-loading="loading"
          :data="list"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column align="center" :label="$t('table.table_name')">
            <template slot-scope="scope">
              <span>{{ scope.row.table_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('table.actions')">
            <template slot-scope="scope">
              <span>{{ scope.row.action }}</span>
            </template>
          </el-table-column>

          <el-table-column align="left" :label="$t('table.field_value')">
            <template slot-scope="scope">
              <p
                v-for="(fieldValue, index) in beautifyFieldValue(scope.row.field_value)"
                :key="index"
                style="margin: 0;"
              >
                {{ fieldValue }}
              </p>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            :label="$t('table.user_name')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.user_name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('table.date')">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.updated_date) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :page.sync="query.page"
        :limit.sync="query.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @pagination="handlePagination"
      />
    </div>
    <br>
  </div>
</template>

<script>
import { search } from '@/api/auditTrail';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission';
import Pagination from '@/components/Pagination';
import moment from 'moment';

export default {
  name: 'AuditTrail',
  components: {
    Pagination,
  },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      // paginatedList: [],
      actionTypeFilter: [
        {
          name: 'CREATE',
          value: 'CREATE',
        },
        {
          name: 'INSERT',
          value: 'INSERT',
        },
        {
          name: 'UPDATE',
          value: 'UPDATE',
        },
        {
          name: 'DELETE',
          value: 'DELETE',
        },
      ],
      query: {
        table_name: '',
        action: '',
        field_value: '',
        user_name: '',
        updated_date: '',
        page: 1,
        limit: 10,
      },
      loading: false,
      total: 0,
      // totalPage: 1,
      // currentPage: 1,
      // limit: 10,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.list = [];
      // this.paginatedList = [];

      if (this.query.updated_date) {
        this.query.updated_date = moment(this.query.updated_date).format('YYYY-MM-DD');
      }

      search(this.query)
        .then((response) => {
          const data = response.data;
          if (data) {
            this.list = data;
          }
          this.total = response?.total || 0;
          // this.total = this.list.length;
          // this.totalPage = Math.ceil(this.total / this.limit);
          // this.pagingListData({ page: 1, limit: this.limit });
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.total = 0;
          this.query.page = 1;
          this.loading = false;
        });
    },
    handlePagination({ page, limit }){
      this.query.page = page;
      this.query.limit = limit;
      this.getList();
    },
    handleFilter() {
      // this.currentPage = 1;
      this.query.page = 1;
      this.getList();
    },
    beautifyFieldValue(fieldValue){
      const listFieldValue = [];
      fieldValue.forEach(el => {
        const textFieldValue = el.field + ': ' + el.value;
        listFieldValue.push(textFieldValue);
      });
      return listFieldValue;
    },
    formatDate(dateString) {
      const formattedDate = moment(dateString).format('YYYY-MM-DD');
      if (formattedDate === 'Invalid date') {
        return dateString;
      } else {
        return formattedDate;
      }
    },
    // pagingListData({ page, limit }) {
    //   this.limit = limit;
    //   const startIdx = (page * this.limit) - this.limit;
    //   const endIdx = page * this.limit;
    //   const recordData = this.list;
    //   if (page === this.totalPage) {
    //     this.paginatedList = recordData.slice(startIdx);
    //   } else if (page < this.totalPage) {
    //     this.paginatedList = recordData.slice(startIdx, endIdx);
    //   } else {
    //     this.paginatedList = [];
    //   }
    //   this.currentPage = page;
    // },
  },
};
</script>

<style lang="scss" scoped>
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

.filter-item-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-item-transaction {
  margin-bottom: 5px;
  margin-right: 5px;
}
</style>
