<template>
  <div :style="'height: '+ defaultHeight +'px; background-color: rgba(0, 0, 0, 0.4)'">
    <div id="content">
      <div id="user-avatar">
        <img :src="$REPLACEURL(user.userAvatar)">
      </div>
      <h3 class="user-tile">{{user.userName}}</h3>
      <ul class="user-ul">
        <li class="user-ul-li"><span>姓名:</span>{{user.userName}}</li>
        <li class="user-ul-li"><span>等级:</span>{{user.userDepartmentName}}</li>
        <li class="user-ul-li"><span>角色:</span>{{user.userRoleName}}</li>
        <li class="user-ul-li"><span>电话:</span>{{user.userPhone}}</li>
        <li class="user-ul-li"><span>邮箱:</span>{{user.userEmail}}</li>
      </ul>
      <div class="user-total">
        <div class="user-total-title">士不可以不弘毅 任重而道远</div>
        <div class="user-total-thor">------{{user.userName}}</div>
      </div>
    </div>
    <page-right :show="pageIsShow" @rightClose="resetRightBox">
      <self-from :dataForm="user"
                 @right-close="resetRightBox">
      </self-from>
    </page-right>
  </div>
</template>
<script>
  import pageRight from '../../../common/self-pageright.vue'
  import selfFrom from './userInfofrom.vue';
  import {UserAccount} from '@/api/resources'
  export default {
    components: {
      selfFrom: selfFrom,
      pageRight: pageRight
    },
    props: ['userId'],
    data() {
      return {
        defaultHeight: window.innerHeight,
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
      setUserMse () {
        if (!this.userId) {
          return '';
        }
        this.$api.get('api/user/account?id=' + this.userId).then((res) => {
          this.user = res;
        });
      },
      updateUser() {
        this.pageIsShow = true;
      }
    }
  };
</script>

<style scoped>
  #user-avatar{
    -webkit-filter: blur(0px);
    -moz-filter: blur(0px);
    -o-filter: blur(0px);
    -ms-filter: blur(0px);
    filter: blur(0px);
  }
  #user-avatar img {
    position: absolute;
    top: 110px;
    left: 12%;
    height: 260px;
    width: 34%;
  }
  #content {
    position: absolute;
    top: 10%;
    right: 10%;
    height: 80%;
    width: 80%;
    text-align: center;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .user-tile{
    font-size: 1.8em;
    color: #e6e6e6;
    line-height: 60px;
  }
  .user-ul-li {
    width: 100%;
    text-align: left;
    font-size: 1.2em;
    line-height: 50px;
  }
  .user-ul{
    position: absolute;
    right: 18%;
  }
  .user-ul-li span{
    margin-right: 30px;
  }
  .user-total{
    position: absolute;
    bottom: 65px;
    width: 80%;
  }
  .user-total .user-total-title{
    position: absolute;
    left: 15%;
    text-align: center;
    font-size: 1.5em;
  }
  .user-total .user-total-thor{
    margin-top: 40px;
    position: absolute;
    right: 0px;
    text-align: right;
    display: inline-flex;
  }
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
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
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
