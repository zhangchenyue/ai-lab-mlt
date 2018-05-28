<template>
  <div class='analysis'>
    <el-row class='analysis-row analysis-select'>
      <span class="analysis-row-title">Data Source</span>
      <el-select class='data-source-select' v-model="currentOption" value-key="_id" filterable placeholder="Select Source" @change="onDataSourceChange">
        <el-option v-for='source in dataSourceOptions' :key='source._id' :label='source.filename' :value='source'>
        </el-option>
      </el-select>
    </el-row>
    <el-row class='analysis-row'>
      <el-card class='box-card'>
        <div class="analysis-row-title">Statistics Table</div>
        <el-table stripe height="300" max-height="300" ref='stRef' :data='statisticTable.tableData' v-loading='isContentLoading' element-loading-text='loading' element-loading-spinner='el-icon-loading' element-loading-background='rgba(0, 0, 0, 0.3)'>
          <el-table-column v-for='field in statisticTable.features' :key='field' :label='field' sortable>
            <template slot-scope="scope">
              <span>{{ scope.row[field] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-row class='analysis-row analysis-row-chart'>
      <el-col :sm="24" :md="8">
        <el-card class='box-card'>
          <div class="analysis-row-title">Heat Map</div>
          <div class="analysis-row-subtitle">{{currentOption?currentOption.filename:''}}</div>
          <div class="analysis-chart">
            <analysis-heat-map :heatData="$store.getters.statisticTable" :isLoading="isContentLoading"></analysis-heat-map>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-card class='box-card'>
          <div class="analysis-row-title">Cross Plot</div>
          <div class="analysis-row-subtitle">{{currentOption?currentOption.filename:''}}</div>
          <div class="analysis-chart">
            <analysis-cross-plot :features="features" :fileId="currentOption?currentOption._id:''" :isLoading="isContentLoading"></analysis-cross-plot>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-card class='box-card'>
          <div class="analysis-row-title">Histogram</div>
          <div class="analysis-row-subtitle">{{currentOption?currentOption.filename:''}}</div>
          <div class="analysis-chart">
            <analysis-histogram :features="features" :fileId="currentOption?currentOption._id:''" :isLoading="isContentLoading"></analysis-histogram>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AnalysisHeatMap from '@/components/AnalysisHeatMap'
import AnalysisCrossPlot from '@/components/AnalysisCrossPlot'
import AnalysisHistogram from '@/components/AnalysisHistogram'

export default {
  name: 'Analysis',

  components: {
    AnalysisHeatMap,
    AnalysisCrossPlot,
    AnalysisHistogram
  },

  data() {
    return {
      currentOption: null,
      isContentLoading: false,
      lastOptId: ''
    }
  },

  computed: {
    ...mapGetters([
      'filesInfo',
      'currentSource',
      'features'
    ]),
    // features: function () {
    //   let d = this.$store.getters.statisticTable.Describe;
    //   if (!d) {
    //     return [];
    //   }
    //   return Object.keys(d);
    // },
    dataSourceOptions: function () {
      if (!this.filesInfo.length) {
        return;
      }
      if (!this.currentSource._id) {
        this.$store.commit('updateCurrentSource', this.filesInfo[0]);
      }
      return this.filesInfo;
    },
    statisticTable: function () {
      let d = this.$store.getters.statisticTable.Describe;
      if (!d) {
        return { tableData: null };
      }

      let features = Object.keys(d);
      let indexes = Object.keys(d[features[0]]);
      let tempF = features.length > 1 ? features : [...features, ...features];
      let tableData = indexes.map(idx => tempF.reduce((pre, cur) => {
        let t = {};
        if (typeof pre === 'string') {
          t[pre] = d[pre][idx];
          t[cur] = d[cur][idx];
          t['#prop'] = idx;
          return { ...t }
        }
        t[cur] = d[cur][idx];
        t['#prop'] = idx;
        return { ...pre, ...t };
      }));
      this.isContentLoading = false;
      return {
        features: ['#prop', ...features],
        indexes: indexes,
        tableData: tableData
      }
    }
  },

  watch: {
    'currentSource'(val) {
      if (!val._id || this.$route.path !== '/analysis') {
        return;
      }
      this.currentOption = this.$store.getters.filesInfo.find(it => it._id === this.currentSource._id);
      this.$store.dispatch('getStatisticTable', { fileId: this.currentSource._id });
      this.$store.dispatch('getFeaturesByFileId', { fileId: this.currentSource._id });
      this.isContentLoading = true;
      this.lastOptId = this.currentSource._id;
    }
  },
  methods: {
    onDataSourceChange(val, key) {
      this.currentOption = val;
      this.isContentLoading = true;
      this.$store.commit('updateCurrentSource', val);
    },
    formatStaticIndex(idx) {
      return this.statisticTable.indexes[idx];
    }
  },

  mounted() {
    this.isContentLoading = true
    if (!this.filesInfo || !this.filesInfo.length) {
      this.$store.dispatch('getUserFilesInfo');
    }
  },

  activated() {
    this.$refs.stRef.doLayout();
    if (this.currentSource._id) {
      this.currentOption = this.filesInfo.find(it => it._id === this.currentSource._id);
      if (this.lastOptId !== this.currentOption._id) {
        this.$store.dispatch('getStatisticTable', { fileId: this.currentSource._id });
        this.$store.dispatch('getFeaturesByFileId', { fileId: this.currentSource._id });
        this.isContentLoading = true;
        this.lastOptId = this.currentOption._id;
      }
    } else {
      if (this.filesInfo && this.filesInfo.length) {
        this.$store.commit('updateCurrentSource', this.filesInfo[0]);
      }
    }
  }
}
</script>

<style lang="scss">
.analysis {
  .analysis-row {
    max-width: 1200px;
    padding: 5px 10px;
    margin: 0 auto;
  }

  .analysis-select {
    display: flex;
    align-items: center;
  }

  .analysis-select {
    .analysis-row-title {
      font-family: RobotoBold;
      padding-right: 10px;
      font-size: 1em;
    }
  }

  .box-card {
    .analysis-row-title {
      margin-top: 5px;
      font-family: RobotoBold;
      font-size: 1.1em;
      text-align: center;
    }
    .el-card__body {
      padding: 0 10px 10px 10px;
    }
    .analysis-row-subtitle {
      font-size: 0.9em;
      color: #ccc;
      text-align: center;
    }
  }

  .data-source-select {
    flex: 1;
  }

  .analysis-row-chart {
    padding: 0 10px;
    .box-card {
      margin-top: 10px;
    }
  }

  .analysis-chart {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
