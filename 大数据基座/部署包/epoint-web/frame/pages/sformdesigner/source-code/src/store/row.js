import { copy, uid, colAutoIndex, rowAutoIndex, setDotProp } from '../util/index.js';

import {MIN_ROW_HEIGHT} from '@/config.js';

export default {
  getters: {
    rowDataMap: state => {
      const map = {};

      state.design.forEach(addRowData);

      function addRowData(row, index) {
        if (map[row.id]) {
          console.warn('行id出现重复！！！', map[row.id], row);
        }
        map[row.id] = {
          row: row,
          index: index
        };

        if (row.cols) {
          row.cols.forEach(col => {
            if (col.subs) {
              col.subs.forEach(addRowData);
            }
          });
        }
      }
      // console.log(map);
      return map;
    },
    allRows: (state, { rowDataMap }) => {
      const arr = [];

      for (let id in rowDataMap) {
        if (rowDataMap.hasOwnProperty(id)) {
          arr.push(rowDataMap[id].row);
        }
      }

      return arr;
    },
    subRowPathMap: (state, getters) => {
      const path = {};

      state.design.forEach(findPath);

      // 自顶向下遍历 每次拼接时 加到前面
      function findPath(row) {
        if (!path[row.id]) {
          path[row.id] = [];
        }
        if (row.cols) {
          row.cols.forEach(col => {
            if (col.subs) {
              // 如果当前行有 内嵌行 则每个子行的父元素均为此行
              col.subs.forEach(subRow => {
                path[subRow.id] = [row].concat(path[row.id]);
              });
              col.subs.forEach(findPath);
            }
          });
        }
      }
      for (let rowId in path) {
        if (path.hasOwnProperty(rowId)) {
          if (!path[rowId] || !path[rowId].length) {
            delete path[rowId];
            continue;
          }
          /* eslint no-console: "off" */
          // console.group('嵌套行路径' + rowId + getters.rowDataMap[rowId].row.name);
          // console.log(document.querySelector('[row-id="' + getters.rowDataMap[rowId].row.id + '"]'));

          // path[rowId].forEach(s => {
          //   console.log(document.querySelector('[row-id="' + s.id + '"]'));
          // });

          // console.groupEnd();
        }
      }
      return path;
    },
    /**
     * 选中行所在列
     */
    selectedRowParentCol: (state, getters) => {
      const rowId = state.selectedRowId;
      if (!rowId) {
        return null;
      }
      // 查找 选中行所在的列
      const parentPath = getters.subRowPathMap[rowId];
      if (parentPath && parentPath.length) {
        for (let col of parentPath[0].cols) {
          if (col.subs && col.subs.length) {
            for (let row of col.subs) {
              if (row.id == rowId) {
                return col;
              }
            }
          }
        }
      }
      return null;
    },
    /**
     * 选中行的数据
     */
    selectedLayoutData: (state, getters) => {
      const rowId = state.selectedRowId;
      if (!rowId) {
        return {
          layout: null,
          index: -1
        };
      }

      const data = getters.rowDataMap[rowId];
      return {
        layout: data.row,
        index: data.index
      };
    }
  },
  mutations: {
    updateSelectedLayout(state, payload) {
      const { id } = payload;
      state.selectedRowId = id;
    },
    /**
     * 更新行上的信息
     *
     * @param {*} state
     * @param {Object} payload 负载 格式如下
     * {
     *    value: v, 属性值
     *    prop: 'props.title', 属性路径 支持 .
     *    group, 分组信息
     *    row: this.selectedCol 要操作的行数据
     * }
     */
    setRowProps(state, payload) {
      if (payload.shuttle === undefined) {
        payload.shuttle = true;
      }
      const { prop, value, row } = payload;

      setDotProp(row, prop, value);
    },
    removeRow(state, payload) {
      const { parentCol, index } = payload;

      if (parentCol) {
        if (parentCol.subs) {
          parentCol.subs.splice(index, 1);
        } else {
          console.error('删除时找不到上级！！！');
        }
      } else {
        state.design.splice(index, 1);
      }
    },
    updateRowHeight(state, data) {
      console.log(state, data);
      const { row, height } = data;
      const delta = height - row.height;
      row.height = height;

      // 如果更新的是外层的行的高度 需要去处理内部行的高度
      dealSubRowHeight(row, height);

      // 某些情况是肯定不用向上递推的
      if (data.bubble !== false) {
        dealParentRowHeight(data.parentRowPath, delta);
      }

      /**
       * 处理内部行的高度
       *
       * @param {rowData} row 高度发送变化的行的数据
       * @param {number} height 对应高度
       * @returns
       */
      function dealSubRowHeight(row, height) {
        if (!row.cols) {
          return;
        }
        row.cols.forEach(col => {
          const subRows = col.subs;
          if (!subRows || !subRows.length) return;
          // debugger;
          const lastSubRow = subRows[subRows.length - 1];
          const subRowsHeight = subRows.reduce((t, c) => t + c.height, 0);
          const diff = height - subRowsHeight;
          if (diff > 0) {
            // 高度增加的情况
            // 如果内部所有的行高小于 外层行
            // 将内层最后一行高度加高
            lastSubRow.height += diff;
          } else {
            // 高度减小的情况 也是减小内层的最后一个的高度
            // 计算新的最后一行的高度 但不应小于最小值
            const nh = lastSubRow.height + diff;
            lastSubRow.height = nh < MIN_ROW_HEIGHT ? MIN_ROW_HEIGHT : nh;
          }
          dealSubRowHeight(lastSubRow, lastSubRow.height);
        });
      }

      /**
       * 向外递推处理 高度
       * 当前行高度 增加 需要给外层逐个补上相应的高度
       * 当前行高度减小 需要外层也减小相应的高度
       *
       * @param {Array<rowData>} rowPath 嵌套航的路径 由内而外
       * @param {number} delta 高度变化量
       */
      function dealParentRowHeight(rowPath, delta) {
        if (!rowPath || !rowPath.length) {
          return;
        }

        // todo 高度限制问题 拟通过拖拽高度限制来解决
        // 可能存在 都有嵌套的问题
        const parentRow = rowPath[0];
        parentRow.height += delta;

        if (parentRow.type == undefined || parentRow.type == 'row-layout') {
          dealSubRowHeight(parentRow, parentRow.height);
        }

        dealParentRowHeight(rowPath.slice(1), delta);
      }
    },
    /**
     * 基于拖拽的行创建多行多列
     * @param {*} state
     * @param {Object} payload
     * {
     *    row 替换的行
     *    rowIndex 替换的行的索引
     *    rowCount 新的行数
     *    colCount 新的列数
     *    parentCol 所在父列 由于限制了单列仅能直接放置最外层 此处是就是design
     * }
     */
    replaceToMulti(state, payload) {
      const { row, rowIndex, rowCount, colCount, parentCol } = payload;

      const container = parentCol && parentCol.subs ? parentCol.subs : state.design;

      let parentWidth = 900;

      if (parentCol && parentCol.style.width && typeof parentCol.style.width == 'number') {
        parentWidth = parentCol.style.width;
      }

      const multiRows = createMultiRowCol(row, rowCount, colCount, parentWidth);

      container.splice(rowIndex, 1, ...multiRows);

      function createMultiRowCol(base, r, c, parentWidth) {
        const rowBase = copy(base);
        const colBase = row.cols[0];

        rowBase.cols = [];
        rowBase.asMulti = false;
        delete rowBase.asMulti;
        colBase.style.width = parentWidth / c;

        // 行
        const rows = [...new Array(r)].map(() => {
          const id = uid();
          const rowObj = copy(rowBase);
          rowObj.id = id;
          rowObj.autoIndex = rowAutoIndex.getIndex(rowObj.namePrefix || rowObj.name);
          // 内部列
          rowObj.cols = [...new Array(c)].map(() => {
            const index = colAutoIndex.getIndex(id);
            const colObj = copy(colBase);
            colObj.id = `col-${id}-${index}`;
            colObj.name = `col-${index}`;
            return colObj;
          });
          return rowObj;
        });

        return rows;
      }
    },
    /**
     * 处理行copy
     */
    copyRow(state, payload) {
      const { aimIndex, newRow } = payload;
      const parentCol = payload.parentCol ? payload.parentCol.subs : state.design;

      parentCol.splice(aimIndex, 0, newRow);
    },
    /**
     * 更新布局属性
     */
    updateLayoutProp(state, payload) {
      const { prop, value, layout } = payload;
      if (layout) {
        layout[prop] = value;
      } else {
        console.error('组件件不存在');
      }
    },
    /**
     * 更新行高度 未做任何向内外的调整 仅适用于顶层且无嵌套
     */
    updateAllRowHeight(state, payload) {
      const { rows, height } = payload;
      if (Array.isArray(rows)) {
        rows.forEach(row => {
          row.height = height;
          if (row.type == 'acc-layout') {
            doUpdate(row);
          }
        });
      }

      function doUpdate(row) {
        row.cols.forEach(col => {
          col.subs.forEach(subRow => {
            // 如果此行内部有嵌套 则不能更新高度
            for (let col of subRow.cols) {
              if (col.subs && col.subs.length) {
                return false;
              }
            }
            subRow.height = height;
          });
        });
      }
    }
  },
  actions: {
    /**
     * 设置全部行的高度
     */
    setAllRowHeight(ctx, payload) {
      const { height } = payload;

      // 过滤得出所有可以设置的行
      const rows = ctx.state.design.filter(row => {
        if (row.type == 'acc-layout') {
          return true;
        }
        for (let col of row.cols) {
          if (col.subs && col.subs.length) {
            return false;
          }
        }
        return true;
      });

      // 先更新全局的
      const group = 'allRowHeight' + +new Date();
      ctx.commit('updateGlobalStyleProp', { prop: 'cellHeight', value: height, shuttle: true, group });
      // 更新符合条件的行
      if (rows.length) {
        ctx.commit('updateAllRowHeight', { rows, height, shuttle: true, group });
      }
    },
    setSelectedLayout(ctx, payload) {
      ctx.commit('updateSelectedLayout', payload);

      // 选中行后 清空单元格和控件的选中
      ctx.commit({
        type: 'setSelectedCol',
        selectedColId: ''
      });
      ctx.commit('clearSelectedControl');
    },
    /**
     * 设置布局的属性
     */
    setLayoutProp(ctx, payload) {
      let { layout, prop, value } = payload;
      if (!layout) {
        layout = ctx.getters.selectedLayoutData.layout;
      }
      ctx.commit('updateLayoutProp', { layout, prop, value });
    },
    /**
     * 删除一行
     * {
     *   row, index, parentCol
     * }
     */
    deleteRow(ctx, payload) {
      if (payload.shuttle === undefined) {
        payload.shuttle = true;
      }
      if (payload.group === undefined) {
        payload.group = 'deleteRow-' + +new Date();
      }

      // 如果是选中行被删除 需要清除状态
      if (payload.row == ctx.getters.selectedLayoutData.layout) {
        ctx.commit('updateSelectedLayout', { id: '' });
      }

      const miss_h = payload.row.height;

      ctx.commit('removeRow', payload);

      // 行高度检查和调整
      const parentCol = payload.parentCol;
      // const parentRow = payload.parentRow;
      if (parentCol) {
        const subRows = parentCol.subs;
        if (!subRows.length) {
          return;
        }

        // 给剩下的行加上 删除的行的高度即可
        const targetRow = subRows[subRows.length - 1];
        const new_h = targetRow.height + miss_h;

        ctx.commit('updateRowHeight', {
          row: targetRow,
          height: new_h,
          bubble: false
        });
      }
    }
  }
};
