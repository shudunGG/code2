export default {
  getters: {
    inControlDragging(state) {
      return state.helper.inControlDragging;
    },
    inLayoutDragging(state) {
      return state.helper.inLayoutDragging;
    }
  },
  mutations: {
    updateLineTop(state, top) {
      state.helper.top = top;
    },
    updateLineLeft(state, left) {
      state.helper.left = left;
    },
    showHLine(state) {
      state.helper.showHLine = true;
    },
    hideHLine(state) {
      state.helper.showHLine = false;
    },
    showVLine(state) {
      state.helper.showVLine = true;
    },
    hideVLine(state) {
      state.helper.showVLine = false;
    },

    layoutDragStart(state) {
      state.helper.inLayoutDragging = true;
    },
    layoutDragEnd(state) {
      state.helper.inLayoutDragging = false;
    },
    controlDragStart(state) {
      state.helper.inControlDragging = true;
    },
    controlDragEnd(state) {
      state.helper.inControlDragging = false;
    },
    updateViewType(state, value) {
      if (/^(pc|mobile)$/.test(value)) {
        state.helper.viewType = value;
      } else {
        console.error('unsupport viewType');
      }
    },
    toggleViewDesign(state) {
      state.helper.viewDesign = !state.helper.viewDesign;
    },
    setShowPreview(state, payload) {
      state.helper.showPreview = payload.showPreview;
    }
  },
  actions: {}
};
