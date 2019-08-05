<template>
  <div>
    <div>
      <el-header align="center">
        <h3>{{heardText}}</h3>
      </el-header>
      <el-table
        :data="prolist"
        show-summary
        style="width: 100%">
        <el-table-column type="index" label="编号" width="50" :index="indexMethod" align="center"></el-table-column>
        <el-table-column prop="pro.productName" label="菜名" align="center"></el-table-column>
        <el-table-column prop="productPrise" label="价格" align="center">
          <template slot-scope="scope">
            ¥{{scope.row.pro.productPrise}}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="数量" align="center">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.number" :min="1" :max="10" @change="handleChange"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" circle @click="remove(scope.row)" class="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-main>
      <el-form :model="order" label-width="100px" class="demo-ruleForm">
        <el-form-item label="是否派送" prop="orderType" >
          <el-tooltip :content="'Switch value: ' + order.orderType" placement="top">
            <el-switch
              @change="changeType"
              v-model="order.orderType"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="请选择位置" prop="orderDesk" >
          <el-select v-model="order.orderDesk" filterable placeholder="请选择位置" :disabled="order.orderType === '1'" style="width: 100%">
            <el-option
              style="width: 100%"
              v-for="item in deskList"
              :key="item.deskId"
              :label="item.deskName + '-' + item.deskSerialNumber"
              :value="item.deskId">
              <span style="float: left">{{ item.deskName + '-' + item.deskSerialNumber }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.deskCapacity }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派送地址" prop="orderDesk" >
          <el-row :gutter="24">
            <el-col :span="17">
              <el-select v-model="address" placeholder="请选择派送地址" :disabled="order.orderType !== '1'" style="width: 100%">
                <el-option
                    style="width: 100%"
                    v-for="item in addressList"
                    :key="item.addressId"
                    :label="item.addressName"
                    :value="item.addressId">
                  <span style="float: left">{{item.addressName}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{item.addressDetail}}</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button @click="addressOperation = true">添加新地址</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" plain style="width: 100%;" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <custom-drawer :show="addressOperation" @rightClose="closeAddress" :css="{'width': '650px'}">
      <order-address @closeAddress="closeAddressReload"></order-address>
    </custom-drawer>
  </div>
</template>

<script>
import {Order, Desk, Address} from '../../api/resources';
import orderAddress from './address/address';

export default {
  name: 'selfTag',
  components: {orderAddress},
  props: {
    heardText: {
      type: String,
      default: ''
    },
    prolist: {
      type: Array,
      default: () =>[]
    },
    order: {
      type: Object,
      default: () =>{}
    },
    idList: {
      type: Array,
      default: () =>[]
    }
  },
  data() {
    return {
      addressOperation: false,
      deskList: [],
      addressList: [],
      address: '',
      deskDto: {
        deskStatus: 0,
      }
    };
  },
  mounted () {
    this.getDeskList();
    this.getAddress();
  },
  methods: {
    getDeskList () {
      let formDate = JSON.parse(JSON.stringify(this.deskDto));
      Desk.queryPager(formDate).then((res) => {
        this.deskList = res.list;
      }).catch(() => {
      });
    },
    getAddress () {
      Address.queryByUserId({userId: this.$store.state.user.userId}).then(res=> {
        console.info(res);
        this.addressList = res;
      }).catch(error => {})
    },
    indexMethod(index) {
      return index + 1;
    },
    changeType() {
      if (this.order.orderType === '1') {
        this.order.orderDesk = '';
        this.address = '';
      }
    },
    resetForm() {
      this.getDeskList();
      this.order.orderDesk = '';
      this.order.orderType = '';
    },
    rightClose() {
      this.resetForm();
      this.$emit('rightClose');
    },
    closeAddress() {
      this.addressOperation = false;
    },
    closeAddressReload(item) {
      this.addressOperation = false;
      this.getAddress();
      this.address = item.addressId;
    },
    remove(row) {
      this.$removeListByKey(this.prolist, row.pro.productId);
      this.$removeListByKey(this.order.products, row.pro.productId);
      this.$removeListByKey(this.idList, row.pro.productId);
    },
    handleChange(value) {
      // console.log(value);
    },
    submit() {
      if (this.order.products.length === 0) {
        this.$notify({
          type: 'info',
          title: '提示',
          message: '请添加菜品！'
        });
        return '';
      }
      if (this.order.orderType === '0' && this.order.orderDesk === '') {
        this.$notify({
          type: 'info',
          title: '提示',
          message: '请选择位置！'
        });
        return '';
      }
      if (this.order.orderType === '1') {
        this.order.orderDesk = this.address;
      }
      Order.save(this.order).then(res => {
        this.rightClose();
        this.$notify({
          type: 'success',
          title: '提示',
          message: '订单提交成功！'
        });
      }).catch(error => {
        this.rightClose();
        this.$notify({
          type: 'error',
          title: '提示',
          message: '订单提交失败！' + error
        });
        console.error(error);
      })
    }
  }
}
</script>

<style scoped>

</style>
