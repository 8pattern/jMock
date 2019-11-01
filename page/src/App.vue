<template>
  <div id="app">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-container>
          <el-aside>
            <Aside />
          </el-aside>
          <el-main>
            <Main />
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <Dialog />
  </div>
</template>

<script>
import Aside from './components/Aside'
import Main from './components/Main'
import Dialog from './components/Dialog'

export default {
  name: 'app',
  components: {
    Aside,
    Main,
    Dialog,
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
