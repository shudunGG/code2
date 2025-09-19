<template>
  <div class="config-form">
    <div class="config-block">
      <h3 class="config-category">
        全局文字
        <el-tooltip placement="right" content="将影响所有控件">
          <span class="design-help"></span>
        </el-tooltip>
      </h3>
      <div class="form-item">
        <label class="form-label">字体</label>
        <el-select v-model="fontFamily" size="small" class="font-set-select">
          <el-option v-for="item in fontFamilyList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
        <el-input-number v-model="fontSize" size="small" class="font-set-input" :controls="!!0" :min="12" :max="100"></el-input-number>
        <span class="form-control-suffix">px</span>
      </div>
      <div class="form-item">
        <label class="form-label">样式</label>
        <FontColor style="margin-right:10px" v-model="fontColor"></FontColor>
        <div class="design-button-group font-group">
          <el-tooltip :open-delay="500" content="加粗">
            <MyButton icon="font-bold" :class="{ active: fontBolder }" @click.native="fontBolder = !fontBolder"></MyButton>
          </el-tooltip>
          <el-tooltip :open-delay="500" content="倾斜">
            <MyButton icon="font-italic" :class="{ active: fontItalic }" @click.native="fontItalic = !fontItalic"></MyButton>
          </el-tooltip>
          <el-tooltip :open-delay="500" content="下划线">
            <MyButton icon="font-underline" :class="{ active: fontUnderline }" @click.native="fontUnderline = !fontUnderline"></MyButton>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="config-block">
      <h3 class="config-category">
        全局单元格
        <el-tooltip placement="right" content="将影响所有单元格">
          <span class="design-help"></span>
        </el-tooltip>
      </h3>
      <div class="form-item">
        <label class="form-label">对齐</label>
        <AlignButton v-model="textAlign" type="horizontal" />
        <AlignButton type="vertical" v-model="verticalAlign" />
      </div>
      <div class="form-item">
        <label class="form-label">高度</label>
        <!-- <el-select v-model="heightPerset.selected" size="small" class="height-set-select"> <el-option v-for="item in heightPerset.list" :key="item.id" :value="item.value" :label="item.label"></el-option></el-select> -->
        <el-input-number class="height-set-input" v-model="height" size="small" :controls="false" :min="MIN_ROW_HEIGHT" :max="2000" @change="setHeight" />
        <span class="form-control-suffix">px</span>
      </div>
    </div>
    <div class="config-block">
      <h3 class="config-category">
        全局边框
        <el-tooltip placement="right" content="将影响所有单元格">
          <span class="design-help"></span>
        </el-tooltip>
      </h3>
      <div class="form-item">
        <label class="form-label">线宽</label>
        <BorderWidthSelect v-model="borderWidth" :border-color="borderColor" :border-style="borderStyle" />
      </div>

      <div class="form-item">
        <label class="form-label">线性</label>
        <BorderStyleSelect v-model="borderStyle" @change="onBorderStyleChange" :border-width="borderWidth" :border-color="borderColor" :disabled="!borderWidth" />
      </div>

      <div class="form-item">
        <label class="form-label">颜色</label>
        <ColorPicker v-model="borderColor" :disabled="!borderWidth"></ColorPicker>
      </div>

      <div class="form-item">
        <label class="form-label">外边框</label>
        <AllBorderType class="form-control" :border-type="allBorderType" @active="handleBorderTypeChange"></AllBorderType>
      </div>
    </div>
    <div class="config-block">
      <h3 class="config-category">控件配置</h3>
      <div class="form-item">
        <label class="form-label">label自动冒号</label>
        <el-switch v-model="autoColons" :border-color="borderColor" :border-style="borderStyle"></el-switch>
      </div>
    </div>
    <div class="config-block">
      <h3 class="config-category">预设风格</h3>
      <div class="form-item">
        <label class="form-label">风格选择</label>
        <el-select v-model="currentSkin" style="width: 120px; margin-right:10px; display:inline-block;" @change="onSkinChange">
          <el-option v-for="item in skins" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-button type="primary" :disabled="!isNewSkin" @click="createNewSkin">存为新风格</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import AlignButton from '../form/AlignButton';
import FontColor from '../form/Control-FontColor';
import ColorPicker from '../ColorPicker';
import BorderStyleSelect from '../form/BorderStyleSelect';
import BorderWidthSelect from '../form/BorderWidthSelect';
import Button from '../form/Button';
import AllBorderType from '../form/AllBorderType';
import { mapState, mapActions } from 'vuex';
import { copy } from '../../util/index.js';

import { MIN_ROW_HEIGHT, MIN_COL_WIDTH } from '@/config.js';
// import merge from 'lodash.merge';

const globalFontFamilyList = copy(window.FORM_DESIGN_CONFIG.preset.fontFamilyList);

export default {
  name: 'config-form',
  components: {
    AlignButton,
    FontColor,
    BorderStyleSelect,
    BorderWidthSelect,
    MyButton: Button,
    ColorPicker,
    AllBorderType
  },
  computed: {
    ...mapState(['globalStyle', 'skin']),

    fontFamilyList() {
      return globalFontFamilyList;
    }
  },
  mounted() {
    this.getSkinList();
  },
  data() {
    const globalStyle = this.globalStyle || this.$store.state.globalStyle;
    const border = globalStyle.border;
    return {
      MIN_ROW_HEIGHT: MIN_ROW_HEIGHT,
      currentSkin: this.skin || '',
      skins: [],
      isNewSkin: false,
      height: globalStyle.cellHeight || MIN_ROW_HEIGHT,
      borderWidth: border.top.width || 1,
      borderStyle: border.top.style || 'solid',
      borderColor: border.top.color || '#dddddd',

      fontSize: globalStyle.fontSize,
      fontFamily: globalStyle.fontFamily,
      fontColor: globalStyle.fontColor,
      fontBolder: globalStyle.fontBolder,
      fontItalic: globalStyle.fontItalic,
      fontUnderline: globalStyle.fontUnderline,
      textAlign: globalStyle.textAlign,
      verticalAlign: globalStyle.verticalAlign,
      autoColons: globalStyle.autoColons,

      allBorderType: globalStyle.allBorderType || 'all',

      heightPerset: {
        selected: 'compact',
        list: [
          {
            label: '紧凑',
            value: 'compact'
          },
          {
            label: '2倍',
            value: 40
          },
          {
            label: '50',
            value: 50
          },
          {
            label: '自定义',
            value: 30
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions({
      setBorder: 'setGlobalBorder',
      setStyle: 'setGlobalStyle'
    }),
    getSkinList() {
      return this.$httpPost(window.formDesignerActions.getSkinListUrl).then(res => {
        if (Array.isArray(res.skinList)) {
          this.skins = res.skinList;
        } else {
          this.skins = [];
        }
      });
    },
    onBorderStyleChange(v) {
      if (v == 'double' && this.borderWidth < 4) {
        this.$message({
          type: 'info',
          message: '双线边框效果仅可在边框宽度大于3px时呈现'
        });
      }
    },
    onSkinChange(skinId) {
      const skin = this.skins.filter(s => s.id == skinId)[0];
      if (!skin || !skin.data) return;

      // const skinData = merge({}, this.globalStyle, skin.data);
      const skinData = copy(skin.data);

      // this.$store.commit('updateGlobalStyle', {style: skinData});
      // this.$store.commit('setSkin', { skinName: this.currentSkin });
      this.$store.dispatch({
        type: 'applySkin',
        skinData: skinData,
        skin: this.currentSkin
      });
      this.$nextTick(() => {
        this.isNewSkin = false;
      });
    },
    createNewSkin() {
      this.$prompt('请输入新风格名称', '创建新风格', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /^[\d\w-_\u4E00-\u9FA5]+$/,
        // inputErrorMessage: '风格名称格式不正确',
        inputValidator(str) {
          if (!str || !str.trim()) {
            return '风格名称不能为空';
          }
          return /^[\d\w-_\u4E00-\u9FA5]+$/.test(str) ? true : '风格名称格式不正确';
        }
      }).then(({ value }) => {
        this.saveNewSkin(value);
      });
    },
    saveNewSkin(name) {
      const skinData = copy(this.globalStyle);
      delete skinData.cellHeight;
      return this.$httpPost(window.formDesignerActions.addSkinUrl, {
        skinName: name,
        data: skinData
      })
        .then(res => {
          this.currentSkin = res.id;
          this.skins.push({
            id: this.currentSkin,
            name: name,
            data: skinData
          });
          this.$nextTick(() => {
            this.isNewSkin = false;
          });
          this.$message({
            type: 'success',
            message: '保存成功'
          });
        })
        .catch(err => {
          console.error(err);
          this.$message({
            type: 'error',
            message: '保存失败'
          });
        });
    },
    getData() {
      const globalStyle = this.globalStyle || this.$store.state.globalStyle;
      const border = globalStyle.border;
      return {
        height: globalStyle.cellHeight || MIN_ROW_HEIGHT,
        borderWidth: border.top.width || 1,
        borderStyle: border.top.style || 'solid',
        borderColor: border.top.color || '#dddddd',

        fontSize: globalStyle.fontSize,
        fontFamily: globalStyle.fontFamily,
        fontColor: globalStyle.fontColor,
        fontBolder: globalStyle.fontBolder,
        fontItalic: globalStyle.fontItalic,
        fontUnderline: globalStyle.fontUnderline,
        textAlign: globalStyle.textAlign,
        verticalAlign: globalStyle.verticalAlign,
        autoColons: globalStyle.autoColons
      };
    },
    handleChange(value, prop) {
      if (value === this.globalStyle[prop]) return;
      this.setStyle({ prop, value });
    },
    setHeight(v) {
      console.log('height', v);
      this.$store.dispatch('setAllRowHeight', { height: v });
    },
    handleBorderTypeChange(v) {
      this.isNewSkin = true;
      console.log('borderType changed', v, 'borderWidth', this.borderWidth);
      this.$store.dispatch('setAllBorderType', {
        type: v,
        borderWidth: this.borderWidth
      });
    }
  },
  watch: {
    globalStyle(style) {
      const border = style.border;
      this.height = style.cellHeight || MIN_ROW_HEIGHT;
      this.borderWidth = border.top.width || 1;
      this.borderStyle = border.top.style || 'solid';
      this.borderColor = border.top.color || '#dddddd';

      this.fontSize = style.fontSize;
      this.fontFamily = style.fontFamily;
      this.fontColor = style.fontColor;
      this.fontBolder = style.fontBolder;
      this.fontItalic = style.fontItalic;
      this.fontUnderline = style.fontUnderline;
      this.textAlign = style.textAlign;
      this.verticalAlign = style.verticalAlign;
      this.autoColons = style.autoColons;
      if (this.allBorderType != style.allBorderType) {
        this.allBorderType = style.allBorderType;
        this.handleBorderTypeChange(this.allBorderType);
      }
    },
    borderWidth(v) {
      this.isNewSkin = true;
      this.setBorder({ prop: 'width', value: v });
    },
    borderStyle(v) {
      this.isNewSkin = true;
      this.setBorder({ prop: 'style', value: v });
    },
    borderColor(v) {
      this.isNewSkin = true;
      this.setBorder({ prop: 'color', value: v });
    },
    autoColons(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'autoColons');
    },
    fontSize(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'fontSize');
    },
    fontFamily(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'fontFamily');
    },
    fontColor(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'fontColor');
    },
    fontBolder(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'fontBolder');
    },
    fontItalic(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'fontItalic');
    },
    fontUnderline(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'fontUnderline');
    },
    textAlign(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'textAlign');
    },
    verticalAlign(v) {
      this.isNewSkin = true;
      this.handleChange(v, 'verticalAlign');
    },
    // isNewSkin(v) {
    //   if (v) {
    //     this.currentSkin = '';
    //   }
    // },
    skin: {
      immediate: true,
      handler(v) {
        if (v !== this.currentSkin) {
          this.isNewSkin = false;
          this.currentSkin = v;
        }
      }
    }
  }
};
</script>
