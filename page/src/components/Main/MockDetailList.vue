<template>
  <el-table :data="tableData" style="width: 100%" @row-click="rowClick">
    <el-table-column label="" min-width="1">
      <template v-slot="scope">
        <el-switch v-model="scope.row.isOpen" :disabled="(scope.row.type || scope.row.content) === null" />
      </template>
    </el-table-column>
    <el-table-column label="Method" min-width="1">
      <template v-slot="scope">
        <span v-text="scope.row.method" />
      </template>
    </el-table-column>
    <el-table-column label="Type" prop="type" min-width="1" />
    <el-table-column label="Content" prop="content" min-width="7" />
  </el-table>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { ActionEvents } from '../../store'

export default {
  name: 'MockDetailList',
  computed: {
    tableData() {
      return this.methodList.map((method) => ({
        isOpen: false, type: null, content: null, ...this.mockData[method], method 
      }))
    },
    ...mapState({
      methodList: state => state.config.supportedMethodList,
    }),
    ...mapGetters({
      mockData: 'mockData',
    }),
  },
  methods: {
    rowClick(row) {
      this.$store.dispatch(ActionEvents.OPEN_DIALOG, {
        url: this.$store.state.currentMockItemUrl,
        method: row.method,
      })
    },
  },
  components: {
  },
}
</script>

<style scoped lang="scss">

</style>
