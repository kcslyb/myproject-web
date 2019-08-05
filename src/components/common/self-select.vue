<template>
<div>
  <input
      :placeholder="placeholder"
      :maxlength="maxlength"
      :min="minlength"/>
</div>
</template>

<script>
  export default {
    name: 'self-select',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      filterable: {
        type: Boolean,
        default: true
      },
      maxlength: {
        type: Number,
        default: 100
      },
      minlength: {
        type: Number,
        default: 0
      }
    },
    methods: {
      onchange(res) {
        console.info(res)
      }
    }
  };
</script>

<style scoped>

</style>
