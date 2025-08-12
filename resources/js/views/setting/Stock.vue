<template>
  <div class="app-container">
    <div class="filter-container" style="text-align: right">
      <el-input v-model="query.name" :placeholder="$t('table.keyword')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="query.category_id" placeholder="Category" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="ctg of menuFilter" :key="ctg.value" :label="ctg.name" :value="ctg.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
    </div>

    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">

      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Picture">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.picture"
              fit="fill"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" label="Name">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Category">
          <template slot-scope="scope">
            <span>{{ category[scope.row.category_id] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Stock">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Price">
          <template slot-scope="scope">
            <span>{{ scope.row.price | price_format }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Actions" width="150">
          <template slot-scope="scope">
            <el-button v-permission="['manage food']" type="default" size="small" icon="el-icon-data-analysis" @click="handleDetail(scope.row)" />
            <el-button v-permission="['manage food']" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
          </template>
        </el-table-column>
      </el-table>

      <pagination :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </div>

    <el-dialog :title="'Update Stock and Price'" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="menuUpdating" class="form-container">
        <el-form ref="updateForm" :model="updateMenu" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item label="Stock" prop="name">
            <el-input v-model="updateMenu.stock" />
          </el-form-item>
          <el-form-item label="Price" prop="name">
            <el-input v-model="updateMenu.price" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doupdateMenu()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogDetailVisible" title="Detail Stock and Price" :custom-class="'rounded-border'">
      <el-table :data="detailMenu" :show-header="false">
        <el-table-column label="Name" width="150">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="Count" align="left">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.name === 'Picture'"
              style="width: 300px; height: 300px"
              :src="scope.row.value"
              fit="contain"
              lazy
            />
            <br>{{ scope.row.value }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { fetchListCategory } from '@/api/category';
import { fetchListMenu, updateStockAndPrice } from '@/api/menu';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    price_format: function(value) {
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
      menuFilter: [],
      category: [],
      total: 0,
      loading: true,
      downloading: false,
      itemCreating: false,
      menuUpdating: false,
      query: {
        page: 1,
        limit: 15,
        name: '',
        category_id: null,
        status: null,
      },
      dummyQuery: {
        page: 1,
        limit: 15,
      },
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      updateMenu: {},
      detailMenu: [],
      timerCount: 0,
    };
  },
  watch: {
    timerCount: {
      handler() {
        if (this.timerCount >= 0) {
          setTimeout(() => {
            const tmpStoreId = atob(localStorage.getItem('store_id'));
            if (tmpStoreId !== this.query.store_id) {
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
    async getList() {
      this.menuFilter = [];
      this.dummyQuery.merchant_id = atob(localStorage.getItem('merchant_id'));
      fetchListCategory(this.dummyQuery).then(response => {
        for (const tmp of response.data) {
          this.category[tmp.id] = tmp.name;
          this.menuFilter.push({
            name: tmp.name,
            value: tmp.id,
          });
        }
      });
      this.loading = true;
      this.query.store_id = atob(localStorage.getItem('store_id'));
      fetchListMenu(this.query).then(response => {
        this.list = response.data;
      });
      this.loading = false;
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    handleUpdate(row) {
      this.updateMenu = {
        item_store_id: parseInt(row.item_store_id),
        stock: parseInt(row.stock),
        price: parseInt(row.price),
      };
      this.dialogUpdateFormVisible = true;
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate();
      });
    },
    handleDetail(row) {
      this.detailMenu = [
        {
          'name': 'Name',
          'value': row.name,
        },
        {
          'name': 'Category',
          'value': this.category[row.category_id],
        },
        {
          'name': 'Stock',
          'value': row.stock,
        },
        {
          'name': 'Price',
          'value': row.price,
        },
      ];
      this.dialogDetailVisible = true;
    },
    doupdateMenu() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.menuUpdating = true;
          this.updateMenu.item_store_id = parseInt(this.updateMenu.item_store_id);
          this.updateMenu.stock = parseInt(this.updateMenu.stock);
          this.updateMenu.price = parseInt(this.updateMenu.price);
          updateStockAndPrice(this.updateMenu)
            .then(reponse => {
              this.$message({
                message: 'Update success.',
                type: 'success',
                duration: 5 * 1000,
              });
              this.dialogUpdateFormVisible = false;
              this.handleFilter();
            }).catch(error => {
              this.$message({
                message: 'Failed to update menu: ' + error,
                type: 'error',
                duration: 5 * 1000,
              });
            }).finally(() => {
              this.menuUpdating = false;
              this.dialogUpdateFormVisible = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
