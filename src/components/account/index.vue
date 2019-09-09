<template>
  <div align="center">
    <el-collapse accordion v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <div style="width: 100%; text-align: right">
            <div>搜索开关<i class="el-icon-search"></i></div>
          </div>
        </template>
        <div style="width: 70%; text-align: center">
          <!--<div>post、put方法都会进行加密，如返回为字符串则会进行解密</div>-->
          <!--<div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>-->
          <el-row :gutter="21">
            <el-col :span="18">
              <el-form>
                <el-form-item label="选择时间段">
                  <el-date-picker
                    v-model="dataArray"
                    type="datetimerange"
                    :picker-options="pickerOptions2"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    align="right">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="5">
              <el-form>
                <el-form-item>
                  <el-button size="mini" type="primary" @click="searchAccount()">查询</el-button>
                  <el-button size="mini" type="info" @click="resetAccount()">重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div align="right" style="padding-right: 30px">
      <el-tooltip class="item" effect="dark" content="数据图表" placement="top">
        <el-button size="small" type="primary" icon="el-icon-picture-outline" plain circle @click.stop.prevent="info"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="新增" placement="top">
        <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" plain circle @click.stop.prevent="add"></el-button>
      </el-tooltip>
    </div>
    <div style="width: 100%">
      <el-table
        ref="multipleTable"
        :data="accountList"
        border
        show-summary
        :height="accountTableHeight"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="创建人" prop="accountCreatby" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="标题" prop="accountTitle" width="200"></el-table-column>
        <el-table-column prop="accountDescript" label="内容描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accountRemark" label="备注" show-overflow-tooltip> </el-table-column>
        <el-table-column label="创建日期" width="180">
          <template slot-scope="scope">{{$dateFmt('yyyy-MM-dd hh:mm:ss', scope.row.accountCreattime)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <custom-perm label="">
              <div>
                <el-tooltip class="item" content="编辑" effect="dark" placement="top">
                  <el-button @click="editAccount(scope.row)" circle icon="el-icon-edit" size="mini"
                             type="warning"></el-button>
                </el-tooltip>
                <el-tooltip class="item" content="删除" effect="dark" placement="top">
                  <el-button @click="deleteAccount(scope.row)" circle icon="el-icon-delete" size="mini"
                             type="danger"></el-button>
                </el-tooltip>
              </div>
            </custom-perm>
          </template>
        </el-table-column>
        <el-table-column label="开消" prop="accountPrise" show-overflow-tooltip width="80"></el-table-column>
      </el-table>
    </div>
    <pager-right v-show="showRight" @rightClose="rightClose">
      <account-form :account="account" :action="action" v-show="showRight" @right-Close="rightClose"></account-form>
    </pager-right>
    <pager-right v-show="showRightInfo" @rightClose="rightClose">
      <account-info :searchList="searchList" v-show="showRightInfo" @right-Close="rightClose"></account-info>
    </pager-right>
  </div>
</template>

<script>
  import {account} from '@/api/resources';
  import pageRight from '../common/self-pageright.vue';
  import accountForm from './form.vue';
  import accountInfo from './info.vue';
  import CustomPerm from '../common/self-perm';

  export default {
    name: 'index',
    components: {
      CustomPerm,
      pagerRight: pageRight,
      accountForm: accountForm,
      accountInfo: accountInfo
    },
    data() {
      return {
        activeName: '0',
        showRight: false,
        showRightInfo: false,
        accountList: [],
        account: {},
        action: '',
        accountTableHeight: window.innerHeight-300,
        searchList: [],
        multipleSelection: [],
        pager: {
          pagerSize: 500,
          pagerCurrent: 1,
          pagerCount: 0,
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dataArray: '',
        searchCondition: {
          startTime: '',
          endTime: ''
        }
      }
    },
    mounted() {
      this.getPager();
    },
    methods: {
      getPager() {
        // console.log(this.dataArray);
        let formDate = JSON.parse(JSON.stringify(Object.assign({}, this.searchCondition, {offset: this.pager.pagerSize*(this.pager.pagerCurrent-1), limit: this.pager.pagerSize})));
        account.queryList(formDate).then((res)=> {
          this.accountList = res;
        }).catch((res)=> {
          this.$notify.error({
            title: '提示',
            message: res.Messages || '操作失败'
          })
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      editAccount(item) {
        this.account = JSON.parse(JSON.stringify(item));
        this.action = 'edit';
        this.showRight = true;
      },
      deleteAccount(item) {
        this.$confirm('确认删除？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          account.delete(item.accountId).then(() => {
            this.rightClose();
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
          }).catch(()=> {
            this.$notify.error({
              title: '提示',
              message: '删除失败'
            })
          });
        }).catch(() => {});
      },
      add(){
        this.showRight = true;
        this.action = 'add';
        this.account = {};
      },
      info() {
        if (this.multipleSelection.length === 0){
          this.searchList = JSON.parse(JSON.stringify(this.accountList));
        } else {
          this.searchList = JSON.parse(JSON.stringify(this.multipleSelection));
        }
        this.showRightInfo = true;
      },
      rightClose() {
        this.showRight = false;
        this.showRightInfo = false;
        this.getPager();
      },
      searchAccount() {
        if (this.dataArray) {
          this.searchCondition.startTime = this.dataArray[0];
          this.searchCondition.endTime = this.dataArray[1];
          this.getPager();
        }
      },
      resetAccount() {
        this.dataArray = [];
        this.searchCondition.startTime = '';
        this.searchCondition.endTime = '';
        this.getPager();
      }
    }
  }
</script>

<style scoped>

</style>
