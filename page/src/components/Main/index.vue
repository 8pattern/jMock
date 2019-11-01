<template>
  <div class="mock-detail">
    <el-input v-model="mockPath"></el-input>
    <MockDetailList />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import MockDetailList from './MockDetailList'

export default {
  name: 'Main',
  computed: {
    ...mapState({
      mockPath: state => state.currentMockItemUrl,
    }),
  },
  components: {
    MockDetailList,
  },
}
</script>

<style scoped lang="scss">

</style>
