<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu right-menu--flex">
      <template v-if="device!=='mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <div v-if="merchantViews.includes($route.name)" class="right-menu-item">
        {{ $t('table.merchant') }} :
        <el-select
          v-model="merchant_name"
          filterable
          autocomplete
          @change="setMerchant"
        >
          <el-option
            v-for="merchant in merchants"
            :key="merchant.id"
            :label="merchant.name"
            :value="merchant.id"
          />
        </el-select>
      </div>

      <div v-if="storeViews.includes($route.name)" class="right-menu-item">
        {{ $t('table.store') }} :
        <el-select
          v-model="store_name"
          filterable
          autocomplete
          placeholder="Pilih Toko"
          @change="setStore"
        >
          <el-option
            v-for="store in selectedStore"
            :key="store.id"
            :label="store.label"
            :value="store.id"
          />
        </el-select>
      </div>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="change_password">{{ $t('navbar.change_password') }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import Screenfull from '@/components/Screenfull';
import SizeSelect from '@/components/SizeSelect';
import { fetchStore, fetchStoreDeepLink } from '@/api/store';
import role from '@/directive/role';
import { fetchListMerchant } from '@/api/merchant';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
  },
  directives: { role },
  data() {
    return {
      merchant_id: 0,
      storeViews: ['Dashboard', 'Order', 'PriceAndStock', 'OperationalHour', 'Fee', 'FoodCategory', 'FoodMenu', 'StorePaymentSetting', 'EmptyStock', 'LowStock', 'NotSoldItem', 'SettingMonitoringStock'],
      merchantViews: ['Dashboard', 'Order', 'PriceAndStock', 'OperationalHour', 'UserList', 'FAQ', 'StoreList', 'FoodCategory', 'FoodMenu', 'PaymentSetting', 'EmptyStock', 'LowStock', 'NotSoldItem', 'SettingMonitoringStock'],
      store_id: 0,
      store_name: '',
      merchant_name: '',
      stores: [],
      selectedStore: [],
      merchants: [],
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device',
      'userId',
    ]),
  },
  created() {
    const allowedStores = this.$store.getters.stores;
    const allowedMerchant = this.$store.getters.merchants;
    this.store_id = atob(localStorage.getItem('store_id'));
    this.merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
    const query = {
      page: 1,
      limit: 9999999999999,
    };
    fetchListMerchant(query).then(response => {
      const tmp = [];
      var merchantName = '';
      let storeName = '';
      for (const tmpElement of response.data) {
        tmp.push(tmpElement);
        if (allowedMerchant.includes('' + tmpElement.id) || window.location.hostname === 'localhost') {
          if (tmpElement.stores) {
            for (const store of tmpElement.stores) {
              if (allowedStores.includes('' + store.id) || window.location.hostname === 'localhost') {
                this.stores.push({
                  id: '' + store.id,
                  name: store.name,
                  label: store.name,
                  merchant: tmpElement.id,
                });
                if (tmpElement.id === this.merchant_id || window.location.hostname === 'localhost') {
                  this.selectedStore.push({
                    id: '' + store.id,
                    name: store.name,
                    label: store.name,
                    merchant: tmpElement.id,
                  });
                }
              }
              if (parseInt(store.id) === parseInt(this.store_id) || window.location.hostname === 'localhost') {
                storeName = store.name;
                fetchStoreDeepLink(parseInt(this.store_id)).then((response) => {
                  const reference_id = response.data.reference_id;
                  localStorage.setItem('store_reference_id', reference_id);
                });
              }
            }
          }
        }
        if (parseInt(tmpElement.id) === parseInt(this.merchant_id)) {
          merchantName = tmpElement.name;
        }
      }
      this.selectedStore.reverse();
      this.store_name = storeName;
      this.merchant_name = merchantName;
      this.merchants = tmp;
      localStorage.setItem('merchant_name', merchantName);
      localStorage.setItem('store_name', storeName);
    });
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    change_password() {
      this.$router.push(`/change-password/index`);
    },
    async logout() {
      localStorage.clear();
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    handleChange(storeId) {
      console.log(storeId);
      this.setStore(storeId);
    },
    setStore: function(storeId) {
      localStorage.removeItem('store_id');
      localStorage.setItem('store_id', btoa(storeId));
      this.store_id = storeId;

      fetchStore().then(response => {
        let storeName = '';
        for (const tmpElement of response.data.items) {
          if (parseInt(tmpElement.Id) === parseInt(this.store_id)) {
            storeName = tmpElement.Name;
          }
        }
        this.store_name = storeName;
      });
      location.reload();
    },
    setMerchant: function(merchantId) {
      localStorage.removeItem('merchant_id');
      localStorage.removeItem('store_id');
      localStorage.setItem('merchant_id', btoa(merchantId));
      this.store_name = 'Pilih toko';

      this.merchant_id = merchantId;
      this.selectedStore = [];
      for (const store of this.stores) {
        if (store.merchant === merchantId) {
          this.selectedStore.push(store);
          localStorage.setItem('store_id', btoa(store.id));
          this.store_name = store.name;
        }
      }

      const query = {
        page: 1,
        limit: 9999999999999,
      };
      fetchListMerchant(query).then(response => {
        var merchantName = '';
        for (const tmpElement of response.data) {
          if (parseInt(tmpElement.id) === parseInt(this.merchant_id)) {
            merchantName = tmpElement.name;
          }
        }
        this.merchant_name = merchantName;
        localStorage.setItem('merchant_name', merchantName);
        location.reload();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    &--flex {
      display: flex;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 4px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.el-dropdown-menu {
  &--list-store {
    max-height: 300px;
    overflow: auto;
  }
}
</style>
