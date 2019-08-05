<template>
  <div>
    <div align="center">
      <h3>{{action === 'add'?'添加字典项':'编辑字典项'}}</h3>
    </div>
    <el-form :model="dict" :rules="rules" ref="formName" label-position="right" label-width="150px" class="demo-ruleForm">
      <el-form-item label="选择添加类型" prop="dictionaryGroupName" v-show="action === 'add'">
        <el-select v-model="type" clearable placeholder="请选择添加类型" style="width: 100%;">
        <el-option
        v-for="item in [{key: 'group', value: '字典组'}, {key: 'item', value: '字典项'}]"
        :key="item.key"
        :label="item.value"
        :value="item.key">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择字典组" prop="dictionaryGroupName" v-show="type==='item' || action === 'edit'">
        <el-select v-model="dict.dictionaryGroupName" clearable filterable placeholder="请选择字典组" style="width: 100%;">
        <el-option
        v-for="item in groupList"
        :key="item.groupName"
        :label="item.groupNameValue + item.groupName"
        :value="item.groupName">
          <span style="float: left">{{ item.groupNameValue }}</span>
          <span style="float: right; color: #8492a6; font-size: 0.7em">{{ item.groupName }}</span>
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="输入字典组" prop="dictionaryGroupName" v-show="type==='group'">
        <el-input v-model="dict.dictionaryGroupName" placeholder="请输入字典组"></el-input>
      </el-form-item>
      <el-form-item label="字典关键字" prop="dictionaryKey">
        <el-input v-model="dict.dictionaryKey" placeholder="请输入字典关键字"></el-input>
      </el-form-item>
      <el-form-item label="字典项名称" prop="dictionaryLabel">
        <el-input v-model="dict.dictionaryLabel" placeholder="请输入字典项名称"></el-input>
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
  import {DataDict} from '@/api/resources'
  export default {
    name: 'dictionaryForm',
    props: {
      dict: {
        type: Object,
        default: () =>{}
      },
      action: {
        type: String,
        default: ''
      },
      actionType: {
        type: String,
        default: ''
      },
      groupList: {
        type: Array,
        default: () =>[]
      }
    },
    data() {
      return {
        type: '',
        rules: {
          dictionaryGroupName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          dictionaryKey: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          dictionaryLabel: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add') {
              DataDict.save(this.dict).then(()=> {
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
              DataDict.update(this.dict).then(()=> {
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
        this.type = '';
        this.resetForm(formDate);
        this.$emit('right-Close');
      }
    }
  };
</script>

<style scoped>

</style>
