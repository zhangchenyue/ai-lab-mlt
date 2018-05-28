<template>
  <div id="app">
    <el-container>
      <el-header v-if="!isLanding" height="50px">
        <header-bar></header-bar>
      </el-header>
      <el-main>
        <side-bar class="left-side hidden-md-and-down"></side-bar>
        <div class="right-side">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </div>
      </el-main>
      <el-footer v-if="!isLanding" height="auto">
        <side-bar class="hidden-lg-and-up" :isHorizon="true"></side-bar>
        <footer-docs></footer-docs>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HeaderBar from '@/components/HeaderBar';
import SideBar from '@/components/SideBar';
import FooterDocs from '@/components/FooterDocs';

export default {
  name: 'app',

  components: {
    HeaderBar,
    SideBar,
    FooterDocs
  },

  data() {
    return {
      isLanding: false
    }
  },

  computed: {
    ...mapGetters([
      'lastError'
    ])
  },

  watch: {
    'lastError': function (val) {
      if (!val || !val.msg) {
        return;
      }

      if (val.type !== 'Login' && val.msg.response.status === 401) {
        window.location.reload();
        return;
      }

      let errMsg = '';
      if (val.type === 'Login') {
        errMsg = val.msg;
      } else {
        errMsg = typeof (val.msg.response.data) === 'string' ? val.msg.response.data : (val.msg.message || val.msg);
      }

      this.$message({ message: errMsg, duration: 3000, center: true, type: 'error', showClose: true });
      this.$bus.emit(this.$bus.E_ERROR, val.msg.message || val.msg);
    },

    '$route': function (r) {
      this.isLanding = (r.path === '/');
    }
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.$bus.emit(this.$bus.E_WINDOW_RESIZE);
    })
    this.isLanding = (this.$route.path === '/');
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.el-main {
  display: flex;
  padding: 0 !important;
}

.el-container {
  height: 100%;
}

.el-container.is-vertical {
  overflow: hidden;
}

.el-header,
.el-footer {
  position: relative;
  padding: 0 !important;
}

.el-header {
  background-color: #2a2730;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0.1;
}

.left-side {
  width: calc(50% - 600px);
}

.right-side {
  width: 100%;
  overflow-x: hidden;
}
</style>
