import actions from '@/shared/actions.js';
// 独立运行时，直接挂载应用
// if (!window.__POWERED_BY_QIANKUN__) {
//   history.push('/');
// }

function mainAppLoadingStateChange(callback, props, state) {
  callback(props, state); //调用该函数
}
// 通过回调的方式改变状态
function mainAppLoadingStateChangeCb(props, state) {
  setTimeout(() => {
    props.onGlobalStateChange((state, prev) => {
      // state: 变更后的状态; prev 变更前的状态
      console.log(state, prev);
    });
    props.setGlobalState(state);
  }, 1000);
}

// 配置运行时生命周期钩子
// https://umijs.org/zh-CN/plugins/plugin-qiankun#第二步：配置运行时生命周期钩子（可选）
export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log(props);
  },
  // 应用 render 之前触发
  async mount(props) {
    // 注入 actions 实例
    actions.setActions(props);
    let state = {
      microAppLoading: false,
    };
    // 通过修改全局状态修改子应用加载动画
    mainAppLoadingStateChange(mainAppLoadingStateChangeCb, props, state);
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('app1 unmount', props);
  },
};
