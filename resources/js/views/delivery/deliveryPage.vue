<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="el-col-24" style="text-align: right">
        <el-input v-model="query.name" :placeholder="$t('table.keyword')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="secondary" @click="handleResetFilter">
          Reset
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      </div>
    </div>

    <br>
    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">

      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Name Courrier">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Service Courrier">
          <template slot-scope="scope">
            <span>{{ scope.row.service_name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Service Type">
          <template slot-scope="scope">
            <span>{{ scope.row.service_type }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Service Duration">
          <template slot-scope="scope">
            <span v-if="scope.row.duration && scope.row.duration_unit">{{ scope.row.duration + ' ' + scope.row.duration_unit }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active" active-color="#13ce66" inactive-color="#ff4949" @change="doChangeStatus(scope.row)" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="Actions" width="200">
          <template slot-scope="scope">
            <el-button v-permission="['manage delivery']" type="default" size="small" icon="el-icon-data-analysis" @click="handleDetail(scope.row)" />
            <!-- <el-button v-permission="['manage delivery']" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)" /> -->
            <!-- <el-button v-permission="['manage food']" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id, scope.row.name);" /> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </div>

    <!-- <el-dialog :title="'Update user'" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="deliveryUpdating" class="form-container">
        <el-form ref="updateForm" :rules="rules" :model="updateDelivery" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item label="Name" prop="name">
            <el-input v-model="updateDelivery.name" />
          </el-form-item>
          <el-form-item label="Is Active">
            <el-switch v-model="updateDelivery.is_active" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doUpdateDelivery()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog> -->

    <el-dialog :visible.sync="dialogDetailVisible" title="Detail Delivery" :custom-class="'rounded-border'">
      <el-table :data="detailDelivery" :show-header="false">
        <el-table-column label="Name" width="175">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="Value">
          <template slot-scope="scope">
            {{ scope.row.value }}
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
import {
  fetchListDelivery,
  // createDelivery,
  // deleteDelivery,
  updateDelivery,
} from '@/api/delivery';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      downloading: false,
      deliveryCreating: false,
      deliveryUpdating: false,
      query: {
        page: 1,
        limit: 15,
        name: '',
      },
      // dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
      },
      newDelivery: {},
      updateDelivery: {},
      detailDelivery: [],
      fileList: [],
      fileListUpdate: [],
      value1: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      this.query.merchant_id = atob(localStorage.getItem('merchant_id'));
      this.query.store_id = atob(localStorage.getItem('store_id'));
      fetchListDelivery(this.query).then(response => {
        this.list = response.data.data;
        console.log(this.list);
      });
      this.loading = false;
    },
    handleResetFilter() {
      this.query = {
        page: 1,
        limit: 15,
        name: '',
      };
      this.getList();
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    // handleUpdate(row) {
    //   this.updateDelivery = {
    //     id: row.id,
    //     name: row.name,
    //     service_name: row.service_name,
    //     is_active: row.active,
    //   };
    //   this.dialogUpdateFormVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs['updateForm'].clearValidate();
    //   });
    // },
    handleDetail(row) {
      console.log(row);
      this.detailDelivery = [
        {
          'name': 'Name',
          'value': row.name,
        },
        {
          'name': 'Service Name',
          'value': row.service_name,
        },
        {
          'name': 'Service Description',
          'value': row.description,
        },
        {
          'name': 'Service Type',
          'value': row.service_type,
        },
        {
          'name': 'Service Duration',
          'value': row.duration,
        },
        {
          'name': 'Service Duration Unit',
          'value': row.duration_unit,
        },
        {
          'name': 'Service Insurance',
          'value': row.insurance,
        },
        {
          'name': 'Is Active',
          'value': row.active,
        },
      ];
      this.dialogDetailVisible = true;
    },
    doUpdateDelivery() {
      console.log(this.$refs['updateForm']);
      // this.$refs['updateForm'].validate((valid) => {
      //   if (valid && this.updateDelivery.picture !== '') {
      //     this.deliveryUpdating = true;
      //     updateDelivery(this.updateDelivery)
      //       .then(reponse => {
      //         this.$message({
      //           message: 'Update success.',
      //           type: 'success',
      //           duration: 5 * 1000,
      //         });
      //         this.dialogUpdateFormVisible = false;
      //         this.handleFilter();
      //       }).catch(error => {
      //         this.$message({
      //           message: 'Failed to update delivery: ' + error,
      //           type: 'error',
      //           duration: 5 * 1000,
      //         });
      //       }).finally(() => {
      //         this.deliveryUpdating = false;
      //         this.dialogUpdateFormVisible = false;
      //       });
      //   } else {
      //     this.$message({
      //       message: 'Form is not valid',
      //       type: 'error',
      //       duration: 5 * 1000,
      //     });
      //     return false;
      //   }
      // });
    },
    doChangeStatus(row) {
      this.updateDelivery.active = row.active;
      this.updateDelivery.courier_id = row.id;
      this.updateDelivery.store_id = atob(localStorage.getItem('store_id'));
      updateDelivery(this.updateDelivery)
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
            message: 'Failed to update Delivery: ' + error,
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    // resetnewDelivery() {
    //   this.fileList = [];
    //   this.newDelivery = {
    //     name: '',
    //     is_active: false,
    //     picture: '',
    //   };
    // },
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
