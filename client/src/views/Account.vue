<template>
    <div class="account">
        <h1>My Account</h1>
        <h3>{{ msg }}</h3>
    </div>
</template>

<script>
export default {
    name: 'Account',
    data() {
        return {
            msg: 'To be continue ....'
        }
    }
}
</script>

<style lang="scss" scoped>
.account {
    text-align: center;
  h3 {
    font-weight: normal;
    color: #42b983;
  }
}
</style>
