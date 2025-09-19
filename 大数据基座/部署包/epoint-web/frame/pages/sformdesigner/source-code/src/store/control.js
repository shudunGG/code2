import { getDotProp, setDotProp, copy, controlAutoIndex, uid } from '../util/index.js';

export default {
  getters: {
    controlType2nameMap: state => {
      const baseControls = window.FORM_DESIGN_CONFIG.controlList;
      const extControls = state.extControls;

      const map = {};
      baseControls.concat(extControls).forEach(ctr => {
        map[ctr.type] = ctr.name;
      });
      return map;
    },
    // 将嵌套的字段列表组织成字典形式
    fieldMap: state => {
      const map = {};

      // 新创建的字段
      const newFieldList = state.newFieldList;

      state.fieldList.forEach((table, i) => {
        // 第一张表为主表 新创建的字段将插入在这
        if (i == 0) {
          newFieldList.forEach(item => {
            dealJoin(table, item);
          });
        }

        table.fields.forEach(item => {
          dealJoin(table, item);
        });
      });
      function dealJoin(table, item) {
        // 老的模式，格式为： 表id;字段id
        map[(table.id || '') + ';' + (item.field || '')] = item;

        // 新模式并兼容老数据，格式为： 表id#表name;字段id#字段name
        // const key = `${table.id || ''}#${table.sqltablename || ''};${item.field || ''}#${item.fieldname || ''}`;
        const key = `#${table.sqltablename || ''};#${item.fieldname || ''}`;
        map[key] = item;
      }
      return map;
    },
    codeListMap: ({ codeList }) => {
      const map = {};
      codeList.forEach(item => {
        map[item.id] = item;
      });
      return map;
    },
    // 记录所有已选字段
    selectedFieldMap: (state, { allControls }) => {
      if (!allControls.length) {
        return {};
      }
      const map = {};

      allControls.forEach(ctr => {
        if (ctr.bind) {
          map[ctr.bind] = true;
        }
      });

      return map;
    },
    // 统计得出所有控件
    allControls: (state, { allCol }) => {
      if (!allCol || !allCol.length) return [];

      const arr = [];
      allCol.forEach(col => {
        if (col.controls && col.controls.length) {
          arr.push(...col.controls);
        }
      });
      return arr;
    },
    controlNameMap: ({ hiddenControls }, { allControls }) => {
      const map = {};
      hiddenControls.forEach(ctr => {
        map[ctr.id] = ctr.name || `${ctr.namePrefix}${ctr.autoIndex}`;
      });
      allControls.forEach(ctr => {
        map[ctr.id] = ctr.name || `${ctr.namePrefix}${ctr.autoIndex}`;
      });
      return map;
    },
    controlDataMap: ({ hiddenControls }, { allCol }) => {
      const map = {};
      hiddenControls.forEach((ctr, index) => {
        map[ctr.id] = {
          control: ctr,
          index
        };
      });

      allCol.forEach(col => {
        if (col.controls && col.controls.length) {
          col.controls.forEach(function(ctr, index) {
            map[ctr.id] = {
              control: ctr,
              index
            };
          });
        }
      });
      return map;
    },
    // 选中的控件引用
    selectedControl: ({ selectedControlId }, { controlDataMap }) => {
      if (!selectedControlId) {
        return {
          control: null,
          index: -1
        };
      }
      const data = controlDataMap[selectedControlId];
      console.log(data);
      if (data && data.control) {
        return data;
      }
      return {
        control: null,
        index: -1
      };
    },
    // 选中控件所在的单元格引用
    selectedControlParentCol: ({ selectedControlId, hiddenControls }, { allCol }) => {
      // 遍历每个单元格中的控件 比较 控件 id
      for (let col of allCol) {
        if (col.controls) {
          for (let ctr of col.controls) {
            if (ctr.id == selectedControlId) {
              return col;
            }
          }
        }
      }
      // 加入隐藏域的处理
      for (let ctr of hiddenControls) {
        console.log(ctr);
        if (ctr.id == selectedControlId) {
          return {
            controls: hiddenControls
          };
        }
      }

      return null;
    },
    // 选中控件所在的列的位置信息
    selectedControlParentColInfo: (state, { selectedControlParentCol, rowDataMap }) => {
      const emptyData = {
        row: null,
        index: -1
      };
      if (!selectedControlParentCol) {
        return emptyData;
      }
      const colId = selectedControlParentCol.id;
      const rowId = colId.replace(/^col-(\w+)-\d{1,2}$/, '$1');
      const rowData = rowDataMap[rowId];

      if (!rowData) {
        return emptyData;
      }

      // let index = -1;

      // for (let col of rowData.row.cols) {
      //   index ++
      //   if (col.id == colId) {
      //     return col;
      //   }
      // }

      return {
        row: rowData.row,
        index: rowData.row.cols.indexOf(selectedControlParentCol)
      };
    }
  },
  mutations: {
    /**
     * 更新隐藏控件
     */
    setHiddenControls(state, list) {
      state.hiddenControls = list;
    },
    // 更新 所有可选子表的记录
    setSourceTables(state, list) {
      state.sourceTables = list;
    },
    // 更新 所有可选数据表的记录
    setDataTables(state, list) {
      state.dataTables = list;
    },
    // 更新字段列表的记录
    setFieldList(state, list) {
      state.fieldList = list;
    },
    // 更新代码项的列表
    setCodeList(state, list) {
      state.codeList = list;
    },
    // 更新宏类型列表
    setMacroTypes(state, list) {
      state.macroTypes = list;
    },
    // 更新扩展控件列表
    setExtControls(state, list) {
      state.extControls = list;
    },
    // 更新同通用字段控件列表
    setCommonControls(state, list) {
      state.commonControls = list;
    },
    setButtonEditPopupList(state, list) {
      state.buttonEditPopupList = list;
    },
    /**
     * 删除某个控件
     */
    removeControl(state, payload) {
      const { selectedControl, selectedControlParentCol, selectedControlIndex } = payload;
      if (!selectedControl || !selectedControlParentCol || selectedControlIndex === -1) {
        return console.error('删除控件出错！！！');
      }

      selectedControlParentCol.controls.splice(selectedControlIndex, 1);
    },
    removeHiddenControl(state, payload) {
      const { index } = payload;
      state.hiddenControls.splice(index, 1);
    },
    /**
     * 新增一个控件
     */
    addControl(state, payload) {
      const { parentCol, control } = payload;
      parentCol.controls.push(control);
    },
    setSelectedControl(state, payload) {
      state.selectedControlId = payload.id;
    },
    clearSelectedControl(state) {
      state.selectedControlId = '';
    },
    updateControlProp(state, payload) {
      console.log('修改更新控件的属性');
      console.log(JSON.stringify(payload));
      const control = payload.control;
      if (control) {
        // 属性名中存在 . 则需要解析
        if (!/\./.test(payload.prop)) {
          control[payload.prop] = payload.value;
        } else {
          console.group('dot prop set');
          console.log(payload.prop, getDotProp(control, payload.prop));

          setDotProp(control, payload.prop, payload.value);

          console.log(getDotProp(control, payload.prop));
          console.groupEnd();
        }
      } else {
        console.error('无选中控件');
      }
    },
    /**
     * 大表单配置中为控件属性上新增必要属性的定义
     * multiFormAccId 所在手风琴id
     * multiFormColumnId 所在栏目id
     * multiFormIndex 排序值
     *
     * @param {*} state
     * @param {*} {controlData}
     */
    addMultiFormProps(state, { controlData }) {
      if (controlData) {
        controlData.multiFormAccId = '';
        controlData.multiFormColumnId = '';
        controlData.multiFormIndex = 0;
      }
    },
    /**
     * 为控件上新增 工具提示的配置 作用为兼容老数据，使得其保持正确的响应式
     *
     * @param {*} state
     * @param {*} {controlData}
     */
    addTooltipConfig(state, { controlData }) {
      if (controlData) {
        controlData.tooltipConfig = {
          type: 'tooltip', // tooltip 、 right、 bottom 之一
          content: ''
        };
      }
    },
    /**
     * 风格切换时 将样式应用到指定的控件上
     *
     * @param {*} state
     * @param {*} payload
     * @returns
     */
    updateControlStyle(state, payload) {
      const controls = payload.controls;
      const skinData = payload.skinData;

      if (!controls) return;
      const arr = Array.isArray(controls) ? controls : [controls];
      const props = [
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBolder',
        'fontItalic',
        'fontUnderline',
        'textAlign',
        'verticalAlign'
      ];
      arr.forEach(ctr => {
        props.forEach(k => {
          if (skinData[k]) {
            ctr[k] = skinData[k];
          }
        });
      });
    }
  },
  actions: {
    deleteControl(ctx, payload) {
      // 有传参数 则 删除指定的即可
      if (payload) {
        const { selectedControl, selectedControlParentCol, selectedControlIndex } = payload;
        ctx.commit('removeControl', { selectedControl, selectedControlParentCol, selectedControlIndex, shuttle: true });
      } else {
        // 否则为选中删除 删除 并清除选中状态
        const { control, index } = ctx.getters.selectedControl;
        if (!control || index === -1) {
          return console.error('出现错误，无法删除！');
        }
        // 隐藏域删除
        if (control.type === 'hiddenfield') {
          ctx.commit('clearSelectedControl');
          ctx.commit('removeHiddenControl', {
            index,
            shuttle: true
          });
          return;
        }
        let selectedControlParentCol = ctx.getters.selectedControlParentCol;
        if (!selectedControlParentCol) {
          return console.error('出现错误，无法删除！');
        }
        ctx.commit('clearSelectedControl');
        ctx.commit('removeControl', {
          selectedControl: control,
          selectedControlParentCol,
          selectedControlIndex: index,
          shuttle: true
        });
      }
    },
    setSelectedControl(ctx, payload) {
      ctx.commit('setSelectedControl', payload);

      // 清空行列
      ctx.commit('setSelectedCol', { id: '' });
      ctx.commit('updateSelectedLayout', { id: '' });
    },

    autoAddLabel(ctx, payload) {
      const parentCol = payload.parentCol;
      const control = createLabel(payload.controlData.name || '', ctx.state.globalStyle, payload.controlData);

      ctx.commit('addControl', { parentCol, control });
    },
    /**
     * 处理自动创建字段后的绑定逻辑
     * @param {*} ctx
     * @param {*} payload
     */
    bindFieldToControl(ctx, payload) {
      const { fieldMaps, controls, newFieldList } = payload;

      // 提交新创建的字段
      ctx.commit({
        type: 'submitNewFieldList',
        newFieldList: newFieldList
      });

      // 在控件上绑定字段
      const tableName = ctx.state.fieldList[0].sqltablename;
      function getBindValue(field) {
        return `#${tableName};#${field.fieldname || ''}`;
      }

      const shuttleGroupName = 'bindFieldToControl';

      controls.forEach(control => {
        const fieldData = fieldMaps[control.id];
        let field, field2;
        if (Array.isArray(fieldData)) {
          // 日期范围选择会返回两个字段 单独处理。。。
          field = fieldData[0];
          field2 = fieldData[1];
        } else {
          field = fieldData;
        }

        if (field && field.fieldname) {
          // 之前所有的设置逻辑都是基于选中控件来操作的
          // 此处需要直接修改数据
          // 简单点直接设置选中为要操作的。。。
          if (control.id != ctx.state.selectedControlId) {
            ctx.commit({
              type: 'setSelectedControl',
              id: control.id
            });
          }

          const value = getBindValue(field);
          ctx.dispatch({
            type: 'setControlProp',
            prop: 'bind',
            value: value,
            group: shuttleGroupName,
            control: control
          });

          if (field2) {
            ctx.dispatch({
              type: 'setControlProp',
              prop: 'bind2',
              value: getBindValue(field2),
              group: shuttleGroupName,
              control: control
            });
          }
        }
      });
    },
    setControlProp(ctx, payload) {
      const { prop, value, control } = payload;
      const group = payload.group || 'updateCtrProp-' + +new Date();
      ctx.commit({
        control,
        type: 'updateControlProp',
        prop,
        value,
        shuttle: true,
        group: group
      });
      // TODO 优化为修改控件属性的钩子函数 以便进行一定程度的解耦
      // 设置 bind 之后
      if (prop == 'bind') {
        // 1、如果bind的值有自动关联字段 则需要清空 data 和 并自动选择 对应的 codeItem
        const field = ctx.getters.fieldMap[value];
        if (field && field.datasource) {
          ctx.commit({
            control,
            type: 'updateControlProp',
            prop: 'data',
            value: '',
            shuttle: false
          });
          ctx.commit({
            control,
            type: 'updateControlProp',
            prop: 'codeItem',
            value: field.datasource,
            shuttle: false
          });
        }

        // 2、根据字段 自动设置 emptyText
        if (control && value && !control.emptyText !== undefined) {
          try {
            // ctr.emptyText = '请输入' + ctx.getters.fieldMap[value].name;
            ctx.commit({
              control,
              type: 'updateControlProp',
              prop: 'emptyText',
              value: '请输入' + ctx.getters.fieldMap[value].name,
              shuttle: false
            });
          } catch (err) {
            console.error('自动设置 emptyText', err);
          }
        }

        if (control.id != ctx.state.selectedControlId) {
          return;
        }

        // 3 尝试自动添加label
        autoCreateLabel(ctx, control);

        // 4 尝试修改 label 名称
        autoRenameLabel(ctx, ctx.getters.fieldMap[control.bind].name);

        // 5 尝试 自动 必填
        autoControlRequired(ctx, value, control);

        // 6 尝试设置 类型校验
        autoControlVerify(ctx, value, control);
      }

      // 后面根据的逻辑都是基于当前已选的操作进行的
      // 后续加了自动创建 会通过代码连续调用
      // 后面逻辑无需执行
      if (control.id != ctx.state.selectedControlId) {
        return;
      }

      // 唯一性校验 设置为true 关联必填为 true
      if (prop == 'uniqueValidate' && value === true) {
        ctx.commit({
          control,
          type: 'updateControlProp',
          prop: 'required',
          value: true,
          shuttle: true,
          group: group
        });
        autoLabelRequired(ctx, true);
      }

      if (prop == 'required') {
        autoLabelRequired(ctx, value);
      }

      // 如果清空了子表的 数据表选择 则列要清空
      if (prop == 'sourceTable') {
        dealSubTableFields(ctx, control);
      }

      // 如果修改控件名称 尝试同步 修改label的文字
      if (prop == 'name' && value && (control.type != 'label' || control.type != 'title')) {
        autoRenameLabel(ctx, value, false);
      }
    },
    /**
     * 提交前对控件数据进行的处理
     * 1. 代码项联动过程中 将第一个的代码项直接传递给后面被联动的
     */
    dealSubmitControl(ctx) {
      dealLinkedComboControls(ctx);
    }
  }
};

/**
 * 处理子表的字段 在 sourceTable 变更时触发
 *
 * @param {Object} ctx vuex context
 * @param {Object} control 当前控件
 */
function dealSubTableFields(ctx, control) {
  if (!control || control.type != 'subtable') {
    return;
  }
  // 清空或所选表格变化是 清空列
  ctx.commit({
    control,
    type: 'updateControlProp',
    prop: 'columns',
    value: [],
    shuttle: false
  });
}

/**
 * 根据字段上的配置 自动设置控件的 类型校验
 * @param {Object} ctx vuex context
 * @param {string} bindValue 当前更新的关联字段的 id 值
 * @param {Object} control 当前控件
 */
function autoControlVerify(ctx, bindValue, control) {
  const bindOption = ctx.getters.fieldMap[bindValue];

  if (!bindOption.fieldtype) {
    return;
  }

  // 如果类型非 0
  // 1 数值 2 整数
  let vType;
  switch (bindOption.fieldtype) {
    case 1:
      vType = 'float';
      break;
    case 2:
      vType = 'int';
      break;
    default:
      break;
  }
  if (vType) {
    ctx.commit({
      control,
      type: 'updateControlProp',
      prop: 'vtype',
      value: vType,
      shuttle: false
    });
  }
}

/**
 * 如果字段配置的是必填 则对应控件直接设置上必填
 * @param {Object} ctx vuex context
 * @param {string} bindValue 当前更新的关联字段的 id 值
 * @param {Object} control 当前控件
 */
function autoControlRequired(ctx, bindValue, control) {
  const bindOption = ctx.getters.fieldMap[bindValue];

  // 如果字段配置的是必填 则对应控件直接设置上必填
  if (bindOption.required) {
    if (control) {
      // 尝试修改此控件的 required 配置
      if ('required' in control) {
        ctx.commit({
          control,
          type: 'updateControlProp',
          prop: 'required',
          value: true,
          shuttle: false
        });
        // 尝试自动修改前一个 label 上的必填
        autoLabelRequired(ctx, true);
      }
    }
  }
}

/**
 * 尝试自动修改 label 的文本
 * @param {Object} ctx vuex context
 * @param {string} labelText label 文本
 * @param {boolean} force 强制修改，忽略是否为初始值的判断
 */
function autoRenameLabel(ctx, labelText, force) {
  const prevLabelControl = getPrevColLabel(ctx);
  if (prevLabelControl && (force || prevLabelControl.labelText == '控件label')) {
    ctx.commit('updateControlProp', {
      control: prevLabelControl,
      prop: 'labelText',
      value: labelText,
      shuttle: false
    });
  }
}

/**
 * 尝试修改label上的星号标记
 * @param {Object} ctx vuex context
 * @param {Boolean} value 是否显示星号
 */
function autoLabelRequired(ctx, value) {
  const prevLabelControl = getPrevColLabel(ctx);
  prevLabelControl &&
    ctx.commit('updateControlProp', {
      control: prevLabelControl,
      prop: 'showStar',
      value,
      shuttle: false
    });
}

function getPrevColLabel(ctx) {
  const { row, index } = ctx.getters.selectedControlParentColInfo;
  if (!row || index === -1) {
    console.log('不存在');
    return;
  }
  const prevCol = row.cols[index - 1];
  // 不存在 有布局 有控件 则忽略
  if (!prevCol || !prevCol.controls.length) {
    console.log('不存在前一列 或已有控件');
    return;
  }
  for (let ctr of prevCol.controls) {
    if (ctr.type == 'label') {
      return ctr;
    }
  }
  return null;
}

/**
 * 尝试自动创建 label 标签
 * @param {Object} ctx Vuex context 对象
 */
function autoCreateLabel(ctx, control) {
  const { row, index } = ctx.getters.selectedControlParentColInfo;

  if (!control || !row) {
    return;
  }
  const prevCol = row.cols[index - 1];
  // 不存在 有布局 有控件 则忽略
  if (!prevCol || prevCol.controls.length || prevCol.subs.length) {
    console.log('无前一列，或有布局或控件 忽略自动插入label');
    return;
  }
  const labelControl = createLabel(ctx.getters.fieldMap[control.bind].name, ctx.state.globalStyle);

  ctx.commit('addControl', { parentCol: prevCol, control: labelControl, shuttle: false });
}
/**
 * 创建一个label控件
 * @param {String} labelText 显示文本
 * @param {Object} globalStyle 全局样式对象
 * @param {Object} controlData 触发创建label的控件数据
 */
function createLabel(labelText, globalStyle, controlData) {
  const label = copy(window.FORM_DESIGN_CONFIG.controls.label);
  const idx = controlAutoIndex.getIndex('label');
  label.id = 'label-' + uid();
  // 控件名字自动编号
  label.namePrefix = 'label';
  label.autoIndex = idx;
  label.name = '';
  label.width = '100%';

  if (labelText) {
    label.labelText = labelText;
  }
  // 如果有控件则设置一些关联属性
  if (controlData) {
    if (controlData.required !== undefined) {
      label.showStar = controlData.required;
    }
  }
  delete label.configItems;

  const { fontSize, fontFamily, fontColor, fontBolder, fontItalic, fontUnderline } = globalStyle;
  label.fontSize = fontSize;
  label.fontFamily = fontFamily;
  label.fontColor = fontColor;
  label.fontBolder = fontBolder;
  label.fontItalic = fontItalic;
  label.fontUnderline = fontUnderline;

  return label;
}

/**
 * 处理 联动控件的codeItem
 * @param {Object} ctx vuex context
 */
function dealLinkedComboControls(ctx) {
  const allControls = ctx.getters.allControls;
  const combos = allControls.filter(ctr => ctr.type == 'combobox');

  if (!combos.length) {
    return;
  }

  const comboMap = new Map();
  const ancestorComboMap = new Map();
  combos.forEach(ctr => {
    comboMap.set(ctr.id, ctr);
    //如果配置了 值变更获取代码项的控件 则认为是 祖先控件
    if (ctr.events && ctr.events['valuechanged:getcodelist'] && ctr.events['valuechanged:getcodelist'].length) {
      ancestorComboMap.set(ctr.id, ctr);
    }
  });

  // 逐个修改同步
  syncLinkedComboData(ancestorComboMap, comboMap, ctx, {});
}

/**
 * 同步修改联动的控件信息
 * 1、 codeItem 设置为父控件的 codeItem
 * 2、 新增 codeSyncPid 属性 ， 值为父控件id 用于页面初始化返回时其数据源设置为空
 * @param {Map} ancestorComboMap  祖先控件 即配置了联动事件的控件
 * @param {Map} comboMap 所有 combobox
 * @param {Object} ctx vuex context
 * @param {Object} modifyMap 已经修改过的控件
 */
function syncLinkedComboData(ancestorComboMap, comboMap, ctx, modifyMap = {}) {
  let modified = false,
    retry = false;
  ancestorComboMap.forEach(ctr => {
    // 如果自身有代码项 将传递给每个联动的控件
    if (ctr.codeItem) {
      // 得到所有目标控件信息
      const targets = ctr.events['valuechanged:getcodelist'].reduce((arr, curr) => {
        const aimAction = curr.actions.filter(a => a.type == 'setData')[0];
        if (aimAction) {
          arr.push(...aimAction.targets);
        }
        return arr;
      }, []);

      // 遍历目标控件修改属性
      targets.forEach(childCtr => {
        const sid = childCtr.id;
        // 没修改过的再修改
        if (!modifyMap[sid]) {
          ctx.commit({
            control: comboMap.get(sid),
            type: 'updateControlProp',
            prop: 'codeItem',
            value: ctr.codeItem,
            shuttle: false
          });
          ctx.commit({
            control: comboMap.get(sid),
            type: 'updateControlProp',
            prop: 'codeSyncPid',
            value: ctr.id,
            shuttle: false
          });

          modifyMap[sid] = true;
          modified = true;
        }
      });
    } else {
      retry = true;
    }
  });

  // 需要重试（即某个控件可能处于中间状态，本身没有） 且 本轮遍历至少修改过一个控件 的情况下 重试
  if (retry && modified) {
    syncLinkedComboData(ancestorComboMap, comboMap, ctx, modifyMap);
  }
}
