# wk-services
工具集

1. 为什么用？

 * 减少项目之间重复的代码
 * 公共方法抽离
 * 使用方便
 * 模块化，用哪个，引哪个
 * 易于维护

2. 怎么用？

  * 引用axios方法
 ```
 import utils  from "wk-services";
 const services = utils.service;
 console.log(services);
 ```

3. 安装

  * npm

  `npm install wk-services`

  * yarn

  `yarn add wk-services`