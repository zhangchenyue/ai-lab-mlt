<template>
  <div class="model-cluster-plot">
    <div class="model-cluster-plot-title">{{clusterData.model}}</div>
    <div ref="el" class="model-chart"></div>
    <div v-if="showDownload" class="btn-download-cluster">
        <el-button size="small" type="primary" icon="el-icon-download" @click="handleClusterDownload">Result</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModelClusterPlotOption from './ModelClusterPlotOption';
import CsvExport from '@/util/csv-export';
export default {
    name: 'ModelClusterPlot',

    data() {
        return {
            chart: null,
            option: { ...ModelClusterPlotOption },
            showDownload: false
        }
    },

    computed: {
        ...mapGetters([
            'clusterData'
        ])
    },

    watch: {
        'clusterData': function (d) {
            this.update();
            this.showDownload = true
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
            if (val === 'clustering') {
                this.$nextTick(function () {
                    this.chart.resize();
                });
            }
        });
    },

    methods: {
        update() {
            if (!this.clusterData || !this.clusterData.clusterResult) {
                return;
            }

            let ptsInCluster = this.clusterData.clusterResult;
            let series = [];
            for (var i = 0; i < ptsInCluster.length; i++) {
                series.push({
                    name: ptsInCluster[i][2],
                    type: 'scatter',
                    animation: false,
                    data: [[ptsInCluster[i][0], ptsInCluster[i][1]]],
                    symbolSize: 1,
                    label: {
                        normal: {
                            formatter: '{a}',
                            show: true,
                            textStyle: {
                                color: 'auto'
                            }
                        }
                    }
                });
            }
            this.option.series = series;
            this.chart.setOption(this.option);
        },
        handleClusterDownload() {
            if (this.$store.getters.clusterData && this.$store.getters.clusterData.downloadCluster) {
                let header = this.$store.getters.clusterData.downloadClusterHeader.slice();
                let d = this.$store.getters.clusterData.downloadCluster.map(c => {
                    let o = {};
                    for (let i = 0; i < header.length; i++) {
                        o[header[i]] = c[i];
                    }
                    return o;
                });
                CsvExport(d, header, header, 'export_cluster.csv');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.model-cluster-plot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.model-cluster-plot-title {
  font-size: 1.2em;
  font-family: RobotoBold;
  text-align: center;
}

.model-chart {
  width: 100%;
  flex: 1;
}

.btn-download-cluster {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
</style>
