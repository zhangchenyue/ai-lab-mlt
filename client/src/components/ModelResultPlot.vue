<template>
  <div class="model-resultplot">
    <div class="model-resultplot-title">
        {{title}}
        <el-button class="btn-download-result" type="text" icon="el-icon-download" v-if="!!learnData && Object.keys(learnData).length"   @click="handleResultDownload">Download</el-button>
    </div>
    <div ref="el" class="model-chart">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ModelCrossPlotOption from './ModelResultPlotOption';
import CsvExport from '@/util/csv-export';
export default {
    name: 'ModelResultPlot',

    data() {
        return {
            chart: null,
            option: { ...ModelCrossPlotOption },
            returnTime: '',
            totalTime: '',
            t: '',
            downloadData: ''
        }
    },

    props: [
        'type',
        'outputFeature'
    ],

    computed: {
        ...mapGetters([
            'learnData'
        ]),
        'title': function () {
            let score = '';
            if (this.type === 'test') {
                score = (100 * parseFloat(this.learnData.testScore)).toFixed(2);
                return isNaN(score) ? '' : 'Test R2 Score ' + score + '%';
            }
            score = (100 * parseFloat(this.learnData.validationScore)).toFixed(2);
            return isNaN(score) ? '' : 'Validation R2 Score ' + score + '%';
        }
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
            // prepare result plot data of test data
            // dataX: X Axis
            // dataY1: test result
            // dataY2: benchmark
            // downloadData is test predict data, allow users to download
            let predict = this.learnData.testPredict; // his.type === 'test' ? this.learnData.testPredict : this.learnData.validPredict;
            let num = 0;
            let dataX = [];
            let dataY1 = [];
            let downloadData = [];
            for (let i in predict) {
                this.t = i;
                dataX[num] = num;
                dataY1[num] = predict[num];
                downloadData.push([predict[num]]);
                num++;
            }
            this.downloadData = downloadData.slice();
            // if receive benchmark data, prepare benchmark array
            // else null
            let benchmark = [];
            let outputArr = this.outputFeature ? [this.outputFeature] : [];
            if (this.learnData.benchmark) {
                let outputKey = outputArr[0];
                this.learnData.benchmark.forEach(function (ele) {
                    benchmark.push(ele[outputKey])
                })
            } else {
                benchmark = null;
            }

            // prepare result plot data of validation data
            // dataXValid: X axis
            // dataY1Valid: predict for validation data
            // dataY2Valid: real for validation data
            let dataXValid = [];
            let dataY1Valid = [];
            let dataY2Valid = [];
            let validPredict = this.learnData.validPredict;
            let validReal = this.learnData.validReal;
            num = 0
            for (let i in validPredict) {
                dataXValid[num] = num;
                dataY1Valid[num] = validPredict[i];
                dataY2Valid[num] = validReal[i]
                num++;
            }
            this.returnTime = this.learnData.responseTime;
            this.totalTime = new Date().getTime() - this.learnData.startTime;

            if (this.type === 'test') {
                this.option.xAxis.data = dataX;
                this.option.legend.data[1] = 'Benchmark';
                this.option.series[1].name = 'Benchmark';
                this.option.series[0].data = dataY1;
                this.option.series[1].data = benchmark;
            } else {
                this.option.xAxis.data = dataXValid;
                this.option.legend.data[1] = 'Real'
                this.option.series[1].name = 'Real'
                this.option.series[0].data = dataY1Valid;
                this.option.series[1].data = dataY2Valid;
            }
            this.chart.setOption(this.option);
        },

        handleResultDownload() {
            if (this.downloadData) {
                let header = [this.outputFeature];
                let d = this.downloadData.map(c => {
                    let o = {};
                    for (let i = 0; i < header.length; i++) {
                        o[header[i]] = c[i];
                    }
                    return o;
                });
                CsvExport(d, header, header, 'export_test_result.csv');
            }
        }
    }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.model-resultplot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.model-resultplot-title {
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

.btn-download-result {
  text-align: center;
  margin-left: 20%;
}
</style>
