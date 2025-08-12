<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
      <div class="sidebar-menu-logout" @click="logout">
        <i class="el-icon-switch-button svg-icon" />
        <span>Logout</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import Logo from './Logo';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'permission_routers']),
    routes() {
      return this.$store.state.permission.routes;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    async logout() {
      console.log('logout');
      localStorage.clear();
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
  .sidebar-menu-logout {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: rgb(48, 65, 86);
    display: none;
    font-size: 14px;
    color: rgb(191, 203, 217) !important;
    padding: 0 20px;
    height: 56px;
    line-height: 56px;
    box-shadow: 0 -4px 3px rgba(0,21,41,0.1);
  }
</style>
