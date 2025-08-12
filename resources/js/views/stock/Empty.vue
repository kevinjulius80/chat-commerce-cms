<template>
  <div class="app-container">
    <div class="filter-container filter-container--menu">
      <div>
        <h2>{{ $t('stock.title.empty') }}</h2>
      </div>
      <div class="filter-container__item" style="text-align: right">
        <div class="filter-item-wrapper">
          <el-input
            v-model="query.name"
            :placeholder="$t('table.keyword')"
            class="filter-item-search"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="query.category_id"
            :placeholder="$t('table.category')"
            clearable
            class="filter-item-category"
            @change="handleFilter"
          >
            <el-option
              v-for="ctg of menuFilter"
              :key="ctg.value"
              :label="ctg.name"
              :value="ctg.value"
            />
          </el-select>
          <el-select
            v-model="query.status"
            :placeholder="$t('table.status')"
            clearable
            class="filter-item-status"
            @change="handleFilter"
          >
            <el-option
              v-for="st in statusFilter"
              :key="st.value"
              :label="st.name"
              :value="st.value"
            />
          </el-select>
        </div>
        <div class="filter-item-button">
          <el-button v-waves type="secondary" @click="handleResetFilter">
            {{ $t('table.reset') }}
          </el-button>
          <el-button
            v-waves
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          />
        </div>
      </div>
    </div>
    <!-- Table -->
    <div class="table-wrapper">
      <el-table
        :key="tableKey"
        v-loading="loading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!isMobile"
          align="center"
          :label="$t('table.picture')"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.picture"
              fit="fill"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.name')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!isMobile"
          align="center"
          :label="$t('table.category')"
        >
          <template slot-scope="scope">
            <span>{{ category[scope.row.category_id] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.stock')">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.status')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_active"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="doChangeStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('table.actions')"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['manage stock']"
              type="default"
              size="small"
              icon="el-icon-data-analysis"
              @click="handleDetail(scope.row)"
            />
            <el-button
              v-permission="['manage stock']"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :page.sync="query.page"
        :limit.sync="query.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @pagination="getList"
      />

      <!-- Update -->
      <el-dialog
        :title="$t('menu.update_stock')"
        :visible.sync="dialogUpdateFormVisible"
        :custom-class="'rounded-border'"
      >
        <div v-loading="menuUpdating" class="form-container">
          <el-form
            ref="updateForm"
            :rules="rules"
            :model="updateMenu"
            label-position="left"
            label-width="150px"
            style="max-width: 500px"
          >
            <el-form-item :label="$t('table.stock')">
              <el-input v-model="updateMenu.stock" />
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
      <!-- DETAIL -->
      <el-dialog
        :visible.sync="dialogDetailVisible"
        :title="$t('menu.detail')"
        :custom-class="'rounded-border dialog-menu'"
      >
        <el-table :data="detailMenu" :show-header="false">
          <el-table-column :label="$t('table.name')" width="150">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.count')" align="left">
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.name === 'Gambar'"
                style="width: 300px; height: 300px"
                :src="scope.row.value"
                fit="contain"
                lazy
              />
              {{ scope.row.value }}
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogDetailVisible = false">{{
            $t('table.confirm')
          }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { fetchListCategory } from '@/api/category';
import {
  updateMenu,
} from '@/api/menu';
import {
  fetchEmptyStock,
} from '@/api/stock';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import currencyFormated from '@/utils/currencyFormated';
import i18n from '@/lang';

export default {
  name: 'UserList',
  components: { Pagination },
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
      menuFilter: [],
      statusFilter: [
        {
          name: 'Aktif',
          value: '1',
        },
        {
          name: 'Tidak Aktif',
          value: '0',
        },
      ],
      category: [],
      total: 0,
      tableKey: 0,
      loading: true,
      downloading: false,
      itemCreating: false,
      menuUpdating: false,
      query: {
        page: 1,
        merchant_id: 0,
        limit: 15,
        name: '',
        category_id: null,
        status: null,
      },
      dummyQuery: {
        merchant_id: 0,
        page: 1,
        limit: 999999999999,
      },
      dialogFormVisible: false,
      dialogUploadFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      uploadMenu: {},
      rules: {
        name: [
          {
            required: true,
            message: i18n.t('error_message.name'),
            trigger: 'blur',
          },
        ],
        short_desc: [
          {
            required: true,
            message: i18n.t('error_message.short_description'),
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: i18n.t('error_message.description'),
            trigger: 'blur',
          },
        ],
        category_id: [
          {
            required: true,
            message: i18n.t('error_message.category'),
            trigger: 'blur',
          },
        ],
      },
      newItem: {
        priceFormated: 0,
      },
      updateMenu: {},
      detailMenu: [],
      fileList: [],
      uploadFileList: [],
      fileListUpdate: [],
      value1: false,
      uploadFileUrl: '',
      isShowImageThumbnail: true,
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
  },
  created() {
    this.dummyQuery.store_id = parseInt(atob(localStorage.getItem('store_id')));
    this.dummyQuery.merchant_id = parseInt(
      atob(localStorage.getItem('merchant_id'))
    );
    fetchListCategory(this.dummyQuery).then((response) => {
      if (response.data) {
        for (const tmp of response.data) {
          this.category[tmp.id] = tmp.name;
          this.menuFilter.push({
            name: tmp.name,
            value: tmp.id,
          });
        }
        this.getList();
      } else if (response.data == null) {
        // this block is for case where store doesnt have categories
        this.getList();
      }
    });
    this.resetnewItem();
  },
  methods: {
    getList() {
      this.loading = true;
      this.query.merchant_id = parseInt(
        atob(localStorage.getItem('merchant_id'))
      );
      this.query.store_id = parseInt(atob(localStorage.getItem('store_id')));
      fetchEmptyStock(this.query).then((response) => {
        this.list = response.data;
        this.total = response.total;
      }).catch(() => {});
      this.loading = false;
    },
    handleResetFilter() {
      this.query = {
        page: 1,
        limit: 15,
        name: '',
        category_id: null,
        status: null,
      };
      this.getList();
    },
    handleFilter() {
      if (this.query.category_id === '') {
        this.query.category_id = null;
      }
      if (this.query.status === '') {
        this.query.status = null;
      }
      this.query.page = 1;
      this.getList();
    },
    handleUpdate(row) {
      if (row.picture) {
        this.fileListUpdate = [
          { name: 'current_picture.jpg', url: row.picture },
        ];
      }
      this.updateMenu = {
        id: row.id,
        name: row.name,
        is_active: row.is_active,
        picture: row.picture,
        category_id: row.category_id,
        short_desc: row.short_desc,
        description: row.description,
        priceFormated: currencyFormated(row.price),
        price: row.price,
        stock: row.stock,
        weight: row.weight,
        length: row.length,
        width: row.width,
        height: row.height,
      };
      this.dialogUpdateFormVisible = true;
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate();
      });
    },
    handleDetail(row) {
      this.detailMenu = [
        {
          name: i18n.t('table.name'),
          value: row.name,
        },
        {
          name: i18n.t('table.category'),
          value: this.category[row.category_id],
        },
        {
          name: i18n.t('table.short_description'),
          value: row.short_desc,
        },
        {
          name: i18n.t('table.description'),
          value: row.description,
        },
        {
          name: i18n.t('table.status'),
          value: row.is_active,
        },
        {
          name: i18n.t('table.picture'),
          value: row.picture,
        },
        {
          name: i18n.t('table.price'),
          value: row.price,
        },
        {
          name: i18n.t('table.stock'),
          value: row.stock,
        },
        {
          name: i18n.t('menu.measure.long'),
          value: row.length,
        },
        {
          name: i18n.t('menu.measure.tall'),
          value: row.height,
        },
        {
          name: i18n.t('menu.measure.wide'),
          value: row.width,
        },
        {
          name: i18n.t('menu.measure.heavy'),
          value: row.weight,
        },
      ];
      this.dialogDetailVisible = true;
    },
    doupdateMenu() {
      this.$refs['updateForm'].validate((valid) => {
        const parsedStock = parseInt(this.updateMenu.stock);
        if (valid && this.updateMenu.picture !== '' && !isNaN(parsedStock)) {
          this.menuUpdating = true;
          this.updateMenu.price = parseInt(this.updateMenu.price);
          this.updateMenu.stock = parsedStock;
          this.updateMenu.weight = parseInt(this.updateMenu.weight);
          this.updateMenu.width = parseInt(this.updateMenu.width);
          this.updateMenu.height = parseInt(this.updateMenu.height);
          this.updateMenu.length = parseInt(this.updateMenu.length);
          updateMenu(this.updateMenu)
            .then((reponse) => {
              this.$message({
                message: i18n.t('stock.toaster.update.success', {
                  name: this.updateMenu.name,
                }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.dialogUpdateFormVisible = false;
              this.handleFilter();
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                message: i18n.t('stock.toaster.update.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            })
            .finally(() => {
              this.menuUpdating = false;
              this.dialogUpdateFormVisible = false;
            });
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
    doChangeStatus(row) {
      updateMenu(row)
        .then((reponse) => {
          this.$message({
            message: i18n.t('menu.toaster.update.success', { name: row.name }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.dialogUpdateFormVisible = false;
          this.handleFilter();
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: i18n.t('menu.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    resetnewItem() {
      this.fileList = [];
      this.newItem = {
        name: '',
        category_id: null,
        short_desc: '',
        description: '',
        is_active: false,
        picture: '',
        priceFormated: 0,
        price: 0,
        stock: 0,
        length: 0,
        height: 0,
        weight: 0,
        width: 0,
      };
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
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

.filter-item-search,
.filter-item-category {
  width: 150px;
}

.filter-item-status {
  width: 100px;
  margin-right: 8px;
}

.action-add-button {
  button:first-child {
    margin-right: 10px;
  }
}
</style>
