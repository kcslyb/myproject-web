<template>
<div style="width: 600px;">
  <div style="padding: 20px; font-size: 1.3em; text-align: center">{{action === 'add'?'添加':'修改'}}</div>
  <el-form :model="tease" :rules="rules" ref="formName" label-position="right" label-width="150px" class="demo-ruleForm">
    <el-form-item label="标题" prop="teaseTitle">
      <el-input v-model="tease.teaseTitle"></el-input>
    </el-form-item>
    <el-form-item label="知识点：" prop="teaseDto">
      <el-input :autosize="{ minRows: 4, maxRows: 8}" type="textarea" v-model="tease.teaseDto"></el-input>
    </el-form-item>
    <el-form-item label="实例：" prop="teaseContent">
      <el-input :autosize="{ minRows: 5, maxRows: 8}" type="textarea" v-model="tease.teaseContent"></el-input>
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
  import {account} from '@/api/resources'
  export default {
    props: {
      tease: {
        type: Object,
        default: () => {}
      },
      action: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        rules: {
          teaseTitle: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          teaseContent: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 5, max: 100, message: '长度在 5 到 200 个字符', trigger: 'blur' }
          ],
          teaseDto: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add') {
              let url = this.$HOST + '/tease/addTease';
              let parameter = JSON.parse(JSON.stringify(this.tease));
              this.$api.post(url,parameter).then(() => {
                this.rightClose();
                this.$notify.success({
                  title: '提示',
                  message: '添加成功'
                })
              }).catch(() => {
                this.$notify.error({
                  title: '提示',
                  message: '添加失败'
                })
              });
            } else {
              let url = this.$HOST + '/tease/update';
              let parameter = JSON.parse(JSON.stringify(this.tease));
              this.$api.post(url,parameter).then((res) => {
                this.rightClose();
                this.$notify.success({
                  title: '提示',
                  message: '编辑成功'
                })
              }).catch(() => {
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
