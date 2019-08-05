<template>
  <div>
    <div class="el-header">
      <el-row :gutter="24">
        <el-col :span="22">
          <div>
            <el-button
                :icon="returnIcon(item.dictionaryKey)"
                :size="item.dictionaryKey === condition.productType ? '' : 'small'"
                :type="item.dictionaryKey === condition.productType ? 'primary' : 'info'"
                @click="changeStatus(item)"
                plain v-for="item of productTypes" :key="item.productId">{{item.dictionaryLabel}}</el-button>
          </div>
        </el-col>
        <el-col :span="2">
          <div>
            <el-badge :value="order.products.length" class="item">
              <el-button size="small" type="primary" circle plain icon="el-icon-shopping-cart-2" @click="addtodo"></el-button>
            </el-badge>
          </div>
        </el-col>
      </el-row>
      <el-divider><i class="el-icon-notebook-2"></i>菜单</el-divider>
      <page-right :show="pageIsShow" @rightClose="rightClose" :css="{'width': '650px'}">
        <self-tag :heardText="title"
                  :prolist="list"
                  :order="order"
                  :idList="idList"
                  @rightClose="resetClose">
        </self-tag>
      </page-right>
    </div>
    <el-dialog
      :body-style="{ padding: '0px' }"
      :title="product.productName"
      :visible.sync="centerDialogVisible"
      width="30%"
      :show-close="false"
      :modal-append-to-body="false"
      center>
      <el-card :body-style="{padding: '0px'}">
        <img :src="$REPLACEURL(product.productFilePath)" class="image">
        <div style="padding: 14px;">
          <span>{{product.productName}}:</span>
          <time class="time">{{product.productDescription}}</time>
          <div class="bottom clearfix">
            <time class="time">¥{{product.productPrise}}</time>
            <time class="time">销量:{{product.productSalesNumber}}份</time>
            <el-button type="text" class="button" @click="addProduct(product)">添加</el-button>
            <el-button type="text" class="button"></el-button>
            <el-button type="text" class="button" @click="centerDialogVisible = false">取消</el-button>
          </div>
        </div>
      </el-card>
    </el-dialog>
    <div>
      <div v-loading="loading" :style="'height: ' + defaultHeight + 'px;'">
        <el-row :gutter="20">
          <el-col :span="5" v-for="(pro, index) in productList" :key="index" :offset="index%4 > 0 ? 1 : 0">
            <el-card :body-style="{padding: '0px'}" style="margin-bottom: 20px">
              <img @click="DialogVisible(pro)" :src="$REPLACEURL(pro.productFilePath)" class="image" style="height: 175px;">
              <div style="padding: 14px;">
                <span>{{pro.productName}}:</span>
                <time class="time">{{pro.productDescription}}</time>
                <div class="bottom clearfix">
                  <time class="time">销量:{{pro.productSalesNumber}}份</time>
                  <el-button type="text" class="button">¥{{pro.productPrise}}</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-footer align="center" v-show="productList.length > 0">
        <div class="block">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pager.offset"
              :page-sizes="[8, 20]"
              :page-size="pager.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pager.total">
          </el-pagination>
        </div>
      </el-footer>
    </div>
  </div>
</template>

<script>
import {Product} from '../../api/resources';
import pageRight from '../common/self-pageright.vue'
import selfTag from './productlist.vue'

export default {
  name: 'todolist',
  components: {
    pageRight: pageRight,
    selfTag: selfTag
  },
  data () {
    return {
      loading: false,
      pageIsShow: false,
      musicIsShow: false,
      defaultHeight: window.innerHeight - 240,
      centerDialogVisible: false,
      activeName: '1',
      sumNumb: 0,
      order: {
        orderDesk: '',
        orderType: '',
        products: []
      },
      productTypes: [],
      deskList: [],
      product: {},
      idList: [],
      list: [],
      title: '详情',
      productList: [],
      condition: {
        productStatus: '0',
        productType: '1'
      },
      pager: {
        offset: 1,
        limit: 8,
        total: 0
      }
    }
  },
  mounted () {
    this.getProList();
    this.getProductTypes();
  },
  methods: {
    returnIcon(type) {
      switch (type) {
        case '1':
          return 'el-icon-dish-1';
        case '2':
          return 'el-icon-tableware';
        case '3':
          return 'el-icon-food';
        case '4':
          return 'el-icon-cold-drink';
        default:
          return 'el-icon-dish'
      }
    },
    changeStatus(item) {
      this.condition.productType = item.dictionaryKey;
      this.getProList();
    },
    getProductTypes() {
      this.$getDictionaryByGroup('dishesType').then(res => {
        this.productTypes = res;
      })
    },
    addtodo () {
      this.pageIsShow = true;
    },
    getProList () {
      this.loading = true;
      let formDate = Object.assign({}, this.pager, this.condition);
      Product.queryPager(formDate).then((res) => {
        this.productList = res.list;
        this.pager.total = res.total;
        this.loading = false;
      }).catch(() => {
      });
    },
    rightClose () {
      this.pageIsShow = false;
    },
    resetClose () {
      this.musicIsShow = false;
      this.pageIsShow = false;
      this.idList = [];
      this.list = [];
      this.order = {
        orderDesk: '',
        orderType: '',
        products: []
      };
    },
    handleSizeChange(val) {
      this.pager.limit = val;
      this.getProList();
    },
    handleCurrentChange(val) {
      this.pager.offset = val;
      this.getProList();
    },
    DialogVisible (item) {
      this.centerDialogVisible = true;
      this.product = JSON.parse(JSON.stringify(item));
    },
    addProduct (pro) {
      if (this.idList.indexOf(pro.productId) > -1) {
        this.$confirm('已存在,是否继续添加?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.centerDialogVisible = false;
          this.order.products.map(value => {
            if (value.productId === pro.productId) {
              value.productNumber = value.productNumber + 1;
            }
          });
          this.list.map(value => {
            if (value.pro.productId === pro.productId) {
              value.number += 1;
            }
          });
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
        }).catch(() => {
          this.centerDialogVisible = false;
          this.$message({
            type: 'success',
            message: '已取消添加!'
          });
        })
      }else {
        this.centerDialogVisible = false;
        this.idList.push(pro.productId);
        this.order.products.push({
          productId: pro.productId,
          productNumber: 1
        });
        this.list.push({
          pro: pro,
          number: 1
        });
      }
    }
  }
}
</script>

<style scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    width: 200px;
  }
  .divImg {
    width: 200px;
    height: 200px;
  }
  .divImgMax {
    width: 60%;
  }
  /*img:hover {*/
    /*transform: scale(1.2, 1.2);*/
  /*}*/
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: auto;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
