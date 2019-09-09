<template>
<div>
  <h2 align="center">{{action === 'add'?'添加等级':'编辑等级'}}</h2>
  <el-form :model="department" label-width="100px" :rules="rules" ref="departmentForm" class="demo-ruleForm" >
    <el-form-item label="等级名称：" prop="departmentName">
      <el-input v-model="department.departmentName" placeholder="输入等级名称"></el-input>
    </el-form-item>
    <el-form-item label="等级编号：" prop="departmentNumber">
      <el-input v-model="department.departmentNumber" placeholder="输入等级编号"></el-input>
    </el-form-item>
    <el-form-item label="等级描述：" prop="departmentDescribe">
      <el-input v-model="department.departmentDescribe" placeholder="输入等级描述"></el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" size="small" plain @click="submitForm('departmentForm')">提交</el-button>
      <el-button type="primary" size="small" plain @click="closeForm('departmentForm')">取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import {UserDepartment} from '@/api/resources';

  export default {
    name: 'departmentform',
    props: {
      department: {
        type: Object,
        default: () =>{}
      },
      action: {
        type: String,
        default: ''
      }
    },
    data() {
      return{
        rules: {
          departmentName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          departmentNumber: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 6, message: '长度在6个字符以内', trigger: 'blur' }
          ],
          departmentDescribe: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(fromName) {
        this.$refs[fromName].validate((valid) => {
          if (valid) {
            let formData = JSON.parse(JSON.stringify(this.department));
            if (this.action === 'add') {
              UserDepartment.save(formData).then((res) => {
                this.$notify.success({
                  duration: 2000,
                  title: '成功',
                  message: '添加' + this.department.departmentName + '"成功'
                });
                this.closeFormReload();
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  title: '失败',
                  message: '添加' + this.department.departmentName + '"失败'
                });
                this.closeFormReload();
              })
            } else {
              UserDepartment.update(formData).then((res) => {
                this.$notify.success({
                  duration: 2000,
                  title: '成功',
                  message: '修改"' + this.department.departmentName + '"成功'
                });
                this.closeFormReload();
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  title: '失败',
                  message: '修改"' + this.department.departmentName + '"失败'
                });
                this.closeFormReload();
              })
            }
          } else {
            // console.log('error submit!!');
          }
        })
      },
      closeForm(fromName) {
        // this.$refs[fromName].resetFields();
        this.$emit('rightClose');
      },
      closeFormReload() {
        this.$emit('right-Close');
      }
    }
  };
</script>

<style scoped>

</style>
