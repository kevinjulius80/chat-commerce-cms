<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        {{ $t('roles.add') }}
      </el-button>
    </div>

    <br>
    <div style="width: 100%; padding: 15px; border-radius: 1em; background: white">
      <el-table v-loading="loading" :data="list" highlight-current-row style="width: 100%">
        <el-table-column align="center" :label="$t('table.id')" width="80" prop="index" />

        <el-table-column align="center" :label="$t('table.name')" prop="name" />

        <el-table-column v-if="checkPermission(['manage permission'])" align="center" :label="$t('table.actions')">
          <template slot-scope="scope">
            <el-button v-if="scope.row.name !== 'admin'" v-permission="['manage permission']" type="primary" size="small" icon="el-icon-edit" @click="handleEditPermissions(scope.row.id);" />

            <el-button v-if="scope.row.name !== 'admin'" v-permission="['manage permission']" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id, scope.row.name);" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="$t('roles.create')" :visible.sync="dialogFormVisible" :custom-class="'rounded-border'">
      <div v-loading="roleCreating" class="form-container">
        <el-form ref="roleForm" :rules="rules" :model="newRole" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input v-model="newRole.name" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createRole()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="$t('roles.edit') + currentRole.name" :custom-class="'rounded-border'">
      <div v-loading="dialogLoading" class="form-container">
        <div class="permissions-container">
          <div class="block">
            <el-form :model="currentRole" label-width="80px" label-position="top">
              <el-form-item :label="$t('roles.menus')">
                <el-tree ref="menuPermissions" :data="menuPermissions" :default-checked-keys="permissionKeys(roleMenuPermissions)" :props="permissionProps" show-checkbox node-key="id" class="permission-tree" />
              </el-form-item>
            </el-form>
          </div>
          <div class="block">
            <el-form :model="currentRole" label-width="80px" label-position="top">
              <el-form-item :label="$t('roles.permission')">
                <el-tree ref="otherPermissions" :data="otherPermissions" :default-checked-keys="permissionKeys(roleOtherPermissions)" :props="permissionProps" show-checkbox node-key="id" class="permission-tree" />
              </el-form-item>
            </el-form>
          </div>
          <div class="clear-left" />
        </div>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="confirmPermission">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource';
import RoleResource from '@/api/role';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive (v-permission)
import checkPermission from '@/utils/permission'; // Permission checking
import i18n from '@/lang';

const roleResource = new RoleResource();
const permissionResource = new Resource('permissions');

export default {
  name: 'RoleList',
  directives: { waves, permission },
  data() {
    return {
      newRole: {
        name: '',
      },
      currentRoleId: 1,
      list: [],
      loading: true,
      dialogLoading: false,
      dialogVisible: false,
      dialogFormVisible: false,
      roleCreating: false,
      permissions: [],
      menuPermissions: [],
      otherPermissions: [],
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
      },
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
      },
    };
  },
  computed: {
    currentRole() {
      const found = this.list.find(role => role.id === this.currentRoleId);
      if (found === undefined) {
        return { name: '', permissions: [] };
      }

      return found;
    },
    rolePermissions() {
      return this.classifyPermissions(this.currentRole.permissions).all;
    },
    roleMenuPermissions() {
      return this.classifyPermissions(this.currentRole.permissions).menu;
    },
    roleOtherPermissions() {
      return this.classifyPermissions(this.currentRole.permissions).other;
    },
  },
  created() {
    this.getRoles();
    this.getPermissions();
  },

  methods: {
    checkPermission,

    handleCreate() {
      this.newRole.name = '';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate();
      });
    },

    async getRoles() {
      this.loading = true;
      const { data } = await roleResource.list({});
      this.list = data;
      this.list.forEach((role, index) => {
        role['index'] = index + 1;
        role['description'] = this.$t('roles.description.' + role.name);
      });
      this.loading = false;
    },

    async getPermissions() {
      const { data } = await permissionResource.list({});
      const { all, menu, other } = this.classifyPermissions(data);
      this.permissions = all;
      this.menuPermissions = menu;
      this.otherPermissions = other;
    },

    classifyPermissions(permissions) {
      const all = []; const menu = []; const other = [];
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
      return { id: permission.id, name: this.$options.filters.uppercaseFirst(permission.name.substring(10)) };
    },

    normalizePermission(permission) {
      return { id: permission.id, name: this.$options.filters.uppercaseFirst(permission.name) };
    },

    permissionKeys(permissions) {
      return permissions.map(permssion => permssion.id);
    },

    handleEditPermissions(id) {
      this.dialogVisible = true;
      this.currentRoleId = id;
      this.$nextTick(() => {
        this.$refs.menuPermissions.setCheckedKeys(this.permissionKeys(this.roleMenuPermissions));
        this.$refs.otherPermissions.setCheckedKeys(this.permissionKeys(this.roleOtherPermissions));
      });
    },

    confirmPermission() {
      const checkedMenu = this.$refs.menuPermissions.getCheckedKeys();
      const checkedOther = this.$refs.otherPermissions.getCheckedKeys();
      const checkedPermissions = checkedMenu.concat(checkedOther);
      this.dialogLoading = true;

      roleResource.update(this.currentRole.id, { permissions: checkedPermissions }).then(response => {
        this.$message({
          message: i18n.t('permission.toaster.update.success'),
          type: 'success',
          duration: 5 * 1000,
        });
        this.dialogLoading = false;
        this.dialogVisible = false;
        this.getRoles();
      });
    },

    createRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          roleResource
            .store(this.newRole)
            .then(response => {
              this.$message({
                message: i18n.t('roles.toaster.create.success', { name: this.newRole.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.dialogFormVisible = false;
              this.getRoles();
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              this.roleCreating = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    handleDelete(id, name) {
      this.$confirm(i18n.t('modal.delete.confirm.role', { name: name }), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        roleResource.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: i18n.t('roles.toaster.delete.success', { name: name }),
            duration: 5 * 1000,
          });
        }).catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('roles.toaster.delete.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        }).finally(() => {
          this.getRoles();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('toaster.delete.cancel'),
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.permissions-container {
  flex: 1;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .block {
    float: left;
    min-width: 250px;
  }
  .clear-left {
    clear: left;
  }
}
</style>
