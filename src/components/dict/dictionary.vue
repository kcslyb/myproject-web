<template>
<div>
  <div>
    <el-header style="border: 1px solid #e6e6e6;" align="right">
      <div style="padding: 0 10px 10px 10px; display: inline-block" v-show="showSearchInputTwo">
        <el-input v-model="searchTextTwo" placeholder="请输入关键字搜索"></el-input>
      </div>
      <el-button @click="showSearchInputTwo = !showSearchInputTwo" size="small" icon="el-icon-search" circle></el-button>
      <el-tooltip class="item" effect="dark" content="新增数据字典组" placement="top" style="margin-top: 13px">
        <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" plain circle @click.stop.prevent="addDictionary('group')"></el-button>
      </el-tooltip>
    </el-header>
    <div class="el-container">
      <div class="el-aside" :style="'width: 200px ; border: 1px solid #e6e6e6; height: '+ defaultHeight +'px;'">
        <div align="center">
          <h3 style="display: inline-block;">数据字典组</h3>
          <el-button @click="showSearchInput = !showSearchInput" size="small" icon="el-icon-search" circle></el-button>
          <div style="padding: 0 10px 10px 10px" v-show="showSearchInput">
            <el-input v-model="searchText" placeholder="请输入关键字搜索"></el-input>
          </div>
        </div>
        <div v-loading="dictionaryLoading">
          <template v-for="item of dictionaryList">
            <el-button style="width: 196px; margin: 0; height: 60px" :class="{'is-selected-color': dict.groupName === item.groupName}"  @click="setGroupList(item)" :key="item.groupId">
              <div style="text-align: center;font-size: 1.1em; user-select: text">{{item.groupNameValue}}</div>
              <div style="text-align: center; font-size: 0.7em; color: #aaa; user-select: text">{{item.groupName}}</div>
            </el-button>
          </template>
        </div>
      </div>
      <div class="el-main" style="padding: 0">
        <div style="width: 100%">
          <!--<div align="right" style="padding: 0 20px">-->
            <!--<el-tooltip class="item" effect="dark" content="新增数据字典项" placement="top" style="margin-top: 13px">-->
              <!--<el-button size="small" type="primary" icon="el-icon-circle-plus-outline" plain circle @click.stop.prevent="addDictionary('group')"></el-button>-->
            <!--</el-tooltip>-->
          <!--</div>-->
          <el-divider><i class="el-icon-notebook-2"></i>数据字典项</el-divider>
          <el-table
            ref="multipleTable"
            :data="groupList"
            v-loading="dictionaryLoading"
            :height="defaultBodyHeight">
            <el-table-column prop="dictionaryIndex" label="字典项序号" width="120"> </el-table-column>
            <el-table-column prop="dictionaryKey" label="字典关键字" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dictionaryLabel" label="字典项名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="dictionaryGroupName" label="所属字典组" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建日期">
              <template slot-scope="scope">{{$dateFmt('yyyy-MM-dd hh:mm:ss', scope.row.dictionaryCreateTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <div>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <el-button size="mini" type="warning" icon="el-icon-edit" circle @click="editDictionary(scope.row)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deleteDictionary(scope.row)"></el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @rightClose="rightClose" :css="{'width': '500px'}">
      <dictionary-form :dict="dictionary" :action="action" :groupList="dictionaryList" :actionType="actionType" @right-Close="rightCloseRoad"></dictionary-form>
    </page-right>
  </div>
</div>
</template>

<script>
  import {DataDict} from '@/api/resources'
  import dictionaryform from './dictionaryform';
  import pageright from '../common/self-pageright';
  export default {
    name: 'dictlist',
    components: {
      pageRight: pageright,
      dictionaryForm: dictionaryform
    },
    data() {
      return {
        showRight: false,
        showSearchInput: false,
        showSearchInputTwo: false,
        dictionaryLoading: true,
        flag: '',
        dict: {},
        searchText: '',
        searchTextTwo: '',
        action: '',
        actionType: '',
        dictionary: {},
        activeName: '',
        defaultHeight: window.innerHeight-200,
        defaultBodyHeight: window.innerHeight-265,
        dictionaryList: [],
        groupList: [],
        conditionDict: {}
      };
    },
    watch: {
      searchText(val) {
        this.dictionaryList = this.$filterListOfString(this.dictionaryList,['groupName', 'groupNameValue'], val);
      },
      searchTextTwo(val) {
        this.groupList = this.$filterListOfString(this.groupList,['dictionaryKey', 'dictionaryLabel', 'dictionaryGroupName', this.flag], val);
      }
    },
    mounted() {
      this.getDictionaryList();
    },
    methods: {
      getDictionaryList() {
        this.dictionaryLoading = true;
        let formData = JSON.parse(JSON.stringify(this.conditionDict));
        DataDict.query(formData).then((res) => {
          if (res.length > 0) {
            this.dictionaryList = res;
            let obj = this.dictionaryList.filter(value => {return this.flag === value.groupName});
            this.setGroupList(obj.length > 0 ? obj[0] : this.dictionaryList[0]);
          }
          this.dictionaryLoading = false;
        })
      },
      setGroupList(item) {
        this.dict = item;
        this.groupList = item.dictionaries;
        this.flag = item.groupName;

      },
      addDictionary(value) {
        this.action = 'add';
        this.actionType = value;
        this.dictionary = JSON.parse(JSON.stringify({}));
        this.showRight = true;
      },
      editDictionary(item) {
        this.action = 'edit';
        this.dictionary = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      deleteDictionary(item) {
        this.$confirm('确认删除？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DataDict.delete(item.dictionaryId).then(() => {
            this.rightCloseRoad();
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
      rightClose() {
        this.showRight = false;
      },
      rightCloseRoad() {
        this.showRight = false;
        this.getDictionaryList();
      }
    }
  };
</script>

<style scoped lang="scss">
@import "../../assets/main";
</style>
