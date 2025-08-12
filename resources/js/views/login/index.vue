<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">
        {{ $t('login.title') }}
      </h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" :placeholder="$t('login.username')" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="pwdType"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          Masuk
        </el-button>
      </el-form-item>
      <el-link style="float: right" type="danger" @click.native.prevent="handleForgotPassword">Lupa password?</el-link>
    </el-form>
  </div>
</template>

<script>
import { csrf, loginAuthService } from '@/api/auth';

export default {
  name: 'Login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('Password tidak boleh kurang dari 4'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (localStorage.getItem('isSessionExpired')) {
      localStorage.clear();
      this.$message({
        message: 'Maaf sesi Anda telah berakhir, silahkan login ulang',
        type: 'error',
        duration: 5 * 1000,
      });
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          csrf().then(() => {
            loginAuthService().then(response => {
              const resBody = response.data;
              if (response.status < 300) {
                const data = resBody.data;
                this.$store.dispatch('user/login', this.loginForm)
                  .then(() => {
                    localStorage.setItem('auth_token', data.token);
                    this.$router.push({ path: '/dashboard' }, onAbort => {});
                    this.loading = false;
                  })
                  .catch(() => {
                    this.loading = false;
                  });
              } else {
                this.$message({
                  message: 'Tidak bisa mendapatkan auth_token, kontak tim server',
                  type: 'error',
                  duration: 5 * 1000,
                });
                this.loading = false;
              }
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleForgotPassword() {
      this.$router.push('/reset-password');
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
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
