<template>
  <div align="center">
    <h2>{{title}}</h2>
    <el-form ref="accountform" :model="rolelist" label-width="100px"
             @submit.prevent="onSubmit('accountform')" onsubmit="return false">
      <el-form-item
        label="角色名"
        prop="roleName"
        :rules="[
            { required: true, message: '请输入角色名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['blur', 'change'] }
          ]"
      >
        <el-input type="text" v-model="rolelist.roleName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item
        label="角色描述"
        prop="roleDescription"
        class="contact-check"
        :rules="[
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 15 个字符', trigger: ['blur', 'change'] }
          ]"
      >
        <el-input type="text" v-model="rolelist.roleDescription" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item align="left">
        <el-button type="primary" @click="onSubmit('accountform')" native-type="submit" :disabled="doing">提交</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  /* eslint-disable vue/require-valid-default-prop,no-unused-vars */

  export default {
    name: 'from',
    props: {
      // userDto: {},
      rolelist: {
        type: Object,
        default: () =>{}
      },
      title: {
        type: String,
        default: ''
      },
      action: {
        type: String,
        default: ''
      },
      actionType: {
        type: Boolean,
        default: true
      },
    },
    data () {
      return {
        roleId: '',
        role: {
          roleId: '',
          roleName: '',
          roleDescription: '',
        },
        roleSelect: [],
        doing: false,
        permissionDtos: [],
      };
    },
    methods: {
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.role = this.rolelist;
          let formData = JSON.parse(JSON.stringify(self.role));
          this.doing = true;
          if (this.action === 'add') {
            this.$http.post(this.HOST + '/role/add/', formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增平台用户"' + self.role.roleName + '"成功'
              });
              formData.list = this.getSelectRoles(formData, this.roleSelect);
              self.$emit('change', formData);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增平台用户"' + self.role.roleName + '"失败'
              });
              this.doing = false;
            });
          } else {
            // alert(user)
            self.$http.put(self.HOST + '/role/' + this.role.roleId, formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改平台用户"' + self.role.roleName + '"成功'
              });
              formData.list = this.getSelectRoles(formData, this.roleSelect);
              self.$emit('change', formData);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '修改平台用户"' + self.role.roleName + '"失败'
              });
              this.doing = false;
            });
          }
        });
      },
      getSelectRoles(formData, roles) {
        return roles.filter(f => formData.list.some(s => s.roleId === f.id)).map(m => {
          return {
            roleId: m.id,
            title: m.title
          };
        });
      },
      doClose() {
        // window.opener = null
        this.$emit('right-close');
        // this.$refs['accountform'].resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
