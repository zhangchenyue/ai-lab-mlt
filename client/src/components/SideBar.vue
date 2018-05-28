<template>
  <div class="sidebar" :class="{horizon:isHorizon}" v-if="isValidPath">
    <div class="sidebar-menu">
      <router-link :to="{ path: 'data', query: $route.query}" class="sidebar-menu-item" :class="{active:$route.path==='/data'}">
        <img class="item-icon" src="../assets/icon-data.png">
        <div class="sidebar-menu-item-txt">Data</div>
      </router-link>
      <router-link :to="{ path: 'analysis', query: $route.query}" class="sidebar-menu-item" :class="{active:$route.path==='/analysis'}">
        <img class="item-icon" src="../assets/icon-analysis.png">
        <div class="sidebar-menu-item-txt">Analysis</div>
      </router-link>
      <router-link :to="{ path: 'model', query: $route.query}" class="sidebar-menu-item" :class="{active:$route.path==='/model'}">
        <img class="item-icon" src="../assets/icon-model.png">
        <div class="sidebar-menu-item-txt">Model</div>
      </router-link>
    </div>
  </div>
</template>

<script>
const validPaths = ['/data', '/analysis', '/model'];
export default {
  name: 'SideBar',

  data() {
    return {
      isOpened: false,
      isValidPath: false
    }
  },

  props: ['isHorizon'],

  watch: {
    '$route'(route) {
      this.isValidPath = validPaths.some(it => it === route.path);
    }
  },

  mounted() {
    this.isValidPath = validPaths.some(it => it === this.$route.path);
  },
  methods: {
    onSwitchClick() {
      this.isOpened = !this.isOpened;
    }
  }

}
</script>

<style lang='scss' scoped>
.sidebar {
  z-index: 1030;
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar-menu {
  box-sizing: border-box;
  border-right: 1px solid #e6e6e6;
  width: 50%;
  background: white;
  min-width: 70px;
}
.sidebar-menu-item {
  display: block;
  border-top: 1px solid #e6e6e6;
  transition: all 0.4s ease-in;
  color: grey;
  text-align: center;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
  }

  .sidebar-menu-item-txt {
    font-size: 0.9rem;
  }
}

.sidebar-menu-item:last-child {
  border-bottom: 1px solid #e6e6e6;
}
.item-icon {
  width: 40%;
  filter: grayscale(1);
  filter: gray;
}

.sidebar-menu-item.active {
  transition: all 0.2s ease-in;
  color: #409eff;
  background-color: #e6e6e6;
  .item-icon {
    filter: none;
  }
}

.sidebar.horizon {
  position: static;
  transform: translate(0, 0);
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .sidebar-menu {
    width: auto;
    display: flex;
    border-bottom: none;
    border-right: none;
  }

  .sidebar-menu-item {
    width: 80px;
    border-left: 1px solid #e6e6e6;
  }
  .sidebar-menu-item:last-child {
    border-right: 1px solid #e6e6e6;
  }
  .item-icon {
    height: 30px;
    width: auto;
  }
  .sidebar-menu-item-txt {
    font-size: 0.8rem;
  }
}
</style>
