<template>
  <div class="el-row panel-group">
    <div class="card-panel-col card-panel--1">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.initiated') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.INITIATED"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--2">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.payment_confirmation') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.PAYMENT_CONFIRMED"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--3">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue-the-way">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.accepted') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.ACCEPTED"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--4">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue-the-way">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.pickup') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.ON_PICK_UP"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--5">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.otw') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.ON_THE_WAY"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--6">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.delivered') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.DELIVERED"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--7">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.successful') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.SUCCESSFUL"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--8">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.failed') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.FAILED"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <div class="card-panel-col card-panel--9">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-blue">
          <svg-icon
            style="color: #399eff"
            icon-class="shopping"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('order.status.rejected') }}</div>
          <count-to
            :start-val="0"
            :end-val="data.REJECTED"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </div>
    <!-- <div class="card-panel-col card-panel--9"> -->
    <!--  <div class="card-panel"> -->
    <!--    <div class="card-panel-icon-wrapper icon-blue"> -->
    <!--      <svg-icon -->
    <!--        style="color: #399eff" -->
    <!--        icon-class="shopping" -->
    <!--        class-name="card-panel-icon"/> -->
    <!--    </div> -->
    <!--    <div class="card-panel-description"> -->
    <!--      <div class="card-panel-text">Pengembalian Dana</div> -->
    <!--      <count-to -->
    <!--        :start-val="0" -->
    <!--        :end-val="data.REFUNDED" -->
    <!--        :duration="3600" -->
    <!--        class="card-panel-num"/> -->
    <!--    </div> -->
    <!--  </div> -->
    <!--</div> -->
  </div>
</template>
<script>

import CountTo from 'vue-count-to';

export default {
  components: {
    CountTo,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
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
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 24px;
  @media screen and (max-width: 768px) {
    white-space: unset;
    margin-left: -12px;
    margin-right: -12px;
  }
  @media screen and (max-width: 540px) {
    display: none;
  }

  .card-panel-col {
    margin-bottom: 6px;
    margin-right: 12px;
    width: 350px;
    display: inline-block;
    @media screen and (max-width: 768px) {
      width: 50%;
      float: left;
      margin-right: 0px;
      margin-bottom: 20px;
      padding: 0 12px
    }
    @media screen and (max-width: 414px) {
      padding: 0 6px;
      margin-bottom: 12px;
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
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 1em;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media screen and (max-width: 768px) {
      padding: 16px;
    }

    @media screen and (max-width: 414px) {
      height: 135px;
      display: block;
      text-align: center;
    }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-new {
        background: #00ff00;
      }
      .icon-inprocess {
        background: #b1b639;
      }
      .icon-on-the-way {
        background: #8a6d3b;
      }
      .icon-delivered {
        background: #40c9c6;
      }
      .icon-rejected {
        background: #f4516c;
      }
      .icon-total {
        background: #000000;
      }
      .icon-blue {
        background: #ffffff;
      }
    }
    .icon-new {
      color: #00ff00;
    }
    .icon-blue {
      background: #ffffff;
    }
    .icon-inprocess {
      color: #b1b639;
    }
    .icon-on-the-way {
      color: #8a6d3b;
    }
    .icon-delivered {
      color: #40c9c6;
    }
    .icon-rejected {
      color: #f4516c;
    }
    .icon-total {
      color: #000000;
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

      @media screen and (max-width: 414px) {
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
      font-weight: bold;
      @media screen and (max-width: 414px) {
        padding-left: 0px;
        text-align: center;
      }
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        @media screen and (max-width: 414px) {
          font-size: 12px;
        }
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
