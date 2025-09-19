import { copy, uid, colAutoIndex, controlAutoIndex, rowAutoIndex } from '../../util/index.js';
import assign from 'lodash.assign';

// 行相关操作
export default {
  methods: {
    // 行选择
    handleRowSelect(id) {
      this.setSelectedLayout({ id });
      // 行也被当做一个控件处理
      this.activeRightTab('control');
    },
    // 行复制
    handleRowCopy(row, currIndex, parentCol) {
      const newRow = this.getRowCopyData(row);
      this.copyRow({ aimIndex: currIndex + 1, parentCol, newRow, shuttle: true });
    },
    getRowCopyData(rowData, removeControl) {
      const rowCopy = copy(rowData);

      dealRow(rowCopy);

      return rowCopy;

      function dealRow(row) {
        const rowId = uid();
        const name = row.namePrefix || row.name;
        row.id = rowId;
        row.autoIndex = rowAutoIndex.getIndex(name);
        if (row.name) {
          row.name = `${row.name}_${row.autoIndex}`;
        }

        row.cols.forEach(col => {
          col.id = `col-${rowId}-${colAutoIndex.getIndex(rowId)}`;

          // 内部子行
          if (col.subs) {
            col.subs.forEach(dealRow);
          }
          // 内部控件
          if (removeControl) {
            col.controls = [];
          } else {
            col.controls.forEach(resetControl);
          }
        });
      }

      /**
       * 将控件从设为默认值
       *
       * @param {controlData} control 已有控件的数据
       */
      function resetControl(control) {
        const type = control.type;
        // const name = control.namePrefix || control.name;
        const controlConfig = window.FORM_DESIGN_CONFIG.controls[type];
        if (!controlConfig) {
          throw new Error(`控件的 ${type} 配置信息不存在，无法创建`);
        }
        const defaultControl = copy(controlConfig);
        delete defaultControl.configItems;
        delete defaultControl.name;
        delete defaultControl.width;
        delete defaultControl.id;
        delete defaultControl.type;

        // 读取 控件初始值 进行覆盖
        if (type != 'label' && type != 'title') {
          assign(control, defaultControl);
        }

        // 重设 id 和名称
        const idx = controlAutoIndex.getIndex(type);
        control.id = type + '-' + idx;
        control.autoIndex = idx;
        if (control.name) {
          control.name = `${control.name}_${idx}`;
        }
      }
    },

    // 行删除
    handleRowRemove(row, currIndex) {
      // 空行时列则不提醒
      if (this.isEmptyRow(row)) {
        return this.doRowRemove(row, currIndex);
      }
      this.$confirm('此操作将移除此行，以及此行内的所有内容，是否确认？', ' 删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.list.splice(currIndex, 1);
          this.doRowRemove(row, currIndex);
        })
        .catch(() => {
          console.log('cancel');
        });
    },
    doRowRemove(row, currIndex) {
      this.deleteRow({
        parentCol: this.parentCol,
        parentRow: this.parentRow,
        row: row,
        index: currIndex
      });
    },
    /**
     * 判断某行是否wi空行 即内部不含子布局或控件
     * @param {rowData} row  行数据对象
     * @returns {Boolean} 是否为空行
     */
    isEmptyRow(row) {
      for (let col of row.cols) {
        if (col.subs.length || col.controls.length) {
          return false;
        }
      }
      return true;
    }
  }
};
