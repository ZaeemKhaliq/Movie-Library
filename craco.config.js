module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
          @import "src/assets/scss/_variables.scss";
        `,
      },
    },
  },
};
