<template>
  <div>
    <h3 align="center">{{order.desk ? order.desk.deskSerialNumber + '号' : order.address.addressName}}-菜单详情
      <h5>{{order.orderSerialNumber}}
        <el-tag size="mini" type="danger" v-show="order.orderStatus === '0' ">待上菜-{{productList.filter(value => {return value.orderProductStatus === '0'}).length}}</el-tag>
        <el-tag size="mini" type="warning" v-show="order.orderStatus === '1'">待付款</el-tag>
        <el-tag size="mini" type="success" v-show="order.orderStatus === '2'">完成</el-tag>
      </h5>
    </h3>
    <el-divider><i class="el-icon-notebook-2"></i>订单</el-divider>
    <el-header style="border-bottom: 1px solid #e6e6e6;" v-show="order.orderStatus < '2'">
      <el-row :gutter="24">
        <el-col :offset="1" :span="16">
          <div v-show="isSelect">
            <el-select
              size="small"
              style="width: 100%"
              v-model="orderProductIds"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in list"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="2">
          <div v-show="isSelect">
            <el-button size="small" type="primary" plain @click.stop="submitAddProduct">提交</el-button>
          </div>
        </el-col>
        <el-col :offset="isSelect?1:20" :span="2">
          <perm label="add-product-manage">
            <el-tooltip class="item" effect="dark" content="添加" placement="top">
              <el-button size="small" type="primary" icon="el-icon-guide" plain circle @click.stop="addProduct"></el-button>
            </el-tooltip>
          </perm>
        </el-col>
      </el-row>
    </el-header>
    <el-table :data="productList" show-summary style="width: 100%" v-loading="loading">
      <el-table-column prop="productName" label="菜名">
        <template slot-scope="scope">
          {{scope.row.productName}}
          <el-tag size="mini" type="danger" v-show="scope.row.orderProductStatus === '0' ">待上菜</el-tag>
          <el-tag size="mini" type="success" v-show="scope.row.orderProductStatus === '1'">已上菜</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderProductPrise" label="价格" width="50px"></el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <div>
            <el-input-number size="mini" :disabled="scope.row.orderProductStatus !== '0'" v-model="scope.row.orderProductNumber" @change="handleChange(scope.row)" :min="1" :max="10"></el-input-number>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <perm label="delete-product-manage" v-show="scope.row.orderProductStatus === '0'" style="margin-right: 10px">
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button size="mini" type="danger" icon="el-icon-delete" plain circle @click.stop="deleteProduct(scope.row)"></el-button>
            </el-tooltip>
          </perm>
          <perm label="delete-product-manage" v-show="scope.row.orderProductStatus === '0'">
            <el-tooltip class="item" effect="dark" content="上菜" placement="top">
              <el-button size="mini" type="success" icon="el-icon-thumb" plain circle @click.stop="thumbProduct(scope.row)"></el-button>
            </el-tooltip>
          </perm>
        </template>
      </el-table-column>
    </el-table>
    <el-footer align="right" v-show="order.orderStatus < '2'">
      <el-button @click="rightClose" type="text">{{heardText}}</el-button>
    </el-footer>
  </div>
</template>

<script>
  import {Order, Product} from '../../api/resources';
  import Perm from '../common/self-perm';

  export default {
    name: 'product',
    components: {Perm},
    props: {
      order: {
        type: Object,
        default: () =>{}
      },
      heardText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: false,
        isSelect: false,
        orderProductIds: [],
        productList: [],
        list: [],
      }
    },
    mounted () {
      this.getProductList();
      this.getProductOrderList();
    },
    methods: {
      indexMethod(index) {
        return index + 1;
      },
      getProductOrderList() {
        this.loading = true;
        Order.queryOrderGoodsByOrderId(this.order.orderId).then(res => {
          this.productList = res ? res : [];
          this.loading = false;
        });
      },
      getProductList() {
        Product.queryPager().then(res => {
          this.list = res.list;
        });
      },
      addProduct() {
        this.isSelect = !this.isSelect;
      },
      submitAddProduct() {
        this.$confirm('确认添加?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let formDate = {
            orderId: this.order.orderId,
            orderProductIds: this.orderProductIds,
            orderProductNumber: '1',
            orderProductStatus: '0'
          };
          Order.orderProductAdd(formDate).then(res => {
            this.getProductOrderList();
          });
          this.orderProductIds = [];
          this.addProduct();
        }).catch(() => {});
      },
      handleChange(value) {
        this.$confirm('确认添加数量?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let formDate = {
            orderId: value.orderId,
            orderProductIds: [],
            orderProductNumber: value.orderProductNumber,
            orderProductStatus: '0'
          };
          formDate.orderProductIds.push(value.productId);
          Order.orderProductUpdate(formDate).then(res => {
            this.getProductOrderList();
          })
        }).catch(() => {
          this.getProductOrderList();
        });
      },
      rightClose () {
        Order.settle(this.order.orderId).then((res) => {
          this.$notify.success({
            duration: 2000,
            name: '成功',
            message: '结算成功'
          });
          this.$emit('rightClose');
        }).catch(()  => {
          this.$notify.error({
            duration: 5000,
            name: '失败',
            message: '结算失败'
          });
        })
      },
      deleteProduct(item) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let formDate = {
            orderId: item.orderId,
            productId: item.productId
          };
          Order.orderProductDelete(formDate).then(res => {
            this.getProductOrderList();
          })
        }).catch(() => {});
      },
      thumbProduct(item) {
        let formDate = {
          orderId: item.orderId,
          orderProductIds: [],
          orderProductNumber: item.orderProductNumber,
          orderProductStatus: '1'
        };
        formDate.orderProductIds.push(item.productId);
        Order.orderProductUpdate(formDate).then(res => {
          this.getProductOrderList();
        })
      }
    }
  };
</script>

<style scoped>

</style>
