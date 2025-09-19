export default {
  methods: {
    getPercent(num, len = 6) {
      const s = Math.pow(10, len);
      return (Math.floor(num * 100 * s) / s).toFixed(2) + '%';
    }
  }
};
