<template>
<div id="blog">
  <div id="blog-top">
    <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" circle plain @click="add"></el-button>
  </div>
  <div id="blog-main">
    <div>
      <el-collapse v-model="active" accordion style="">
        <el-collapse-item :title="t.teaseTitle" :name="t.teaseId" v-for="t of teaseList" :key="t.teaseId">
          <template slot="title">
            <div style="padding: 30px; width: 100%">
              <el-row :gutter="21">
                <el-col :span="15">
                  {{t.teaseTitle}}
                </el-col>
                <el-col :span="5">
                  {{$dateFmt('yyyy-MM-dd', t.teaseCreattime)}}
                </el-col>
                <el-col :span="4">
                  <div style="display: inline-block; width: 100px" v-show="isActive(t.teaseId)">
                    <el-tooltip class="item" effect="dark" content="修改" placement="top">
                      <el-button type="primary" plain size="small" circle icon="el-icon-edit"
                                 @click.stop.prevent="editTease(t)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <el-button type="primary" plain size="small" circle icon="el-icon-delete"
                                 @click.stop.prevent="deleteTease(t)"></el-button>
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
          <div id="blog-center">
            <div id="blog-main-knowledge">
              <span class="blog-main-span">知识点：</span>
              <div>{{t.teaseDto}}</div>
            </div>
            <div id="blog-main-example">
              <span class="blog-main-span">实&nbsp;&nbsp;例：</span>
              <div>{{t.teaseContent}}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <pager-right v-show="showRight" @rightClose="rightClose">
      <tease-form :tease="tease" :action="action" v-show="showRight" @right-Close="rightClose"></tease-form>
    </pager-right>
  </div>
</div>
</template>
<!--https://api.douban.com/v2/movie/in_theaters-->
<script>
  import pageRight from '../common/self-pageright.vue';
  import teaseForm from './form.vue';
  import {aesDecrypt,aesEncrypt} from '../../utils/encryption.js'
  export default {
    name: 'recommendPoetry',
    components: {
      pagerRight: pageRight,
      teaseForm: teaseForm
    },
    data () {
      return {
        tease: {
          teaseTitle: '',
          teaseCreatby: this.$store.state.user.userId,
          teaseContent: ''
        },
        teaseList: [],
        context: [],
        text: '',
        active: '',
        timers: [],
        isShow: true,
        showRight: false,
        action: 'add'
      }
    },
    mounted () {
      this.getTeaseList();
    },
    methods: {
      getTeaseList () {
        let url = this.$HOST + '/tease/queryTease';
        this.$api.post(url).then((res) => {
          this.teaseList = res;
          this.active = res[0].teaseId;
        }).catch((res) => {
          this.$notify.error({
            title: '提示',
            message: res.msg || '操作失败'
          })
        });
      },
      editTease(item) {
        this.action = 'edit';
        this.tease = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      deleteTease(item) {
        let url = this.$HOST + '/tease/delete/'+ item.teaseId;
        this.$api.delete(url).then(() => {
          this.rightClose();
          this.getTeaseList();
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
        }).catch(() => {
          this.$notify.error({
            title: '提示',
            message: '删除失败'
          })
        });
      },
      isActive(id) {
        return id === this.active;
      },
      rightClose () {
        this.showRight = false;
        this.getTeaseList();
      },
      add() {
        this.showRight = true;
        this.action = 'add';
        this.tease = JSON.parse(JSON.stringify(this.tease));
      }
    }
  };
</script>

<style scoped>
  #blog {
    text-align: center;
    text-align: -webkit-center;
    text-align: -moz-center;
    /*background: #ffe;*/
  }
  #blog-top {
    padding: 3px 20%;
    text-align: right;
    background: #fff;
    border-bottom: 1px solid #aaa;
  }
  #blog-main {
    text-align: left;
    width: 60%;
    /*background: #dae2ea;*/
  }
  #blog-center {
    border: 1px solid #aaa;
    border-radius: 5px;
    background: #edf5fe;
    box-shadow: 2px 6px #edf5fe;
  }
  #blog-main-knowledge {
    padding: 0 10%;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }
  .blog-main-span {
    font-size: 1.2em;
  }
  #blog-main-knowledge div {
    padding: 0 10%;
    font-family: "Fira Code Light";
  }
  #blog-main-example {
    padding: 0 10%;
  }
  #blog-main-example div {
    padding: 0 10%;
    font-family: "Times New Roman";
  }
</style>
