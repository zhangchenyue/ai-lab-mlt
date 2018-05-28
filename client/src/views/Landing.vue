<template>
  <div class="landing">
    <div class="landing-top">
      <div class="bk-img hidden-sm-and-down">
        <img class="landing-bk-img1" src="../assets/bball.png">
      </div>
      <img class="landing-logo-img" src="../assets/mlt-logo.png">
      <div class="landing-subTitle">Machine Learning Toolkit</div>
      <div class="landing-subsubTitle">Bring you to AI World!</div>
      <div class="landing-btn-groups">
        <el-button type="success" round @click="$router.push('/home')" icon="el-icon-d-arrow-right">Home</el-button>
        <el-button type="warning" round @click="$router.push('/tutorial')" icon="el-icon-view">Tutorial</el-button>
      </div>

    </div>
    <div ref="landingChartContainer" class="landing-bottom" @mousemove="onMousemove"></div>
    <img class="landing-bk-img2" src="../assets/cross-platform.png">
    <img class="landing-bk-img3 hidden-sm-and-down" :src="bkImg3Src">
  </div>
</template>

<script>
const SEPARATION = 100;
const AMOUNTX = 50;
const AMOUNTY = 50;
export default {
  name: 'Landing',
  data() {
    return {
      camera: null,
      renderer: null,
      scene: null,
      material: null,
      count: 0,
      mouseX: 0,
      mouseY: 0,
      particles: [],
      bkImg3Src: '/static/gear.gif'
    }
  },
  mounted: function () {
    setTimeout(() => {
      this.init();
      this.animate();
    }, 300);
    this.$bus.on(this.$bus.E_WINDOW_RESIZE, () => {
      if (!this.camera || !this.renderer) {
        return;
      }
      this.camera.aspect = this.$refs.landingChartContainer.clientWidth / this.$refs.landingChartContainer.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.$refs.landingChartContainer.clientWidth, this.$refs.landingChartContainer.clientHeight);
    });
  },
  methods: {
    init: function () {
      let THREE = this.THREE;
      this.camera = new THREE.PerspectiveCamera(75, this.$refs.landingChartContainer.clientWidth / this.$refs.landingChartContainer.clientHeight, 1, 10000);
      this.camera.position.z = 1000;
      this.scene = new THREE.Scene();
      let PI2 = Math.PI * 2;
      this.material = new THREE.ParticleCanvasMaterial({
        color: 0xfad9d3,
        program: function (context) {
          // context.drawImage(img,0,0,2,2);
          context.beginPath();
          context.arc(0, 0, 1, 0, PI2, true);
          context.fill();
        }
      });
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          let particle = this.particles[i++] = new THREE.Particle(this.material);
          particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          this.scene.add(particle);
        }
      }
      this.renderer = new THREE.CanvasRenderer();
      this.renderer.setSize(this.$refs.landingChartContainer.clientWidth, this.$refs.landingChartContainer.clientHeight);
      this.$refs.landingChartContainer.appendChild(this.renderer.domElement);
    },

    render: function () {
      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
      this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
      this.camera.lookAt(this.scene.position);
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          let particle = this.particles[i++];
          particle.position.y = (Math.sin((ix + this.count) * 0.3) * 50) + (Math.sin((iy + this.count) * 0.5) * 50);
          particle.scale.x = particle.scale.y = (Math.sin((ix + this.count) * 0.3) + 1) * 2 + (Math.sin((iy + this.count) * 0.5) + 1) * 2;
        }
      }
      this.renderer.render(this.scene, this.camera);
      this.count += 0.2;
    },

    animate: function () {
      window.requestAnimationFrame(this.animate.bind(this));
      this.render();
    },

    onMousemove: function (evt) {
      this.mouseX = evt.offsetX;
      this.mouseY = evt.offsetY;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.landing {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: white;
  background: radial-gradient(#aad1fc, #3b89ff);

  .landing-top {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60%;

    .bk-img {
      position: absolute;
      top: 20%;
      bottom: 0;
      left: 0;
      opacity: 0.2;
      img {
        max-height: 50%;
        transform: rotateZ(-45deg);
      }
    }
  }

  .landing-logo-img {
    max-height: 50%;
    max-width: 90%;
  }

  .landing-subTitle {
    color: gold;
    font-size: 3vh;
    text-shadow: 1px 1px 1px black;
    font-family: CURSIVE;
  }

  .landing-btn-groups {
    display: flex;
    button {
      margin: 25px;
    }
    z-index: 99;
  }

  .landing-bottom {
    position: absolute;
    top: 60%;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .landing-bk-img2 {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: auto;
    transform: translateX(-50%);
    opacity: 0.2;
    height: 50%;
  }
  .landing-bk-img3{
    position: absolute;
    transform: rotateZ(45deg);
    top: 10%;
    right: 5%;
    width: auto;
    opacity: 0.2;
    height: 23%;
  }
  .landing-subsubTitle {
    color: ghostwhite;
    margin-top: 10px;
  }
}
</style>
