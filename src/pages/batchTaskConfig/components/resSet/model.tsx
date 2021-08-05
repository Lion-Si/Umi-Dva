export default {
  namespace: 'flowSpace', //命名空间
  state: {
    showData: {},
  },
  reducers: {
    //同步改变state， state为原来的状态 ， action中包含dispatch传过来的入参和回调函数
    setShowData(state, action) {
      const newShowData = { ...state.showData };
      var obj = {};
      obj = { ...obj, ...action.payload };
      obj.outputParam = action.payload.data.outputParam;
      obj.inputParam = action.payload.data.inputParam;
      obj.reqJson = action.payload.reqJson;
      obj.resJson = action.payload.resJson;
      newShowData[action.payload.id] = obj;
      return {
        ...state, //展开旧状态
        showData: newShowData, //新状态替换
      };
    },
  },
  effects: {},
};
