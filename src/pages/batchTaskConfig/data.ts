//表头信息
export const columns = [
  {
    title: '任务节点顺序号',
    dataIndex: 'seqNum',
    key: 'seqNum',
    align: 'center',
    width: 120,
  },
  {
    title: '批量类型',
    dataIndex: 'batType',
    key: 'batType',
    align: 'center',
    width: 100,
  },
  {
    title: '渠道号',
    dataIndex: 'chnNo',
    key: 'chnNo',
    align: 'center',
    width: 130,
  },

  {
    title: '业务代码',
    dataIndex: 'busCode',
    key: 'busCode',
    align: 'center',
    width: 120,
  },
  {
    title: '当前节点名称',
    dataIndex: 'currentNodeName',
    key: 'currentNodeName',
    align: 'center',
    width: 120,
  },
  {
    title: '当前节点编号',
    dataIndex: 'currentNodeId',
    key: 'currentNodeId',
    align: 'center',
    width: 120,
  },
  //未给接口说明
  {
    title: '前置节点名称',
    dataIndex: 'crtTmstmp',
    key: 'crtTmstmp',
    align: 'center',
    width: 120,
  },
  {
    title: '前置节点编号',
    dataIndex: 'modTmstmp',
    key: 'modTmstmp',
    align: 'center',
    width: 120,
  },
  {
    title: '后置节点名称',
    dataIndex: 'afterTmstmp',
    key: 'afterTmstmp',
    align: 'center',
    width: 120,
  },
  {
    title: '后置节点编号',
    dataIndex: 'afterTmsId',
    key: 'afterTmsId',
    align: 'center',
    width: 120,
  },
  //以上
];
export const nodeInfo = {
  'C-TSK': '总控任务节点',
  'C-FDS': '文件下载拆分',
  'S-OS': '批转联服务调度',
  'C-FSM': '结果文件排序',
  'F-RS': '结果消息推送',
};
export const graphConfig = {
  //画布渲染模式
  renderer: 'canvas',
  //默认可交互行为
  // modes:{
  //   default:['drag-canvas','drag-node','zoom-canvas'],
  //   edit:[]
  // },
  //配置默认连入点
  nodeStateStyles: {
    selected: {
      opacity: 0.1,
    },
  },
  //节点信息
  defaultNode: {
    //去掉左边的竖线
    preRect: {
      show: false,
    },
    //改变文字样式
    labelCfg: {
      style: {
        marginRight: 20,
        fontSize: 12,
        fill: '#fff',
      },
    },

    //linkPoints无法修改
    linkPoints: {
      top: false,
      bottom: false,
      left: false,
      right: false,
      size: 4,
      stroke: '#3f67ed',
      fill: '#fff',
    },
    style: {
      lineWidth: 0,
      fill: '#3f67ed',
      stroke: '#fff',
      radius: 32.5,
      opacity: 0.7,
    },
    descriptionCfg: {
      /*  offset:-5, */
      style: {
        fontSize: 12,
        fill: '#fff',
      },
    },
    type: 'customInternalNode',
  },
  //边信息
  defaultEdge: {
    style: {
      lineWidth: 2,
      stroke: '#000',
      endArrow: true,
    },
    type: 'polyline',
  },
};

//结果文件排序子节点
export var stepNodes = [
  {
    styles: {
      opacity: 1,
    },
    id: 'registerHandleResultService',
    type: 'modelRect',
    parent: 'C-FSM',
    parentLabel: '结果文件排序',
    size: [150, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/ResFileSort/regisplitRes-unChecked.svg'),
      x: -60,
    },
    label: '登记分片结果',
    x: 100,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'btrFileMergePreCheckService',
    type: 'modelRect',
    parent: 'C-FSM',
    parentLabel: '结果文件排序',
    size: [175, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/ResFileSort/docConPreCheck-unChecked.svg'),
      x: -70,
    },
    label: '文件合并预检查',
    x: 250,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'resultFileSortAndMergeService',
    type: 'modelRect',
    parent: 'C-FSM',
    parentLabel: '结果文件排序',
    size: [160, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/ResFileSort/fileSortMerge-unChecked.svg'),
      x: -60,
    },
    label: '文件排序合并',
    x: 400,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'uploadFileToOssService',
    type: 'modelRect',
    parent: 'C-FSM',
    parentLabel: '结果文件排序',
    size: [175, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/ResFileSort/resFileUpload-unChecked.svg'),
      x: -70,
    },
    label: '结果文件上传',
    x: 550,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'fgrsNoticeService',
    type: 'modelRect',
    parent: 'C-FSM',
    parentLabel: '结果文件排序',
    size: [175, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/ResFileSort/notifyFileCateway-unChecked.svg'),
      x: -70,
    },
    label: '通知文件网关',
    x: 700,
    y: 400,
  },
];

//联机服务调度子节点
export const endNodes = [
  {
    styles: {
      opacity: 1,
    },
    id: 'splitFileDown',
    type: 'modelRect',
    size: [150, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/OnlineServers/splitFileDown-unChecked.svg'),
      x: -60,
    },
    label: '分片文件下载',
    x: 100,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'splitFileInStorage',
    type: 'modelRect',
    size: [175, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/OnlineServers/splitFileInStorage-unChecked.svg'),
      x: -70,
    },
    label: '分片文件解析入库',
    x: 250,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'serverDispatch',
    type: 'modelRect',
    size: [160, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/OnlineServers/serverDispatch-unChecked.svg'),
      x: -60,
    },
    label: '批转联服务调度',
    x: 400,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'splitResCreate',
    type: 'modelRect',
    size: [175, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/OnlineServers/splitResCreate-unChecked.svg'),
      x: -70,
    },
    label: '分片结果文件生成',
    x: 550,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'splitResUpload',
    type: 'modelRect',
    size: [175, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/OnlineServers/splitResUpload-unChecked.svg'),
      x: -70,
    },
    label: '分片结果文件上传',
    x: 700,
    y: 400,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'messageReceipt',
    type: 'modelRect',
    size: [130, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/OnlineServers/messageReceipt-unChecked.svg'),
      x: -50,
    },
    label: '消息回执',
    x: 850,
    y: 400,
  },
];
//文件下载拆分子节点
export const childrenNode = [
  {
    id: 'btrFileDownloadService',
    type: 'modelRect',
    parent: 'C-FDS',
    parentLabel: '文件下载拆分',
    label: '从OSS下载文件到本地',
    size: [230, 65],
    logoIcon: {
      height: 28,
      width: 28,
      show: true,
      img: require('@/assets/batchProcessSet/FileDown/fileDown-unChecked.svg'),
      x: -100,
    },
    anchorPoints: [
      [0, 1],
      [0.5, 1],
    ],
    x: 100,
    y: 300,
  },
  {
    id: 'fileValidationService',
    type: 'modelRect',
    parent: 'C-FDS',
    parentLabel: '文件下载拆分',
    label: '文件校验',
    labelCfg: {
      paddingTop: '-20px',
    },
    size: [130, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/FileDown/fileCheck-unChecked.svg'),
      x: -50,
    },
    x: 250,
    y: 300,
  },
  {
    id: 'btrInterceptPrdCodeService',
    type: 'modelRect',
    parent: 'C-FDS',
    parentLabel: '文件下载拆分',
    size: [250, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/FileDown/prdCode-unChecked.svg'),
      x: -115,
    },
    label: '开卡时获取银行卡产品码',
    x: 700,
    y: 300,
  },
  {
    styles: {
      opacity: 1,
    },
    id: 'btrClearService',
    type: 'modelRect',
    parent: 'C-FDS',
    parentLabel: '文件下载拆分',
    size: [130, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/OnlineServers/Clear-unChecked.svg'),
      x: -50,
    },
    label: '文件清分',
    x: 850,
    y: 400,
  },
  {
    id: 'btrFileSplitService',
    type: 'modelRect',
    parent: 'C-FDS',
    parentLabel: '文件下载拆分',
    size: [130, 65],
    label: '文件拆分',
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/FileDown/filesplit-unChecked.svg'),
      x: -50,
    },
    x: 400,
    y: 300,
  },
  {
    id: 'btrOsNoticeService',
    type: 'modelRect',
    parent: 'C-FDS',
    parentLabel: '文件下载拆分',
    size: [150, 65],
    logoIcon: {
      height: 25,
      width: 25,
      show: true,
      img: require('@/assets/batchProcessSet/FileDown/fileUpload-unChecked.svg'),
      x: -58,
    },
    label: '通知服务引擎',
    x: 550,
    y: 300,
  },
];

//主节点
export const btrFlowRelsNode = [
  {
    id: 'C-TSK',
    type: 'modelRect',
    label: '总控任务节点',
    /*    size: [90, 70], */
    logoIcon: {
      height: 36,
      width: 36,
      show: true,
      img: require('@/assets/batchProcessSet/node/allControlTask.svg'),
      x: -60,
    },

    styles: {
      stroke: 'lightblue',
    },

    stateStyles: {
      selected: {
        opacity: 0.1,
        fill: '#29088A',
      },
      active: {
        opacity: 0.1,
        fill: '#DF01D7',
      },
      highLight: {
        opacity: 0.1,
      },
    },
  },
  {
    id: 'C-FDS',
    label: '文件下载拆分',
    type: 'modelRect',
    /*    size: [90, 70], */
    logoIcon: {
      height: 36,
      width: 36,
      show: true,
      img: require('@/assets/batchProcessSet/node/FileDownsplit.svg'),
      x: -60,
    },
    styles: {
      stroke: 'lightgreen',
    },
  },
  {
    id: 'S-OS',
    type: 'modelRect',
    label: '联机服务调度',
    /*    size: [90, 70], */
    logoIcon: {
      height: 36,
      width: 36,
      show: true,
      img: require('@/assets/batchProcessSet/node/OnlineServices.svg'),
      x: -60,
    },
  },
  {
    id: 'C-FSM',
    type: 'modelRect',
    label: '结果文件排序',
    size: [90, 70],
    logoIcon: {
      height: 36,
      width: 36,
      show: true,
      img: require('@/assets/batchProcessSet/node/ResultSort.svg'),
      x: -60,
    },
  },
  {
    id: 'F-RS',
    type: 'modelRect',
    label: '结果消息推送',
    size: [90, 70],
    logoIcon: {
      height: 36,
      width: 36,
      show: true,
      img: require('@/assets/batchProcessSet/node/ResultInfoPush.svg'),
      x: -60,
    },
  },
];
