<template>
  <div class="model-classification-matrix">
    <div class="model-classification-matrix-title" v-if="!!score">
        F1 score {{score}}
        <el-button class="btn-download-result" v-if="!!downloadData" type="text" icon="el-icon-download" @click="handleResultDownload">Download</el-button>
    </div>
    <el-table
      class="matrix-table"
      ref="matrixTable"
      max-height="300"
      :data="matrixData"
      >
      <el-table-column property="fName" label="True/Predict"></el-table-column>
      <el-table-column v-for="fk in fkeys" :key="fk" :property="fk" :label="fk"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CsvExport from '@/util/csv-export';

export default {
    name: 'ModelClassificationMatrix',
    data() {
        return {
            matrixData: null,
            score: '',
            fkeys: [],
            downloadData: '',
            t: ''
        }
    },

    props: [
        'type',
        'outputFeature'
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

    methods: {
        update() {
            if (!this.learnData || !Object.keys(this.learnData).length) {
                return;
            }
            if (!this.learnData.conf_mat_test && !this.learnData.conf_mat_valid) {
                return;
            }
            let d = {};
            d = this.learnData.conf_mat_valid;
            this.score = (this.learnData.validationScore * 100).toFixed(2) + '%';
            if (this.type === 'test') {
                d = this.learnData.conf_mat_test;
                this.score = (this.learnData.testScore * 100).toFixed(2) + '%';
            } else {
                d = this.learnData.conf_mat_valid;
                this.score = (this.learnData.validationScore * 100).toFixed(2) + '%';
            }
            // prepare result plot data of test data
            // dataX: X Axis
            // dataY1: test result
            // dataY2: benchmark
            // downloadData is test predict data, allow users to download
            let predict = this.type === 'test' ? this.learnData.testPredict : this.learnData.validPredict;
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

            let classificationMatrix = []
            let featureNames = [];
            for (var i in d) {
                if (i !== 'Total') {
                    featureNames.push(i)
                }
            }
            this.fkeys = Object.keys(d);
            featureNames.push('Precision');
            featureNames.push('Recall');
            featureNames.push('F1');
            let featureNameKeys = Object.keys(d[featureNames[0]])
            featureNameKeys.forEach(k => {
                let line = [];
                if ((featureNames[k] !== 'Precision') && (featureNames[k] !== 'Recall') && (featureNames[k] !== 'F1')) {
                    for (var m in d) {
                        line.push(d[m][k]);
                    }
                } else {
                    for (var j in d) {
                        line.push(((parseFloat(d[j][k]) * 100).toFixed(2)).toString() + '%');
                    }
                }
                let lineObj = {};
                let idx = 0;
                for (let c in d) {
                    lineObj[c] = line[idx];
                    idx++;
                }
                lineObj['fName'] = featureNames[k];
                classificationMatrix.push(lineObj);
            });
            this.matrixData = classificationMatrix.slice();
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
                CsvExport(d, header, header, 'export_classification_result.csv');
            }
        }
    }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.model-classification-matrix {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.model-classification-matrix-title {
  font-size: 1.2em;
  font-family: RobotoBold;
  text-align: center;
}

.matrix-table {
  max-height: 30vh;
}

.btn-download-result {
  text-align: center;
  margin-left: 20%;
}
</style>
