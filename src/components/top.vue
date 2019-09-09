<template>
  <el-container>
    <el-header style="background-color: #ffffff">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#ffd04b">
        <el-row :gutter="24">
          <el-col :span="2">
            <div class="grid-content">
              <div>
<!--                <img width="auto" height="50px" src="../../static/121.png"/>-->
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple nowtime" align="center">
              <el-col style="margin-top: 15px; ">{{$moment().format('YYYY-MM-D dddd a')}}</el-col>
            </div>
          </el-col>
          <el-col :span="1">
            <div style="margin-top: 15px">
              <perm :label="labelPerm">
                <el-switch
                  v-model="music"
                  active-color="#C0CCDA"
                  inactive-color="#409EFF"
                  active-value="no"
                  inactive-value="play-manage">
                </el-switch>
              </perm>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content">
              <perm :label="music">
                <div style="margin-top: 5px">
                  <el-button type="text" @click="prev"><i class="el-icon-caret-left"></i>上一曲</el-button>
                  <el-button type="text" @click="play">暂停/播放</el-button>
                  <el-button type="text" @click="next">下一曲<i class="el-icon-caret-right"></i></el-button>
                </div>
              </perm>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <perm :label="music">
                <audio ref="audio"
                       :volume="0.2"
                       @timeupdate="onTimeUpdate"
                       @ended="forList"
                       :src="src">
                </audio>
                <div style="margin-top: 20px">
                  <el-progress :text-inside="true" :stroke-width=6 :percentage="cTime"></el-progress>
                </div>
              </perm>
            </div>
          </el-col>
          <el-col :span="1">
            <div style="margin-top: 12px">
              <perm label="play-manage">
                <div v-if="infoNumber > 0">
                  <el-badge :value="infoNumber" class="item">
                    <el-button type="primary" plain size="small" icon="el-icon-message" circle @click="showDialogueMeth"></el-button>
                  </el-badge>
                </div>
                <div v-else>
                  <el-button type="primary" plain size="small" icon="el-icon-message" circle @click="showDialogueMeth"></el-button>
                </div>
              </perm>
            </div>
          </el-col>
          <el-col :span="1">
            <div style="margin-top: 12px">
              <perm label="play-manage">
                <router-link :to="{path: '/play'}" tag="li" append><el-button type="primary" icon="el-icon-view" size="small" plain circle></el-button></router-link>
              </perm>
            </div>
          </el-col>
          <el-col :span="1">
            <div style="margin-top: 12px">
              <perm label="encryption-manage">
                <el-button type="primary" plain size="small" icon="el-icon-refresh" circle @click="openEncryption"></el-button>
              </perm>
            </div>
          </el-col>
          <el-col :span="1" style="float: right">
            <div>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <img style="margin-top: 12px" class="avatar" :src="$REPLACEURL($store.state.user.avatar)"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button type="text" @click="showUserInfo">{{$store.state.user.userName}}</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" @click="logout">退出登录</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-menu>
    </el-header>
    <div class="page-right-wrap" v-show="showInfo" @click="rightClose">
      <div class="page-right-part lightBox" @click.stop="" ref="pageRightPart" style="width: 70%">
        <div class="page-right-main"
             :style="'background-image: url('+ ($REPLACEURL(user.avatar)) +'); height: '+ infoHeight +'px;'">
        </div>
        <user-info :userId="user.userId"></user-info>
      </div>
    </div>
    <page-right :show="showDialogue" @rightClose="resetRightDialogue">
      <news
        :show="showDialogue"
        :number="infoNumber"
        @addition="addition"
        @subtraction="subtraction"
        @right-close="resetRightDialogue">
      </news>
    </page-right>
    <page-right :show="showEncryption" @rightClose="resetRightDialogue" :css="{'width': '600px'}">
      <encryption @rightClose="resetRightDialogue"></encryption>
    </page-right>
    <el-container>
      <el-aside id="aside" :style="'border-right: 2px solid #e6e6e6; width:' +asideWidth+'px; overflow-x: hidden; overflow-y: scroll; height: '+ bodyHeight + 'px;'">
        <!--导航菜单-折叠功能-->
        <div :class="collapsed">
          <!--单个激活 并以 index 作为 path 进行路由跳转-->
          <el-menu unique-opened router v-show="!collapsed" style="border: 0">
            <!--动态路由到子组件 将不可见的路径隐藏-->
            <template v-for=" (item, index) in routers">
              <el-submenu :key="item.id" :index="index+'1'" v-if="item.children">
                <!--用el ui 的title进行solt分发菜单-->
                <template slot="title">
                  <div>
                    <i :class="item.meta.icon"></i>
                    {{item.meta.title}}
                  </div>
                </template>
                <!--item.name和item.children.name来配置菜单栏和子菜单栏的名称-->
                <el-menu-item align="center" v-for="child in item.children" :index="child.path" :key="child.id" :class="{'is-selected-color': currentPath === child.path}">
                  {{child.meta.title}}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-main id="page-main" :style="'height: ' +bodyHeight+ 'px'">
        <el-row style="padding: 10px; background-color: #fff; margin-bottom: 5px">
          <el-col :span="24">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <template v-for="(item, index) of crumb">
                <el-breadcrumb-item :key="index" :to=item.path>{{item.label}}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </el-col>
        </el-row>
        <div id="code-main" style="background-color: #fff; padding-top: 10px;">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import perm from './common/self-perm.vue';
  import ElPager from 'element-ui/packages/pagination/src/pager';
  import PageRight from './common/self-pageright';
  import News from './test/news';
  import userInfo from './account/user/info/userInfo';
  import Encryption from './message/encryption';
  export default {
    name: 'top',
    components: {
      Encryption,
      News,
      PageRight,
      userInfo,
      perm: perm
    },
    data() {
      return {
        showInfo: false,
        showEncryption: false,
        user: this.$store.state.user,
        infoHeight: window.innerHeight,
        showDialogue: false,
        currentPath: '/home',
        crumb: [],
        base: {
          to: '',
          label: '首页'
        },
        baseCrumb: {
          to: '',
          label: '主页'
        },
        routers: [],
        infoNumber: 0,
        collapsed: false,
        centerDialogVisible: false,
        nowTime: '',
        list: [
          'https://music.163.com/song/media/outer/url?id=450424527.mp3',
          'https://music.163.com/song/media/outer/url?id=557581284.mp3',
          'https://music.163.com/song/media/outer/url?id=452986458.mp3',
          'https://music.163.com/song/media/outer/url?id=1324667958.mp3'
        ],//歌曲数组
        index: 3,//当前歌曲下标
        audio: {
          // 该字段是音频是否处于播放状态的属性
          playing: false,
          // 音频当前播放时长
          currentTime: 0,
          // 音频最大播放时长
          maxTime: 0
        },
        music: 'no',
        avatar: '../../static/1540455103.jpg',
        labelPerm: 'play-manage'
      };
    },
    mounted() {
      this.nowTimes();
      this.setBodyHeight();
    },
    computed: {
      bodyHeight() {
        let height = parseInt(this.$store.state.app.bodyHeight, 10);
        height = (height - 60);
        return height;
      },
      asideWidth() {
        let asideWidth = parseInt(this.$store.state.app.windowSize.width, 10);
        asideWidth = (asideWidth/8);
        return asideWidth;
      },
      src() {
        return this.list[this.index]; // 当前播放歌曲
      },
      cTime() {
        let temp = 0;
        if (this.audio.currentTime && this.audio.maxTime) {
          temp = this.audio.currentTime * 100 / this.audio.maxTime;
          if (temp < 0) {
            temp = 0;
          }
          return temp > 100 ? 100 : temp;
        } else {
          return temp = 0;
        }
      },
    },
    watch: {
      $route(to, from) {
        // console.log( from.path +'--->'+ to.path );
        this.currentPath = to.path;
        this.setCrumb(to.path);
      }
    },
    methods: {
      setBodyHeight: function () {
        this.$store.commit('SET_BODY_HEIGHT', {
          height: window.innerHeight,
          window: {width: window.innerWidth, height: window.innerHeight}
        });
      },
      showUserInfo() {
        this.showInfo = true;
      },
      rightClose() {
        this.showInfo = false;
      },
      logout() {
        let _this = this;
        _this.$store.dispatch('LogOut', this.user).then(() => {
          _this.$store.dispatch('FedLogOut', this.user).then(() => {
          });
          location.reload();
        }).catch(() => {
        });
      },
      setCrumb(path) {
        this.crumb = [];
        let relUrl = path;
        let menus = this.$store.state.permission.addRouters;
        this.crumb.push(this.base);
        menus.forEach(value => {
          if (value.children) {
            value.children.forEach(val => {
              if (val.path === relUrl) {
                this.base.label = value.meta.title;
                this.baseCrumb.label = val.meta.title;
                this.baseCrumb.to = val.path;
                this.crumb.push(this.baseCrumb);
              }
            });
          }
        });
      },
      nowTimes() {
        this.nowTime = this.$nowDateTime();
        this.crumb.push(this.base);
        this.crumb.push(this.baseCrumb);
      },
      prev() {//上一曲
        let index = this.index - 1;
        if (index < 0) {
          index = this.list.length - 1;
        }
        this.index = index;
        this.$nextTick(() => this.$refs.audio.play());
      },
      play() {//暂停/播放
        this.$nextTick(() => this.$refs.audio.paused ? this.$refs.audio.play() : this.$refs.audio.pause());
      },
      next() {//下一曲
        let index = this.index + 1;
        if (index === this.list.length) {
          index = 0;
        }
        this.index = index;
        this.$nextTick(() => this.$refs.audio.play());
      },
      onTimeUpdate(res) {
        if (this.audio.maxTime === 0) {
          this.audio.maxTime = res.target.duration;
        }
        this.audio.currentTime = res.target.currentTime;
      },
      forList() {
        this.next();
      },
      resetRightDialogue() {
        this.showEncryption = false;
        this.showDialogue = false;
      },
      showDialogueMeth() {
        this.showDialogue = true;
      },
      openEncryption() {
        this.showEncryption = true;
      },
      addition (value) {
        this.infoNumber = this.infoNumber + value;
      },
      subtraction(value) {
        this.infoNumber = this.infoNumber - value;
      }
    },
    created() {
      this.routers = this.$store.state.permission.addRouters;

    }
  };
</script>

<style scoped lang="scss">
  @import "../assets/main";
  #aside::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  #aside {
    background-color: #ffffff;
  }

  #page-main {
    padding: 0 20px 0 20px;
  }
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .page-component-up {
    display: none;
    background-color: #fff;
    position: fixed;
    left: -15px;
    top: 30px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    transition: .3s;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    z-index: 5;
  }

  #elheader {
    margin-top: -9px;
    background: #e5e9f2;
  }

  #eldropdown {
    display: none;
    float: right;
  }

  @media screen and (max-width: 1163px) {
    .nowtime {
      width: 200px;
      margin-left: 100px;
      display: none;
    }

    #elswitch {
      display: none;
    }
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width:12px;
  }
</style>
