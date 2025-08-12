<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col card-panel-col--1">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="check-solid" style="color: #399EFF" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">
            <count-to :start-val="0" :end-val="topDashboard.total_successful_orders" :duration="3600" class="card-panel-num" />
          </div>
          <div class="card-panel-text">
            Total<br>Pesanan Sukses
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col card-panel-col--2">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="shopping" style="color: #399EFF" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">
            <count-to :start-val="0" :end-val="topDashboard.total_orders" :duration="3600" class="card-panel-num" />
          </div>
          <div class="card-panel-text">
            Total Pesanan
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col card-panel-col--3">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="dollar" style="color: #399EFF" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">
            <count-to :start-val="0" :end-val="topDashboard.total_revenue" :duration="2600" class="card-panel-num" />
          </div>
          <div class="card-panel-text">
            Total Pendapatan
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col card-panel-col--4">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon icon-class="peoples" style="color: #399EFF" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">
            <count-to :start-val="0" :end-val="topDashboard.total_customers" :duration="2600" class="card-panel-num" />
          </div>
          <div class="card-panel-text">
            Pengunjung
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import CountTo from 'vue-count-to';

export default {
  components: {
    CountTo,
  },
  props: {
    month: {
      type: String,
      default: '',
    },
    topDashboard: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
    @media screen and (max-width: 414px) {
      margin-bottom: 16px;

      &--1,
      &--3 {
        padding-right: 10px !important;
      }

      &--2,
      &--4 {
        padding-left: 10px !important;
      }
    }
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media screen and (max-width: 768px) {
      padding: 16px;
    }

    @media screen and (max-width: 375px) {
      height: 135px;
      display: block;
      text-align: center;
    }

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-blue {
        background: #FFFFFF;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      transition: all 0.38s ease-out;
      border-radius: 50px;
      background: #D7ECFF;
      @media screen and (max-width: 768px) {
        padding: 10px;
      }

      @media screen and (max-width: 375px) {
        margin-bottom: 8px;
      }
    }

    .card-panel-icon {
      font-size: 32px;
      @media screen and (max-width: 768px) {
        font-size: 24px;
      }
    }

    .card-panel-description {
      padding-left: 6px;
      text-align: right;
      @media screen and (max-width: 375px) {
        padding-left: 0px;
        text-align: center;
      }
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
      }
      .card-panel-num {
        font-weight: bold;
        font-size: 24px;
        @media screen and (max-width: 414px) {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
