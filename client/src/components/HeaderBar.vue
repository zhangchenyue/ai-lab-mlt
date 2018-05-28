<template>
    <div class="header-bar">
        <div class="header-bar-wrap">
            <div class="logo">
                <router-link :to="{ path: '/'}">
                    <img class="mlt-logo-img" src="../assets/mlt-logo.png">
                </router-link>
            </div>
            <div class="middle-menu hidden-sm-and-down">
                <el-menu menu-trigger="click hover" :default-active="activeIndex" class="el-menu-mlt el-menu-mlt-middle" mode="horizontal" @select="handleSelect" background-color="#2a2730" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="1">Home</el-menu-item>
                    <el-menu-item index="2">Tutorial</el-menu-item>
                    <el-menu-item index="3">Documents</el-menu-item>
                    <el-menu-item index="4">Blog</el-menu-item>
                    <el-menu-item index="5">Help Center</el-menu-item>
                    <el-menu-item index="6">Get Started</el-menu-item>
                </el-menu>
            </div>
            <el-button class="dropdown-menu-btn hidden-md-and-up" type="text" @click="showDropdownMenu = !showDropdownMenu">{{activePathName}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <div class="right-menu">
                <el-menu @open="showDropdownMenu=false" menu-trigger="click hover" :default-active="activeIndex" class="el-menu-mlt" mode="horizontal" @select="handleSelect" background-color="#2a2730" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item v-if="!profileName" index="7">Log In</el-menu-item>
                    <el-submenu v-if="!!profileName" index="8">
                        <template slot="title">
                            {{profileName}}
                            <img v-if="!profileImgSrc" class="profile-img" src="../assets/profile.jpg" alt="" srcset="">
                            <img v-if="!!profileImgSrc" class="profile-img" :src="profileImgSrc">
                        </template>
                        <el-menu-item v-if="profileName" index="11">My Account</el-menu-item>
                        <el-menu-item v-if="isAdmin" index="10">Admin Log</el-menu-item>
                        <el-menu-item index="9">Log Out</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
        <div class="dropdownmenu hidden-md-and-up" v-if="showDropdownMenu">
            <el-menu :default-active="activeIndex" class="el-menu-mlt-dropdown" @select="handleSelect" background-color="#2a2730" text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item index="1">Home</el-menu-item>
                <el-menu-item index="2">Tutorial</el-menu-item>
                <el-menu-item index="3">Documents</el-menu-item>
                <el-menu-item index="4">Blog</el-menu-item>
                <el-menu-item index="5">Help Center</el-menu-item>
                <el-menu-item index="6">Get Started</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HeaderBar',

    data() {
        return {
            activeIndex: '1',
            showDropdownMenu: false,
            activePathName: 'Menu'
        }
    },

    mounted() {
        this.handleRouteChange(this.$route.path);
    },

    computed: {
        profileName: function () {
            return this.$store.getters.user ? (this.$store.getters.user.displayName || this.$store.getters.user.displayname) : '';
        },

        isAdmin: function () {
            return this.$store.getters.user ? this.$store.getters.user.admin : false;
        },

        profileImgSrc: function () {
            if (this.$store.getters.user && this.$store.getters.user.employeeNumber) {
                return ' http://directory.slb.com/misc/pictures/' + this.$store.getters.user.employeeNumber + '.jpg';
            }
            return '';
        }
    },

    watch: {
        '$route'(route) {
            this.handleRouteChange(route.path);
        }
    },

    methods: {
        handleSelect(key, keyPath) {
            switch (parseInt(key)) {
                case 1:
                    this.$router.push('/home');
                    break;
                case 2:
                    this.$router.push('tutorial');
                    break;
                case 3:
                    this.$router.push('documents');
                    break;
                case 4:
                    this.$router.push('blog');
                    break;
                case 5:
                    this.$router.push('helpcenter');
                    break;
                case 6:
                    this.$router.push('data');
                    break;
                case 7:
                    this.$router.push('login');
                    break;
                case 9:
                    this.$store.dispatch('logOut');
                    this.$router.push('/');
                    break;
                case 10:
                    this.$router.push('/log');
                    break;
                case 11:
                    this.$router.push('/account');
                    break;
            }
            this.activeIndex = key;
            this.showDropdownMenu = false;
        },
        handleRouteChange(path) {
            switch (path) {
                case '/home':
                    this.activeIndex = '1';
                    break;
                case '/tutorial':
                    this.activeIndex = '2';
                    break;
                case '/documents':
                    this.activeIndex = '3';
                    break;
                case '/blog':
                    this.activeIndex = '4';
                    break;
                case '/helpcenter':
                    this.activeIndex = '5';
                    break;
                case '/login':
                    this.activeIndex = '7';
                    break;
                case '/data':
                    this.activeIndex = '6';
                    break;
                case '/logOut':
                    this.activeIndex = '9';
                    break;
                case '/log':
                    this.activeIndex = '10';
                    break;
                case '/account':
                    this.activeIndex = '11';
                    break;
            }
        }
    }
}
</script>

<style lang="scss">
$barHeight: 50px;
.header-bar-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-menu-mlt-dropdown {
  z-index: 10;
}

.mlt-logo-img {
  margin-top: 2px;
  margin-left: 10px;
  height: 40px;
  width: auto;
}

.el-menu {
  border: none;
}

.el-menu--horizontal {
  border: none;
  .el-menu-item,
  .el-submenu .el-submenu__title {
    height: $barHeight !important;
    line-height: $barHeight !important;
    border-bottom: none !important;
    min-width: auto !important;
    padding: 0 5px !important;
  }
  .el-submenu > .el-menu {
    top: 51px !important;
  }
}

.el-menu-mlt-middle {
  .el-menu-item,
  .el-submenu .el-submenu__title {
    margin-left: 50px !important;
  }
}

.profile-img {
  margin-left: 5px;
  height: 30px;
  width: auto;
  border-radius: 50%;
}

.dropdown-menu-btn {
  color: white !important;
  &:hover,
  &:focus {
    color: white !important;
  }
}
</style>
