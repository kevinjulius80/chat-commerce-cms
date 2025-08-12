<template>
  <div class="login-container">
    <el-form ref="resetPasswordForm" :model="resetPasswordForm" :rules="resetPasswordRules" class="login-form" auto-complete="on" label-position="left" @submit.prevent="handleResetPassword">
      <h3 class="title">
        Change Password
      </h3>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="resetPasswordForm.password" name="password" type="password" show-password placeholder="New Password" @keyup.enter="handleResetPassword" />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="resetPasswordForm.confirmPassword" name="confirm password" type="password" show-password placeholder="Confirm Password" @keyup.enter="handleResetPassword" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleResetPassword">
          Change Password
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changeResetPassword } from '@/api/auth';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      resetPasswordForm: {
        password: '',
        confirmPassword: '',
      },
      resetPasswordRules: {
        password: [{ required: true, message: 'required', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: 'required', trigger: 'blur' }],
      },
      loading: false,
      pwdType: 'password',
    };
  },
  methods: {
    handleResetPassword() {
      if (this.resetPasswordForm.password.length < 8) {
        this.$message({
          message: 'Password minimal 8 karakter',
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      this.$refs.resetPasswordForm.validate(valid => {
        if (valid && this.resetPasswordForm.password === this.resetPasswordForm.confirmPassword) {
          this.loading = true;
          this.resetPasswordForm.token = this.$route.query.token;
          this.resetPasswordForm.email = this.$route.query.email;
          changeResetPassword(this.resetPasswordForm).then(response => {
            this.$message({
              message: 'Success, please try to login again',
              type: 'success',
              duration: 5 * 1000,
            });
            this.$router.push({ path: '/login' }, onAbort => {});
          });
        } else {
          this.$message({
            message: 'Form not valid',
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
      });
      this.loading = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .set-language {
    color: #fff;
    position: absolute;
    top: 40px;
    right: 35px;
  }
}
@media screen and (orientation:landscape) and (max-width:1024px) {
  .login-container {
    position: relative;
    overflow-y: auto;
    .login-form {
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      margin: auto;
    }
  }
}
</style>
