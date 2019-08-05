<template>
<div style="width: 600px">
  <div style="padding: 20px; font-size: 1.3em">{{action === 'add'?'添加事件':'修改事件'}}</div>
  <el-form :model="account" :rules="rules" ref="formName" label-position="right" label-width="150px" class="demo-ruleForm">
    <el-form-item label="account名称" prop="accountTitle">
      <!--<el-input v-model="account.accountTitle"></el-input>-->
      <el-select v-model="account.accountTitle" clearable placeholder="请选择" style="width: 100%;">
        <el-option
          v-for="item of titleList"
          :key="item.dictionaryId"
          :label="item.dictionaryLabel"
          :value="item.dictionaryLabel">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="account描述" prop="accountDescript">
      <el-input type="textarea" v-model="account.accountDescript"></el-input>
    </el-form-item>
    <el-form-item label="account开消" prop="accountPrise"
      :rules="[{ required: true, message: '不能为空'},
      { type: 'number', message: '必须为数字值'}]">
        <el-input type="number" v-model.number="account.accountPrise" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="account备注" prop="accountRemark">
      <el-input type="textarea" v-model="account.accountRemark"></el-input>
    </el-form-item>
    <el-form-item align="left">
      <el-button size="mini" type="primary" @click="submitForm('formName')">提交</el-button>
      <el-button size="mini" type="primary" @click="resetForm('formName')">重置</el-button>
      <el-button size="mini" type="primary" @click="rightClose('formName')">取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import {aesEncrypt,aesDecrypt}from '../../utils/encryption'
  import {account, DataDict} from '@/api/resources'
  export default {
    props: {
      account: {
        type: Object,
        default: () =>{}
      },
      action: {
        type: String,
        default: ''
      }
    },
    mounted() {
      this.getTitleList()
    },
    data() {
      return {
        titleList: '',
        rules: {
          accountTitle: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          accountDescript: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
          ],
          accountRemark: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      getTitleList() {
        this.$getDictionaryByGroup('noteType').then(res => {
          this.titleList = res;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add') {
              account.add(this.account).then(()=> {
                this.rightClose();
                this.$notify.success({
                  title: '提示',
                  message: '添加成功'
                })
              }).catch(()=> {
                this.$notify.error({
                  title: '提示',
                  message: '添加失败'
                })
              });
            } else {
              account.edit(this.account).then(()=> {
                this.rightClose();
                this.$notify.success({
                  title: '提示',
                  message: '编辑成功'
                })
              }).catch(()=> {
                this.$notify.error({
                  title: '提示',
                  message: '编辑失败'
                })
              });
            }
          }
        });
      },
      resetForm(formName) {
        if (this.$refs[formName]!==undefined) {
          this.$refs[formName].resetFields();
        }
      },

      rightClose(formDate) {
        this.resetForm(formDate);
        this.$emit('right-Close');
      }
    }
  };
</script>

<style scoped>

</style>
