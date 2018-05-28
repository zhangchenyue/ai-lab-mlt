<template>
    <div class="features">
        <router-link :to="{ path: 'data'}">
          <div class="feature-item">
            <el-card class="box-card">
              <img src="../assets/icon-data.png" alt="">
              <div class="box-card-item-title box-card-item-title-data">Data</div>
            </el-card>
            <div class="feature-item-title">Importing and preparing data for platform</div>
          </div>
        </router-link>
        <router-link :to="{ path: 'analysis'}">
          <div class="feature-item">
            <el-card class="box-card">
              <img src="../assets/icon-analysis.png" alt="">
              <div class="box-card-item-title box-card-item-title-analysis">Analysis</div>
            </el-card>
            <div class="feature-item-title">Getting your Data Ready for MachineLearning</div>
          </div>
        </router-link>
        <router-link :to="{ path: 'model'}">
          <div class="feature-item">
            <el-card class="box-card">
              <img src="../assets/icon-model.png" alt="">
              <div class="box-card-item-title box-card-item-title-model">Model</div>
            </el-card>
            <div class="feature-item-title">Building Supervised Models and Making Predictions</div>
          </div>
        </router-link>
    </div>
</template>

<script>
export default {
  name: 'NavFeature'
}
</script>

<style lang="scss" scoped>
.features {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  & > a {
    display: inline-block;
    text-align: center;
  }
  & > a:nth-child(2) {
    margin: 0 3%;
  }
}

.feature-item {
  display: inline-block;
  opacity: 0.8;
  &:hover {
    transform: scale(1.01);
    cursor: pointer;
    opacity: 1;
  }
}

.feature-item-title {
  max-width: 22vh;
  text-align: center;
  font-size: 0.9em;
  font-family: "RobotoBlack";
  color: black;
}
.box-card {
  position: relative;
  .el-card__body {
    padding: 10px;
  }
  img {
    height: 20vh;
    width: auto;
  }
}

.box-card-item-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  font-size: 3vh;
  text-align: center;
}
.box-card-item-title-data {
  background: rgba(25, 65, 199, 0.6);
}
.box-card-item-title-analysis {
  background: rgba(21, 145, 97, 0.6);
}
.box-card-item-title-model {
  background: rgba(83, 3, 233, 0.6);
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: scroll;
  }

  .feature-item {
    margin: 20px;
    width: 80%;
    text-align: center;
  }
  .feature-item-title {
    max-width: 100%;
    text-align: center;
    font-size: 1em;
  }
}
</style>
