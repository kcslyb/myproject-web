<template>
  <div>
    <div>
      <el-tabs type="border-card" tab-position="left" align="left">
        <el-tab-pane label="用户信息">
          <div>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="个人资料" name="1">
                <div style="height: 260px ; border: 1px solid #aaa; padding: 20px 30px 0 70px;">
                  <el-row :gutter="24">
                    <el-col :span="5">
                      <div>
<!--                        <img src="../../../static/9999.jpg" style="width: 200px; height: 200px;">-->
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <ul v-for="(item, index) of userMse" :key="index">
                        <li style="height: 30px; border-bottom: 1px solid #aaa" align="left">
                          <span>{{item.label}}</span><span class="text-info">:----></span><span class="text-danger">{{item.value}}</span>
                        </li>
                      </ul>
                    </el-col>
                    <el-col :span="7">
                      <div>

                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="安全设置">
          <div>
            <el-button type="text" @click="updateUser">修改密码</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="其它设置">
          <div>
            暂无其它
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <page-right :show="pageIsShow" @rightClose="resetRightBox">
      <self-from :dataForm="user"
                 @right-close="resetRightBox">
      </self-from>
    </page-right>
  </div>
</template>
<script>
  import pageRight from '../common/self-pageright.vue'
  import selfFrom from './selfInfofrom.vue';
  import {UserInfo} from '@/api/resources'
  export default {
    components: {
      selfFrom: selfFrom,
      pageRight: pageRight
    },
    props: ['userId'],
    data() {
      return {
        user: {},
        userInfo: {},
        userMse: [],
        action: '修改',
        pageIsShow: false,
        activeNames: ['1']
      };
    },
    mounted() {
      this.setUserMse();
    },
    watch: {
      userId() {
        this.setUserMse();
      }
    },
    methods: {
      resetRightBox() {
        this.pageIsShow = false;
        this.$emit('right-close');
      },
      async setUserMse () {
        if (!this.userId) {
          return '';
        }
        await UserInfo.getById(this.userId).then((res) => {
          this.user = res;
        });
        this.userMse = [];
        this.userMse.push({
          label: '用户名',
          value: this.user.userName
        });
        this.userMse.push({
          label: '用户角色',
          value: this.user.roleName
        });
        this.userMse.push({
          label: '用户号码',
          value: this.user.userPhone
        });
        this.userMse.push({
          label: '用户邮箱',
          value: this.user.userEmail
        });
      },
      updateUser() {
        this.pageIsShow = true;
      }
    }
  };
</script>

<style scoped>
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: left;
    line-height: 60px;
  }
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #e5e9f2;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .el-header {
    display: none;
  }
  @media screen and (max-width: 1129px) {
    .el-header {
      display: inline-block;
      padding: 0px;
    }
  }
  /*body > .el-container {*/
    /*margin-bottom: 40px;*/
  /*}*/
  /*.el-row {*/
    /*margin-bottom: 20px;*/
  /*&:last-child {*/
     /*margin-bottom: 0;*/
   /*}*/
  /*}*/
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
