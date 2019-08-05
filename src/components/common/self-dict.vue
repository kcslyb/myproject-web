<template>
<span>{{value}}</span>
</template>

<script>
  export default {
    name: 'CustomDict',
    props: {
      dictGroup: {
        type: String,
        default: ''
      },
      dictValue: {
        type: String,
        default: ''
      }
    },
    compute: {
      value: () => {
        this.$getDictionaryByGroup(this.dictGroup).then((res) => {
          let result = res ? res.filter(value => {
            return value.dictionaryKey === this.dictValue;
          }) : [];
          return result.length > 0 ? result[0].dictionaryLabel : '不存在该字典';
        })
      }
    }
  };
</script>

<style scoped>

</style>
