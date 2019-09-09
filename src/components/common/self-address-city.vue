<template>
  <div>
    <el-cascader
        :options="options"
        :props="props"
        :style="style"
        @change="change"
        clearable
        filterable
        placeholder="请选择地址"
        size="size"
        v-model="value">
    </el-cascader>
  </div>
</template>

<script>
  import address from '@/utils/data-utils';

  export default {
    name: 'CustomAddressCity',
    props: {
      width: {
        type: String,
        default: '50%'
      },
      size: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        props: {
          value: 'label'
        },
        options: address.address,
        style: {
          width: this.width
        },
        value: ''
      };
    },
    methods: {
      change() {
        let address = '';
        this.value.forEach(v => {
          if (v !== '市辖区') {
            address += v;
          }
        });
        this.$emit('input', address);
      }
    }
  };
</script>

<style scoped>

</style>
