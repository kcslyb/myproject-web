<template>
  <div>
    <div>
      <el-header>
        <page-right :show="pageIsShow" @rightClose="rightClose">
          <product
            :action="action"
            :ruleForm="product"
            @rightClose="rightClose">
          </product>
        </page-right>
        <div align="right">
            <perm label="add-product-manage">
              <el-tooltip class="item" effect="dark" content="新增" placement="top" style="margin-top: 10px">
                <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" plain circle @click.stop.prevent="proAdd"></el-button>
              </el-tooltip>
              添加
            </perm>
        </div>
      </el-header>
      <div v-loading="loading">
        <el-table
          :data="tableData2"
          :height="defaultHeight"
          style="width: 100%"
          align="center"
          :row-class-name="tableRowClassName">
          <el-table-column type="index" label="编号" width="50" :index="indexMethod" align="center"></el-table-column>
          <el-table-column label="样例" width="150" align="center">
            <template slot-scope="scope" >
              <img title="样例" :src="$REPLACEURL(scope.row.productFilePath)"/>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="菜名">
            <template slot-scope="scope">
              {{scope.row.productName}}
              <el-tag size="mini" type="primary" v-if="scope.row.productStatus === '0'">售出{{scope.row.productSalesNumber}}笔</el-tag>
              <el-tag size="mini" type="info" v-else>已禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productPrise" label="价格">
            <template slot-scope="scope">
              ¥{{scope.row.productPrise}}
            </template>
          </el-table-column>
          <el-table-column prop="proType" label="类型" :formatter="typeSet"></el-table-column>
          <el-table-column prop="productCreateByName" label="创建人"></el-table-column>
          <el-table-column prop="productCreateTime" label="创建时间" :formatter="dateSet" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productUpdateByName" label="修改人"></el-table-column>
          <el-table-column prop="productUpdateTime" label="修改时间" :formatter="modifySet" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <perm label="update-product-manage">
                <el-button type="warning" size="mini" plain circle class="el-icon-edit" @click="update(scope.row)"></el-button>编辑
              </perm>
              <perm label="delete-product-manage">
                <el-button :type="scope.row.productStatus === '1' ? 'primary' : 'danger'" size="mini" plain circle class="el-icon-refresh" @click="remove(scope.row)"></el-button>{{scope.row.productStatus === '1' ? '启用' : '停用'}}
              </perm>
            </template>
          </el-table-column>
        </el-table>
        <el-footer align="center" v-show="tableData2.length">
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
    </div>
  </div>
</template>

<script>
  import pageRight from '../common/self-pageright.vue'
  import product from '../product/product.vue'
  import Perm from '../common/self-perm';
  import {Product} from '@/api/resources'

  export default {
    name: 'productmanager',
    components: {
      Perm,
      pageRight: pageRight,
      product:product
    },
    data() {
      return {
        pageIsShow: false,
        loading: false,
        defaultHeight: window.innerHeight - 230,
        tableData2: [],
        dishesType: [],
        product: {},
        action: '',
        condition: {},
        pager: {
          offset: 1,
          limit: 7,
          total: 0
        }
      }
    },
    mounted () {
      this.getProList();
      this.getDishesType();
    },
    methods: {
      handleSizeChange(val) {
        this.pager.limit = val;
        this.getProList();
      },
      handleCurrentChange(val) {
        this.pager.offset = val;
        this.getProList();
      },
      getDishesType() {
        this.$getDictionaryByGroup('dishesType').then((res) => {
          this.dishesType = res;
        })
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 0) {
          return 'warning-row';
        } else if (rowIndex%2 === 1) {
          return 'success-row';
        }
        return '';
      },
      indexMethod(index) {
        return ((this.pager.offset - 1) * this.pager.limit) + index + 1;
      },
      rightClose () {
        this.pageIsShow = false;
        this.getProList();
      },
      getProList () {
        this.loading = true;
        let formData = Object.assign({}, this.condition, this.pager);
        Product.queryPager(formData).then((res) => {
          this.tableData2 = res.list;
          this.pager.total = res.total;
          this.loading = false;
        });
      },
      proAdd () {
        this.action = 'add';
        this.product = {};
        this.pageIsShow = true
      },
      update (row) {
        this.action = 'update';
        this.product = JSON.parse(JSON.stringify(row));
        this.pageIsShow = true;
      },
      remove (row) {
        let _this = this;
        _this.$confirm('确认更改？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.$HOST + '/product/' + row.productId;
          _this.$api.delete(url).then((res) => {
            _this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '更改成功'
            });
            _this.getProLIst();
          }).catch(() => {});
        }).catch(() => {});
      },
      typeSet (date) {
        let type = this.dishesType.filter(value => {
          return value.dictionaryKey === date.productType;
        });
        return type[0].dictionaryLabel;
      },
      dateSet (row) {
        return this.$formatStringtoDateTime(row.productCreateTime)
      },
      modifySet (row) {
        return this.$formatStringtoDateTime(row.productUpdateTime)
      }
    },
  };
</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  img {
    height: 50px;
    width: 50px;
  }
  img:hover {
    transform: scale(1.3, 1.3);
  }
</style>
