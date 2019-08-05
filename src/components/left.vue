<template>
  <div>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside></el-aside>
        <el-main></el-main>
      </el-container>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'left',
  data () {
    return {
      routers: [],
      openeds: ['1'],
      collapsed: false
    }
  },
  computed: {
  },
  methods: {
    getRouters () {
      alert(this.routers)
      // this.routers = this.$router.options.routers
      this.routers.forEach(rout => {
        console.log(rout.name)
        console.log(rout.path)
        console.log(rout.children)
      })
    }
  },
  created () {
    this.$router.options.routes.forEach(route => {
      this.routers.push(route)
      // this.routers.push({
      //   name: route.name,
      //   path: route.path,
      //   children: route.children,
      //   pathToRegexpOptions: route.pathToRegexpOptions
      // })
    })
  }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 800px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
