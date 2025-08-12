<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="el-col-6">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          {{ $t('user.add') }}
        </el-button>
      </div>
      <div class="el-col-18" style="text-align: right">
        <el-input
          v-model="query.name"
          :placeholder="$t('user.name')"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="query.email"
          :placeholder="$t('user.email')"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="query.role"
          :placeholder="$t('user.role')"
          clearable
          style="width: 90px"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option v-for="item in roles" :key="item" :label="item | uppercaseFirst" :value="item" />
        </el-select>
        <el-select
          v-model="query.status"
          :placeholder="$t('table.status')"
          clearable
          style="width: 100px"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option key="Aktif" :label="$t('user.status.active')" :value="true" />
          <el-option key="NonAktif" :label="$t('user.status.non_active')" :value="false" />
        </el-select>
        <el-button v-waves class="filter-item" type="secondary" @click="handleReset">
          {{ $t('table.reset') }}
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
        <el-button
          v-waves
          :loading="downloading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        />
      </div>
    </div>

    <!-- TABLE LIST -->
    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white; margin-top: 40px">
      <br>
      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('user.name')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('user.email')">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('user.phone_number')">
          <template slot-scope="scope">
            <span>{{ scope.row.phone_number }}</span>
          </template>
        </el-table-column>

        <!--      <el-table-column align="center" label="Merchants">-->
        <!--        <template slot-scope="scope">-->
        <!--          <span v-if="merchant_items !== []">{{ getMerchantName(scope.row.merchant) }}</span>-->
        <!--          <span v-else>...</span>-->
        <!--        </template>-->
        <!--      </el-table-column>-->

        <el-table-column align="center" :label="$t('table.store')">
          <template slot-scope="scope">
            <span v-if="store_items !== []">{{ getStoresName(scope.row.store) }}</span>
            <span v-else>{{ scope.row.store_id }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.role')">
          <template slot-scope="scope">
            <span>{{ scope.row.roles.join(', ') }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.status')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="doChangeStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.actions')">
          <template slot-scope="scope">
            <el-button
              v-permission="['manage user']"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            />
            <el-button
              v-permission="['manage user']"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id, scope.row.name);"
            />
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="getList"
      />
    </div>

    <!-- CREATE NEW USER -->
    <el-dialog :title="$t('user.create')" :visible.sync="dialogFormVisible" :custom-class="'rounded-border'">
      <div v-loading="userCreating" class="form-container">
        <el-form
          ref="userForm"
          :rules="rules"
          :model="newUser"
          label-position="left"
          label-width="160px"
          style="max-width: 500px;"
        >
          <el-form-item :label="$t('user.role')" prop="role">
            <el-select v-model="newUser.role" class="filter-item" :placeholder="$t('table.select.role')">
              <el-option v-for="item in nonAdminRoles" :key="item" :label="item | uppercaseFirst" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user.access.merchant')">
            <el-select v-model="newUser.merchant" multiple :placeholder="$t('table.select.merchant')" @change="changeMerchant">
              <el-option
                v-for="item in merchantsOption"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user.access.store')">
            <el-select v-model="newUser.store" multiple :placeholder="$t('table.select.store')">
              <el-option
                v-for="item in selectedStoresOption"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user.name')" prop="name">
            <el-input v-model="newUser.name" />
          </el-form-item>
          <el-form-item :label="$t('user.email')" prop="email">
            <el-input v-model="newUser.email" />
          </el-form-item>
          <el-form-item :label="$t('user.phone_number')" prop="phone_number">
            <el-input v-model="newUser.phone_number" />
          </el-form-item>
          <el-form-item :label="$t('user.password')" prop="password">
            <el-input v-model="newUser.password" show-password />
          </el-form-item>
          <el-form-item :label="$t('user.confirmPassword')" prop="confirmPassword">
            <el-input v-model="newUser.confirmPassword" show-password />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createUser()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- UPDATE USER -->
    <el-dialog :title="$t('user.update')" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="userUpdating" class="form-container">
        <el-form
          ref="updateForm"
          :rules="rulesUpdate"
          :model="updateUser"
          label-position="left"
          label-width="160px"
          style="max-width: 500px;"
        >
          <el-form-item :label="$t('user.role')" prop="role">
            <el-select v-model="updateUser.role" class="filter-item" :placeholder="$t('table.select.role')">
              <el-option v-for="item in nonAdminRoles" :key="item" :label="item | uppercaseFirst" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user.access.merchant')">
            <el-select v-model="updateUser.merchant" multiple :placeholder="$t('table.select.merchant')" @change="changeUpdateMerchant">
              <el-option
                v-for="item in merchantsOption"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user.access.store')">
            <el-select v-model="updateUser.store" multiple :placeholder="$t('table.select.store')">
              <el-option
                v-for="item in selectedStoresOption"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('user.name')" prop="name">
            <el-input v-model="updateUser.name" />
          </el-form-item>
          <el-form-item :label="$t('user.email')" prop="email">
            <el-input v-model="updateUser.email" />
          </el-form-item>
          <el-form-item :label="$t('user.phone_number')" prop="phone_number">
            <el-input v-model="updateUser.phone_number" />
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="updateUser.status" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doUpdateUser()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import UserResource from '@/api/user';
import { fetchListMerchant } from '@/api/merchant';
import Resource from '@/api/resource';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import checkPermission from '@/utils/permission';
import RoleResource from '@/api/role';
import i18n from '@/lang';

const userResource = new UserResource();
const roleResource = new RoleResource();
const permissionResource = new Resource('permissions');

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.newUser.password) {
        callback(new Error('Password is mismatched!'));
      } else {
        callback();
      }
    };
    return {
      list: null,
      store_items: [],
      merchant_items: [],
      total: 0,
      loading: true,
      downloading: false,
      userCreating: false,
      userUpdating: false,
      query: {
        page: 1,
        limit: 15,
        name: '',
        email: '',
        role: '',
      },
      roles: [],
      nonAdminRoles: [],
      newUser: {},
      updateUser: {},
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      currentUserId: 0,
      currentUser: {
        name: '',
        permissions: [],
        rolePermissions: [],
      },
      rules: {
        role: [{ required: true, message: 'Role is required', trigger: 'change' }],
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] },
        ],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
      },
      rulesUpdate: {
        role: [{ required: true, message: 'Role is required', trigger: 'change' }],
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] },
        ],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
        // confirmUpdatePassword: [{ validator: validateUpdateConfirmPassword, trigger: 'blur' }],
      },
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
      },
      permissions: [],
      menuPermissions: [],
      otherPermissions: [],
      storesOption: [],
      selectedStoresOption: [],
      merchantsOption: [],
    };
  },
  computed: {
    storeName() {
      return (store_id) => this.store_items[store_id];
    },
    normalizedMenuPermissions() {
      let tmp = [];
      this.currentUser.permissions.role.forEach(permission => {
        tmp.push({
          id: permission.id,
          name: permission.name,
          disabled: true,
        });
      });
      const rolePermissions = {
        id: -1, // Just a faked ID
        name: 'Inherited from role',
        disabled: true,
        children: this.classifyPermissions(tmp).menu,
      };

      tmp = this.menuPermissions.filter(permission => !this.currentUser.permissions.role.find(p => p.id === permission.id));
      const userPermissions = {
        id: 0, // Faked ID
        name: 'Extra menus',
        children: tmp,
        disabled: tmp.length === 0,
      };

      return [rolePermissions, userPermissions];
    },
    normalizedOtherPermissions() {
      let tmp = [];
      this.currentUser.permissions.role.forEach(permission => {
        tmp.push({
          id: permission.id,
          name: permission.name,
          disabled: true,
        });
      });
      const rolePermissions = {
        id: -1,
        name: 'Inherited from role',
        disabled: true,
        children: this.classifyPermissions(tmp).other,
      };

      tmp = this.otherPermissions.filter(permission => !this.currentUser.permissions.role.find(p => p.id === permission.id));
      const userPermissions = {
        id: 0,
        name: 'Extra permissions',
        children: tmp,
        disabled: tmp.length === 0,
      };

      return [rolePermissions, userPermissions];
    },
    userMenuPermissions() {
      return this.classifyPermissions(this.userPermissions).menu;
    },
    userOtherPermissions() {
      return this.classifyPermissions(this.userPermissions).other;
    },
    userPermissions() {
      return this.currentUser.permissions.role.concat(this.currentUser.permissions.user);
    },
  },
  created() {
    this.getStore();
    this.getRoles();
    this.resetNewUser();
    this.getList();
    if (checkPermission(['manage permission'])) {
      this.getPermissions();
    }
  },
  methods: {
    checkPermission,
    async getPermissions() {
      const { data } = await permissionResource.list({});
      const { all, menu, other } = this.classifyPermissions(data);
      this.permissions = all;
      this.menuPermissions = menu;
      this.otherPermissions = other;
    },

    async getRoles() {
      const { data } = await roleResource.list({});
      const roles = this.$store.getters.roles;
      const isAdmin = roles.includes('admin');
      this.roles = [];
      this.nonAdminRoles = [];
      for (const datum of data) {
        if (datum.name === 'admin') {
          if (isAdmin) {
            this.roles.push(datum.name);
            this.nonAdminRoles.push(datum.name);
          }
        } else {
          this.roles.push(datum.name);
          this.nonAdminRoles.push(datum.name);
        }
      }
    },
    async getList() {
      const merchant_id = atob(localStorage.getItem('merchant_id'));
      const roles = this.$store.getters.roles;
      const isAdmin = roles.includes('admin');
      const { limit, page } = this.query;
      const tempQuery = this.query;

      tempQuery.merchant_id = merchant_id;
      tempQuery.is_admin = isAdmin;

      const { data, meta } = await userResource.list(tempQuery);

      this.loading = true;
      const tmp = data;
      this.list = [];
      tmp.forEach((element, index) => {
        this.list.push(element);
        element['index'] = (page - 1) * limit + index + 1;
      });
      this.total = meta.total;
      this.loading = false;
    },
    handleReset() {
      this.query = {
        page: 1,
        limit: 15,
        name: '',
        email: '',
        role: '',
      };
      this.getList();
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    changeMerchant() {
      this.selectedStoresOption = [];
      for (const store of this.storesOption) {
        if (this.newUser.merchant.includes('' + store.merchant)) {
          this.selectedStoresOption.push(store);
        }
      }
      const newStore = [];
      for (const store of this.newUser.store) {
        let storeObj = {};
        for (const storeOpt of this.storesOption) {
          if (storeOpt.id === store) {
            storeObj = storeOpt;
            break;
          }
        }
        if (this.newUser.merchant.includes('' + storeObj.merchant)) {
          newStore.push(store);
        }
      }
      this.newUser.store = newStore;
    },
    changeUpdateMerchant() {
      this.selectedStoresOption = [];
      for (const store of this.storesOption) {
        if (this.updateUser.merchant.includes('' + store.merchant)) {
          this.selectedStoresOption.push(store);
        }
      }

      const newStore = [];
      for (const store of this.updateUser.store) {
        let storeObj = {};
        for (const storeOpt of this.storesOption) {
          if (storeOpt.id === store) {
            storeObj = storeOpt;
            break;
          }
        }
        if (this.updateUser.merchant.includes('' + storeObj.merchant)) {
          newStore.push(store);
        }
      }
      this.updateUser.store = newStore;
    },
    getStore() {
      const query = {
        limit: 9999999,
        page: 1,
      };
      fetchListMerchant(query).then(response => {
        this.store_items[0] = 'Undefined';
        this.store_items[null] = 'Undefined';
        this.merchant_items[0] = 'Undefined';
        this.merchant_items[null] = 'Undefined';
        const allowedStores = this.$store.getters.stores;
        const allowedMerchant = this.$store.getters.merchants;
        const roles = this.$store.getters.roles;
        const isAdmin = roles.includes('admin');

        for (const merchant of response.data) {
          this.merchant_items[merchant.id] = merchant.name;
          if (merchant.stores) {
            for (const store of merchant.stores) {
              this.store_items[store.id] = store.name;
              if (allowedStores.includes('' + store.id) || isAdmin) {
                this.storesOption.push({
                  id: '' + store.id,
                  name: store.name,
                  label: store.name,
                  merchant: merchant.id,
                });
              }
            }
          }

          if (allowedMerchant.includes('' + merchant.id) || isAdmin) {
            this.merchantsOption.push({
              id: '' + merchant.id,
              name: merchant.name,
              label: merchant.name,
            });
          }
        }
      });
    },

    getStoresName(stores) {
      var name = '';
      for (const store of stores) {
        let storeItem = {};
        for (const opt of this.storesOption) {
          if (opt.id === store) {
            storeItem = opt;
          }
        }
        if (this.store_items[store]) {
          if (storeItem.merchant !== parseInt(atob(localStorage.getItem('merchant_id')))) {
            continue;
          }
          if (name === '') {
            name = this.store_items[store];
          } else {
            name = name + ', ' + this.store_items[store];
          }
        }
      }
      return name;
    },

    getMerchantName(merchants) {
      var name = '';
      for (const merchant of merchants) {
        if (this.merchant_items[merchant]) {
          if (name === '') {
            name = this.merchant_items[merchant];
          } else {
            name = name + ', ' + this.merchant_items[merchant];
          }
        }
      }
      return name;
    },

    handleCreate() {
      this.resetNewUser();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate();
      });
    },
    handleUpdate(row) {
      this.dialogUpdateFormVisible = true;
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate();
        this.updateUser = {
          id: row.id,
          name: row.name,
          email: row.email,
          phone_number: row.phone_number,
          password: row.password,
          confirmPassword: row.password,
          role: row.roles[0],
          merchant: row.merchant,
          store: row.store,
          status: row.status,
          storeId: row.store_id,
        };
        this.changeUpdateMerchant();
      });
    },
    handleDelete(id, name) {
      this.$confirm(i18n.t('modal.delete.confirm.user', { name: name }), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        userResource.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: i18n.t('user.toaster.delete.success', { name: name }),
          });
          this.handleFilter();
        }).catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('user.toaster.delete.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('toaster.delete.cancel'),
        });
      });
    },
    async handleEditPermissions(id) {
      this.currentUserId = id;
      this.dialogPermissionLoading = true;
      this.dialogPermissionVisible = true;
      const found = this.list.find(user => user.id === id);
      const { data } = await userResource.permissions(id);
      this.currentUser = {
        id: found.id,
        name: found.name,
        permissions: data,
      };
      this.dialogPermissionLoading = false;
    },
    createUser() {
      this.$refs['userForm'].validate((valid) => {
        if (valid && this.newUser.merchant.length !== 0 && this.newUser.store.length !== 0) {
          this.newUser.roles = [this.newUser.role];
          this.userCreating = true;
          userResource
            .store(this.newUser)
            .then(response => {
              this.$message({
                message: i18n.t('user.toaster.create.success', { name: this.newUser.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.resetNewUser();
              this.dialogFormVisible = false;
              this.handleFilter();
            })
            .catch(error => {
              console.log(error);
              this.$message({
                message: i18n.t('user.toaster.create.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            })
            .finally(() => {
              this.userCreating = false;
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
      const payload = {
        status: row.status,
      };
      userResource.changeStatus(row.id, payload).then(response => {
        this.$message({
          message: i18n.t('toaster.update.status.success'),
          type: 'success',
          duration: 5 * 1000,
        });
      });
    },
    doUpdateUser() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid && this.updateUser.merchant.length !== 0 && this.updateUser.store.length !== 0) {
          this.updateUser.roles = [this.updateUser.role];
          this.userCreating = true;
          userResource
            .update(this.updateUser.id, this.updateUser)
            .then(response => {
              this.$message({
                message: i18n.t('user.toaster.update.success', { name: this.updateUser.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.resetNewUser();
              this.dialogUpdateFormVisible = false;
              this.handleFilter();
            })
            .catch(error => {
              console.log(error);
              this.$message({
                message: i18n.t('user.toaster.update.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            })
            .finally(() => {
              this.userUpdating = false;
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
    resetNewUser() {
      this.newUser = {
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
        role: '',
        storeId: 0,
        store: [],
        merchant: [],
        status: true,
      };
    },
    handleDownload() {
      this.downloading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'user_id', 'name', 'email', 'roles'];
        const filterVal = ['index', 'id', 'name', 'email', 'roles'];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'user-list',
        });
        this.downloading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    permissionKeys(permissions) {
      return permissions.map(permssion => permssion.id);
    },
    classifyPermissions(permissions) {
      const all = [];
      const menu = [];
      const other = [];
      permissions.forEach(permission => {
        const permissionName = permission.name;
        all.push(permission);
        if (permissionName.startsWith('view menu')) {
          menu.push(this.normalizeMenuPermission(permission));
        } else {
          other.push(this.normalizePermission(permission));
        }
      });
      return { all, menu, other };
    },

    normalizeMenuPermission(permission) {
      return {
        id: permission.id,
        name: this.$options.filters.uppercaseFirst(permission.name.substring(10)),
        disabled: permission.disabled || false,
      };
    },

    normalizePermission(permission) {
      const disabled = permission.disabled || permission.name === 'manage permission';
      return { id: permission.id, name: this.$options.filters.uppercaseFirst(permission.name), disabled: disabled };
    },

    confirmPermission() {
      const checkedMenu = this.$refs.menuPermissions.getCheckedKeys();
      const checkedOther = this.$refs.otherPermissions.getCheckedKeys();
      const checkedPermissions = checkedMenu.concat(checkedOther);
      this.dialogPermissionLoading = true;

      userResource.updatePermission(this.currentUserId, { permissions: checkedPermissions }).then(response => {
        this.$message({
          message: i18n.t('permission.toaster.update.success'),
          type: 'success',
          duration: 5 * 1000,
        });
        this.dialogPermissionLoading = false;
        this.dialogPermissionVisible = false;
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
