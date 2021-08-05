import { cloneDeep } from 'lodash';

const DemoModel = {
  namespace: 'tableList',
  state: {
    batType: '',
    busCode: '',
    chnNo: '',
    fileType: '',
    graphData: {},
    graphChildData: {},
    graphEndData: {},
    graphStepData: {},
    param: {},
    importData: {},
    tableList: [],
    display: false,
    nextClick: false,
    fileColumns: [],
    dataAraFileColumns: [],
    inputParameter: {},
    connectLineInfo: {},
    fileListDisplay: '',
    current: 0,
    clearRuleData: [],
    resDefaultData: {},
    viewOrEditData: {},
  },
  reducers: {
    saveIsDisplay(state, action) {
      const display = action.payload.display;
      console.log(display);
      return {
        ...state,
        ...state.display,
        display,
      };
    },
    changeData(state, action) {
      const batType = action.payload.batType;
      const busCode = action.payload.busCode;
      const chnNo = action.payload.chnNo;
      console.log('batType:', batType, 'busCode:', busCode, 'chnNo:', chnNo);
      const fileType = action.payload.fileType;
      return {
        ...state,
        ...state.batType,
        batType,
        ...state.busCode,
        busCode,
        ...state.chnNo,
        chnNo,
        ...state.fileType,
        fileType,
      };
    },
    changeTableData(state, action) {
      const tableList = action.payload.tableList;
      console.log('保存tableList', tableList);
      return {
        ...state,
        ...state.tableList,
        tableList,
      };
    },
    saveGraphData(state, action) {
      const graphData = action.payload.graphData;
      console.log('graphData:', graphData);
      return {
        ...state,
        ...state.graphData,
        graphData,
      };
    },
    saveGraphChildData(state, action) {
      const graphChildData = action.payload.graphChildData;
      console.log('graphChildData:', graphChildData);
      return {
        ...state,
        ...state.graphChildData,
        graphChildData,
      };
    },
    saveGraphEndData(state, action) {
      const graphEndData = action.payload.graphEndData;
      console.log('graphEndData:', graphEndData);
      return {
        ...state,
        ...state.graphEndData,
        graphEndData,
      };
    },
    saveGraphStepData(state, action) {
      const graphStepData = action.payload.graphStepData;
      console.log('graphStepData:', graphStepData);
      return {
        ...state,
        ...state.graphStepData,
        graphStepData,
      };
    },
    //存储所有配置表单数据并回显
    saveParam(state, action) {
      const stateData = cloneDeep(state.param);
      stateData[action.payload.id] = action.payload.data;
      console.log('stateData:', stateData);
      return {
        ...state,
        param: stateData,
      };
    },
    // 保存文件列数据
    saveFileColumns(state, action) {
      const fileColumns = action.payload.fileColumns;
      console.log(' fileColumns:', fileColumns);
      return {
        ...state,
        fileColumns,
      };
    },
    // 保存附加数据文件列数据
    saveDataAraFileColumns(state, action) {
      const dataAraFileColumns = action.payload.dataAraFileColumns;
      console.log(' dataAraFileColumns:', dataAraFileColumns);
      return {
        ...state,
        dataAraFileColumns,
      };
    },
    // 保存inputParameter
    saveInputParameter(state, action) {
      const inputParameter = action.payload.inputParameter;
      return {
        ...state,
        inputParameter,
      };
    },

    saveConnectLineInfo(state, action) {
      const connectLineInfo = action.payload.connectLineInfo;
      return {
        ...state,
        connectLineInfo,
      };
    },
    saveFileListDisplay(state, action) {
      const fileListDisplay = action.payload.fileListDisplay;
      return {
        ...state,
        fileListDisplay,
      };
    },
    savePageCurrent(state, action) {
      const current = action.payload.current;
      return {
        ...state,
        current,
      };
    },
    //保存导入文件信息
    saveImport(state, action) {
      const importData = cloneDeep(state.importData);
      importData[action.payload.id] = action.payload.data;
      //判断是否导入成功
      if (importData[action.payload.id]) {
        importData[action.payload.id].tag = true;
      } else {
        importData[action.payload.id].tag = false;
      }
      console.log('importData:', importData);
      return {
        ...state,
        importData,
      };
    },
    //从清分规则条数判断是否渲染一清二拆和具体数量
    isClear(state, action) {
      const clearRuleData = action.payload.clearRuleData;
      return {
        ...state,
        clearRuleData,
      };
    },
    // 当前清分文件上传状态
    saveUploadStatus(state, action) {
      const uploadStatus = action.payload.uploadStatus;
      return {
        ...state,
        uploadStatus,
      };
    },
    // 当前结果文件默认值
    saveResDefaultData(state, action) {
      const stateData = cloneDeep(state.resDefaultData);
      stateData[action.payload.id] = action.payload.data;
      console.log('stateData:', stateData);
      return {
        ...state,
        resDefaultData: stateData,
      };
    },
    // 保存对应的查看/编辑数据
    saveViewOrEditData(state, action) {
      const viewOrEditData = action.payload.viewOrEditData;
      return {
        ...state,
        viewOrEditData,
      };
    },
  },
  effects: {},
  subscriptions: {},
};

export default DemoModel;
