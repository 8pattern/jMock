<template>
  <div class="mock-item" :class="{ open: isOpen }" @click="handleMockItemClick">
    <i class="item-switch" @click="switchClick" />
    <div class="mock-info">
      <span class="mock-path" v-text="url"></span>
      <ul class="mock-method-list">
        <li class="mock-method-item" v-for="method in methods" :key="method" v-text="method"></li>
      </ul>
    </div>
    <i class="item-close el-icon-remove-outline" />
    <i class="item-close el-icon-circle-plus-outline" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ActionEvents } from '../../store'

export default {
  name: 'MockItem',
  props: {
    url: String,
    methods: Array,
  },
  computed: {
    isOpen() {
      return this.$store.getters.mockConfig[this.url].isOpen
    },
  },
  methods: {
    switchClick(e) {
      e.stopPropagation()
      this.$store.dispatch(ActionEvents.TOGGLE_MOCK_ITEM_STATUS, { url: this.url })
    },
    handleMockItemClick() {
      this.$store.dispatch(ActionEvents.CHANGE_SELECTED_URL, { url: this.url })
    }
  }
}
</script>

<style scoped lang="scss">
@keyframes fade-blink {
  0% {
    background-color: red;
  }
  50% {
    background-color: rgba(255, 0, 0, .2);
  }
  100% {
    background-color: red;
  }
}

.mock-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px #000 solid;
  padding: 0 10px;
  cursor: pointer;

  &.open {
    .item-switch {
      background-color: red;
      animation: fade-blink 3s infinite;
    }
  }

  .item-switch {
    width: 12px;
    height: 12px;
    border-radius: 12px;
    border: 1px black solid;
    cursor: pointer;
  }

  .mock-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 50%;
    margin: 0 5%;

    .mock-path {
      font-size: 1.5em;
      font-weight: bolder;
    }

    .mock-method-list {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      align-items: center;
      font-size: 1.2em;

      .mock-method-item {
        color: #409EFF;

        &:not(:last-child)::after {
          content: '/';
          margin: 0 5px;
          color: #000;
        }
      }
    }
  }

  .item-close {
    cursor: pointer;
    &:hover {
      color: rgba(255,0,0,.8);
    }
    &:active {
      color: red;
    }
  }
}
</style>
