window.FORM_DESIGNER = {
  // 保存前的自定义验证
  validateBeforeSave: false,
  // 验证方法
  validate: function(data) {
    // 方式一： 直接返回布尔值 成功 或失败
    alert('校验失败');
    return false;

    // 方式二： 返回promise  适用需要异步验证的情况
    // jq 实现
    // var dtd = $.Deferred();
    // $.ajax({
    //   url: 'xxx',
    //   success: function(res) {
    //     if (res && res.success == '1') {
    //       // 验证成功
    //       dtd.resolve();
    //     } else {
    //       // 验证失败
    //       alert('验证失败');
    //       dtd.reject();
    //     }
    //   },
    //   error: function(error) {
    //     // 验证失败
    //     alert('验证失败' + error.message);
    //     dtd.reject();
    //   }
    // });

    // return dtd.promise();
  }
};
