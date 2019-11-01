<template>
  <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" @open="handleDialogOpen">
    <template v-slot:title>
      <span>标题</span>
    </template>
    
    <div class="mock-data-type">
      <el-radio v-for="item in typeList" :key="item" v-model="type" :label="item"></el-radio>
    </div>
    <div ref="editor"></div>

    <template v-slot:footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import JsonEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

import { ActionEvents } from '../../store'

export default {
  name: 'Dialog',
  data() {
    return {
      type: null,
      content: null,
    }
  },
  computed: {
    ...mapState({
      dialogVisible: 'dialogVisible',
      typeList: state => state.config.supportedContentTypeList,
    })
  },
  watch: {
    type() {
      if (this.editor) {
        this.editor.setMode(({
          JSON: 'code',
          String: 'text',
          null: 'text',
          undefined: 'text',
        })[this.type])
      }
    },
  },
  methods: {
    handleDialogOpen() {
      this.$nextTick(() => {
        if (!this.editor) {
          this.editor = new JsonEditor(this.$refs.editor, {
            mode: 'code',
            modes: ['tree', 'view', 'code', 'text'],
            indentation: 2,
            search: false,
            navigationBar: false,
            statusBar: false,
            colorPicker: false,
            language: 'zh-CN',
            enableTransform: false,
            onChange: () => {
              this.content = this.editor.getText()
            },
          })
        }

        const { selectedMockContent } = this.$store.getters
        const { type, content } = selectedMockContent || {}
        const editorContent = type === 'JSON' ? JSON.parse(content) : content

        this.type = type
        this.editor.set(editorContent || '')
      })
    },
    handleClose() {
      this.$store.dispatch(ActionEvents.CLOSE_DIALOG)
    }
  },
  components: {
  },
}
</script>

<style scoped lang="scss">
  .mock-data-type {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 5%;
  }
</style>
