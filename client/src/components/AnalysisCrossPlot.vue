<template>
    <div class="analysis-crossplot" v-loading='isLoading && isPlotLoading' element-loading-text='loading' element-loading-spinner='el-icon-loading' element-loading-background='rgba(0, 0, 0, 0.6)'>
        <div class="analysis-crossplot-feature-selection">
            <div class="analysis-crossplot-feature-selection-part">
                <div class="feature-label">Feature 1</div>
                <el-select class='data-source-select' size="mini" v-model="xFeature" filterable placeholder="Select Feature" @change="onFeatureChange">
                    <el-option v-for='xf in features' :key='xf' :label='xf' :value='xf'></el-option>
                </el-select>
            </div>
            <div class="analysis-crossplot-feature-selection-part">
                <div class="feature-label">Feature 2</div>
                <el-select class='data-source-select' size="mini" v-model="yFeature" filterable placeholder="Select Feature" @change="onFeatureChange">
                    <el-option v-for='yf in features' :key='yf' :label='yf' :value='yf'></el-option>
                </el-select>
            </div>
        </div>
        <div ref="el" class="analysis-chart"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AnalysisCrossPlotOption from './AnalysisCrossPlotOption'

export default {
    name: 'AnalysisCrossPlot',

    data() {
        return {
            title: 'Cross Plot',
            chart: null,
            option: { ...AnalysisCrossPlotOption },
            xFeature: '',
            yFeature: '',
            isPlotLoading: false
        }
    },
    props: [
        'fileId',
        'features',
        'isLoading'
    ],

    computed: {
        ...mapGetters([
            'crossPlotData'
        ])
    },

    watch: {
        'crossPlotData': function (d) {
            let cd = this.removeContinousSamePoints(d);
            this.chart.setOption({
                series: [{ name: 'scatter', data: cd }]
            });
            this.isPlotLoading = false;
        },

        'features': function (f) {
            if (f.length && this.$route.path === '/analysis') {
                this.xFeature = f[0];
                this.yFeature = f[0];
                this.isPlotLoading = true;
                this.$store.dispatch('getCrossPlotData', { fileId: this.fileId, features: [this.xFeature, this.yFeature] });
            }
        },

        'isLoading': function (v) {
            this.isPlotLoading = v;
        }
    },

    activated() {
        this.option.xAxis.name = this.xFeature;
        this.option.yAxis.name = this.yFeature;
        this.chart.resize();
    },

    mounted() {
        this.chart = this.echarts.init(this.$refs.el);
        this.chart.setOption(this.option);
        this.$bus.on(this.$bus.E_WINDOW_RESIZE, () => {
            this.chart.resize();
        });
    },

    methods: {
        onFeatureChange() {
            this.isPlotLoading = true;
            this.$store.dispatch('getCrossPlotData', { fileId: this.fileId, features: [this.xFeature, this.yFeature] });
        },

        removeContinousSamePoints(points) {
            if (!points.length) {
                return;
            }
            let res = [points[0]];
            for (let i = 1, l = points.length; i < l; i++) {
                if (points[i][0] !== res[res.length - 1][0] || points[i][1] !== res[res.length - 1][1]) {
                    res.push(points[i])
                }
            }
            return res;
        }
    }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.analysis-crossplot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.analysis-crossplot-feature-selection {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.analysis-crossplot-feature-selection-part {
  padding: 0 5px;
}

.feature-label {
  font-size: 0.9em;
  font-family: RobotoBold;
  text-align: center;
}

.analysis-chart {
  width: 100%;
  flex: 1;
}
</style>
