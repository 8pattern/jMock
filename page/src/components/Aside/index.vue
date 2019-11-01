<template>
  <ul class="mock-list">
    <MockItem v-for="mockItem in mockList" :key="mockItem.url" v-bind="mockItem" />
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import MockItem from './MockItem.vue'

export default {
  name: 'Aside',
  computed: {
    ...mapGetters({
      mockList: 'mockList', 
    }),
  },
  components: {
    MockItem,
  },
}
</script>

<style scoped lang="scss">
  .mock-list {
    margin: 0;
    padding: 0;
  }
</style>
