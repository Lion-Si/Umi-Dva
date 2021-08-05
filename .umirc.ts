import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: { type: 'hash' },
  publicPath: './',
  define: {
    // 'process.env.baseUrl': 'http://agrs.sdebank.com:8080/agrs',//生产地址
    // 'process.env.baseUrl': 'http://107.255.27.193:9098/agrs', //uat环境
    // 'process.env.baseUrl': 'http://107.255.22.160:9098/agrs', //sit环境
    // 'process.env.baseUrl': 'http://107.255.28.215:9098/agrs', //dev环境
    'process.env.baseUrl': 'http://107.255.18.20:9098/agrs', //dvl环境
    // 'process.env.baseUrl': 'http://172.16.66.222:8341', //lx本地
    'process.env.local': false, //切换app文件中的请求入参及地址
    'process.env.mock': false,
  },
  routes: [
    {
      path: '/',
      component: '@/pages/index', // 首页对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchTaskConfig',
      component: '@/pages/batchTaskConfig/index', // 批次任务配置对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchTaskList',
      component: '@/pages/batchTaskList/index', // 批次任务列表对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchDiagram',
      component: '@/pages/batchDiagram/index', // 批次运行图对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchMainTask',
      component: '@/pages/batchMainTask/index', // 批次总控任务对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchInfoRegister',
      component: '@/pages/batchInfoRegister/index', // 批次信息登记对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchAbnormalFlow',
      component: '@/pages/batchAbnormalFlow/index', // 批次异常流水对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchUploadHistory',
      component: '@/pages/batchUploadHistory/index', // 批次上传历史对应组件
    },
    {
      name: 'ngfe-app-dbto',
      path: '/batchTemplateShow',
      component: '@/pages/batchTemplateShow/index', // 批次模板展示对应组件
    },
  ],
  dva: {},
  qiankun: {
    slave: {},
  },
});
