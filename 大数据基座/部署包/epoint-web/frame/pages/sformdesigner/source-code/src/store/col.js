import { copy, setDotProp, colAutoIndex, uid, rowAutoIndex } from '../util/index.js';

export default {
  getters: {
    // 所有列
    allCol: (state, getters) => {
      const arr = [];

      const rowDataMap = getters.rowDataMap;
      let row;
      for (let rowId in rowDataMap) {
        if (Object.prototype.hasOwnProperty.call(rowDataMap, rowId)) {
          row = rowDataMap[rowId].row;
          row.cols.forEach(col => {
            arr.push(col);
          });
        }
      }
      return arr;
    },
    // 列样式
    colStyleText: (state, getters) => {
      const allCol = getters.allCol;
      const styleArr = [];
      allCol.forEach(col => {
        const border = col.style.border;

        const style = [
          `#${col.id}:after{`,
          `border-top: ${border.top.width}px ${border.top.style} ${border.top.color};`,
          `border-right: ${border.right.width}px ${border.right.style} ${border.right.color};`,
          `border-bottom: ${border.bottom.width}px ${border.bottom.style} ${border.bottom.color};`,
          `border-left: ${border.left.width}px ${border.left.style} ${border.left.color};}`
        ].join('');

        styleArr.push(style);
      });

      return styleArr.join('');
    },
    /**
     * 选中的列的引用
     */
    selectedCol: (state, getters) => {
      const colId = state.selectedColId;
      if (!colId) return null;

      const rowId = colId.replace(/^col-([\w-]+)-\d{1,2}$/, '$1');
      const rowData = getters.rowDataMap[rowId];
      if (!rowData) {
        // 嵌套的数据中找不到，尝试遍历一次
        for (let col of getters.allCol) {
          if (col.id === colId) {
            return col;
          }
        }
        return null;
      }

      for (let col of rowData.row.cols) {
        if (col.id == colId) {
          return col;
        }
      }

      return null;
    }
  },
  mutations: {
    setSelectedCol(state, payload) {
      state.selectedColId = payload.id;
    },
    /**
     * 更新列上的信息
     *
     * @param {*} state
     * @param {Object} payload 负载 格式如下
     * {
     *    value: v, 属性值
     *    prop: 'props.title', 属性路径 支持 .
     *    group, 分组信息
     *    col: this.selectedCol 要操作的列数据
     * }
     */
    setColProps(state, payload) {
      if (payload.shuttle === undefined) {
        payload.shuttle = true;
      }
      const { prop, value, col } = payload;

      setDotProp(col, prop, value);
    },
    /**
     * 新增手风琴项
     *
     */
    addAccItem(state, payload) {
      const { item, parentRow } = payload;
      parentRow.cols.push(item);
    },

    removeCol(state, payload) {
      const { col, parentRow, colIndex } = payload;
      if (!parentRow.cols || parentRow.cols.length == 1) {
        return;
      }
      // todo 仅调整一层是不够的 需要考虑向内外递归
      const prevCol = parentRow.cols[colIndex - 1];
      if (prevCol) {
        prevCol.style.width += col.style.width;
      } else {
        const nextCol = parentRow.cols[colIndex + 1];
        if (nextCol) {
          nextCol.style.width += col.style.width;
        }
      }
      parentRow.cols.splice(colIndex, 1);
    },
    splitCol(state, payload) {
      const { col, colIndex, count, parentRow, direction = 'right' } = payload;
      if (!parentRow) {
        payload.shuttle = false;
        console.error('未指定所在行！！');
        return;
      }
      // 宽度处理
      // 拆分为 n 个 则宽度均分
      // 当前的格子宽度为原宽度 - 新格子宽度之和
      // eg： 拆分为 2 个 则宽度均分； 拆分为3个 则宽度各为 1/3
      const all_w = col.style.width;
      const sub_w = (all_w / count) >> 0;
      col.style.width = all_w - sub_w * (count - 1);

      const newColDataArr = [];
      const len = count - 1;
      let i = 0;

      while (i++ < len) {
        // 构建新列的数据
        const newColData = copy(col);
        // id
        genderIdName(parentRow, newColData);

        newColData.style.width = sub_w;
        newColData.style.border = copy(col.style.border);
        newColData.controls = [];
        newColDataArr.push(newColData);
      }

      // 插入
      const aimIndex = direction == 'left' ? colIndex : colIndex + 1;
      parentRow.cols.splice(aimIndex, 0, ...newColDataArr);

      function genderIdName(row, colData) {
        const rowId = row.id;
        // const maxId = Math.max(
        //   ...row.cols.map(col => {
        //     return parseInt(col.id.substr(col.id.lastIndexOf('-') + 1), 10);
        //   })
        // );
        const index = colAutoIndex.getIndex(rowId);
        colData.id = `col-${rowId}-${index}`;
        colData.name = `col-${index}`;
      }
    },
    // 目标单元格中插入 行数组
    intertRowsInCol(state, payload) {
      const { rowDataArr, col } = payload;

      col.subs = rowDataArr;
    },
    // 快速拆分时 单行单列替换
    replaceSingleColToRows(state, payload) {
      const { rowIndex, rowDataArr, parentRowPath } = payload;

      let parentRow;

      if (parentRowPath && parentRowPath[0]) {
        parentRow = parentRowPath[0];
      } else {
        parentRow = state.design;
      }

      parentRow.splice(rowIndex, 1, ...rowDataArr);
    },
    updateColAllBorder(state, payload) {
      console.log('简易设置边框', payload);
      const { directions, prop, value } = payload;

      directions.forEach(dir => {
        if (dir) {
          dir[prop] = value;
        }
      });
    },
    setColBorder(state, payload) {
      const { border, selectedCol } = payload;
      console.log('更新边框', JSON.stringify(payload));
      selectedCol.style.border = copy(border);
    },
    setColStyle(state, payload) {
      console.log('更新单元格样式', JSON.stringify(payload));
      const { prop, value, selectedCol } = payload;
      selectedCol.style[prop] = value;
    },
    /**
     * 设置全部边框的宽度 用于全局设置为全边框 和 无边框的情况
     */
    setAllColBorderWidth(state, payload) {
      const { cols, borderWidth } = payload;

      setAllBorder(cols, borderWidth);
    },
    /**
     * 全局设置 仅内边框
     */
    setAllColBorder_inner(state, payload) {
      // 先全部加上  然后去掉外边框
      const { cols, borderWidth } = payload;
      setAllBorder(cols, borderWidth);

      // 第一行去掉 上边
      fixedTopBorder(state.design[0], 0);
      // 最后一行去掉 下边
      fixedBottomBorder(state.design[state.design.length - 1], 0);
      // 去掉最左边
      fixedLeftBorder(state.design, 0);
      // 去掉最右边
      fixedRightBorder(state.design, 0);
    },
    /**
     * 全局边距 仅水平线
     */
    setAllColBorder_hline(state, payload) {
      const { cols, borderWidth } = payload;
      cols.forEach(col => {
        col.style.border.left.width = 0;
        col.style.border.right.width = 0;

        col.style.border.top.width = borderWidth;
        col.style.border.bottom.width = borderWidth;
      });
    },

    /**
     * 全局边距 仅垂直线
     */
    setAllColBorder_vline(state, payload) {
      const { cols, borderWidth } = payload;
      cols.forEach(col => {
        col.style.border.left.width = borderWidth;
        col.style.border.right.width = borderWidth;

        col.style.border.top.width = 0;
        col.style.border.bottom.width = 0;
      });
    },
    /**
     * 全局边距 仅外部线
     */
    setAllColBorder_outer(state, payload) {
      // 先全部去掉  然后加上外边框
      const { cols, borderWidth } = payload;
      setAllBorder(cols, 0);

      // 第一行加上 上边
      fixedTopBorder(state.design[0], borderWidth);
      // 最后一行加上 下边
      fixedBottomBorder(state.design[state.design.length - 1], borderWidth);
      // 加上最左边
      fixedLeftBorder(state.design, borderWidth);
      // 加上最右边
      fixedRightBorder(state.design, borderWidth);
    },
    /**
     * 全局边距 仅左边
     */
    setAllColBorder_left(state, payload) {
      const { cols, borderWidth } = payload;
      // 全部去掉
      setAllBorder(cols, 0);
      // 补上左边
      fixedLeftBorder(state.design, borderWidth);
    },
    /**
     * 全局边距 仅上边
     */
    setAllColBorder_top(state, payload) {
      const { cols, borderWidth } = payload;
      // 全部去掉
      setAllBorder(cols, 0);
      // 再把第一行的上边框补上
      fixedTopBorder(state.design[0], borderWidth);
    },
    /**
     * 全局边框 仅右边
     */
    setAllColBorder_right(state, payload) {
      const { cols, borderWidth } = payload;
      // 全部去掉
      setAllBorder(cols, 0);
      // 再把顶层每行最后一个补上
      fixedRightBorder(state.design, borderWidth);
    },
    /**
     * 全局边框 仅下边
     */
    setAllColBorder_bottom(state, payload) {
      const { cols, borderWidth } = payload;
      // 全部去掉
      setAllBorder(cols, 0);
      // 再把顶层最后一行底部补上
      const len = state.design.length;
      if (len) {
        const lastRow = state.design[len - 1];
        fixedBottomBorder(lastRow, borderWidth);
      }
    },
    /**
     * 更新列宽度 用于列拖动时
     */
    updateColWidth(state, data) {
      const { col, width, nextCol } = data;
      // 当前列的宽度变化量
      const delta = width - col.style.width;

      // 相邻两行调整时 本列改变之后 下一列加减移动的差值
      if (nextCol && nextCol.style) {
        nextCol.style.width -= delta;
        // 如果右侧里面有子行 也需要递归
        if (nextCol.subs) {
          dealInnerColWidth(nextCol, -delta, 'right');
        }
      }
      // 当前列宽度调整
      col.style.width = width;
      // 当前列内部有嵌入的子行的时候 需要进入子行 修改每行最后一列的宽度
      if (col.subs) {
        dealInnerColWidth(col, delta, 'left');
      }

      /**
       * 处理内部嵌套行的中列的宽度
       * 如果调整列中 还有嵌套行 那么宽度变化时 其内嵌的行的最后一列的宽度也需要随之变化
       *
       * @param {ColData} col 当前列
       * @param {number} delta 宽度变化 以增加为正
       * @param {string} direction 方向 left or right 右侧的单元格改变第一个 左侧（自己）的改变内部最后一个
       */
      function dealInnerColWidth(col, delta, direction) {
        col.subs.forEach(row => {
          const subCols = row.cols;

          if (!subCols || !subCols.length) return;

          const firstSubCol = subCols[direction == 'right' ? 0 : subCols.length - 1];

          firstSubCol.style.width += delta;

          dealInnerColWidth(firstSubCol, delta, direction);
        });
      }
    },
    /**
     * 更新行中每一列的宽度 用于行拖拽重新放置时
     * @param {*} state
     * @param {Object} payload
     * {
     *   row: 发生变化的行
     *   ratio： 变化比例
     * }
     */
    updateRowColWidth(state, payload) {
      const { row, ratio } = payload;
      updateWidth(row);

      function updateWidth(row) {
        row.cols.forEach(col => {
          col.style.width *= ratio;

          // 内部递推
          if (col.subs && col.subs.length) {
            col.subs.forEach(updateWidth);
          }
        });
      }
    },
    updateColBorder(state, payload) {
      const {prop, value, targetBorderConfig} = payload;
      if (targetBorderConfig) {
        // if (!targetCol.style.border) debugger
        // console.log(JSON.stringify(targetBorderConfig, 0 ,2));
        // console.log(prop, value);
        targetBorderConfig[prop] = value;
      }
    }
  },
  actions: {
    setSelectedCol(ctx, payload) {
      ctx.commit('setSelectedCol', payload);

      // 清空行和控件
      ctx.commit('updateSelectedLayout', { id: '', shuttle: false });
      ctx.commit('clearSelectedControl');
    },
    removeCol(ctx, payload) {
      // 清空选中
      const { col } = payload;
      if (col.id == ctx.state.selectedColId) {
        ctx.commit('setSelectedCol', { id: '', shuttle: false });
      }

      ctx.commit('removeCol', payload);

      // todo 其他列宽度调整
    },
    setColAllBorder(ctx, payload) {
      const { prop, value } = payload;

      const currentCol = ctx.getters.selectedCol;
      // 四个方向的边框
      // r 、 b 必定为自身 其他需要查找
      // l 为前一个的 r
      // t 暂时取上一行相同索引的 b
      const r = currentCol.style.border.right;
      const b = currentCol.style.border.bottom;
      let l;
      let t;

      const temp = ctx.state.selectedColId.match(/col-(\w+)-\d/);
      if (!temp) return console.error('单元格不存在！！！');
      const parentRowId = temp[1];
      if (!parentRowId) return console.error('无法匹配目标行');
      const parentRow = ctx.getters.rowDataMap[parentRowId].row;
      const parentRowIndex = ctx.getters.rowDataMap[parentRowId].index;

      const colIndex = parentRow.cols.indexOf(currentCol);
      if (colIndex === -1) {
        return console.error('单元格不存在！！！');
      }

      if (colIndex === 0) {
        // 第一个 则为自身的
        l = currentCol.style.border.left;
      } else {
        // 否则为前一个的右边
        l = parentRow.cols[colIndex - 1].style.border.right;
      }

      if (parentRowIndex == 0) {
        // 第一行则top就是自身
        t = currentCol.style.border.top;
      } else {
        let prevRow;
        const rowPath = ctx.getters.subRowPathMap[parentRowId];
        // 否则查找
        if (rowPath && rowPath.length) {
          // 嵌套模式 从直接父行里面取
          prevRow = rowPath[0].cols[parentRowIndex - 1];
        } else {
          // 无嵌套的行直接索引取
          prevRow = ctx.state.design[parentRowIndex - 1];
        }

        t = prevRow.cols[colIndex] ? prevRow.cols[colIndex].style.border.bottom : null;
      }

      // let topCol = prevRow.cols[colIndex] ? prevRow.cols[colIndex] : null;

      ctx.commit('updateColAllBorder', {
        directions: [t, r, b, l],
        prop,
        value,
        shuttle: true
      });
    },
    // 设置单元格单个方向的边框属性
    setColBorderDetail(ctx, payload) {
      const {dir, prop, value, selectedCol} = payload;
      if (!selectedCol) return;
      // 先对自身进行修改
      ctx.commit('updateColBorder', {
        prop, 
        value, 
        targetBorderConfig: selectedCol.style.border[dir],
        group: payload.group
      });

      // 右侧 和 下方就是自身的 无需特殊处理
      if (dir == 'right' || dir == 'bottom') {
        return;
      }

      // 然后再查找对应其他单元格修改
      let l;
      let t;
      const currentCol = selectedCol;

      const temp = ctx.state.selectedColId.match(/col-(\w+)-\d/);
      if (!temp) return console.error('单元格不存在！！！');
      const parentRowId = temp[1];
      if (!parentRowId) return console.error('无法匹配目标行');
      const parentRow = ctx.getters.rowDataMap[parentRowId].row;
      const parentRowIndex = ctx.getters.rowDataMap[parentRowId].index;

      const colIndex = parentRow.cols.indexOf(currentCol);
      if (colIndex === -1) {
        return console.error('单元格不存在！！！');
      }

      
      if (dir == 'left') {
        // 找前一个修改

        if (colIndex === 0) {
          // 第一个 则为自身的
          l = currentCol.style.border.left;
        } else {
          // 否则为前一个的右边
          l = parentRow.cols[colIndex - 1].style.border.right;
        }

        if (l) {
          ctx.commit('updateColBorder',{
            prop, 
            value, 
            targetBorderConfig: l,
            group: payload.group
          });
        }

        return;
      }

      if (dir == 'top') {
        // 找上一行的修改
        if (parentRowIndex == 0) {
          // 第一行则top就是自身
          t = currentCol.style.border.top;
        } else {
          let parentCol;
          let prevRow;
          const rowPath = ctx.getters.subRowPathMap[parentRowId];
          // 否则查找
          if (rowPath && rowPath.length) {
            // 嵌套模式 从直接父行里面找
            rowPath[0].cols.forEach((col)=>{
              if (parentCol) return;
              if (col.subs && col.subs[parentRowIndex] === parentRow) {
                parentCol = col;
              }
            });
            
            prevRow = parentCol ? parentCol.subs[parentRowIndex - 1] : null;
          } else {
            // 无嵌套的行直接索引取
            prevRow = ctx.state.design[parentRowIndex - 1];
          }
  
          t = (prevRow && prevRow.cols[colIndex]) ? prevRow.cols[colIndex].style.border.bottom : null;
        }
        if (t) {
          ctx.commit('updateColBorder',{
            prop, 
            value, 
            targetBorderConfig: t,
            group: payload.group
          });
        }
        return;
      }

    },
    
    // 插入多行多列
    insertMultiRowCol(ctx, payload) {
      const { col, parentRow, parentRowIndex, rowCount, colCount } = payload;
      const rowDataArr = new Array(rowCount).fill(1).map(() => {
        return createRowData(colCount, col.style.width, ctx.state.globalStyle);
      });

      const group = 'insertMultiRowCol' + +new Date();

      const current_h = parentRow.height;

      const inner_h = ctx.state.globalStyle.cellHeight * rowCount;

      if (inner_h > current_h) {
        // 如果插入后的高度更大 则先更新 容器所在行高度
        ctx.commit({
          type: 'updateRowHeight',
          row: parentRow,
          height: inner_h,
          group
        });
      } else {
        // 否则 修正最后一行的高度
        rowDataArr[rowCount - 1].height += current_h - inner_h;
      }

      // 单行单列的拆分 直接替换掉即可
      if (parentRow.cols.length === 1) {
        // 替换即可
        ctx.commit({
          type: 'replaceSingleColToRows',
          group,
          parentRowPath: ctx.getters.subRowPathMap[parentRow.id],
          row: parentRow,
          rowIndex: parentRowIndex,
          rowDataArr
        });
        return;
      }

      // 在目标单元格插入创建好的行
      ctx.commit({
        type: 'intertRowsInCol',
        group,
        col,
        rowDataArr
      });
    }
  }
};

/**
 * 设置全部边框
 * @param {Array<colData>} cols 单元格数组
 * @param {Number} width 边框宽度
 */
function setAllBorder(cols, width) {
  cols.forEach(col => {
    col.style.border.top.width = width;
    col.style.border.right.width = width;
    col.style.border.bottom.width = width;
    col.style.border.left.width = width;
  });
}

/**
 * 补上顶部边框
 *
 * @param {rowData} row 行数据
 * @param {Number} width 边框宽度
 */
function fixedTopBorder(row, width) {
  if (row) {
    row.cols.forEach(col => {
      col.style.border.top.width = width;
      const subFirstRow = col.subs[0];
      fixedTopBorder(subFirstRow);
    });
  }
}

/**
 * 补上底部边框
 * @param {rowData} row 行数据
 * @param {Number} width 边框宽度
 */
function fixedBottomBorder(row, width) {
  if (row) {
    row.cols.forEach(col => {
      col.style.border.bottom.width = width;

      const subLen = col.subs.length;
      if (subLen) {
        fixedBottomBorder(col.subs[subLen - 1], width);
      }
    });
  }
}

/**
 * 补上左边的边框
 * @param {Array<rowData>} topRows 行数组
 * @param {Number} width 边框宽度
 */
function fixedLeftBorder(topRows, width) {
  if (Array.isArray(topRows) && topRows.length) {
    topRows.forEach(row => {
      const firstCol = row.cols[0];
      if (firstCol) {
        firstCol.style.border.left.width = width;

        // 递归内部
        fixedLeftBorder(firstCol.subs, width);
      }
    });
  }
}

/**
 * 补上右边的边框
 * @param {Array<rowData>} topRows 行数组
 * @param {Number} width 边框宽度
 */
function fixedRightBorder(topRows, width) {
  if (Array.isArray(topRows) && topRows.length) {
    topRows.forEach(row => {
      const lastCol = row.cols[row.cols.length - 1];
      if (lastCol) {
        lastCol.style.border.right.width = width;

        // 递归内部
        fixedRightBorder(lastCol.subs, width);
      }
    });
  }
}


/**
 * 创建行数据 用于快速拆分
 * @param {number} colCount 此行的列数目
 * @param {number} containerWidth 父列宽度
 * @param {object} globalStyle 全局样式
 */
function createRowData(colCount, containerWidth, globalStyle) {
  const id = uid();
  const row = {
    id,
    type: 'row-layout',
    name: '行',
    autoIndex: rowAutoIndex.getIndex('row'),
    namePrefix: '行',
    height: globalStyle.cellHeight,
    cols: []
  };

  const w = containerWidth / colCount;

  let i = 0;
  let index;
  while (i++ < colCount) {
    index = colAutoIndex.getIndex(id);
    row.cols.push({
      id: `col-${id}-${index}`,
      name: `col-${index}`,
      type: 'col-item',
      style: {
        verticalAlign: globalStyle.verticalAlign,
        textAlign: globalStyle.textAlign,
        width: w,
        border: copy(globalStyle.border)
      },
      subs: [],
      controls: []
    });
  }

  return row;
}
