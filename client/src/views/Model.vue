<template>
  <div class="model">
    <div class="model-content">
      <el-form :model="modelRuleForm" :rules="rules" ref="modelRuleForm" class="model-rule-Form" size="mini">
        <div class="model-start">
          <el-form-item size="small">
            <el-button type="primary" icon="el-icon-tickets" @click="onNewPage">New Page</el-button>
            <el-button type="success" icon="el-icon-caret-right" @click="submitForm('modelRuleForm')">Play</el-button>
          </el-form-item>
        </div>
        <el-collapse v-model="modelRuleForm.activeNames" @change="handleChange" v-loading="isContentLoading" element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
          <el-collapse-item class="model-content-selection" name="selection">
            <template slot="title">
              <div class="model-content-title">
                <span>Data Selection</span>
                <i class="header-icon el-icon-info"></i>
              </div>
            </template>
            <el-row class="data-selection-row">
              <el-col :xs="24" :sm="12">
                <div class="data-selection-col-title">Source Selection</div>
                <el-form-item label="Training:" prop="trainingSource">
                  <el-select v-model="modelRuleForm.trainingSource" value-key="_id" filterable placeholder="Select Training Source" @change="onTrainingSourceChange">
                    <el-option v-for="source in dataSourceOptions" :key="source._id" :label="source.filename" :value="source">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="!isClusterPattern" label="Test:" prop="testSource">
                  <el-select v-model="modelRuleForm.testSource" value-key="_id" filterable placeholder="Select Test Source" @change="onTestSourceChange">
                    <el-option v-for="source in dataSourceOptions" :key="source._id" :label="source.filename" :value="source">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="!isClusterPattern" label="Benchmark:" prop="benchmarkSource">
                  <el-select v-model="modelRuleForm.benchmarkSource" value-key="_id" filterable clearable placeholder="Select Benchmark Source">
                    <el-option v-for="source in dataSourceOptions" :key="source._id" :label="source.filename" :value="source">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <div class="data-selection-col-title">Features Selection</div>
                <el-form-item size="medium" label="Input:" prop="inputFeatures">
                  <el-select v-model="modelRuleForm.inputFeatures" multiple placeholder="Select Input Features" @change="onInputFeaturesChange">
                    <el-option v-for="inf in inputFeatureOptions" :key="inf.val" :label="inf.val" :value="inf.val" :disabled="inf.disabled">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="!isClusterPattern" size="medium" label="Output:" prop="outputFeature">
                  <el-select v-model="modelRuleForm.outputFeature" placeholder="Select Output Feature" @change="onOutputFeaturesChange">
                    <el-option v-for="outf in outputFeatureOptions" :key="outf.val" :label="outf.val" :value="outf.val" :disabled="outf.disabled">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="showStatus" class="data-selection-statistics-row">
              <el-col :xs="12" :sm="5">
                <span class="data-selection-statistics-col-title">Train size: </span>
                <span>{{trainSize}}</span>
              </el-col>
              <el-col :xs="12" :sm="5">
                <span class="data-selection-statistics-col-title">Validation size: </span>
                <span>{{validationSize}}</span>
              </el-col>
              <el-col :xs="12" :sm="4">
                <span class="data-selection-statistics-col-title">Test size: </span>
                <span>{{textSize}}</span>
              </el-col>
              <el-col :xs="12" :sm="5">
                <span class="data-selection-statistics-col-title">Input Feaure count: </span>
                <span>{{modelRuleForm.inputFeatures.length}}</span>
              </el-col>
              <el-col :xs="12" :sm="5">
                <span class="data-selection-statistics-col-title">Output Feaure count: </span>
                <span>{{modelRuleForm.outputFeature?1:0}}</span>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item class="model-content-learning" name="learning">
            <template slot="title">
              <div class="model-content-title">
                <span>Machine Learning</span>
                <i class="header-icon el-icon-info"></i>
              </div>
            </template>
            <el-row class="data-learning-row">
              <el-col :xs="24" :sm="12">
                <div class="data-learning-col-title">Type of Machine Learning</div>
                <el-form-item label="Type:" prop="patternType">
                  <el-radio-group v-model="modelRuleForm.patternType" @change="onPatternChange">
                    <el-radio-button label="regression">Regression</el-radio-button>
                    <el-radio-button label="classification">Classification</el-radio-button>
                    <el-radio-button label="clustering">Clustering</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="!isClusterPattern" label="Normalization:" prop="normalization">
                  <el-radio-group v-model="modelRuleForm.normalization">
                    <el-radio label="[0,1]">[0,1]</el-radio>
                    <el-radio label="[-1,1]">[-1,1]</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="!isClusterPattern" label="Learning Rate:" prop="learningRate">
                  <el-input v-model.number="modelRuleForm.learningRate"></el-input>
                </el-form-item>
                <el-form-item v-if="!isClusterPattern" :label="trainAndValidationLabel" class="train-validation-item">
                  <el-tag class="train-validation-item-text" type="info">Train</el-tag>
                  <el-slider :min="trainAndValidationMin" :max="trainAndValidationMax" :step="trainAndValidationStep" v-model="modelRuleForm.trainAndValidation">
                  </el-slider>
                  <el-tag class="train-validation-item-text" type="info">Validation</el-tag>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <div class="data-learning-col-title">Model Settings</div>
                <el-form-item label="Algorithm:" prop="algorithm">
                  <el-select v-model="modelRuleForm.algorithm" value-key="name" filterable placeholder="Select algorithm" @change="onAlgorithmChange">
                    <el-option v-for="inf in algorithmOptions" :key="inf.name" :label="inf.label" :value="inf">
                    </el-option>
                  </el-select>
                  <a :href="modelRuleForm.algorithm.link" target="_blank">
                    <i class="header-icon el-icon-info"></i>
                  </a>
                </el-form-item>
                <el-form-item label="Parameters:" v-if="!!modelRuleForm.algorithm.parameters" style="margin-bottom: 0"></el-form-item>
                <el-form-item class="modelForm-algorithm-params" v-if="!!modelRuleForm.algorithm.parameters">
                  <el-form-item v-if="!!modelRuleForm.algorithm.parameters.kernel" prop="algorithm.parameters.kernel" label="Kernel">
                    <el-select v-model="modelRuleForm.algorithm.parameters.kernel" @change="onAlgorithmParamChange">
                      <el-option v-for="k in algorithmParamKernelOptions" :key="k" :label="k" :value="k">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.c)!=='undefined'" prop="algorithm.parameters.c" label="C">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.c"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.gamma)!=='undefined'" prop="algorithm.parameters.gamma" label="Gamma">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.gamma"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.n_estimators)!=='undefined'" prop="algorithm.parameters.n_estimators" label="N_Estimators">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.n_estimators"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.max_depth)!=='undefined'" prop="algorithm.parameters.max_depth" label="Max_Depth">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.max_depth"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.penalty)!=='undefined'" prop="algorithm.parameters.penalty" label="Penalty">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.penalty"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.tol)!=='undefined'" prop="algorithm.parameters.tol" label="Tol">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.tol"></el-input>
                  </el-form-item>
                  <el-form-item v-if="!!modelRuleForm.algorithm.parameters.solver" label="Solver" prop="algorithm.parameters.solver">
                    <el-select v-if="modelRuleForm.algorithm.name == 'LogisticRegression'" v-model="modelRuleForm.algorithm.parameters.solver" @change="onAlgorithmParamChange">
                      <el-option v-for="s in algorithmParamSolverOptions" :key="s" :label="s" :value="s">
                      </el-option>
                    </el-select>
                    <el-select v-if="modelRuleForm.algorithm.name == 'NeuralNetwork'" v-model="modelRuleForm.algorithm.parameters.solver" @change="onAlgorithmParamChange">
                      <el-option v-for="s in algorithmParamNNSolverOptions" :key="s" :label="s" :value="s">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.hidden_layer_sizes)!=='undefined'" prop="algorithm.parameters.hidden_layer_sizes" label="Hidden Layer Sizes">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.hidden_layer_sizes"></el-input>
                  </el-form-item>
                  <el-form-item v-if="!!modelRuleForm.algorithm.parameters.activation" label="Activation" prop="algorithm.parameters.activation">
                    <el-select v-model="modelRuleForm.algorithm.parameters.activation" @change="onAlgorithmParamChange">
                      <el-option v-for="a in algorithmParamActivationOptions" :key="a" :label="a" :value="a">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="!!modelRuleForm.algorithm.parameters.learningrate" prop="algorithm.parameters.learningrate" label="Learning Rate">
                    <el-select v-model="modelRuleForm.algorithm.parameters.learningrate" @change="onAlgorithmParamChange">
                      <el-option v-for="l in algorithmParamLearningrateOptions" :key="l" :label="l" :value="l">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.alpha)!=='undefined'" prop="algorithm.parameters.alpha" label="Alpha">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.alpha"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.max_iter)!=='undefined'" prop="algorithm.parameters.max_iter" label="Max Iter">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.max_iter"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.momentum)!=='undefined'" prop="algorithm.parameters.momentum" label="Momentum">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.momentum"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.random_state)!=='undefined'" prop="algorithm.parameters.random_state" label="Random State">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.random_state"></el-input>
                  </el-form-item>
                  <el-form-item v-if="typeof(modelRuleForm.algorithm.parameters.n_clusters)!=='undefined'" prop="algorithm.parameters.n_clusters" label="N_Clusters">
                    <el-input v-model.number="modelRuleForm.algorithm.parameters.n_clusters"></el-input>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item class="model-content-result" name="result">
            <template slot="title">
              <div class="model-content-title">
                <span>Result</span>
                <i class="header-icon el-icon-info"></i>
              </div>
            </template>
            <el-row v-if="!isClusterPattern && modelRuleForm.benchmarkSource" type="flex" justify="center" class="data-type-row">
              <el-radio-group size="mini" v-model="dataType">
                <el-radio label="validation">Validation</el-radio>
                <el-radio label="test">Test</el-radio>
              </el-radio-group>
            </el-row>
            <el-row v-show="this.modelRuleForm.patternType==='regression'">
              <el-col :span="24" class="result-resultplot">
                <model-result-plot :outputFeature="modelRuleForm.outputFeature" :type="dataType"></model-result-plot>
              </el-col>
              <el-col :span="24" class="result-crossplot">
                <model-regression-cross-plot :type="dataType"></model-regression-cross-plot>
              </el-col>
            </el-row>
            <el-row v-show="this.modelRuleForm.patternType==='classification'">
              <el-col :span="24">
                <model-classification-matrix :type="dataType" :outputFeature="modelRuleForm.outputFeature"></model-classification-matrix>
              </el-col>
              <el-col :span="24" class="classification-crossplot">
                <model-classification-cross-plot :type="dataType"></model-classification-cross-plot>
              </el-col>
            </el-row>
            <el-row v-show="isClusterPattern" type="flex" justify="center">
              <el-col :span="24" class="result-clusterplot">
                <model-cluster-plot></model-cluster-plot>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import ModelResultPlot from '@/components/ModelResultPlot'
import ModelRegressionCrossPlot from '@/components/ModelRegressionCrossPlot'
import ModelClassificationCrossPlot from '@/components/ModelClassificationCrossPlot'
import ModelClassificationMatrix from '@/components/ModelClassificationMatrix'
import ModelClusterPlot from '@/components/ModelClusterPlot'
export default {
  name: 'model',
  components: {
    ModelResultPlot,
    ModelRegressionCrossPlot,
    ModelClassificationCrossPlot,
    ModelClassificationMatrix,
    ModelClusterPlot
  },
  data() {
    return {
      modelRuleForm: {
        activeNames: ['selection', 'learning', 'result'],
        trainingSource: null,
        testSource: null,
        benchmarkSource: null,
        inputFeatures: [],
        outputFeature: null,
        patternType: 'regression',
        normalization: '[0,1]',
        learningRate: 0.01,
        trainAndValidation: 0.5,
        algorithm: {
          name: 'SVM',
          label: 'SVM',
          link: 'https://en.wikipedia.org/wiki/Support_vector_machine',
          pattern: ['regression', 'classification'],
          parameters: {
            kernel: 'rbf',
            c: 1.000,
            gamma: 1.000
          }
        }
      },
      textSize: 0,
      isContentLoading: false,
      dataType: 'validation',
      inputFeatureOptions: [],
      outputFeatureOptions: [],
      algorithmParamKernelOptions: ['linear', 'poly', 'rbf', 'sigmoid', 'precomputed'],
      algorithmParamSolverOptions: ['newton-cg', 'lbfgs', 'liblinear', 'sag', 'saga'],
      algorithmParamNNSolverOptions: ['adam', 'lbfgs', 'sgd'],
      algorithmParamActivationOptions: ['identity', 'logistic', 'tanh', 'relu'],
      algorithmParamLearningrateOptions: ['constant', 'invscaling'],
      algorithmTotalOptions: [
        {
          name: 'SVM',
          label: 'SVM',
          link: 'https://en.wikipedia.org/wiki/Support_vector_machine',
          pattern: ['regression', 'classification'],
          parameters: {
            kernel: 'rbf',
            c: 1.000,
            gamma: 1.000
          }
        },
        {
          name: 'RandomForest',
          label: 'Random Forest',
          pattern: ['regression', 'classification'],
          link: 'https://en.wikipedia.org/wiki/Random_forest',
          parameters: {
            n_estimators: 10,
            max_depth: 5
          }
        },
        {
          name: 'LinearRegression',
          label: 'Linear Regression',
          pattern: ['regression']
        },
        {
          name: 'LogisticRegression',
          label: 'Logistic Regression',
          link: 'https://en.wikipedia.org/wiki/Logistic_regression',
          pattern: ['classification'],
          parameters: {
            penalty: 'l2',
            c: 1.000,
            tol: 0.0001,
            solver: 'liblinear'
          }
        },
        {
          name: 'GradientBoostTree',
          label: 'Gradient Boost Tree',
          link: 'https://en.wikipedia.org/wiki/Gradient_boosting',
          pattern: ['regression', 'classification'],
          parameters: {
            n_estimators: 100,
            max_depth: 5
          }
        },
        {
          name: 'NeuralNetwork',
          label: 'Neural Network',
          link: 'https://en.wikipedia.org/wiki/Artificial_neural_network',
          pattern: ['regression', 'classification'],
          parameters: {
            hidden_layer_sizes: '(100)',
            activation: 'relu',
            solver: 'adam',
            learningrate: 'constant',
            alpha: 0.0001,
            max_iter: 2000,
            momentum: 0.9000,
            random_state: 1
          }
        },
        {
          name: 'XGBoost',
          label: 'XGBoost',
          link: 'https://en.wikipedia.org/wiki/Xgboost',
          pattern: ['classification'],
          parameters: {
            n_estimators: 100,
            max_depth: 5
          }
        },
        {
          name: 'KMeans',
          label: 'KMeans',
          link: 'https://en.wikipedia.org/wiki/K-means_clustering',
          pattern: ['clustering'],
          parameters: {
            n_clusters: 2
          }
        },
        // {
        //   name: 'SpectralClustering',
        //   label: 'SpectralClustering',
        //   link: 'https://en.wikipedia.org/wiki/Spectral_clustering',
        //   pattern: ['clustering'],
        //   parameters: {
        //     n_clusters: 2
        //   }
        // },
        {
          name: 'AgglomerativeClustering',
          label: 'AgglomerativeClustering',
          link: 'https://en.wikipedia.org/wiki/Cluster_analysis#agglomerative_clustering',
          pattern: ['clustering'],
          parameters: {
            n_clusters: 2
          }
        }
      ],
      trainAndValidationMin: 0.01,
      trainAndValidationMax: 0.99,
      trainAndValidationStep: 0.01,
      rules: {
        trainingSource: [
          { required: true, message: 'Please select training source', trigger: 'change' }
        ],
        testSource: [
          { required: true, message: 'Please select test source', trigger: 'change' }
        ],
        inputFeatures: [
          { required: true, type: 'array', message: 'Please select at least 1 input feature', trigger: 'change' }
        ],
        outputFeature: [
          { required: true, message: 'Please select output feature', trigger: 'change' }
        ],
        learningRate: [
          { required: true, type: 'number', message: 'Please input valid learning rate', trigger: 'blur' }
        ],
        patternType: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        normalization: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        'algorithm.parameters.kernel': [
          { required: true, trigger: 'change' }
        ],
        'algorithm.parameters.c': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.gamma': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.n_estimators': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.max_depth': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.hidden_layer_sizes': [
          { required: true, type: 'string', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.alpha': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.max_iter': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.momentum': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.random_state': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ],
        'algorithm.parameters.n_clusters': [
          { required: true, type: 'number', message: ' ', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentSource',
      'learnData',
      'clusterData',
      'filesInfo',
      'fileContent',
      'features'
    ]),
    dataSourceOptions: function() {
      if (!this.filesInfo.length) {
        return [];
      }
      return this.filesInfo;
    },
    trainAndValidationLabel: function() {
      return 'Ratio(' + this.modelRuleForm.trainAndValidation + '):'
    },
    algorithmOptions: function() {
      let ops = this.algorithmTotalOptions.filter(option => option.pattern.indexOf(this.modelRuleForm.patternType) >= 0);
      this.modelRuleForm.algorithm = ops.find(o => o.name === this.modelRuleForm.algorithm.name) || ops[0];
      return ops;
    },
    testRatio: function() {
      return 1 - this.modelRuleForm.trainAndValidation;
    },
    isClusterPattern: function() {
      return this.modelRuleForm.patternType === 'clustering';
    },
    trainSize: function() {
      let trainNum = this.fileContent.length || 0;
      return Math.round(trainNum * this.modelRuleForm.trainAndValidation);
    },
    validationSize: function() {
      return (this.fileContent.length || 0) - this.trainSize;
    },
    showStatus: function() {
      return this.trainSize || this.validationSize || this.textSize || this.modelRuleForm.inputFeatures.length || this.modelRuleForm.outputFeature
    }
  },
  watch: {
    'features': function(f) {
      this.inputFeatureOptions = f.map(it => ({ val: it, disabled: false }));
      this.outputFeatureOptions = f.map(it => ({ val: it, disabled: false }));
    },
    'learnData': function(d) {
      if (d && Object.keys(d).length) {
        this.isContentLoading = false;
      }
    },
    'clusterData': function(d) {
      if (d && Object.keys(d).length) {
        this.isContentLoading = false;
      }
    }
  },
  mounted() {
    if (!this.filesInfo || !this.filesInfo.length) {
      this.$store.dispatch('getUserFilesInfo');
    }
    this.$bus.on('E_ERROR', (val) => {
      this.isContentLoading = false;
    });
  },
  activated() {
    if (this.currentSource._id) {
      this.modelRuleForm.trainingSource = this.filesInfo.find(it => it._id === this.currentSource._id);
      this.$store.dispatch('getFeaturesByFileId', { fileId: this.currentSource._id });
    }
  },
  methods: {
    handleChange(val) {
    },
    onNewPage() {
      window.open(window.location);
    },
    onInputFeaturesChange: function(iFeatures) {
      this.outputFeatureOptions.forEach(o => {
        if (iFeatures.indexOf(o.val) >= 0) {
          o.disabled = true;
        } else {
          o.disabled = false;
        }
      });
    },
    onOutputFeaturesChange: function(oFeature) {
      this.inputFeatureOptions.forEach(i => {
        if (oFeature === i.val) {
          i.disabled = true;
        } else {
          i.disabled = false;
        }
      });
    },
    onPatternChange: function(pattern) {
      this.$bus.emit('E_PATTERN_CHANGE', pattern);
    },
    onTrainingSourceChange(val) {
      if (!val._id) {
        return;
      }
      this.modelRuleForm.inputFeatures = [];
      this.modelRuleForm.outputFeature = '';
      this.$store.commit('updateCurrentSource', val)
      this.$store.dispatch('getUserFileById', { id: val._id });
      this.$store.dispatch('getFeaturesByFileId', { fileId: val._id });
    },
    onTestSourceChange(val) {
      if (!val._id) {
        return;
      }

      axios.get('/api/file/' + val._id)
        .then(res => {
          if (res && res.data) {
            this.textSize = res.data.length;
          }
        })
        .catch(err => {
          this.$store.commit('updateLastError', {
            type: 'getTestFileById',
            msg: err
          });
          console.log(err)
        });
    },
    onAlgorithmChange: function(algorithm) {
      console.log(algorithm);
    },
    onAlgorithmParamChange: function(algorithmParam) {
      console.log(algorithmParam);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isContentLoading = true
          if (this.modelRuleForm.patternType !== 'clustering') {
            this.$store.dispatch('getLearnData', {
              trainFileId: this.modelRuleForm.trainingSource._id,
              testFileId: this.modelRuleForm.testSource._id,
              benchmarkFileId: this.modelRuleForm.benchmarkSource ? this.modelRuleForm.benchmarkSource._id : '',
              normalization: this.modelRuleForm.normalization,
              inputFeatures: this.modelRuleForm.inputFeatures,
              outputFeatures: [this.modelRuleForm.outputFeature],
              learningrate: this.modelRuleForm.learningRate,
              testratio: this.testRatio,
              isClassification: this.modelRuleForm.patternType === 'classification',
              model: this.modelRuleForm.algorithm.name,
              config: this.modelRuleForm.algorithm.parameters || {}
            });
          } else {
            this.$store.dispatch('getClusterData', {
              trainFileId: this.modelRuleForm.trainingSource._id,
              inputFeatures: this.modelRuleForm.inputFeatures,
              model: this.modelRuleForm.algorithm.name,
              config: this.modelRuleForm.algorithm.parameters || {}
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.model {
  display: flex;
  justify-content: center;
  .el-collapse-item__header {
    height: 40px;
    line-height: 40px;
  }
  .el-collapse-item__arrow {
    line-height: 40px;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }

  .el-collapse-item__content {
    padding-bottom: 0;
  }

  .el-form-item__label {
    min-width: 100px;
    text-align: right;
    font-family: RobotoBold;
    font-size: 0.9em;
  }

  .el-form-item__error {
    left: 100px;
  }

  .el-collapse {
    border-bottom: none;
  }
}

.model-rule-Form {
  padding-top: 45px;
}

.model-content {
  width: 100%;
  max-width: 1200px;
}

.header-icon {
  margin-left: 10px;
}

.model-content-title {
  text-align: center;
  font-size: 1.2em;
  background: #f0f2f5;
}

.model-content-result {
  .data-type-row {
    padding: 5px 0;
  }
  .result-resultplot,
  .result-crossplot {
    height: 34vh;
  }
  .classification-crossplot,
  .result-clusterplot {
    height: 40vh;
  }
}

.model-start {
  padding: 5px 0;
  position: fixed;
  top: 50px;
  max-width: 1200px;
  width: 100%;
  background: white;
  z-index: 10;
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}

.data-selection-row,
.data-learning-row {
  .el-select,
  .el-input {
    width: 70%;
  }
}

.train-validation-item {
  display: flex;
  .el-form-item__content {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .el-form-item__label {
    line-height: 38px;
  }
  .el-slider__bar {
    background-color: #606266;
  }

  .el-slider__button {
    border-color: #606266;
    width: 10px;
    height: 10px;
  }

  .el-slider {
    width: 50%;
    display: inline-block;
  }
}

.data-selection-col-title,
.data-learning-col-title {
  font-family: RobotoBold;
  text-align: center;
  margin-bottom: 5px;
}

.data-selection-statistics-row {
  text-align: center;
  font-size: 0.9em;
  color: #909399;
}

.data-selection-statistics-col-title {
  font-style: italic;
  font-weight: 600;
  padding-right: 8px;
}

.train-validation-item-text {
  padding: 0 10px;
  color: #606266;
  border: none;
  height: 24px;
  line-height: 24px;
}

.modelForm-algorithm-params {
  .el-form-item__content {
    padding-left: 20px;
  }

  .el-form-item__label {
    text-align: center;
    font-family: Roboto;
    font-size: 0.9em;
    width: 100%;
    padding-right: 0;
  }
  .el-form-item {
    display: inline-block;
  }

  .el-select,
  .el-input {
    width: 120px;
    input,
    select {
      text-align: center;
    }
  }
}
</style>
