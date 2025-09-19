export default {
  methods: {
    lineFeed(text) {
      if (!text || text + '' !== text) return '';
      return text.replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;');
    }
  }
};
