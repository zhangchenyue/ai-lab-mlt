<template>
  <div class="model-classification-crossplot">
    <div class="model-classification-crossplot-title">{{learnData.model}}</div>
    <div ref="el" class="model-chart">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClassificationOption from './ModelClassificationCrossPlotOption';

export default {
    name: 'ModelClassificationCrossPlot',
    data() {
        return {
            chart: null,
            classificationOption: { ...ClassificationOption }
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
            if (val === 'classification') {
                this.chart.resize();
            }
        });
    },

    methods: {
        update() {
            if (!this.learnData || !Object.keys(this.learnData).length) {
                return;
            }
            if (!this.learnData.conf_mat_test && !this.learnData.conf_mat_valid) {
                return;
            }
            let d = {};
            if (this.type === 'test') {
                d = this.learnData.conf_mat_test;
            } else {
                d = this.learnData.conf_mat_valid;
            }
            let classificationData = []
            let sum = 0;
            let featureName = [];
            for (var i in d) {
                if (i !== 'Total') {
                    featureName.push(i)
                }
            }
            for (let i = 0; i < featureName.length; i++) {
                for (let j = 0; j < featureName.length; j++) {
                    classificationData.push([featureName[i], featureName[j], d[featureName[i]][j]])
                    sum += d[featureName[i]][j]
                }
            }
            this.classificationOption.xAxis.data = featureName;
            this.classificationOption.yAxis.data = featureName;
            this.classificationOption.series[0].data = classificationData;
            this.classificationOption.series[0].symbolSize = (p) => (Math.sqrt(p[2] / sum) * 100);
            this.chart.setOption(this.classificationOption);
        }
    }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.model-classification-crossplot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.model-classification-crossplot-title {
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
