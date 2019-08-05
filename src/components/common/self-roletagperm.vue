<template>
  <span class="perm" v-if="isShow">
    <slot></slot>
  </span>
</template>

<script>
  export default {
    name: 'CustomPermRole',

    props: ['label'],

    data() {
      return {};
    },
    computed: {
      isShow: function () {
        return this.$store.state.user.role === this.label;
      }
    }
  };
</script>
