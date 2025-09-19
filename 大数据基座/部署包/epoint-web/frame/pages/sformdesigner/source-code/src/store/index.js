import Vue from 'vue';
import Vuex from 'vuex';

import row from './row.js';
import col from './col.js';
import control from './control.js';
import helper from './helper.js';
import merge from 'lodash.merge';
import { copy, colAutoIndex } from '@/util/index';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    formSize: {
      width: 900,
      height: 0
    },
    // 设计的数据
    design: [],
    // 移动端设计的数据
    mobileDesignData: [],
    // 隐藏控件
    hiddenControls: [],
    // 风格名称
    skin: '',
    // 设计区域全局样式
    globalStyle: {
      autoColons: true,
      fontSize: 13,
      fontFamily: 'Microsoft Yahei',
      fontColor: '#333333',
      fontBolder: false,
      fontItalic: false,
      fontUnderline: false,

      textAlign: 'left',
      verticalAlign: 'middle',

      cellHeight: 48,

      border: {
        top: {
          width: 1,
          style: 'solid',
          color: '#ddd'
        },
        right: {
          width: 1,
          style: 'solid',
          color: '#ddd'
        },
        bottom: {
          width: 1,
          style: 'solid',
          color: '#ddd'
        },
        left: {
          width: 1,
          style: 'solid',
          color: '#ddd'
        }
      },
      // 可选值： 'all', 'inner', 'hline', 'vline', 'outer', 'left', 'top', 'right', 'bottom', 'none'
      allBorderType: 'all'
    },
    // 辅助数据
    helper: {
      // 是否显示线条以及线条位置
      showVLine: false,
      showHLine: false,
      left: 0,
      top: 0,
      // 拖动状态
      inControlDragging: false,
      inLayoutDragging: false,
      // 视图状态 设计模式 和 真实模式
      viewDesign: false,
      // 设计视图状态 可选 pc 、 mobile
      viewType: 'pc',
      showPreview: false
    },
    jsCode: '',
    cssCode: '',
    fieldList: [],
    codeList: [],
    macroTypes: [],
    // 子表格
    sourceTables: [],
    // 数据表
    dataTables: [],

    // 创建新字段时 可选的数据库类型
    DBDataTypes: [],

    // 自由设计时新创建的字段即可
    newFieldList: [],

    buttonEditPopupList: [],

    // 需要显示的扩展控件
    extControls: [],

    // 通用字段
    commonControls: [],

    leftActiveTab: 'layout',
    rightActiveTab: 'form',

    // 当前选中控件
    selectedControlId: '',
    // 当前选中单元格
    selectedColId: '',

    // 当前选中的行
    selectedRowId: ''
  },
  getters: {
    ...row.getters,
    ...col.getters,
    ...control.getters,
    ...helper.getters,

    // 根据全局配置 生成一个一段样式
    globalStyleText: state => {
      const {
        fontSize,
        fontFamily,
        fontColor,
        fontBolder,
        fontItalic,
        fontUnderline,
        textAlign,
        verticalAlign
      } = state.globalStyle;

      return `
        font-size: ${fontSize}px;
        font-family: ${fontFamily};
        color: ${fontColor};
        font-weight: ${fontBolder ? 'bold' : 'normal'};
        font-style: ${fontItalic ? 'italic' : 'normal'};
        text-decoration: ${fontUnderline ? 'underline' : 'none'};
        text-align: ${textAlign};
        vertical-align: ${verticalAlign};
      `;
    }
  },
  mutations: {
    ...row.mutations,
    ...col.mutations,
    ...control.mutations,
    ...helper.mutations,
    setSkin(state, payload) {
      const skinName = payload.skinName;
      state.skin = skinName;
    },
    setJsCode(state, jsText) {
      state.jsCode = jsText;
    },
    setCssCode(state, cssText) {
      state.cssCode = cssText;
    },
    setDBDataTypes(state, typeList) {
      if (Array.isArray(typeList)) {
        state.DBDataTypes = typeList;
      } else {
        console.error('设置创建新字段时可选的数据库类型时出错', typeList);
      }
    },
    // 加入新创建的字段信息 校验在新增的逻辑中处理，此处只负责数据加入
    addToNewFieldList(state, payload) {
      state.newFieldList.push(payload.fieldProps);
    },
    // 提交新创建的字段
    submitNewFieldList(state, payload) {
      const newFieldList = payload && payload.newFieldList ? payload.newFieldList : state.newFieldList;
      // 自由设计时，新字段创建目标表就是第一张表
      const aimTableFields = state.fieldList[0] && state.fieldList[0].fields;
      if (newFieldList.length && Array.isArray(aimTableFields)) {
        aimTableFields.push(...newFieldList);
        if (state.newFieldList.length) {
          state.newFieldList = [];
        }
      }
    },
    updateGlobalStyleProp(state, payload) {
      console.log('更新全局样式', JSON.stringify(payload));
      state.globalStyle[payload.prop] = payload.value;
    },
    updateGlobalBorder(state, payload) {
      console.log('更新全局边框', JSON.stringify(payload));
      state.globalStyle.border.top[payload.prop] = payload.value;
      state.globalStyle.border.right[payload.prop] = payload.value;
      state.globalStyle.border.bottom[payload.prop] = payload.value;
      state.globalStyle.border.left[payload.prop] = payload.value;
    },
    updateGlobalStyle(state, payload) {
      const style = payload.style;
      state.globalStyle = merge({}, state.globalStyle, style);
    },
    applyGlobalStyle(state, payload) {
      const { cols, prop, value } = payload;
      cols.forEach(col => {
        col.style[prop] = value;
        // 部分属性需要写入控件
        // todo 优化为配置
        if (
          col.controls &&
          col.controls.length &&
          ['fontSize', 'fontFamily', 'fontColor', 'fontBolder', 'fontItalic', 'fontUnderline'].indexOf(prop) !== -1
        ) {
          col.controls
            .filter(c => c.type == 'label' || c.type == 'title')
            .forEach(c => {
              c[prop] = value;
            });
        }
      });
    },
    applyGlobalBorder(state, payload) {
      const { cols, prop, value } = payload;
      cols.forEach(col => {
        col.style.border.top[prop] = value;
        col.style.border.right[prop] = value;
        col.style.border.bottom[prop] = value;
        col.style.border.left[prop] = value;
      });
    },
    activeLeftTab(state, v) {
      state.leftActiveTab = v;
    },
    activeRightTab(state, v) {
      state.rightActiveTab = v;
    },
    updateDesign(state, newVal) {
      // state.design.splice(0, state.design.length - 1, ...newVal);
      state.design = newVal;
      console.log(state.design);
    },
    tryMergeAcc(state, payload) {
      const { row, rowIndex } = payload;
      if (!row || rowIndex === undefined) return;
      if (state.design.length == 1) return;

      const prev = state.design[rowIndex - 1];
      const next = state.design[rowIndex + 1];
      const prevIsAcc = prev && prev.type == 'acc-layout';
      const nextIsAcc = next && next.type == 'acc-layout';

      let newData;
      let rowId;
      // 前一个是 手风琴 则将当前手风琴加入前一个
      if (prevIsAcc) {
        newData = copy(prev);
        rowId = newData.id;
        row.cols.forEach(col => {
          // const rowId = newData.id;
          // const colIndex = colAutoIndex.getIndex(rowId);
          // const newCol = copy(col);
          // newCol.id = `col-${rowId}-${colIndex}`;
          // newData.cols.push(newCol);
          newData.cols.push(copyCol(col, rowId));
        });
        state.design.splice(rowIndex - 1, 2, newData);
        return;
      }

      if (nextIsAcc) {
        // 后一个是手风琴 则将后一个的全部加入当前
        newData = copy(row);
        rowId = newData.id;
        next.cols.forEach(col => {
          newData.cols.push(copyCol(col, rowId));
        });
        state.design.splice(rowIndex, 2, newData);
        return;
      }
      /**
       * 处理列拷贝
       * 需对 col id重新编组
       * @param {colData} col 列数据
       * @param {string} rowId 父行id
       */
      function copyCol(col, rowId) {
        const colIndex = colAutoIndex.getIndex(rowId);
        const newCol = copy(col);
        newCol.id = `col-${rowId}-${colIndex}`;
        return newCol;
      }
    },
    replaceMobileDesign(state, payload) {
      state.mobileDesignData = payload.mobileDesignData;
    },
    // 控件数据兼容
    controlCompatible( state, {controls}) {
      if (Array.isArray(controls)) {
        controls.forEach(ctr => {
          // regexp 关键字导致sql注入风险被拦截 改名为 regSource 做旧数据兼容
          let customValidate = ctr.customValidate;
          if (customValidate && customValidate.regExp !== void 0) {
            customValidate.regSource = customValidate.regExp;
            delete customValidate.regExp;
          }
        });
      }
    }
  },
  actions: {
    ...row.actions,
    ...col.actions,
    ...control.actions,
    ...helper.actions,
    activeRightTab({ state, commit }, payload) {
      if (state.rightActiveTab != payload) {
        commit('activeRightTab', payload);
      }
    },
    setGlobalStyle(ctx, payload) {
      ctx.commit('updateGlobalStyleProp', payload);
      ctx.commit('applyGlobalStyle', { cols: ctx.getters.allCol, ...payload, shuttle: true });
    },
    setGlobalBorder(ctx, payload) {
      ctx.commit('updateGlobalBorder', payload);
      ctx.commit('applyGlobalBorder', { cols: ctx.getters.allCol, ...payload, shuttle: true });
    },
    setAllBorderType(ctx, payload) {
      const { type, borderWidth } = payload;
      const group = 'bordertype-' + +new Date();
      // 先提交到全局样式
      ctx.commit('updateGlobalStyleProp', {
        prop: 'allBorderType',
        value: type,
        group,
        shuttle: true
      });
      // 针对每个单元合格进行修改
      setAllCellBorderType(ctx, type, borderWidth, group);
    },
    applySkin(ctx, payload) {
      const skin = payload.skin;
      const skinData = payload.skinData;

      // 更新风格名称
      ctx.commit({ type: 'setSkin', skinName: skin, group: 'skin', shuttle: true });

      // 应用风格的样式
      ctx.commit({ type: 'updateGlobalStyle', style: skinData, group: 'skin', shuttle: true });

      // 将风格应用到部分控件上 (文字类控件需要)
      const controls = ctx.getters.allControls.filter(ctx => ['title', 'label', 'output'].indexOf(ctx.type) != -1);
      if (controls.length) {
        ctx.commit({
          type: 'updateControlStyle',
          controls: controls,
          group: 'skin',
          skinData: skinData,
          shuttle: true
        });
      }
    }
  }
});

/**
 * 全部边框的设置
 * @param {Object} ctx vuex context
 * @param {String} type  one of all, inner, hline, vline, outer, left, top, right, bottom, none
 * @param {Number} borderWidth 边框的宽度
 * @param {String} group 撤销还原的分组名
 */
function setAllCellBorderType(ctx, type, borderWidth, group) {
  const allCol = ctx.getters.allCol;
  if (type == 'all') {
    return ctx.commit('setAllColBorderWidth', { cols: allCol, group, borderWidth });
  }
  if (type == 'none') {
    return ctx.commit('setAllColBorderWidth', { cols: allCol, group, borderWidth: 0 });
  }
  ctx.commit('setAllColBorder_' + type, { cols: allCol, group, borderWidth });
}
