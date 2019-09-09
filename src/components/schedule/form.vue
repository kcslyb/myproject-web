<template>
  <div>
    <el-form :model="formDate" :rules="rules" class="demo-ruleForm" label-width="100px" ref="formDate">
      <el-form-item label="事件名称" prop="scheduleTitle">
        <el-input v-model="formDate.scheduleTitle"></el-input>
      </el-form-item>
      <el-form-item label="事件备注" prop="scheduleRemake">
        <el-input :autosize="{ minRows: 3, maxRows: 5}" type="textarea" v-model="formDate.scheduleRemake"></el-input>
      </el-form-item>
      <el-form-item>
        <div align="right">
          <el-button @click="commit" size="mini" type="success">提交</el-button>
          <el-button @click="close" size="mini" type="info">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {SCHEDULE} from '@/api/resources';

  export default {
    name: 'schedule-form',
    data() {
      return {
        formDate: {
          scheduleTitle: '',
          scheduleRemake: ''
        },
        rules: {
          scheduleTitle: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          scheduleRemake: [
            {required: true, message: '请填写活动形式', trigger: 'blur'},
            {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      commit() {
        this.$refs['formDate'].validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.formDate));
            SCHEDULE.save(data).then(res => {
              if (res && res.scheduleId) {
                this.$notify({
                  type: 'success',
                  message: '添加成功'
                });
                this.close();
              }
            });
          } else {
            return false;
          }
        });
      },
      close() {
        this.$refs['formDate'].resetFields();
        this.$emit('close');
      }
    }
  };
</script>

<style scoped>

</style>
