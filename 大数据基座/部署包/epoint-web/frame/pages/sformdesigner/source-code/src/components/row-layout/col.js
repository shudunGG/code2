// 列相关
export default {
  methods: {
    // 处理列点击
    handleColClick(index, col, ev) {
      const target = ev.target;
      if (target.classList.contains('col-helper-line')) {
        return;
      }
      const colEl = target.closest('.col');
      if (!colEl) return;

      const isSelected = col.id == this.selectedColId;

      if (!isSelected) {
        this.setSelectedCol({ id: col.id });
        this.activeRightTab('cell');
      } else {
        this.setSelectedCol({ id: '' });
      }
    },
    // 列删除
    removeCol(data) {
      const { col, parentRow, colIndex } = data;
      // 空列则不提醒
      if (this.isEmptyCol(col)) {
        return this.doColRemove(col, parentRow, colIndex);
      }
      this.$confirm('删除后此单元格内的所有内容将一并删除，是否继续？', '删除确认', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
          this.doColRemove(col, parentRow, colIndex);
        })
        .catch(err => {
          if (err) {
            console.error(err);
          }
          console.log('cancel');
        });
    },
    doColRemove(col, parentRow, colIndex) {
      this.$store.dispatch('removeCol', { col, parentRow, colIndex, shuttle: true });
    },
    isEmptyCol(col) {
      return !(col.subs.length || col.controls.length);
    },
    getColCls(col, colIndex, length) {
      const globalStyle = this.globalStyle;
      const subLength = col.subs.length;
      const style = col.style;
      const cls = {
        selected: this.selectedColId == col.id,
        isSub: !subLength,
        hasSub: subLength,
        first: colIndex === 0,
        mid: colIndex && colIndex !== length - 1,
        last: colIndex === length - 1,
        ['text-' + (style.textAlign || globalStyle.textAlign)]: true,
        ['vertical-' + (style.verticalAlign || globalStyle.verticalAlign)]: true
      };

      return cls;
    }
  }
};
