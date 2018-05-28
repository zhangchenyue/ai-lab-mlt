<template>
  <div class="model-regression-crossplot">
    <div class="model-regression-crossplot-title">{{learnData.model}}</div>
    <div ref="el" class="model-chart">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RegressionOption from './ModelRegressionCrossPlotOption';

export default {
    name: 'ModelRegressionCrossPlot',

    data() {
        return {
            chart: null,
            regressionOption: { ...RegressionOption }
        }
    },

    props: [
        'type'
    ],

    computed: {
        ...mapGetters([
            'learnData'
        ])
    },

    watch: {
        'learnData': function (d) {
            this.update();
        },
        'type': function () {
            this.update();
        }
    },

    activated() {
        this.chart.resize();
    },

    mounted() {
        this.chart = this.echarts.init(this.$refs.el);
        this.$bus.on(this.$bus.E_WINDOW_RESIZE, () => {
            this.chart.resize();
        });
        this.$bus.on(this.$bus.E_PATTERN_CHANGE, (val) => {
            if (val === 'regression') {
                this.chart.resize();
            }
        });
    },

    methods: {
        update() {
            if (!this.learnData || !Object.keys(this.learnData).length) {
                return;
            }
            if (!this.learnData.testRealPredict) {
                return;
            }
            if (this.type === 'test') {
                this.regressionOption.series[0].data = this.learnData.testRealPredict;
            } else {
                this.regressionOption.series[0].data = this.learnData.validRealPredict;
            }
            this.chart.setOption(this.regressionOption);
        }
    }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.model-regression-crossplot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.model-regression-crossplot-title {
  margin-top: 10px;
  font-size: 1.2em;
  font-family: RobotoBold;
  text-align: center;
}

.model-chart {
  width: 100%;
  height: calc(100% - 30px);
}


@media (max-width: 1199px) {
  .model-chart {
    height: calc(100% - 60px);
  }
}

</style>
