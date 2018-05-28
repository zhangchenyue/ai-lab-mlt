<template>
    <div class="blog" ref="blogContainer" v-loading='isLoading' element-loading-text='loading' element-loading-spinner='el-icon-loading' element-loading-background='rgba(0, 0, 0, 0.6)'>
        <iframe id="show-iframe" frameborder=0 name="microsoft blog" scrolling='yes' :src="blogUrl"></iframe>
    </div>
</template>

<script>
export default {
    name: 'blog',

    data() {
        return {
            blogUrl: 'https://blogs.technet.microsoft.com/machinelearning',
            oIframe: null,
            isLoading: false
        }
    },

    mounted() {
        this.oIframe = document.getElementById('show-iframe');
        this.oIframe.style.width = '100%';
        this.oIframe.style.height = this.$refs.blogContainer.clientHeight - 5 + 'px';
        window.addEventListener('resize', () => {
            this.oIframe.style.height = this.$refs.blogContainer.clientHeight - 5 + 'px';
        })
    },

    activated() {
        this.isLoading = true;
        this.oIframe.style.width = '100%';
        if (this.oIframe.attachEvent) {
            this.oIframe.onreadystatechange = () => {
                if (this.readyState === 'complete') {
                    this.isLoading = false;
                }
            }
        } else {
            this.oIframe.onload = () => {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.blog {
  height: 100%;
}
</style>