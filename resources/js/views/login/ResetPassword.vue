<template>
  <div class="login-container">
    <el-form ref="resetPasswordForm" :model="resetPasswordForm" :rules="resetPasswordRules" class="login-form" auto-complete="on" label-position="left" @submit.prevent="handleResetPassword">
      <h3 class="title">
        Lupa Password
      </h3>
      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="resetPasswordForm.email" name="email" type="text" auto-complete="on" :placeholder="$t('login.email')" @keyup.enter="handleResetPassword" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleResetPassword">
          Reset Password
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate';
import { resetPassword } from '@/api/auth';

export default {
  name: 'ForgotPassword',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Silahkan masukkan email yang sesuai'));
      } else {
        callback();
      }
    };
    return {
      resetPasswordForm: {
        email: '',
      },
      resetPasswordRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
      },
      loading: false,
      pwdType: 'password',
    };
  },
  methods: {
    handleResetPassword() {
      this.$refs.resetPasswordForm.validate(valid => {
        if (valid) {
          this.loading = true;
          resetPassword(this.resetPasswordForm).then(response => {
            this.$message({
              message: 'Link sudah kami kirimkan ke ' + this.resetPasswordForm.email,
              type: 'success',
              duration: 5 * 1000,
            });
            this.$router.push({ path: '/login' }, onAbort => {});
          });
        } else {
          console.log('error submit!!');
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
