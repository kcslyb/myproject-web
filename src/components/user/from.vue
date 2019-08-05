<template>
  <div style="width: 500px" align="center">
    <h2 class="clearfix">{{title}}</h2>
    <div align="left">
      <el-form ref="accountform" :model="userlist" label-width="100px"
               @submit.prevent="onSubmit('accountform')" onsubmit="return false">
        <el-form-item
          label="姓名"
          prop="userName"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input type="text" v-model="userlist.userName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="userPhone"
          class="contact-check"
          :rules="[
            { required: true, message: '请输入号码', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入正确的号码', trigger: ['blur', 'change'] }
        ]"
        >
          <el-input type="text" v-model="userlist.userPhone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          label="Email"
          prop="userEmail"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]"
        >
          <el-input type="text" v-model="userlist.userEmail" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <template slot-scope="scope">
            <el-select v-model="userRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="onSubmit('accountform')" native-type="submit" :disabled="doing">提交</el-button>
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
      userlist: {
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
      }
    },
    mounted() {
      this.getRoleList();
    },
    data() {
      return {
        userRoleId: '',
        roleList: [],
        userDto: {
          uuid: '',
          userName: '',
          userPhone: '',
          userEmail: '',
          userStatus: '',
          roleDto: {}
        },
        roleDto: {
          roleId: '',
          roleName: '',
          roleDescription: '',
        },
        roleSelect: [],
        doing: false,
        departmentList: [],
      };
    },
    methods: {
      onSubmit: function (formName) {
        let self = this;
        let user = self.userlist;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          self.roleDto.roleId = this.userRoleId;
          self.userDto = this.userlist;
          self.userDto.roleDto = this.roleDto;
          let formData = JSON.parse(JSON.stringify(self.userDto));
          this.doing = true;
          if (this.action === 'add') {
            this.$http.post(this.HOST + '/user/add', formData).then((res) => {
              this.doing = false;
              if (res.data.returnCode === '502') {
                this.$notify.error({
                  duration: 5000,
                  name: '失败',
                  message: res.data.returnMsg
                });
              } else {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增平台用户"' + self.userDto.userName + '"成功'
                });
              }
              formData.list = this.getSelectRoles(formData, this.roleSelect);
              self.$emit('change', formData);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增平台用户"' + self.userDto.userName + '"失败'
              });
              this.doing = false;
            });
          } else {
            // alert(user)
            if (this.userRoleId) {
              self.$http.put(self.HOST + '/user/' + user.uuid, formData).then((res) => {
                this.doing = false;
                if (res.data.returnCode === '502') {
                  this.$notify.error({
                    duration: 5000,
                    name: '失败',
                    message: res.data.returnMsg
                  });
                } else {
                  this.$notify.success({
                    duration: 2000,
                    name: '成功',
                    message: '修改平台用户"' + self.userDto.userName + '"成功'
                  });
                }
                // formData.list = this.getSelectRoles(formData, this.roleSelect);
                this.$emit('change');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改平台用户"' + self.userDto.userName + '"失败'
                });
                this.doing = false;
              });
            } else {
              this.$notify({
                title: '提示',
                message: '请选择角色',
              });
              this.doing = false;
            }
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
      getRoleList() {
        let _this = this;
        let url = this.HOST + '/role/list';
        _this.$http.get(url).then((res) => {
          if (res.data.returnCode) {
          } else {
            _this.roleList = res.data;
          }
        }).catch(() => {
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
