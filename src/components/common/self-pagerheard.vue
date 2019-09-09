<template>
<el-header>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    active-text-color="#fff">
    <el-row :gutter="24">
      <el-col :span="2">
        <div class="grid-content">
          <div>
<!--            <img width="auto" height="50px" src="../../../static/121.png"/>-->
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple nowtime" align="center">
          <el-col style="margin-top: 15px; ">{{$moment().format('YYYY-MM-D dddd a')}}</el-col>
        </div>
      </el-col>
      <el-col :span="1">
        <router-link :to="{path: '/home'}" tag="li" append>
          <el-button size="small" type="primary" circle plain style="margin-top: 14px;">首页</el-button>
        </router-link>
      </el-col>
      <el-col :span="1" style="float: right">
        <div class="grid-content">
          <div class="avatar">
            <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button size="small" type="primary" plain round style=" height: 30px; width: 30px ; margin-top: 12px; border-radius: 20px ;padding: 0">{{$store.state.user.userName}}</el-button>
                    <!--<img style="height: 50px; width: 50px ; border-radius: 25px; margin-top: 5px" :src="avatar"/>-->
                  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link :to="{path: '/user/info/' + $store.state.user.userId}" tag="li" append><el-button type="text">个人信息</el-button></router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text" @click="logout">退出登录</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-menu>
</el-header>
</template>

<script>
  export default {
    name: 'CustomHeard',
    props: {
      menuList: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      logout() {
        let _this = this;
        _this.$store.dispatch('LogOut', this.user).then(() => {
          _this.$store.dispatch('FedLogOut', this.user).then(() => {
          });
          location.reload();
        }).catch(() => {
        });
      },
    }
  };
</script>

<style scoped>

</style>
