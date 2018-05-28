<template>
  <div ref="elHeatMap" class="analysis-heat-map"
        v-loading='isLoading'
        element-loading-text='loading'
        element-loading-spinner='el-icon-loading'
        element-loading-background='rgba(0, 0, 0, 0.6)'
  >
  </div>
</template>

<script>
import AnalysisHeatMapOption from './AnalysisHeatMapOption'
export default {
    name: 'AnalysisHeatMap',

    data() {
        return {
            title: 'Heat Map',
            heatChart: null,
            heatOption: { ...AnalysisHeatMapOption }
        }
    },

    props: [
        'heatData',
        'isLoading'
    ],

    watch: {
        'heatData': function (t) {
            this.heatOption.xAxis.data = t.feature;
            this.heatOption.yAxis.data = t.feature;
            this.heatOption.series[0].data = t.data;
            this.heatChart.setOption(this.heatOption);
        }
    },

    activated() {
        this.heatChart.setOption(this.heatOption);
        this.heatChart.resize();
    },

    mounted() {
        this.heatChart = this.echarts.init(this.$refs.elHeatMap);

        this.$bus.on(this.$bus.E_WINDOW_RESIZE, () => {
            this.heatChart.resize();
        });
    }
}
</script>

<style <style lang="scss" scoped>
.analysis-heat-map {
  width: 100%;
  height: 100%;
}
</style>
