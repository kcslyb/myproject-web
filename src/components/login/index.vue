<template>
  <div id="login-page" :style="'height: '+ defaultHeight +'px'" v-loading="loading">
    <div id="login-div-parent" align="center">
      <div id="login-div">
        <div id="responsive">
          <!--<img id="img" src=""/>-->
          <img id="img" :src="$REPLACEURL('../../../static/imagejpeg/100903072772911.jpg')"/>
        </div>
        <div class="el-main">
          <el-form :model="user" :rules="rules"  ref="user" label-width="100px" class="demo-ruleForm">
            <el-form-item label="username" prop="userName" align="center">
              <el-input v-model="user.userName" @keyup.enter.native="handleLogin('user')" placeholder="username" @focus="ishaver = true" @blur="ishaver = false"></el-input>
            </el-form-item>
            <el-form-item label="password" prop="userPassword" align="center">
              <el-input type="password" v-on:keyup.enter.native="handleLogin('user')" v-model="user.userPassword" placeholder="password" @focus="ishaver = true" @blur="ishaver = false"></el-input>
            </el-form-item>
            <el-row align="center">
              <el-button type="primary" style="width: 60%;padding: 10px" @click="handleLogin('user')">确 定</el-button>
              <el-button size="small" type="text" @click="addUer" align="left">注册</el-button>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @rightClose="rightClose" :default-with="true">
      <edit-form :title="formTitle"
                 @right-close="rightClose">
      </edit-form>
    </page-right>
  </div>
</template>
<script>
  import pageRight from '../common/self-pageright';
  import editForm from './from.vue';
  import {randomColor} from '@/utils/util';
  import {addOrEditLocalStorage, getLocalStorage} from '@/utils/localstorageutil';

  export default {
    name: 'login',
    components: {
      pageRight: pageRight,
      editForm: editForm
    },
    data() {
      return {
        action: '',
        rdmColor: (randomColor)(),
        defaultHeight: window.innerHeight ,
        showRight: false,
        formTitle: '',
        loading: false,
        centerDialogVisible: true,
        radio: '',
        user: {
          rememberMe: false,
          userName: '',
          userPassword: ''
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: ['blur', 'change']}
          ],
          userPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change']}
          ]
        },
      }
    },
    mounted () {
      this.setUserDate();
    },
    methods: {
      setUserDate() {
        let user = getLocalStorage('user');
        if (user) {
          this.user = user;
        }
      },
      handleLogin(user) {
        this.$refs[user].validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.user).then(data => {
              if (200 === data.status || '200' === data.status) {
                this.$router.push({path: '/'});
                addOrEditLocalStorage('user', this.user);
              } else {
                this.$message.error("账号/密码错误");
                this.loading = false;
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      addUer() {
        this.showRight = true;
        this.formTitle = '注册';
      },
      rightClose () {
        this.showRight = false;
      }
    }
  }
</script>
<style scoped>
  body {
    margin: 0;
    border: 0;
    padding: 0;
  }
  #login-div-parent{
    text-align: -webkit-center;
    padding-top: 200px;
  }

  #login-div{
    width: 28%;
    border: 1px solid #8abbfa;

  }

  #responsive{
    width: auto;
    height: 200px;
  }

  img {
    width: 100%;
    height: 100%;
  }

</style>
