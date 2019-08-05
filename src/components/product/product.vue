<template>
  <el-main>
    <el-header align="center">
      <span>{{action === 'add' ? '添加':'修改'}}</span>
    </el-header>
    <el-main style="width: 450px;">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="类型" prop="productType">
          <el-select v-model="ruleForm.productType" placeholder="请选择类型" style="width: 100%;">
            <el-option
              v-for="item in dishesType"
              :key="item.dictionaryId"
              :label="item.dictionaryLabel"
              :value="item.dictionaryKey">
              <span style="float: left">{{ item.dictionaryLabel }}</span>
              <span style="float: right; color: #8492a6; font-size: 0.7em">{{ item.dictionaryKey }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="productName">
          <el-input v-model="ruleForm.productName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="productPrise" >
          <el-input v-model.number="ruleForm.productPrise" autocomplete="off" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="productDescription">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="ruleForm.productDescription"></el-input>
        </el-form-item>
        <el-form-item label="上传样例" prop="productFileInfo">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="$HOSTURL('http://127.0.0.1:8018/api/file/upload')"
            :on-success="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            list-type="picture">
            <el-button size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
          </el-upload>
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
  import {aesDecrypt} from '../../utils/encryption';
  import {Product} from '@/api/resources'
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
        IsUpload: false,
        dishesType: [],
        product: {
          proId: '',
          proLable: '',
          proPrise: 0,
          number: 1,
          proSrc: ''
        },
        pro: {
          proId: '',
          proLable: '',
          proType: '',
          proPath: '',
          proPrise: '',
          proSrc: ''
        },
        rules: {
          productName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          productType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          productPrise: [
            { required: true, message: '价格不能为空'},
            { required: true, message: '价格必须为数字值'}
          ],
          productDescription: [
            { required: true, message: '描述不能为空'},
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
          ]
        },
        doing: true
      };
    },
    mounted() {
      this.getDishesType();
    },
    methods: {
      getDishesType() {
        this.$getDictionaryByGroup('dishesType').then((res) => {
          this.dishesType = res;
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.action === 'add'){
              if (this.IsUpload) {
                let formData = JSON.parse(JSON.stringify(this.ruleForm));
                this.doing = true;
                this.$api.post(this.$HOST + '/product', formData).then(() => {
                  this.$notify.success({
                    duration: 2000,
                    name: '成功',
                    message: '新增成功'
                  });
                  this.$emit('rightClose', formData);
                })
              } else {
                this.$message.error('请上传样例！');
              }
            } else {
              let formData = JSON.parse(JSON.stringify(this.ruleForm));
              this.doing = true;
              this.$api.put(this.$HOST + '/product', formData).then(() => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '修改成功'
                });
                this.$emit('rightClose', formData);
              })
            }
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleRemove() {
        this.ruleForm.productFileInfo = '';
        this.IsUpload = false;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 格式 或 PNG 格式!');
          return false;
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          return false;
        }
        return file;
      },
      handlePreview(response) {
        let data = aesDecrypt(response);
        this.ruleForm.productFileInfo = data.data.fileId;
        this.IsUpload = true;
      },
    }
  };
</script>

<style scoped>

</style>
