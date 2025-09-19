import { clamp } from '../../util/index.js';
export default {
  methods: {
    onMouseDown(ev) {
      console.log('mousedown');
      const target = ev.target;
      if (!target.classList.contains('col-helper-line')) {
        return true;
      }
      // ev.stopPropagation();
      // Event.prototype.
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      var rowEl = (this.rowEl = target.closest('.row'));
      var colEl = (this.colEl = target.closest('.col'));
      this.rowId = rowEl && rowEl.getAttribute('row-id');
      this.rowData = this.findRow(this.rowId);
      this.startHeight = this.rowData.height || 30;

      const container = this.getDesignContainer();
      const containerRect = container.getBoundingClientRect();

      this.mouseOffset = this.getMouseOffset(ev);
      this.stagElementsOffset(ev, containerRect);

      const colIndex = parseInt(target.dataset.colIndex, 10);
      this.colData = this.rowData.cols[colIndex];
      this.nextColData = this.rowData.cols[colIndex + 1];

      if (this.colData.width + '' === this.colData.width) {
        // 如果字符串 则表示未设置 或百分比， 需要获取计算一下宽度
        this.startWidth = colEl.getBoundingClientRect().width;
      } else {
        this.startWidth = this.colData.style.width;
      }
      console.log(rowEl, this.rowId);
      this.inMoving = true;
      if (target.classList.contains('line-v')) {
        this.getXLimit(ev, containerRect);
        this.resizeMode = 'v';
        this.startOffsetX = this.getXOffset(ev);
        this.updateLineLeft(this.startOffsetX);
        this.showVLine();
      } else if (target.classList.contains('line-h')) {
        this.getYLimit(ev, containerRect);
        this.resizeMode = 'h';
        this.startOffsetY = this.getYOffset(ev);
        this.updateLineTop(this.startOffsetY);
        this.showHLine();
      }
    },
    onMouseMove(ev) {
      console.log('move');
      // const containerOffset = this.containerOffset;
      // const container = document.getElementById('design-container');
      // const container = this.getDesignContainer();
      // const containerOffset = container.getBoundingClientRect();
      // console.log(ev.pageX, ev.pageY);
      // console.log(containerOffset);
      // var x = ev.pageX - containerOffset.left - window.pageXOffset;
      // var y = ev.pageY - containerOffset.top - window.pageYOffset;
      // this.updateLineTop(y);
      // this.updateLineLeft(x);

      if (this.resizeMode == 'h') {
        let y = this.getYOffset(ev);
        // 处理范围限制
        y = clamp(y, this.moveRange.y[0], this.moveRange.y[1]);
        this.updateLineTop(y);
        const move = y - this.startOffsetY;
        let height = this.startHeight + move;
        if (height < 30) {
          height = 30;
        }
        this.updateRowHeight({
          rowId: this.rowId,
          height,
          row: this.rowData,
          parentRowPath: this.pathMap[this.rowId],
          shuttle: true
        });
      } else if (this.resizeMode == 'v') {
        let x = this.getXOffset(ev);
        // 处理范围限制
        x = clamp(x, this.moveRange.x[0], this.moveRange.x[1]);
        // 处理吸附
        const absorbX = this.getSnapOffset(x);
        if (absorbX) {
          x = absorbX;
        }
        this.updateLineLeft(x);
        const w = x - this.startOffsetX;
        let width = this.startWidth + w;
        if (width < 10) width = 10;
        this.updateColWidth({
          col: this.colData,
          width: width,
          nextCol: this.nextColData,
          shuttle: true
        });
      }
    },
    /**
     * 获取 x 方向上的移动范围限制 根据左右侧的宽度转化为相对画布的位置描述
     * 左侧为 当前列中的宽度 存在嵌套则为每行最后一列宽度的最小值
     * 右侧为 下一列的宽度 存在嵌套则为每行的第一列宽度的最小值
     */
    getXLimit(ev, containerRect) {
      const COL_MIN_WIDTH = 30;
      console.group('获取宽度限制');
      let x1, x2;
      // resizer 出现在元素内部右侧 左侧的限制其实就是自身宽度的限制
      if (!this.colData) {
        x1 = 0;
      } else {
        x1 = getWidth(this.colData, 'last');
        console.log('左侧宽度限制', x1);
        // 还需要保证一个最小宽度
        x1 = x1 < COL_MIN_WIDTH ? 0 : x1 - COL_MIN_WIDTH;
      }

      if (!this.nextColData) {
        x2 = 0;
      } else {
        x2 = getWidth(this.nextColData, 'first');
        console.log('右侧宽度限制', x2);
        // 还需要保证一个最小宽度
        x2 = x2 < COL_MIN_WIDTH ? 0 : x2 - COL_MIN_WIDTH;
      }

      // 移动距离转化为 相对画布的 offset 以便比较 也需要修正鼠标位置
      x1 = ev.pageX - containerRect.left - this.mouseOffset.x - x1;
      x2 = ev.pageX - containerRect.left - this.mouseOffset.x + x2;
      this.moveRange.x = [x1, x2];

      console.log(x1, x2);
      console.groupEnd();

      /**
       * 获取宽度
       * @param {ColData} colData 列数据
       * @param {string} type 获取的方向
       * first 标识取第一列的 对应向后移动的限制
       * last 标识取最后一列的 对应向前移动的限制
       */
      function getWidth(colData, type) {
        // 没有内嵌行 则直接为 列宽度
        if (!colData.subs || !colData.subs.length) {
          return colData.style.width;
        }
        // 存在内嵌行时 取每个内嵌行的最后一个或第一个
        const widths = colData.subs.map(row => {
          // return getWidth(row.cols[0]);
          return getWidth(row.cols[type == 'first' ? 0 : row.cols.length - 1]);
        });
        console.log(widths);
        return Math.min(...widths);
      }
    },
    /**
     * 获取 y 方向上的移动范围限制 根据上下可移动的范围转化为相对画布的位置描述
     * 上方为 所在行的内嵌最后一行的最小高度
     * 下方无须限制
     * todo: 目前仅考虑了内部子行的限制 但实际一行高度相同，还受到外部其他行里面的行高度的限制
     */
    getYLimit(ev, containerRect) {
      const MIN_HEIGHT = 38;
      console.group('获取拖拽的高度限制');

      let y1, y2;
      const rowHeight = getHeight(this.rowData) || MIN_HEIGHT;
      y1 = rowHeight - MIN_HEIGHT;
      if (y1 < 0) {
        y1 = 0;
      }
      console.log('可向上移动的范围', y1);

      // 将向上移动的范围转化为 相对 画布的 offset
      y1 = ev.pageY - containerRect.top - this.mouseOffset.y - y1;
      console.log('对应的y坐标', y1);
      y2 = Infinity;

      console.groupEnd();
      this.moveRange.y = [y1, y2];
      return [y1, y2];

      function getHeight(row) {
        let hasSubRow = false;
        // 记录此行每个列的最后一行的高度
        const heights = [];
        row.cols.forEach(col => {
          if (col.subs && col.subs.length) {
            hasSubRow = true;
            heights.push(getHeight(col.subs[col.subs.length - 1]));
          }
        });

        console.log(hasSubRow, heights, row.height);
        // 有子行 则取所有last子行高度的最小值
        // 没有则为自身高度
        return hasSubRow ? Math.min(...heights) : row.height;
      }
    },

    getLimitedOffset() {},
    getYOffset(ev) {
      const container = this.getDesignContainer();
      const containerOffset = container.getBoundingClientRect();
      // const y = ev.pageY - containerOffset.top - window.pageYOffset - this.mouseOffset.y;
      // y 的滾動不在 window 上了 containerOffset 也被滾動了 本身已經包含
      const y = ev.pageY - containerOffset.top - this.mouseOffset.y;
      return y;
    },
    getXOffset(ev) {
      const container = this.getDesignContainer();
      const containerOffset = container.getBoundingClientRect();
      // const x = ev.pageX - containerOffset.left - window.pageXOffset - this.mouseOffset.x;
      const x = ev.pageX - containerOffset.left - this.mouseOffset.x;
      return x;
    },
    // 为了拖拽体验 触发区域比较大 和鼠标位置是有偏移的 使用此方法进行修正
    getMouseOffset(ev) {
      const target = ev.target;
      const rect = target.getBoundingClientRect();
      return {
        x: ev.pageX - rect.left - rect.width / 2,
        y: ev.pageY - rect.top - rect.height / 2
      };
    },
    // 拖拽前暫存 所有相關元素的位置
    stagElementsOffset(ev, containerRect) {
      const container = this.getDesignContainer();
      const target = ev.target.closest('col');
      const elements = [].slice.call(container.querySelectorAll('.col.isSub'));
      const posArr = [];
      elements.forEach(el => {
        if (el.classList.contains('last') || el == target) {
          return;
        }
        const rect = el.getBoundingClientRect();
        const right = rect.left + rect.width - containerRect.left;
        console.log(el, right);
        posArr.push(right);
      });

      console.log(posArr);
      this.otherColOffSets = Array.from(new Set(posArr));
      console.log(this.otherColOffSets);
    },
    getSnapOffset(x) {
      // 統計所有符合的
      const map = new Map();
      this.otherColOffSets.forEach(l => {
        const delta = Math.abs(x - l);
        if (delta <= 10) {
          map.set(delta, l);
        }
      });
      console.log(map);
      // 取最小值
      if (map.size) {
        return map.get(Math.min(...map.keys()));
      }

      return false;
    },
    onMouseUp() {
      console.log('up');
      this.hideHLine();
      this.hideVLine();
      this.resetMoveData();
      this.removeEventListener();
    },
    resetMoveData() {
      this.inMoving = false;
      this.rowEl = null;
      this.colEl = null;
      this.rowId = '';
      this.rowData = null;
      this.colData = null;
      this.nextColData = null;
      this.startOffsetX = 0;
      this.startOffsetY = 0;
      // 鼠标位置和实际位置的偏移
      this.mouseOffset.x = 0;
      this.mouseOffset.y = 0;
      this.moveRange.x = [0, 0];
      this.moveRange.y = [0, 0];
      // 非拖动列的 位置 用于吸边比较
      this.otherColOffSets = [];
      this.startHeight = 0;
      this.startWidth = 0;
      this.resizeMode = false;
    },
    removeEventListener() {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  }
};
