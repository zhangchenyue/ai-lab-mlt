<template>
    <div class="login">
        <div class="login-img"><img src="../assets/login-logo.png" alt=""></div>
        <div class="login-title">
            <span class="login-title-text">Sign in(LDAP)</span>
            <el-tooltip class="item" effect="dark" content="Only support SLB LDAP account" placement="top-start">
                <span class="login-title-icon el-icon-warning"></span>
            </el-tooltip>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="login-ruleForm">
            <el-form-item label="Username" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <div class="agreement-text">
                <p>During the open beta test period, it is allowed to
                    <b> test only "PUBLIC" data</b>. Do not upload any data classified as "PRIVATE" or "CONFIDENTIAL". Due to security reasons, it is not allowed to test "CLIENTS" data in Machine Learning Toolkit.</p>
                <p>All the services on this website are compiled from multiple sources and are intended for informational purposes only. MLT has no responsibility or legal liability for the accuracy, completeness or usefulness of any information on this website.</p>
                <el-checkbox v-model="checkedAgree">I Agree</el-checkbox>
            </div>
            <el-form-item>
                <el-button :disabled="!checkedAgree" type="primary" @click="submitForm('ruleForm')" :loading="isLogining">Login</el-button>
                <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'Login',

    data() {
        return {
            returnUrl: '/home',
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: 'username could not be empty', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'password could not be empty', trigger: 'blur' }
                ]
            },
            isLogining: false,
            checkedAgree: false
        }
    },

    activated() {
        this.isLogining = false;
        this.checkedAgree = false;
        this.ruleForm.username = '';
        this.ruleForm.password = '';
        this.returnUrl = this.$route.query.returnUrl || this.returnUrl;
        if (this.returnUrl !== '/home') {
            this.$message({
                message: 'Please login first!',
                duration: 2000,
                center: true,
                type: 'warning'
            })
        }
    },

    watch: {
        '$store.getters.lastError': function (val) {
            if (!val.msg || val.type !== 'Login') {
                return;
            }
            this.isLogining = false;
        }
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isLogining = true;
                    this.$store.dispatch('logIn', { username: this.ruleForm.username, password: this.ruleForm.password, returnUrl: this.returnUrl, $router: this.$router })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  padding: 0 15px;
}
.login-ruleForm {
  max-width: 400px;
  margin: 0 auto;
}

.login-img {
  text-align: center;
  padding: 20px 0;
}

.login-title {
  padding: 20px 0;
  text-align: center;
}

.login-title-text {
  font-size: 1.5rem;
  font-weight: bold;
}
.agreement-text {
  font-size: 0.9em;
  padding: 5px 0;
}
</style>
