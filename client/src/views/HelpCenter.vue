<template>
    <div class="help-center">
        <div class="content">
            <div class="help-center-logo-img"><img src="../assets/help-center-logo.png" alt=""></div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="Subject" prop="subject">
                    <el-input v-model="ruleForm.subject"></el-input>
                </el-form-item>
                <el-form-item label="Comments" prop="comments">
                    <el-input class="comments-area" type="textarea" :rows="10" placeholder="input comments" v-model="ruleForm.comments"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">Send Mail</el-button>
                    <el-button @click="resetForm('ruleForm')">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelpCenter',

    data() {
        return {
            ruleForm: {
                subject: '',
                comments: ''
            },
            rules: {
                subject: [
                    { required: true, message: 'Please input your subject', trigger: 'blur' }
                ],
                comments: [
                    { required: true, message: 'Please input your comments', trigger: 'blur' }
                ]
            }
        }
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var recipient = 'dawnmoon';
                    var at = String.fromCharCode(64);
                    var dotcom = '126.com';
                    var mail = 'mailto:';
                    let mailURL = mail + recipient + at + dotcom + '?subject=' + encodeURIComponent('sadsad') + '&body=' + encodeURIComponent('asdsa');
                    window.open(mailURL);
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
<style lang="scss" scoped>
.help-center {
  margin: 20px auto;
  display: flex;
  justify-content: center;
}

.content {
  width: 100%;
  padding: 0 20px;
  max-width: 1200px;
}

.help-center-logo-img {
  max-width: 400px;
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
