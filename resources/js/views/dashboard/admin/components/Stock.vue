<template>
  <div class="monitoring-stock-container">
    <h4>{{ $t('dashboard.stock.title') }}</h4>
    <div class="monitoring-stock-data">
      <el-row :gutter="40" class="stock">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col card-panel-col--1">
          <div class="card-panel" @click="toEmpty">
            <div class="card-panel-icon-wrapper icon-blue icon-empty">
              <svg-icon
                icon-class="close"
                style="color: #e3342f"
                class-name="card-panel-icon"
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">
                <count-to
                  :start-val="0"
                  :end-val="countEmpty.count"
                  :duration="3600"
                  class="card-panel-num"
                />
              </div>
              <div class="card-panel-text">{{ $t('dashboard.stock.count.empty') }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col card-panel-col--2">
          <div class="card-panel" @click="toLow">
            <div class="card-panel-icon-wrapper icon-blue icon-low">
              <svg-icon
                icon-class="warning"
                style="color: #f6993f"
                class-name="card-panel-icon"
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">
                <count-to
                  :start-val="0"
                  :end-val="countLow.count"
                  :duration="3600"
                  class="card-panel-num"
                />
              </div>
              <div class="card-panel-text">{{ $t('dashboard.stock.count.low') }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col card-panel-col--3">
          <div class="card-panel" @click="toNotSold">
            <div class="card-panel-icon-wrapper icon-blue icon-not-sold">
              <svg-icon
                icon-class="dislike"
                style="color: #666"
                class-name="card-panel-icon"
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">
                <count-to
                  :start-val="0"
                  :end-val="countNotSold.count"
                  :duration="2600"
                  class="card-panel-num"
                />
              </div>
              <div class="card-panel-text">{{ $t('dashboard.stock.count.not_sold') }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import CountTo from 'vue-count-to';

export default {
  components: {
    CountTo,
  },
  props: {
    countEmpty: {
      type: Object,
      default: () => {
        return {
          count: 0,
          monitoring_name: '',
        };
      },
    },
    countLow: {
      type: Object,
      default: () => {
        return {
          count: 0,
          monitoring_name: '',
        };
      },
    },
    countNotSold: {
      type: Object,
      default: () => {
        return {
          count: 0,
          monitoring_name: '',
        };
      },
    },
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type);
    },
    toEmpty() {
      this.$router.push('/stock/empty');
    },
    toLow() {
      this.$router.push('/stock/low');
    },
    toNotSold() {
      this.$router.push('/stock/not-sold');
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.monitoring-stock-container {
  .monitoring-stock-data {
    .stock {
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
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);
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
          .card-panel-text {
            color: #40c9c6;
            text-decoration: underline;
          }

          .icon-people {
            background: #40c9c6;
          }

          .icon-blue {
            background: #ffffff;
          }

          .icon-message {
            background: #36a3f7;
          }

          .icon-money {
            background: #f4516c;
          }

          .icon-shopping {
            background: #34bfa3;
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
          color: #34bfa3;
        }

        .card-panel-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          transition: all 0.38s ease-out;
          border-radius: 50px;
          // background: #d7ecff;
          @media screen and (max-width: 768px) {
            padding: 10px;
          }

          @media screen and (max-width: 375px) {
            margin-bottom: 8px;
          }
        }

        .icon-empty {
          background: rgba(227, 52, 47, 0.2);
        }

        .icon-low {
          background: rgba(246, 153, 63, 0.2);
        }

        .icon-not-sold {
          background: rgba(102, 102, 102, 0.2);
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
  }
}
</style>
