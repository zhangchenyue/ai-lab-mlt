<template>
    <div class="analysis-histogram" v-loading='isLoading && isPlotLoading' element-loading-text='loading' element-loading-spinner='el-icon-loading' element-loading-background='rgba(0, 0, 0, 0.6)'>
        <div class="analysis-histogram-feature-selection">
            <h5>Feature 1</h5>
            <el-select class='data-source-select' size="mini" v-model="selectedFeature" filterable placeholder="Select Feature" @change="onFeatureChange">
                <el-option v-for='xf in features' :key='xf' :label='xf' :value='xf'></el-option>
            </el-select>
        </div>
        <div ref="el" class="analysis-chart"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ecStat from 'echarts-stat';
import AnalysisHistogramOption from './AnalysisHistogramOption';

export default {
    name: 'AnalysisHistogram',

    data() {
        return {
            title: 'Histogram',
            chart: null,
            option: { ...AnalysisHistogramOption },
            selectedFeature: '',
            interval: 0,
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
            'histogramData'
        ])
    },

    watch: {
        'histogramData': function (d) {
            if (d.every(i => !i)) {
                return;
            }
            let girth = d;
            let bins = ecStat.histogram(girth);
            let min = Infinity;
            let max = -Infinity;
            let histData = this.echarts.util.map(bins.data, (item, index) => {
                let x0 = bins.bins[index].x0;
                let x1 = bins.bins[index].x1;
                this.interval = x1 - x0;
                min = Math.min(min, x0);
                max = Math.max(max, x1);
                return [x0, x1, item[1]];
            });
            this.option.series[0].data = histData;
            this.option.xAxis.min = min;
            this.option.xAxis.max = max;
            this.option.xAxis.interval = this.interval;
            this.option.series[0].renderItem = this.renderItem.bind(this);
            this.chart.setOption(this.option);
            this.isPlotLoading = false;
        },
        'features': function (f) {
            if (f.length && this.$route.path === '/analysis') {
                this.selectedFeature = f[0];
                this.isPlotLoading = true;
                this.$store.dispatch('getHistogramData', { fileId: this.fileId, feature: this.selectedFeature });
            }
        },
        'isLoading': function (v) {
            this.isPlotLoading = v;
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
    },

    methods: {
        onFeatureChange(featureX) {
            this.isPlotLoading = true;
            this.$store.dispatch('getHistogramData', { fileId: this.fileId, feature: this.selectedFeature });
        },
        renderItem(params, api) {
            let yValue = api.value(2);
            let v0 = api.value(0)
            let v1 = api.value(1)
            let start = api.coord([v0, yValue]);
            let size = api.size([v1 - v0, yValue]);
            let style = api.style();
            return {
                type: 'rect',
                shape: {
                    x: start[0],
                    y: start[1],
                    width: size[0],
                    height: size[1]
                },
                style: style
            };
        }
    }
}
</script>

<style lang="scss" scoped>
.analysis-histogram {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.analysis-histogram-feature-selection {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.analysis-chart {
  width: 100%;
  flex: 1;
}
</style>
