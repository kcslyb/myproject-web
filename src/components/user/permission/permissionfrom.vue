<template>
  <div align="center" style="width: 500px">
    <h2>{{title}}</h2>
    <div align="left">
      <el-form ref="permissionlist" :model="permissionlist" label-width="100px"
               @submit.prevent="onSubmit('permissionlist')" onsubmit="return false">
        <el-form-item
          label="权限名"
          prop="permissionName"
          :rules="[
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input type="text" v-model="permissionlist.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          label="路径权限"
          prop="permissionUrl"
          class="contact-check"
          :rules="[
            { required: true, message: '请输入路径权限', trigger: 'blur' },
            { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input type="text" v-model="permissionlist.permissionUrl" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单权限"
          prop="permissionMethod"
          class="contact-check"
          :rules="[
            { required: true, message: '菜单权限', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input type="text" v-model="permissionlist.permissionMethod" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          label="权限描述"
          prop="permissionDescription"
          :rules="[
            { required: true, message: '权限描述', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input type="text" v-model="permissionlist.permissionDescription" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="onSubmit('permissionlist')" native-type="submit" :disabled="doing">提交</el-button>
          <el-button @click="doClose">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'from',
    props: {
      // userDto: {},
      permissionlist: {
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
        roleSelect: [],
        doing: false,
        permissionDtos: {
          permissionId: '',
          permissionName: '',
          permissionUrl: '',
          permissionMethod: '',
          permissionDescription: ''
        },
        value11: []
      };
    },
    methods: {
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (valid && self.permissionlist) {
            this.permissionDtos = this.permissionlist;
            let formData = JSON.parse(JSON.stringify(self.permissionDtos));
            this.doing = true;
            if (this.action === 'add') {
              this.$http.post(this.HOST + '/permission/add/', formData).then(() => {
                this.doing = false;
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增权限"' + self.permissionDtos.permissionName + '"成功'
                });
                formData.list = this.getSelectRoles(formData, this.roleSelect);
                self.$emit('change', formData);
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增权限"' + self.permissionDtos.permissionName + '"失败'
                });
                this.doing = false;
              });
            } else {
              // alert(user)
              self.$http.put(self.HOST + '/permission/' + self.permissionDtos.permissionId, formData).then(() => {
                this.doing = false;
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '修改权限"' + self.permissionDtos.permissionName + '"成功'
                });
                formData.list = this.getSelectRoles(formData, this.roleSelect);
                self.$emit('change', formData);
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改权限"' + self.permissionDtos.permissionName + '"失败'
                });
                this.doing = false;
              });
            }
          };
        })
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
