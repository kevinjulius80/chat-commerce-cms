<template>
  <div class="app-container">
    <h1 class="global-title">{{ $t('operational_hour.index') }}</h1>
    <div class="global-container">
      <h3 class="global-subtitle">{{ $t('operational_hour.close_open') }}</h3>
      <div>
        <el-switch v-model="close" active-color="#13ce66" inactive-color="#ff4949" />
        <span v-if="!close">{{ $t('table.close') }}</span>
        <span v-else>{{ $t('table.open') }}</span>
      </div>

      <br>
      <h3>{{ $t('days.monday') }}</h3>
      <div class="input-container input-container--flex">
        <el-input v-model="list['1'].start" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input v-model="list['1'].end" />
      </div>

      <h3>{{ $t('days.tuesday') }}</h3>
      <div class="input-container input-container--flex">
        <el-input v-model="list['2'].start" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input v-model="list['2'].end" />
      </div>

      <h3>{{ $t('days.wednesday') }}</h3>
      <div class="input-container input-container--flex">
        <el-input v-model="list['3'].start" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input v-model="list['3'].end" />
      </div>

      <h3>{{ $t('days.thursday') }}</h3>
      <div class="input-container input-container--flex">
        <el-input v-model="list['4'].start" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input v-model="list['4'].end" />
      </div>

      <h3>{{ $t('days.friday') }}</h3>
      <div class="input-container input-container--flex">
        <el-input v-model="list['5'].start" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input v-model="list['5'].end" />
      </div>

      <h3>{{ $t('days.saturday') }}</h3>
      <div class="input-container input-container--flex">
        <el-input v-model="list['6'].start" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input v-model="list['6'].end" />
      </div>

      <h3>{{ $t('days.sunday') }}</h3>
      <div class="input-container input-container--flex">
        <el-input v-model="list['0'].start" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input v-model="list['0'].end" />
      </div>

      <el-button class="global-btn" style="margin-top: 16px;" type="primary" @click="handleUpdate">
        {{ $t('table.update') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchListService, updateService } from '@/api/setting';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import i18n from '@/lang';

export default {
  name: 'UserList',
  directives: { waves, permission },
  data() {
    return {
      storeId: 0,
      list: {
        '0': {},
        '1': {},
        '2': {},
        '3': {},
        '4': {},
        '5': {},
        '6': {},
      },
      close: false,
      message: '',
      loading: true,
      timerCount: 0,
    };
  },
  watch: {
    timerCount: {
      handler() {
        if (this.timerCount >= 0) {
          setTimeout(() => {
            const tmpStoreId = atob(localStorage.getItem('store_id'));
            if (tmpStoreId !== this.storeId) {
              this.getList();
            }
            this.timerCount++;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.storeId = atob(localStorage.getItem('store_id'));
      this.loading = true;
      fetchListService(this.storeId).then(response => {
        if (response.data) {
          this.list = response.data;
          this.message = response.oss_message;
          this.close = response.force_close === 'false';
        } else {
          this.$message({
            message: i18n.t('operational_hour.toaster.fetch.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        }
      })
        .catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('operational_hour.toaster.fetch.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
      this.loading = false;
    },
    validate() {
      if (!this.validateTime(this.list['1'].start)) {
        return 'Format jam buka hari Senin tidak benar';
      }
      if (!this.validateTime(this.list['1'].end)) {
        return 'Format jam tutup hari Senin tidak benar';
      }
      if (!this.validateTime(this.list['2'].start)) {
        return 'Format jam buka hari Selasa tidak benar';
      }
      if (!this.validateTime(this.list['2'].end)) {
        return 'Format jam tutup hari Selasa tidak benar';
      }
      if (!this.validateTime(this.list['3'].start)) {
        return 'Format jam buka hari Rabu tidak benar';
      }
      if (!this.validateTime(this.list['3'].end)) {
        return 'Format jam tutup hari Rabu tidak benar';
      }
      if (!this.validateTime(this.list['4'].start)) {
        return 'Format jam buka hari Kamis tidak benar';
      }
      if (!this.validateTime(this.list['4'].end)) {
        return 'Format jam tutup hari Kamis tidak benar';
      }
      if (!this.validateTime(this.list['5'].start)) {
        return 'Format jam buka hari Jumat tidak benar';
      }
      if (!this.validateTime(this.list['5'].end)) {
        return 'Format jam tutup hari Jumat tidak benar';
      }
      if (!this.validateTime(this.list['6'].start)) {
        return 'Format jam buka hari Sabtu tidak benar';
      }
      if (!this.validateTime(this.list['6'].end)) {
        return 'Format jam tutup hari Sabtu tidak benar';
      }
      if (!this.validateTime(this.list['0'].start)) {
        return 'Format jam buka hari Minggu tidak benar';
      }
      if (!this.validateTime(this.list['0'].end)) {
        return 'Format jam tutup hari Minggu tidak benar';
      }
      return '';
    },
    validateTime(timeString) {
      return /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(timeString);
    },
    handleUpdate() {
      const errorMessage = this.validate();
      if (errorMessage !== '') {
        this.$message({
          message: errorMessage,
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      const open = !this.close;
      const req = {
        'data': {
          '0': {
            'start': this.list['0'].start,
            'end': this.list['0'].end,
          },
          '1': {
            'start': this.list['1'].start,
            'end': this.list['1'].end,
          },
          '2': {
            'start': this.list['2'].start,
            'end': this.list['2'].end,
          },
          '3': {
            'start': this.list['3'].start,
            'end': this.list['3'].end,
          },
          '4': {
            'start': this.list['4'].start,
            'end': this.list['4'].end,
          },
          '5': {
            'start': this.list['5'].start,
            'end': this.list['5'].end,
          },
          '6': {
            'start': this.list['6'].start,
            'end': this.list['6'].end,
          },
        },
        'force_close': open.toString(),
        'message': this.message,
      };
      updateService(this.storeId, req).then(response => {
        this.$message({
          message: i18n.t('operational_hour.toaster.update.success'),
          type: 'success',
          duration: 5 * 1000,
        });
        this.getList();
      })
        .catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('operational_hour.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
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
.input-container {
  .el-input {
    width: 200px;
  }
  &--flex {
    display: flex;
    align-items: center;
  }
}
</style>
