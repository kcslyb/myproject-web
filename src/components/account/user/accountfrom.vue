<template>
  <div style="width: 500px" align="center">
    <h2 class="clearfix">{{action === 'add'?'添加账号':'编辑账号'}}</h2>
    <el-alert
      title="默认密码:123456"
      type="success"
      effect="dark"
      :closable="false">
    </el-alert>
    <div align="left">
      <el-form ref="accountform" :model="user" label-width="100px"
               @submit.prevent="onSubmit('accountform')" onsubmit="return false">
        <el-form-item label="用户头像" prop="userAvatar" :rules="[
          { required: true, message: '请上传用户头像', trigger: 'blur' }
         ]">
          <self-fileupload :fileList="fileList" :check-type="true" @callback="handleAvatarSuccess"></self-fileupload>
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="userName"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input type="text" v-model="user.userName" placeholder="请输入"></el-input>
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
          <el-input type="text" v-model="user.userPhone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          label="Email"
          prop="userEmail"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]"
        >
          <el-input type="text" v-model="user.userEmail" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="用户级别" prop="userRole" :rules="[
          { required: true, message: '请选择用户级别', trigger: 'blur' }
         ]">
          <template>
            <el-select v-model="user.userDepartment" filterable placeholder="请选择级别" style="width: 100%">
              <el-option
                v-for="item in departmentTypes"
                :key="item.departmentId"
                :label="item.departmentName + item.departmentNumber"
                :value="item.departmentId">
                <span style="float: left">{{ item.departmentName }}</span>
                <span style="float: right; color: #8492a6; font-size: 0.7em">{{ item.departmentNumber }}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="角色" prop="userRole" :rules="[
          { required: true, message: '请选择用户角色', trigger: 'blur' }
         ]">
          <template>
            <el-select v-model="user.userRole" filterable placeholder="请选择角色" style="width: 100%">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleDescription + item.roleName"
                :value="item.roleId">
                <span style="float: left">{{ item.roleDescription }}</span>
                <span style="float: right; color: #8492a6; font-size: 0.7em">{{ item.roleName }}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button size="small" type="primary" plain @click="onSubmit('accountform')" native-type="submit" :disabled="doing">提交</el-button>
          <el-button size="small" type="info" plain @click="doClose">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {UserAccount, Role, UserDepartment} from '@/api/resources'
  import SelfFileupload from '../../common/self-fileupload';
  export default {
    name: 'from',
    components: {SelfFileupload},
    props: {
      user: {
        type: Object,
        default: () =>{}
      },
      action: {
        type: String,
        default: ''
      }
    },
    watch: {
      user(u) {
        this.fileList = [];
        if (u.userAvatar) {
          this.fileList.push({name: u.userName + ' avatar', url: this.$REPLACEURL(u.userAvatar)});
        }
      }
    },
    mounted() {
      this.getRoleList();
      this.getDepartmentTypes();
    },
    data() {
      return {
        userRoleId: '',
        fileList: [],
        roleList: [],
        departmentTypes: [],
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
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          // if (this.user.userAvatar) {
          //   this.user.userAvatar = this.$HOSTURL(this.user.userAvatar);
          // }
          let formData = JSON.parse(JSON.stringify(this.user));
          if (this.action === 'add') {
            formData.userStatus = '0';
            UserAccount.save(formData).then((res) => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                title: '成功',
                message: '新增平台用户"' + this.user.userName + '"成功'
              });
              this.doCloseReload();
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                title: '失败',
                message: '新增平台用户"' + this.user.userName + '"失败'
              });
              this.doing = false;
            });
          } else {
            UserAccount.update(formData).then((res) => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                title: '成功',
                message: '修改平台用户"' + this.user.userName + '"成功'
              });
              this.doCloseReload();
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                title: '失败',
                message: '修改平台用户"' + this.user.userName + '"失败'
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
      getRoleList() {
        Role.query({}).then((res) => {
          this.roleList = res;
        })
      },
      getDepartmentTypes() {
        UserDepartment.query().then((res) => {
          this.departmentTypes = res;
        })
      },
      handleAvatarSuccess(file) {
        this.user.userAvatar = file.filePath;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG && !isPng) {
          this.$message.error('上传头像图片只能是 JPG4 或 PNG 格式!');
          return false;
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
          return false;
        }
        return file;
      },
      doCloseReload(){
        this.$emit('right-Close');
        this.$refs['accountform'].resetFields();
      },
      doClose() {
        this.$emit('rightClose');
        this.$refs['accountform'].resetFields();
      }
    }
  };
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    border: 1px solid #e6e6e6;
    border-radius: 50px;
    display: -webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    -webkit-box-orient: vertical;
    text-align: center
  }
  .avatar {
    width: 100px;
    height: 100px;
    border: 1px solid #e6e6e6;
    border-radius: 50px;
    display: -webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    -webkit-box-orient: vertical;
    text-align: center
  }
</style>
