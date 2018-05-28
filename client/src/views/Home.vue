<template>
  <div class="home">
    <el-carousel>
      <el-carousel-item>
        <div class="item-content">
          <span class="item-content-text">Complete sign-up, and start learing machine learning course</span>
          <img src="../assets/carousel-1.png" alt="">
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="item-content">
          <span class="item-content-text">Try MLT with a 10-Minute Tutorial</span>
          <img src="../assets/carousel-2.png" alt="">
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="item-content">
          <span class="item-content-text">Explore the MLT platform, products and capabilities</span>
          <img src="../assets/carousel-3.png" alt="">
        </div>
      </el-carousel-item>
      <div class="slogan">{{slogan}}</div>
    </el-carousel>
    <nav-feature></nav-feature>
  </div>
</template>

<script>
import NavFeature from '@/components/NavFeature'
export default {
  name: 'Home',
  components: {
    NavFeature
  },
  data() {
    return {
      slogan: 'Enjoy the Power of Machine Learning'
    }
  }
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
  .el-carousel {
    height: 40vh;
  }
  .el-carousel__container {
    height: 100%;
  }

  .slogan {
    position: absolute;
    bottom: 20px;
    left: 50%;
    z-index: 2;
    white-space: nowrap;
    transform: translateX(-50%);
    color: gold;
    font-size: 3vh;
    text-shadow: 1px 1px 1px black;
    font-family: CURSIVE;
  }
  .el-carousel__item:nth-child(3n) {
    background: #55a7fe;
    background: linear-gradient(top, #55a7fe, #4d92f6);
  }

  .el-carousel__item:nth-child(3n + 1) {
    background: #3bc5a0;
    background: linear-gradient(top, #3bc5a0, #2fa283);
  }

  .el-carousel__item:nth-child(3n + 2) {
    background: #9567eb;
    background: linear-gradient(top, #9567eb, #8250da);
  }

  .item-content {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 30vh;
      width: auto;
    }
  }

  .item-content-text {
    color: white;
    font-size: 2.5vh;
    max-width: 250px;
    margin-right: 1vh;
  }

  @media (max-width: 768px) {
    .item-content {
      padding: 0 10px;
      img {
        height: 20vh;
        width: auto;
      }
    }

    .item-content-text {
      margin-right: 0;
    }
  }
}
</style>
