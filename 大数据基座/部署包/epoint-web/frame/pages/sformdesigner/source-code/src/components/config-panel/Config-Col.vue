// 单元格配置
<template>
  <div v-if="selectedCol">
    <div class="config-block">
      <h3 class="config-category">
        对齐
      </h3>
      <div class="form-item"><label class="form-label">对齐</label> <AlignButton type="horizontal" v-model="textAlign" /> <AlignButton type="vertical" v-model="verticalAlign" /></div>
    </div>
    <div class="config-block">
      <h3 class="config-category">
        边框
        <el-tooltip :content="currentView == 'normal' ? '切换到详细模式' : '切换到简易模式'"><span class="border-config-toggle el-icon-d-arrow-right" @click="toggleView"></span></el-tooltip>
      </h3>
      <!-- 简易模式 -->
      <div v-if="currentView == 'normal'">
        <div class="form-item"><label class="form-label">线宽</label><BorderWidthSelect v-model="borderWidth" :border-color="borderColor" :border-style="borderStyle" /></div>
        <div class="form-item"><label class="form-label">线型</label><BorderStyleSelect v-model="borderStyle" @change="onBorderStyleChange" :border-width="borderWidth" :border-color="borderColor" :disabled="!borderWidth" /></div>
        <div class="form-item"><label class="form-label">颜色</label><ColorPicker v-model="borderColor" /></div>
      </div>

      <!-- 高级模式 -->
      <div v-if="currentView == 'advance'">
        <div class="config-block">
          <h3 class="config-category">边框——上</h3>
          <div class="form-item"><label class="form-label">线宽</label><BorderWidthSelect @change="onBorderChange('top', 'width', $event)" v-model="border.top.width" :border-color="border.top.color" /></div>

          <div class="form-item"><label class="form-label">线性</label> <BorderStyleSelect @change="onBorderChange('top', 'style', $event)" v-model="border.top.style" :border-color="border.top.color" :disabled="!border.top.width" /></div>

          <div class="form-item"><label class="form-label">颜色</label><ColorPicker @change="onBorderChange('top', 'color', $event)" v-model="border.top.color" :disabled="!border.top.width"></ColorPicker></div>
        </div>
        <div class="config-block">
          <h3 class="config-category">边框——右</h3>
          <div class="form-item"><label class="form-label">线宽</label><BorderWidthSelect @change="onBorderChange('right', 'width', $event)" v-model="border.right.width" :border-color="border.right.color" /></div>

          <div class="form-item"><label class="form-label">线性</label> <BorderStyleSelect @change="onBorderChange('right', 'style', $event)" v-model="border.right.style" :border-color="border.right.color" :disabled="!border.right.width" /></div>

          <div class="form-item"><label class="form-label">颜色</label><ColorPicker @change="onBorderChange('right', 'color', $event)" v-model="border.right.color" :disabled="!border.right.width"></ColorPicker></div>
        </div>
        <div class="config-block">
          <h3 class="config-category">边框——下</h3>
          <div class="form-item"><label class="form-label">线宽</label><BorderWidthSelect @change="onBorderChange('bottom', 'width', $event)" v-model="border.bottom.width" :border-color="border.bottom.color" /></div>

          <div class="form-item"><label class="form-label">线性</label> <BorderStyleSelect @change="onBorderChange('bottom', 'style', $event)" v-model="border.bottom.style" :border-color="border.bottom.color" :disabled="!border.bottom.width" /></div>

          <div class="form-item"><label class="form-label">颜色</label><ColorPicker @change="onBorderChange('bottom', 'color', $event)" v-model="border.bottom.color" :disabled="!border.bottom.width"></ColorPicker></div>
        </div>
        <div class="config-block">
          <h3 class="config-category">边框——左</h3>
          <div class="form-item"><label class="form-label">线宽</label><BorderWidthSelect  @change="onBorderChange('left', 'width', $event)" v-model="border.left.width" :border-color="border.left.color" /></div>

          <div class="form-item"><label class="form-label">线性</label> <BorderStyleSelect  @change="onBorderChange('left', 'style', $event)" v-model="border.left.style" :border-color="border.left.color" :disabled="!border.left.width" /></div>

          <div class="form-item"><label class="form-label">颜色</label><ColorPicker  @change="onBorderChange('left', 'color', $event)" v-model="border.left.color" :disabled="!border.left.width"></ColorPicker></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlignButton from '../form/AlignButton';
import ColorPicker from '../ColorPicker';
import BorderStyleSelect from '../form/BorderStyleSelect';
import BorderWidthSelect from '../form/BorderWidthSelect';
import { copy } from '../../util/index.js';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'config-col',
  components: {
    AlignButton,
    // BorderButton,
    ColorPicker,
    BorderStyleSelect,
    BorderWidthSelect
  },
  props: ['selectedCol'],
  computed: {
    // ...mapGetters(['selectedCol'])
  },
  data() {
    // console.log(this.selectedCol);
    return this.getShowData();
  },
  methods: {
    ...mapMutations(['setColBorder', 'setColStyle']),
    ...mapActions(['setColAllBorder', 'setColBorderDetail']),
    getShowData() {
      if (!this.selectedCol) {
        return {};
      }
      const border = copy(this.selectedCol.style.border);
      const borderWidth = border.bottom.width;
      const borderStyle = border.bottom.style;
      const borderColor = border.bottom.color;
      return {
        textAlign: this.selectedCol.style.textAlign || 'left',
        verticalAlign: this.selectedCol.style.verticalAlign || 'middle',
        border,
        borderWidth,
        borderStyle,
        borderColor,
        currentView: 'normal'
      };
    },
    toggleView() {
      this.currentView = this.currentView == 'normal' ? 'advance' : 'normal';
    },
    // 变化变化 高级的单独配置
    onBorderChange (dir, prop, value) {
      console.log('高级边框配置');
      console.log(dir, prop, value);
      this.setColBorderDetail({
        dir,
        prop,
        value,
        selectedCol: this.selectedCol,
        group: 'adv-border'
      });
      if (prop == 'style' && value == 'double' && this.border[dir].width < 4){
        this.showBorderStyleMessage();
      }
    },
    onBorderStyleChange(v) {
      if (v == 'double' && this.borderWidth < 4) {
        this.showBorderStyleMessage();
      }
    },
    showBorderStyleMessage() {
      this.$message({
        type: 'info',
        message: '双线边框效果仅可在边框宽度大于3px时呈现'
      });
    }
  },
  watch: {
    selectedCol(v, oldV) {
      console.log(v, oldV);
      if (this.selectedCol) {
        console.log('selected col change');
        const border = copy(this.selectedCol.style.border);
        const borderWidth = border.bottom.width;
        const borderStyle = border.bottom.style;
        const borderColor = border.bottom.color;
        if (oldV) {
          this.border = border;
          this.verticalAlign = this.selectedCol.style.verticalAlign;
          this.textAlign = this.selectedCol.style.textAlign;
          this.borderWidth = borderWidth;
          this.borderStyle = borderStyle;
          this.borderColor = borderColor;
        } else {
          this.$set(this, 'border', border);
          this.$set(this, 'verticalAlign', this.selectedCol.style.verticalAlign);
          this.$set(this, 'textAlign', this.selectedCol.style.textAlign);
          this.$set(this, 'borderWidth', borderWidth);
          this.$set(this, 'borderStyle', borderStyle);
          this.$set(this, 'borderColor', borderColor);
        }
      }
    },
    // border: {
    //   deep: true,
    //   handler(border) {
    //     if (JSON.stringify(border) == JSON.stringify(this.selectedCol.style.border)) {
    //       return;
    //     }
    //     console.log('设置单元格边框', ...arguments);
    //     this.setColBorder({ border, selectedCol: this.selectedCol, shuttle: true });
    //   }
    // },
    borderWidth(v) {
      this.setColAllBorder({
        prop: 'width',
        value: v
      });
    },
    borderStyle(v) {
      this.setColAllBorder({
        prop: 'style',
        value: v
      });
    },
    borderColor(v) {
      this.setColAllBorder({
        prop: 'color',
        value: v
      });
    },
    textAlign(v) {
      if (v == this.selectedCol.style.textAlign) {
        return;
      }
      console.log('设置对齐', ...arguments);
      this.setColStyle({ prop: 'textAlign', value: v, selectedCol: this.selectedCol, shuttle: true });
    },
    verticalAlign(v) {
      if (v == this.selectedCol.style.verticalAlign) {
        return;
      }
      console.log('设置对齐', ...arguments);
      this.setColStyle({ prop: 'verticalAlign', value: v, selectedCol: this.selectedCol, shuttle: true });
    }
  }
};
</script>

<style lang="scss"></style>
