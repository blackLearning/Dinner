'use strict';
/**
 * db mongo config
 * @type {Object}
 */
// export default {
//   type: 'mongo',
//   log_sql: true,
//   log_connect: true,
//   cache: {
//     on: true,
//     type: '',
//     timeout: 3600
//   },
//   adapter: {
//     mongo: {
//       host: 'localhost',
//       port: '',
//       database: 'Foods',
//       user: '',
//       password: '',
//       prefix: '',
//       encoding: 'utf8'
//     }
//   }
// };


/**
 * db mysql config
 * @type {Object}
 */
export default {
  type: 'mysql',
  host: '127.0.0.1', // 数据库IP（本地默认为127.0.0.1）
  port: '',// 数据库端口
  name: 'dinner', // 数据库名
  user: 'root',  // 数据库用户名
  pwd: '',  // 数据库密码，默认为空
  prefix: '',  // 数据名前缀
  encoding: 'utf8',
  nums_per_page: 10,
  log_sql: true,
  log_connect: true,
  cache: {
    on: true,
    type: '',
    timeout: 3600
  }
};