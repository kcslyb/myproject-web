<template>
<div class="el-main">
  <div align="center">
    <el-header><h3>添加地址</h3></el-header>
  </div>
  <el-form :model="address" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="地址名称" prop="addressName">
      <el-input v-model="address.addressName"></el-input>
    </el-form-item>
    <el-form-item label="详细地址" prop="addressDetail">
      <el-input v-model="address.addressDetail"></el-input>
    </el-form-item>
    <el-form-item label="">
      <div align="right">
        <el-button type="success" @click="commit">提交</el-button>
        <el-button type="info" @click="close">取消</el-button>
      </div>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import {Address} from '../../../api/resources';

  export default {
    name: 'address',
    data() {
      return {
        address: {
          addressName: '',
          addressDetail: '',
          addressDeleteFlag: 0
        },
        resultAddress: {},
        rules: {
          addressName: [
            {required: true, message: '请输地址名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          addressDetail: [
            {required: true, message: '请输入详细地址', trigger: 'change'},
            {min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      commit() {
        Address.save(JSON.parse(JSON.stringify(this.address))).then(res => {
          this.resultAddress = res;
          this.$emit('closeAddress', this.resultAddress);
        })
      },
      close() {
        this.$emit('closeAddress', this.resultAddress);
      }
    }
  };
</script>

<style scoped>

</style>
