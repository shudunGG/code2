class AutoIndex {
  constructor() {
    this.store = {};
  }
  _get(type) {
    if (!type) {
      throw new Error('type is required!');
    }
    if (!this.store[type]) {
      return (this.store[type] = 1);
    }
    return ++this.store[type];
  }
  adaptProp(key, len = 1) {
    if (!this.store[key]) {
      this.store[key] = len;
    } else {
      this.store[key] += len;
    }
  }
}

class ControlAutoIndex extends AutoIndex {
  constructor() {
    super();
  }

  getIndex(type) {
    return this._get('control-' + type);
  }
  adapt(controls) {
    if (Array.isArray(controls)) {
      const typesMax = {};
      // 按照类型统计最大值
      controls.forEach(ctr => {
        const type = ctr.type;
        const autoIndex = ctr.autoIndex || this.getIndex(type);
        if (!typesMax[type]) {
          typesMax[type] = autoIndex;
        } else {
          typesMax[type] = Math.max(autoIndex, typesMax[type]);
        }
      });

      // 设为最大值
      for (let t in typesMax) {
        this.adaptProp('control-' + t, typesMax[t]);
      }
    }
  }
}
class ColAutoIndex extends AutoIndex {
  constructor() {
    super();
  }
  getIndex(rowId) {
    return this._get('col-' + rowId);
  }
  adapt(rows) {
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        row.cols.forEach(col => {
          this.adaptProp('col-' + row.id);

          if (col.subs && col.subs.length) {
            this.adapt(col.subs);
          }
        });
      });
    }
  }
}
class RowAutoIndex extends AutoIndex {
  constructor() {
    super();
  }
  getIndex(name) {
    return this._get('row-' + name);
  }
  adapt(rows) {
    if (Array.isArray(rows)) {
      const maxMap = {};
      rows.forEach(row => {
        const name = row.namePrefix || row.name || '行';
        const autoIndex = row.autoIndex || this.getIndex(name);
        if (!maxMap[name]) {
          maxMap[name] = autoIndex;
        } else {
          maxMap[name] = Math.max(autoIndex, maxMap[name]);
        }
      });
      // 设为最大值
      for (let t in maxMap) {
        this.adaptProp('control-' + t, maxMap[t]);
      }
    }
  }
}

const rowAutoIndex = new RowAutoIndex();
const controlAutoIndex = new ControlAutoIndex();
const colAutoIndex = new ColAutoIndex();

window.rowAutoIndex = rowAutoIndex;
window.controlAutoIndex = controlAutoIndex;
window.colAutoIndex = colAutoIndex;

export { rowAutoIndex, controlAutoIndex, colAutoIndex };
export default { row: rowAutoIndex, control: controlAutoIndex, col: colAutoIndex };
