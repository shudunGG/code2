<template>
  <div class="editor-wrap">
    <div class="editor-toolbar">
      <el-button size="mini" type="primary" @click="handleDialogClose('save')">保存</el-button>
      <el-button size="mini" @click="handleDialogClose('cancel')">取 消</el-button>
      <el-tooltip :open-delay="200" content="格式化">
        <el-button size="mini" icon="el-icon-s-grid" @click="format"></el-button>
      </el-tooltip>
      <el-tooltip :open-delay="200" content="搜索替换">
        <el-button size="mini" icon="el-icon-search" @click="search"></el-button>
      </el-tooltip>
    </div>
    <div class="editor-main">
      <div class="editor-el" :class="{ 'with-right': language == 'javascript' }" ref="editorEl"></div>

      <div class="editor-right" v-if="language == 'javascript'">
        <div class="editor-right-search">
          <el-input v-model="searchInputValue" placeholder="输入关键词进行过滤">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="scroll-wrap">
          <Accordion title="控件">
            <ul class="control-list" v-if="filteredControlList.length">
              <li v-for="item in filteredControlList" :key="item.id" @click="addControl(item.id, item.type)">{{ item.name }}</li>
            </ul>
            <div class="control-list empty" v-else>无匹配控件</div>
          </Accordion>
          <Accordion title="常用值">
            <ul class="control-list">
              <li v-for="item in valueList" :key="item.id" @click="addValue(item.id)">{{ item.text }}</li>
            </ul>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Accordion from './Accordion';
// import * as monaco from 'monaco-editor';
// window.__Meditor = monaco;
import loadMonaco from '../util/load-monaco.js';
import { copy } from '../util/index';

/**
 * debounce 大于间隔时间时才触发
 * 连续触发时，仅当时间间隔大于指定时间才触发
 *
 * @param {function} fn 要处理的函数
 * @param {number} delay 间隔时间 单位 ms
 * @param {[object]} ctx 要绑定的上下文
 * @returns debounce 后的新函数
 */
function debounce(fn, delay, ctx) {
  delay = delay || 17;
  var timer;
  return function() {
    var args = arguments;
    var context = ctx || this;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}
export default {
  name: 'Editor',
  components: { Accordion },
  props: {
    language: {
      type: String,
      default: 'javascript',
      validator(v) {
        return ['javascript', 'css'].indexOf(v) !== -1;
      }
    },
    code: { type: String, default: ['function x() {', '    console.log("Hello world!");', '}', ''].join('\n') }
  },
  data() {
    const d = {
      defaultCode: {
        javascript: ['epoint.onAfterInit = function (customData) {', '    // 这个方法将在 页面initPage之后被调用\n    ', '};', 'function myScriptFn() {', '\t/* todo something */\n\t', '}', ''].join('\n'),
        css: '/* 在下面加入您的 css  */ \n'
      },
      editor: null,
      searchInputValue: ''
    };
    d.codeText = this.code || d.defaultCode[this.language];
    return d;
  },
  computed: {
    valueList() {
      return copy(window.FORM_DESIGN_CONFIG.preset['epointsform.specificValues']);
    },
    controlList() {
      const hiddenControls = this.$store.state.hiddenControls;
      const controls = this.$store.getters.allControls;
      const arr = [];
      hiddenControls.forEach(ctr => {
        arr.push({
          id: ctr.id,
          type: ctr.type,
          name: ctr.name || ctr.namePrefix + ctr.autoIndex
        });
      });
      controls.forEach(ctr => {
        arr.push({
          id: ctr.id,
          type: ctr.type,
          name: ctr.name || ctr.namePrefix + ctr.autoIndex
        });
      });
      return arr;
    },
    filteredControlList() {
      const list = this.controlList;
      const search = this.searchInputValue;
      if (!search) return list;

      const reg = new RegExp(search, 'i');
      return list.filter(item => reg.test(item.name));
    }
  },
  mounted() {
    if (this.language == 'javascript') {
      this.loadTypes().then(() => {
        this.initEditor(this.codeText);
      });
      return;
    }

    this.initEditor(this.codeText);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.adaptLayout);
    if (this.editor) {
      this.editor.dispose();
    }
  },
  methods: {
    handleDialogClose(action) {
      this.$emit(action, this.editor.getValue());
    },
    _adaptLayout() {
      if (this.editor) {
        this.editor.layout();
      }
    },
    search() {
      this.editor._actions['actions.find'].run();
    },
    format() {
      this.editor._actions['editor.action.formatDocument'].run();
    },
    addControl(id, type) {
      const code = (type == 'label' || type == "title") ? `$('#${id}').` : `mini.get('${id}').`;
      this.insertText(code);

      this.editor._actions['editor.action.triggerSuggest'].run();
    },
    addValue(holderCode) {
      this.insertText(holderCode);
    },
    insertText(text) {
      const position = this.editor.getPosition();
      this.editor.executeEdits('', [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: text
        }
      ]);

      const selection = this.editor.getSelection();
      selection.selectionStartColumn = selection.startColumn = selection.endColumn;
      selection.selectionStartLineNumber = selection.startLineNumber = selection.endLineNumber;

      this.editor.setSelection(selection);

      this.editor.focus();
    },
    initEditor(value) {
      this.adaptLayout = debounce(this._adaptLayout, 200);
      window.addEventListener('resize', this.adaptLayout);

      loadMonaco().then(monaco => {
        window.__meditor = this.editor = monaco.editor.create(this.$refs.editorEl, {
          value: value || '',
          language: this.language,
          lineHeight: 26,
          autoIndent: true,
          formatOnPaste: true,
          lineNumbers: 'on',
          minimap: true,
          tabCompletion: 'on',
          quickSuggestions: {
            comments: true
          },
          snippetSuggestions: 'top',
          accessibilitySupport: 'on',
          suggest: {}
        });
        this.editor.focus();
      });
    },
    loadTypes() {
      const headers = {
        'content-type': 'text/plain; charset=UTF-8'
      };
      return loadMonaco().then(monaco => {
        // 注入 miniui snippets
        return this.$httpGet('./types/mini-snippets.json', true, headers)
          .then(text => {
            const suggestions = JSON.parse(text);
            suggestions.forEach(item => {
              item.kind = monaco.languages.CompletionItemKind.Function;
              item.detail = item.documentation;
            });
            monaco.languages.registerCompletionItemProvider('javascript', {
              provideCompletionItems: function() {
                return {
                  suggestions: suggestions
                };
              }
            });
          })
          .then(() => {
            // 注入 jquery miniui epoint 的 类型描述文件
            this.$httpGet('./types/jquery.d.ts', true, headers).then(text => {
              monaco.languages.typescript.javascriptDefaults.addExtraLib(text, 'jquery.d.ts');
            });
            this.$httpGet('./types/miniui.d.ts', true, headers).then(text => {
              monaco.languages.typescript.javascriptDefaults.addExtraLib(text, 'miniui.d.ts');
            });
            this.$httpGet('./types/epoint.d.ts', true, headers).then(text => {
              monaco.languages.typescript.javascriptDefaults.addExtraLib(text, 'epoint.d.ts');
            });
          });
      });
    }
  }
};
</script>

<style lang="scss">
$toolbar_h: 30px;
$gap: 10px;
$right_w: 220px;
.editor {
  &-wrap {
    height: 100%;
    box-sizing: border-box;
    padding-top: $toolbar_h + $gap;
  }
  &-toolbar {
    margin-top: -$toolbar_h;
    height: $toolbar_h;
    padding: $gap / 2 10px;
    background: #f4f2f1;
  }
  &-main {
    height: 100%;
    display: flex;
    box-sizing: border-box;
  }
  &-el {
    height: 100%;
    flex-grow: 1;
    width: 100%;
    &.with-right {
      width: calc(100% - #{$right_w});
    }
  }
  &-right {
    flex-grow: 0;
    flex-shrink: 0;
    width: $right_w;
    padding: 52px 14px 0;

    .scroll-wrap {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.control-list.empty {
  padding-left: 14px;
  color: #999;
}
.editor-right-search {
  padding: 10px 0;
  margin-top: -52px;
}
</style>
