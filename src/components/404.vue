<template>
  <el-main>
    <div>
      <div style="text-align: center">
        <h1>  What have you done? </h1>
        <div>
          <el-button type="text" style="display: inline" @click="goBack">
            <h4> Now Go Back Using Below LInk</h4>
          </el-button>
        </div>
        <span id="error-link">{{number}}</span>
        <h2>! ERROR DECETED !</h2>
      </div>
    </div>
  </el-main>
</template>

<script>
  export default {
    name: 'not',
    data () {
      return {
        number: 404
      }
    },
    mounted () {
      // this.setNumber();
    },
    methods: {
      // setNumber () {
      //   this.number++;
      //   let timeid;
      //   if (this.number = 404) {
      //     window.clearInterval(timeid);
      //     timeid = setTimeout(this.setNumber,10);
      //   };
      //
      // }
      goBack() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      }
    }
  };
</script>

<style scoped>
  #error-link {
    font-size: 10em;
    padding: 10px;
    box-sizing: border-box;
  }
</style>
