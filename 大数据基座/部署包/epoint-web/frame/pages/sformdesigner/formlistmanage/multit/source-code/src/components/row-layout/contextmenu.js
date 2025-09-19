export default {
  methods: {
    onContextmenu(event, data) {
      const target = event.target;
      /* {
        control, // 控件
        controlIndex, // 控件
        controlParentCol, // 控件所在列 即 当前 col

        row, // 当前行
        rowIndex, // 行索引
        parentCol, // 所在父列

        col, // 当前列
        colIndex, // 列索引
        parentRow, // 所在行 即 row
        colDeletable // 此列是否可删除 默认为true 需要计算得出
      } */

      // 计算补充 列是否可删除
      // 仅一列时 禁止删除
      // 还需要防止将列删除成 一个单元格里面嵌套一个单元格的情况
      if (data.row.cols.length == 1 || (data.row.cols.length === 2 && data.parentCol)) {
        data.colDeletable = false;
      }

      // 如果在控件上 加入控件配置
      const controlEl = target.closest('.design-control');
      if (controlEl) {
        const controlId = controlEl.dataset.id;
        let controlIndex, control, c;
        for (let i = 0, len = data.col.controls.length; i < len; i++) {
          c = data.col.controls[i];
          if (c.id == controlId) {
            controlIndex = i;
            control = c;
            break;
          }
        }
        if (control) {
          data.control = control;
          data.controlIndex = controlIndex;
        }
      }

      console.log(event, data);
      this.$data._ctxMenuData = data;
      this.showCtxMenu(event, data, this.handleContextMenu);
    },
    handleContextMenu(type) {
      console.log(this, type);
      const data = this.$data._ctxMenuData;
      switch (type) {
        case 'deleteControl':
          this.deleteControl({
            selectedControl: data.control,
            selectedControlParentCol: data.col,
            selectedControlIndex: data.controlIndex
          });
          break;
        case 'removeCol':
          this.removeCol({
            col: data.col,
            parentRow: data.row,
            colIndex: data.colIndex
          });
          break;
        case 'removeRow':
          this.handleRowRemove(data.row, data.rowIndex);
          break;
        case 'insertRowUp':
          this.copyRow({
            aimIndex: data.rowIndex,
            parentCol: data.parentCol,
            newRow: this.getRowCopyData(data.row, true),
            shuttle: true
          });
          break;
        case 'insertRowDown':
          this.copyRow({
            aimIndex: data.rowIndex + 1,
            parentCol: data.parentCol,
            newRow: this.getRowCopyData(data.row, true),
            shuttle: true
          });
          break;
        case 'insertColLeft':
          this.splitCol({
            col: data.col,
            colIndex: data.colIndex,
            parentRow: data.row,
            direction: 'left',
            shuttle: true
          });
          break;
        case 'insertColRight':
          this.splitCol({
            col: data.col,
            colIndex: data.colIndex,
            parentRow: data.row,
            direction: 'right',
            shuttle: true
          });
          break;

        default:
          break;
      }
    }
  }
};
