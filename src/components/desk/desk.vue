<template>
  <el-main>
    <el-header align="center">
      <span>{{action === 'add' ? '添加':'修改'}}</span>
    </el-header>
    <el-main style="width: 450px;">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="deskName">
          <el-input v-model="ruleForm.deskName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="deskSerialNumber">
          <el-input v-model="ruleForm.deskSerialNumber" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="容量" prop="deskCapacity" placeholder="容量">
          <el-input type="prise" v-model="ruleForm.deskCapacity" placeholder="容量"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="deskStatus">
          <el-tooltip :content="'Switch value: ' + ruleForm.deskStatus" placement="top">
            <el-switch
              v-model="ruleForm.deskStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="1">
            </el-switch>
          </el-tooltip>
        </el-form-item>
        <el-container>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-container>
      </el-form>
    </el-main>
  </el-main>
</template>

<script>
  import {Desk} from '../../api/resources';

  export default {
    name: 'product',
    props: {
      ruleForm: {
        type: Object,
        default: () =>{}
      },
      action: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        desk: {},
        rules: {
          deskName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          deskSerialNumber: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          ],
          deskStatus: [
            { required: true, message: '请选择状态类型', trigger: 'change' }
          ],
          deskCapacity: [
            { required: true, message: '容量不能为空'},
          ]
        },
        doing: true
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add'){
              let formData = JSON.parse(JSON.stringify(this.ruleForm));
              this.doing = true;
              Desk.save(formData).then(() => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增"' + this.ruleForm.deskName + '"成功'
                });
                this.$emit('rightClose');
              })
            } else {
              let formData = JSON.parse(JSON.stringify(this.ruleForm));
              this.doing = true;
              Desk.update(formData).then(() => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '修改"' + this.ruleForm.deskName + '"成功'
                });
                this.$emit('rightClose');
              })
            }
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
