<template>
  <el-container>
    <el-main>
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="havePrem"
          filterable
          :titles="['其它', '已有']"
          :button-texts="['取消权限', '授予权限']"
          @change="handleChange"
          :data="allPrem">
          <span slot-scope="{ option }">{{ option.label }}</span>
        </el-transfer>
      </div>
    </el-main>
    <el-footer align="right">
      <el-button type="text" @click="onSubmitAdd" native-type="submit" :disabled="doing"><el-tag>提交</el-tag></el-button>
      <el-button type="text" @click="doClose"><el-tag>取消</el-tag></el-button>
    </el-footer>
  </el-container>

</template>

<script>
  export default {
    name: 'rolepermissionfrom',
    props: {
      rolelist: {
        type: Object,
        default: () =>{}
      },
      title: {
        type: String,
        default: '编辑'
      },
      actionType: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        havePrem: [],
        allPrem: [],
        isChange: false,
        isGetList: true,
        doing: false,
        value: [],
        permissionDtos: [],
        roleperms:{
          roleId: '',
          permIds: [],
        },
        permid: {
          permissionId: ''
        }
      };
    },
    watch: {
      rolelist() {
        this.setPerm();
      }
    },
    mounted() {
      this.getPermissionDtos();
    },
    methods: {
      onSubmitAdd () {
        if (this.isChange) {
          this.roleperms.permIds = this.havePrem;
          this.roleperms.roleId = this.rolelist.roleId;
          let formData = JSON.parse(JSON.stringify(this.roleperms));
          this.api.put(this.HOST + '/role/perm/add', formData).then(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '修改成功'
            });
            this.doClose()
          }).catch(() => {
            this.doClose();
          });
        } else {
          this.doClose()
        }
      },
      doClose() {
        this.havePrem = [];
        this.allPrem = [];
        this.$emit('right-close');
      },
      setPerm () {
        let date = [];
        this.permissionDtos.forEach((value1) => {
          date.push({
            key: value1.permissionId,
            label: value1.permissionName
          })
        });
        this.allPrem = JSON.parse(JSON.stringify(date));
        let have = [];
        this.rolelist.permissionDtos.forEach(value2 => {
          have.push(value2.permissionId)
        });
        this.havePrem = JSON.parse(JSON.stringify(have))
      },
      getPermissionDtos () {
        let _this = this;
        if (_this.isGetList){
          let url = this.HOST + '/permission/list';
          _this.api.get(url).then((res) => {
            _this.isGetList = false;
            _this.permissionDtos = res;
            this.setPerm();
          }).catch(() => {
          });
        } ;

      },
      handleChange(value, direction, movedKeys) {
        this.isChange = true;
      }
    }
  };
</script>

<style scoped>

</style>
