<template>
  <el-main>
    <el-form :model="userDto" status-icon :rules="rules" ref="userDto"
             label-position="left"
             label-width="100px"
             style="width: 400px"
             class="demo-ruleForm">
      <el-form-item
        prop="userName"
        label="用户名"
        :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
        ]"
      >
        <el-input v-model="userDto.userName"></el-input>
      </el-form-item>
      <el-form-item
        prop="userPhone"
        label="用户号码"
        :rules="[
            { required: true, message: '请输入号码', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入正确的号码', trigger: ['blur', 'change'] }
        ]"
      >
        <el-input v-model="userDto.userPhone"></el-input>
      </el-form-item>
      <el-form-item
        prop="userEmail"
        label="用户邮箱"
        :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]"
      >
        <el-input v-model="userDto.userEmail"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
        <el-input type="password" v-model="userDto.userPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="userDto.checkPass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('userDto')">提交</el-button>
        <el-button @click="resetForm('userDto')">重置</el-button>
        <el-button @click="closePage">取消</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
  export default {
    name: 'selffrom',
    props: {
      dataForm: {
        type: Object,
        default: () =>{}
      }
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.userDto.checkPass !== '') {
            this.$refs.userDto.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userDto.userPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        userDto: {
          uuid: '',
          userName: '',
          userPhone: '',
          userEmail: '',
          userPassword: '',
          checkPass: ''
        },
        ruleForm2: {
          pass: '',
          checkPass: '',
        },
        rules: {
          userPassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },
    mounted() {
      this.setUserMse();
    },
    watch: {
      dataForm() {
        this.setUserMse();
      }
    },
    methods: {
      setUserMse() {
        this.userDto.uuid = this.dataForm.uuid;
        this.userDto.userName = this.dataForm.userName;
        this.userDto.userPhone = this.dataForm.userPhone;
        this.userDto.userEmail = this.dataForm.userEmail;
      },
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = JSON.parse(JSON.stringify(_this.userDto));
            _this.$http.put(_this.HOST + '/user/current/' + _this.userDto.uuid, formData).then((res) => {
              if (res.data.returnCode){
                _this.$notify.error({
                  duration: 5000,
                  name: '失败',
                  message: res.data.returnMsg
                });
              }else {
                _this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '更改"' + _this.userDto.userName + '"成功'
                });
              }
              _this.$store.dispatch('LogOut', this.user).then(() => {
                _this.$store.dispatch('FedLogOut', this.user).then(() => {
                });
                location.reload();
              }).catch(() => {
              });
              _this.$emit('right-close');
            }).catch(() => {
              _this.$notify.error({
                duration: 2000,
                message: '更改"' + _this.userDto.userName + '"失败'
              });
            });
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      closePage(){
        this.$emit('right-close');
      }
    }
  };
</script>

<style scoped>

</style>
