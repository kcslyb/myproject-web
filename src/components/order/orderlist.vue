<template>
  <el-container>
    <el-header>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-button :class="condition.orderStatus === '0' ? 'current-but' : ''" type="danger" plain @click="getOneType" style="box-shadow: 0px 6px 6px #aaa">待上菜{{condition.orderStatus === '0' ? pager.total : ''}}</el-button>
          <el-button :class="condition.orderStatus === '1' ? 'current-but' : ''" type="warning" plain @click="getTwoType" style="box-shadow: 0px 6px 6px #aaa">待付款{{condition.orderStatus === '1' ? pager.total : ''}}</el-button>
          <el-button :class="condition.orderStatus === '2' ? 'current-but' : ''" type="success" plain @click="getThreeType" style="box-shadow: 0px 6px 6px #aaa">完成{{condition.orderStatus === '2' ? pager.total : ''}}</el-button>
          <el-button :class="condition.orderStatus === '' ? 'current-but' : ''" type="primary" plain @click="getAllType" style="box-shadow: 0px 6px 6px #aaa">所有{{condition.orderStatus === '' ? pager.total : ''}}</el-button>
        </el-col>
        <el-col :span="6">
          <el-select v-model="condition.orderDesk" clearable placeholder="请选择位置" style="width: 100%" size="small">
            <el-option
                style="width: 100%"
                v-for="item in deskList"
                :key="item.deskId"
                :label="item.deskName"
                :value="item.deskId">
              <span style="float: left">{{ item.deskName + '-' +item.deskSerialNumber }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.deskCapacity }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button size="small" type="primary" @click="getOrderList">搜索</el-button>
          <el-button size="small" type="warning" @click="resetCondition">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="primary" plain @click="showTable = !showTable">切换</el-button>
        </el-col>
      </el-row>
    </el-header>
    <div v-loading="loading" v-show="showTable">
      <el-table :data="orderList" align="center" :height="defaultHeight" @row-click="searchOrder">
        <el-table-column type="index" label="编号" width="50" :index="indexMethod" align="center"></el-table-column>
        <el-table-column label="唯一标识" prop="orderSerialNumber" width="200">
          <template slot-scope="scope">
            <el-tag size="mini" type="primary">{{scope.row.orderProductSize}}</el-tag>
            <span>{{scope.row.orderSerialNumber}}</span>
            <el-tag size="mini" type="danger" v-show="scope.row.orderStatus === '0' ">待上菜</el-tag>
            <el-tag size="mini" type="warning" v-show="scope.row.orderStatus === '1'">待付款</el-tag>
            <el-tag size="mini" type="success" v-show="scope.row.orderStatus === '2'">完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建者" prop="orderCustomerName" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.orderCustomerName}}</span>
            <el-tag size="mini" type="primary" v-show="scope.row.orderType === '1'">派送单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="流水" prop="orderNumber" width="100"></el-table-column>
        <el-table-column prop="orderCreateTime" label="创建时间" :formatter="getNumber"></el-table-column>
        <el-table-column label="位置">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.orderType === '0'" :value="scope.row.desk.deskCapacity" class="item" type="primary" style="margin-top: 10px">
              <span >{{scope.row.desk.deskName + '-' + scope.row.desk.deskSerialNumber}}</span>
            </el-badge>
            <span v-else>派送地址：{{scope.row.address.addressName + scope.row.address.addressDetail}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.orderStatus === '0'">
              <el-button type="primary" @click="searchOrder(scope.row)" size="mini" plain circle class="el-icon-dish"></el-button>上菜
            </div>
            <div v-show="scope.row.orderStatus <= '2'">
              <el-button type="primary" @click="searchOrder(scope.row)" size="mini" plain circle class="el-icon-search"></el-button>查看
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-footer align="center" v-show="orderList.length > 0">
        <div class="block">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pager.offset"
              :page-sizes="[pager.limit, 20]"
              :page-size="pager.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pager.total">
          </el-pagination>
        </div>
      </el-footer>
    </div>
    <div v-loading="loading" v-show="!showTable" align="center">
      <el-divider><i class="el-icon-notebook-2"></i>订单</el-divider>
      <div style="border: 1px solid #e6e6e6; width: 50%;">
        <div v-for="item of orderList" :key="item.orderId" style="box-shadow: 10px 10px 5px #888888">
          <el-divider>{{item.orderNumber}}</el-divider>
          <el-row :gutter="23">
            <el-col :offset="2" :span="4">{{item.orderSerialNumber}}</el-col>
            <el-col :offset="10" :span="3">{{item.orderType === '1' ? '派送单' : ''}}</el-col>
          </el-row>
          <el-row :gutter="24" v-if="flag === item.orderId">
            <el-row v-for="(pro, index) of productList" :key="index" style="padding: 10px;">
              <el-col :offset="3" :span="1">{{index+1}}</el-col>
              <el-col :offset="2" :span="4">{{pro.productName}}</el-col>
              <el-col :offset="2" :span="2">{{pro.orderProductPrise}}</el-col>
              <el-col :offset="2" :span="2">{{pro.orderProductNumber}}</el-col>
              <el-col :offset="2" :span="2">
                <el-tag size="mini" type="danger" v-show="item.orderStatus === '0' ">待上菜</el-tag>
                <el-tag size="mini" type="warning" v-show="item.orderStatus === '1'">待付款</el-tag>
                <el-tag size="mini" type="success" v-show="item.orderStatus === '2'">完成</el-tag>
              </el-col>
            </el-row>
          </el-row>
          <el-row :gutter="24" v-else>
            <el-col :offset="2" :span="20">
              <el-button type="text" @click="getProductOrderList(item.orderId)">...</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <page-right v-if="orderPageIsShow" :show="orderPageIsShow" @rightClose="rightClose" :css="{'width': '650px'}">
      <order-dto :heardText="title" :order="order" @rightClose="rightClose"></order-dto>
    </page-right>
  </el-container>
</template>

<script>

  import {Desk, Order} from '@/api/resources';
  import pageRight from '../common/self-pageright.vue';
  import orderDto from '../order/order.vue';

  export default {
    name: 'orderlist',
    data () {
      return {
        loading: false,
        showTable: true,
        orderPageIsShow: false,
        defaultHeight: window.innerHeight - 230,
        order: {},
        orderList: [],
        deskList: [],
        productList: [],
        condition: {
          orderStatus: '',
          orderDesk: ''
        },
        deskCondition: {},
        productCondition: {},
        pager: {
          offset: 1,
          limit: 10,
          total: 0
        },
        title: '结算',
        flag: '',
      }
    },
    components: {
      pageRight: pageRight,
      orderDto:orderDto
    },
    mounted () {
      this.getDeskList();
      this.getOrderList();
    },
    methods: {
      getDeskList () {
        this.deskCondition = Object.assign({}, this.pager);
        let formDate = JSON.parse(JSON.stringify(this.deskCondition));
        Desk.queryPager(formDate).then((res) => {
          this.deskList = res.list;
        }).catch(() => {
        });
      },
      getAllType () {
        this.condition.orderStatus = '';
        this.getOrderList ()
      },
      getOneType () {
        this.condition.orderStatus = '0';
        this.getOrderList ()
      },
      getTwoType () {
        this.condition.orderStatus = '1';
        this.getOrderList ()
      },
      getThreeType () {
        this.condition.orderStatus = '2';
        this.getOrderList ()
      },
      resetCondition() {
        this.condition.orderDesk = '';
        this.getOrderList();
      },
      getOrderList () {
        this.loading = true;
        this.condition = Object.assign({}, this.pager, this.condition);
        let formDate = JSON.parse(JSON.stringify(this.condition));
        Order.queryPager(formDate).then((res) => {
          this.orderList = res.list
          this.pager.total = res.total;
          this.loading = false;
        }).catch(() => {
        });
      },
      getProductOrderList(orderId) {
        this.flag = orderId;
        this.loading = true;
        Order.queryOrderGoodsByOrderId(orderId).then(res => {
          this.productList = res ? res : [];
          this.loading = false;
        });
      },
      indexMethod(index) {
        return ((this.pager.offset - 1) * this.pager.limit) + index + 1;
      },
      rightClose () {
        this.getOrderList();
        this.orderPageIsShow = false;
      },
      getNumber(row) {
        return this.$formatStringtoDateTime(row.orderCreateTime);
      },
      handleSizeChange(val) {
        this.pager.limit = val;
        this.getOrderList();
      },
      handleCurrentChange(val) {
        this.pager.offset = val;
        this.getOrderList();
      },
      searchOrder (item) {
        this.order = item;
        this.orderPageIsShow = true;
      },
      serving (item) {
        Order.serving(item.orderId).then((res) => {
          this.$notify.success({
            duration: 2000,
            name: '成功',
            message: '上菜完成'
          });
          this.getOrderList();
        }).catch((error)  => {
          this.$notify.error({
            duration: 5000,
            name: '失败',
            message: '上菜失败' + error
          });
        })
      }
    }
  };
</script>
<style>
  .el-table .order-row {
    box-shadow: -2px -3px #aaa;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .current-but{
    padding: 16px 25px;
  }
</style>
