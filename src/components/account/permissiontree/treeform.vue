<template>
<div style="width: 600px">
  <div style="padding: 20px; font-size: 1.3em">{{action === 'add'?'添加节点':'修改节点'}}</div>
  <el-form :model="permMenu" :rules="rules" ref="formName" label-position="right" label-width="150px" class="demo-ruleForm">
    <el-form-item label="节点类型" prop="permtype">
      <el-select v-model="permMenu.permtype" clearable placeholder="请选择" style="width: 100%;">
        <el-option
          v-for="item in titleList"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="该节点父节点" prop="permparent" v-show="permMenu.permtype === '1' || permMenu.permtype === 1">
      <el-select v-model="permMenu.permparent" clearable placeholder="请选择" style="width: 100%;">
        <el-option
          v-for="item in parentList"
          :key="item.permid"
          :label="item.permkey +'(' +item.permvalue + ')'"
          :value="item.permid">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="节点key值" prop="permkey">
      <el-input v-model="permMenu.permkey" placeholder="权限管理"></el-input>
    </el-form-item>
    <el-form-item label="节点value值" prop="permvalue">
        <el-input v-model="permMenu.permvalue" placeholder="permission-manage"></el-input>
    </el-form-item>
    <el-form-item label="节点path值" prop="permpath">
      <el-input v-model="permMenu.permpath" placeholder="permission"></el-input>
    </el-form-item>
    <el-form-item label="选择需要的子节点" v-show="permMenu.permtype === '0' || permMenu.permtype === 0">
      <el-checkbox :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="add"></el-checkbox>
        <el-checkbox label="delete"></el-checkbox>
        <el-checkbox label="update"></el-checkbox>
        <el-checkbox label="query"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button size="mini" type="primary" @click="submitForm('formName')">提交</el-button>
      <el-button size="mini" type="primary" @click="resetForm('formName')">重置</el-button>
      <el-button size="mini" type="primary" @click="rightClose('formName')">取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import {aesEncrypt,aesDecrypt}from '../../../utils/encryption'
  import {PermMenu} from '@/api/resources'
  export default {
    props: {
      permMenu: {
        type: Object,
        default: () =>{}
      },
      parentList: {
        type: Array,
        default: () =>[]
      },
      action: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isIndeterminate: false,
        checkList: [],
        rules: {
          permkey: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          permpath: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          permtype: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          permvalue: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          permparent: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        },
        titleList: [
          {
            key: '0',
            value: '一级节点权限'
          },
          {
            key: '1',
            value: '二级节点权限'
          }
        ],
        checkedOptions: ['add', 'delete', 'update', 'query'],
        options: ['添加', '删除', '修改', '查询']
      }
    },
    methods: {
      submitForm(formName) {
        if (this.permMenu.permtype === 0 || this.permMenu.permtype === '0') {
          this.permMenu.permparent='null';
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add') {
              PermMenu.save(this.permMenu).then(async (res)=> {
                if (this.checkList.length && this.checkList.length > 0) {
                  await this.checkList.forEach(async (value, index) => {
                    let formData = JSON.parse(JSON.stringify(this.permMenu));
                    formData.permtype = '1';
                    formData.permparent = res.permid;
                    formData.permkey = this.options[index] + formData.permkey.substring(0, formData.permkey.length-2);
                    formData.permvalue = value+ '-' + formData.permvalue;
                    formData.permpath = formData.permpath + '/' + value;
                    await PermMenu.save(formData).then((res)=> {});
                  })
                }
                this.checkList = [];
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
              PermMenu.update(this.permMenu).then(()=> {
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
      handleCheckAllChange() {
        this.checkList = this.checkList.length === 0 ? this.checkedOptions : [];
        this.isIndeterminate = !this.isIndeterminate;
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
