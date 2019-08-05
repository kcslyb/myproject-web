<template>
  <span class="perm" v-if="isShow">
    <slot></slot>
  </span>
</template>

<script>
  export default {
    name: 'CustomPerm',
    props: ['label'],
    data() {
      return {};
    },
    computed: {
      isShow: function () {
        return this.$store.state.user.permissions.indexOf(this.label) !== -1;
      }
    }
  };
</script>
<style scoped>
  .perm{
  }
</style>
