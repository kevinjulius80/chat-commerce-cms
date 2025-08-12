<template>
  <div class="app-container">
    <el-form ref="passwordForm" :rules="rules" :model="newPassword" label-position="left" label-width="150px" style="max-width: 500px;">
      <el-form-item label="New Password" prop="name">
        <el-input v-model="newPassword.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="Confirm Password" prop="name">
        <el-input v-model="newPassword.confirmPassword" type="password" show-password />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createCategory()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script>

import { changePassword } from '@/api/user';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive

export default {
  name: 'UserList',
  directives: { waves, permission },
  data() {
    return {
      rules: {
        password: [{ required: true, message: 'required', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: 'required', trigger: 'blur' }],
      },
      newPassword: {
        password: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    createCategory() {
      this.$refs['passwordForm'].validate((valid) => {
        if (this.newPassword.password.length < 8) {
          this.$message({
            message: 'Password minimal 8 karakter',
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
        if (valid && this.newPassword.password === this.newPassword.confirmPassword) {
          changePassword(this.newPassword).then(response => {
            this.$message({
              message: 'Change password success',
              type: 'success',
              duration: 5 * 1000,
            });
          });
        } else {
          this.$message({
            message: 'Password tidak sama',
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
      });
    },
  },
};
</script>
