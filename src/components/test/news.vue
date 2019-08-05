<template>
  <div>
    <el-header style="border-bottom: 1px solid #eee;">
      <div>
        <el-button type="text" style="color: #aaa">搜索联系人：</el-button>
        <el-input
          size="small"
          style="width: 280px;"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="filterValue">
        </el-input>
      </div>
    </el-header>
    <el-container>
      <el-aside :style="'width: 150px; border: 1px solid #e6e6e6; height: ' +asideHeight+ 'px'">
        <div id="news-aside" class="clearFlix">
          <ul class="user" v-for="user of filterUsers" :key="user.userId">
            <li @click="setMessage(user)" style="border: 1px solid #e6e6e6">
              <div>
                <img class="pic-left" :src="$REPLACEURL(user.headPortrait)">
                <el-button type="text" style="color: #000">{{user.userName}}</el-button>
                <el-tag size="mini" v-show="user.userId === $store.state.user.userId">self</el-tag>
                <el-badge v-show="user.noticeNumber > 0" :value="user.noticeNumber"><i class="el-icon-loading"></i></el-badge>
              </div>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-container>
        <div>
          <div align="center"><span>{{other}}</span></div>
          <div id="container" class="clearfix" :style="'height: ' +bodyHeight+ 'px'"> <!-- 对话总框 -->
            <template v-for="(mesage, index) of msgList">
              <div class="message clearfix" :key="index" v-if="mesage.msgSender === msg.msgSender"> <!-- 每条对话总框 -->
                <img class="pic" :src="$REPLACEURL($store.state.user.avatar)">
                <div class="text-style">
                  <div class="pos">
                    <div><span style="color: #000">{{self}}</span></div>
                    <div class="bubbleSelf">
                      <div class="plain">{{mesage.msgContent}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="message clearfix" :key="index" v-else> <!-- 每条对话总框 -->
                <img class="pic-left" :src="$REPLACEURL(otherAvatar)">
                <div class="text-style-left">
                  <div class="pos-left">
                    <div><span>{{other}}</span></div>
                    <div class="bubbleOther">
                      <div class="plain">{{mesage.msgContent}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <el-footer style="border-top: 1px solid #eee; padding-top: 30px;">
          <el-row :gutter="24">
            <el-col :span="20">
              <el-input
                style="width: 400px;"
                size="small"
                type="textarea"
                @keyup.enter.native="sendMessage()"
                placeholder="请输入内容"
                v-model="msg.msgContent">
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" plain @click="sendMessage()">发送</el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>

  export default {
    name: 'news',
    props: {
      number: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        websocket: null,
        title: '',
        other: '',
        otherAvatar: '',
        self: '',
        msgList: [],
        userList: [],
        filterValue: '',
        filterUsers: [],
        timer: null,
        msg: {
          msgSender: this.$store.state.user.userId,
          msgReceiver: '',
          msgContent: ''
        },
        tMsg: {
          msgSender: this.$store.state.user.userId,
          msgReceiver: '',
          start: 0,
          limit: 6
        }
      };
    },
    created() {
      this.initWebSocket();
    },
    computed: {
      bodyHeight() {
        let height = parseInt(this.$store.state.app.bodyHeight, 10);
        height = (height / 2);
        return height;
      },
      asideHeight() {
        let height = parseInt(this.$store.state.app.bodyHeight, 10);
        height = (height - 100);
        return height;
      }
    },
    mounted() {
      this.getUserList();
    },
    destroyed(){//实例销毁之后被调用，一般情况下，在页面切换路由时，会自动销毁组件，
      this.websocket.close() // 离开路由之后断开websocket连接
    },
    watch: {
      filterValue(val, oldVal) {
        if (val !== '' && this.filterValue !== '') {
          this.filterUserList(val);
        }
        if (val === '') {
          this.filterUsers = this.userList;
        }
      }
    },
    methods: {
      initWebSocket(){ // 初始化websocket
        this.websocket = (this.$socket)();
        this.websocket.onmessage = (msg) =>{
          let data = JSON.parse(msg.data);
          this.$notify({
            title: data.msgSender,
            type: 'success',
            message: data.msgContent
          });
          this.userList = this.userList.map(value => {
            if (value.userName === data.msgSender) {
              value.noticeNumber += 1;
            }
          });
          this.$emit('addition', 1);
        };
      },
      getUserList() {
        let url = this.$HOST + '/msg/query';
        this.$api.get(url).then((res) => {
          this.userList = res;
          this.filterUsers = res;
        })
      },
      filterUserList(val) {
        this.filterUsers = this.userList.filter(value => {
          return value.userName.indexOf(val) > -1;
        });
      },
      setMessage(user) {
        this.msg.msgReceiver = user.userId;
        this.tMsg.msgReceiver = user.userId;
        this.msg.msgContent = '';
        this.other = user.userName;
        this.otherAvatar = user.headPortrait;
        this.self = this.$store.state.user.userName;
        this.findMessage(user);
        this.$emit('subtraction', user.noticeNumber)
      },
      findMessage(user) {
        let formDate = JSON.parse(JSON.stringify(this.tMsg));
        let url = this.$HOST + '/msg/list';
        this.$api.post(url, formDate).then((res) => {
          if (res) {
            this.msgList = res.msgs;
          }else {
            this.msgList = [];
          }
          if (user.noticeNumber > 0) {
            this.updateMsgStatus(user.userId);
          }
        }).catch(() => {
        });
      },
      updateMsgStatus(userId) {
        let url = this.$HOST + '/msg/' + userId + '/edit';
        this.$api.post(url).then(() => {
          this.getUserList();
        }).catch(() => {});
      },
      sendMessage() {
        this.websocket.send(JSON.stringify(this.msg));
        this.msgList.push(JSON.parse(JSON.stringify(this.msg)));
        this.msg.msgContent = '';
      }
    }
  };
</script>

<style scoped>
  .clearFlix {
    display: block;
    height: 500px;
    zoom: 1;
    overflow-x: hidden;
  }

  .clearfix {
    display: block;
    zoom: 1;
    overflow-x: hidden;
    /*overflow-y: scroll*/
  }

  #container {
    height: 500px;
    width: 500px;
    border: 1px solid #eee;
    overflow-y: auto;

  }

  .user {
    display: block;
    padding: 0px;
    margin: 0px;
  }

  .user li {
    cursor: pointer;
    padding: 10px 0 10px 10px;
  }

  .user li:hover {
    background-color: #eee;
  }

  .user li img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  .message {
    margin-bottom: 10px;
  }

  .content-time {
    text-align: center;
    margin: 10px auto;
  }

  .content-time-span {
    display: block;
    text-align: center;
    color: #aaa;
  }

  .pic {
    float: right;
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }

  .pic-left {
    float: left;
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }

  .text-style {
    text-align: right;
  }

  .text-style-left {
    text-align: left;
  }

  .pos, .pos-left {
    margin: 0 10px;
    display: inline-block;
    position: relative;
  }

  .pos:after {
    content: "";
    position: absolute;
    top: 20px;
    left: 100%;
    border-top: 5px solid transparent;
    border-left: 6px solid #edf5fe;
    border-bottom: 5px solid transparent;
  }

  .bubbleSelf {
    text-align: left;
    max-width: 400px;
    min-height: 40px;
    display: inline-block;
    vertical-align: top;
    background: #edf5fe;
    border-radius: 3px;
  }

  .pos-left:before {
    content: "";
    position: absolute;
    top: 20px;
    right: 100%;
    border-top: 5px solid transparent;
    border-right: 6px solid #f4f4f3;
    border-bottom: 5px solid transparent;
  }

  .bubbleOther {
    text-align: left;
    max-width: 400px;
    min-height: 40px;
    display: inline-block;
    vertical-align: top;
    background: #f4f4f3;
    border-radius: 3px;
  }

  .plain {
    padding: 9px 13px;
    font-size: 14px;
  }
</style>
