import React from 'react';
import styles from './component.less';
import Import from '../../components/Import/index';
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio,
  Popover,
  Switch,
  Checkbox,
  InputNumber,
  Table,
  message,
  Pagination,
  Divider,
  Tag,
  Modal,
  Spin,
  Tree,
  Tooltip,
  Tabs,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { cloneDeep } from 'lodash';
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import BatchNodeTable from './BatchNodeTable';
import {
  getSerDataDicList,
  getStdSvcIndByAac,
  getStdIntfIndBySvc,
  getVersionByService,
  getNgParamOapsDetails,
  getCommonCode,
  getFileList,
  addFileTempl,
} from '../service';
import { DoubleRightOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ServiceTaskNode from './resSet/ServiceTaskNode';
import ResultFileMerge from './dbtoConfig/resultFileMerge';
import SplitFileInStorage from './dbtoConfig/splitFileInStorageTo';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

var conditionArr: any = [];
var conditionArrData: any = [];
var resArrData: any = [];
var resExtraArrData: any = [];

const { Search } = Input;
const { Option } = Select;
class EngineServerSet extends React.Component {
  validateMessages = {
    required: '${label} 不能为空!',
    types: {
      email: '${label} is not validate email!',
      number: '${label} is not a validate number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  state = {
    //文件内容分割符字段数组
    separator: [],
    //运行等级数组
    runLevel: [],
    //服务级别数组
    serviceLevel: [],
    //aacCode数据存放数组,下列均为公共数据存放 start
    aacCode: [],
    dcnCode: [],
    idcCode: [],
    srvName: [],
    srvMethod: [],
    versionNo: [],
    clearCenterNo: [],
    svcType: [],
    timeReviewFlag: [],
    mergeConf: [],

    // end
    selectSvcInd: '',
    selectStdIntfInd: '',
    showSummary: '',
    //数据分割符
    showInDelemiters: false,
    showDatAraInDelimiters: false,
    //显示定时回查标志
    showTimeReviewFlag: false,
    //显示搜索结果
    showSearchRes: false,
    clicked: false,
    datAraClicked: false,
    resAraClicked: false,
    resExtraClicked: false,
    hovered: false,
    datAraHovered: false,
    // 是否存在附加域
    condition: false,
    outCondition: false,
    showSplitFileInStorage: true,
    //显示联机服务调度
    showServerDispatch: true,
    //展示一清二拆的服务调度
    showClearDispatch: false,
    //联机服务调度一清二拆多种服务数据
    clearDispatchData: [],

    showSplitResCreate: true,
    //是否显示文件排序合并
    showFileSortMerge: true,
    //文件列选中
    isCheck: false,
    checkboxData: [],
    //附加域选择框
    isDatAraCheck: false,
    datAraCheckboxData: [],
    //结果选择框
    isResCheck: false,
    resCheckboxData: [],
    //结果附加域选择框
    isResExtraCheck: false,
    resExtraCheckboxData: [],

    defaultData: [],
    //文件列选中
    suconditions: [],
    //额外域选中
    datAraInColumns: [],
    //结果列选中
    showInColumnsTable: false,
    resCheckedColumns: [],
    //结果列附加信息
    showInColumnsExtraTable: false,
    resCheckedExtraColumns: [],
    //搜索信息
    searchValue: '',
    //文件列信息
    treeData: [],
    //额外域信息
    treeExtraData: [],
    //结果列信息
    treeResData: [],
    //结果列附加信息
    treeResExtraData: [],
    //搜索结果设置值
    searchResSetVal: {},
    display: 'none',
    dataSource: [],
    total: '',
    pageNum: 1,
    pageSize: '',
    visible: false,

    //搜
    customValue: '',
    currentRowKey: '', // 当前行Key
    currentSource: '批次详情', // 当前来源
    secondSource: '', //第二列标题
    thirdSource: '', //第三列标题
    fourthSource: '', //第四列标题
    loadingForParamTree: false,
    loadingForSourceTree: false,
    fileColumns: [], //文件列数据
    dataAraFileColumns: [], //附加数据
    selectedRowKeys: [], // 已选行Keys
    treeDataForParam: [], // 参数树
    treeDataForSource: [], // 来源树
    currentSelect: [], //来源树选中
    secondListData: [], //第二列数据
    secondListSelect: [], //第二列选中
    selectResData: false,
    thirdListTag: '', //第三列标签
    thirdListData: [], //第三列数据
    thirdListSelect: [], //第三列选中
    fourthListTag: '', //第四列标签
    fourthListData: [], //第四列数据
    fourthListSelect: [], //第四列选中
    expandedKeys: [],
    autoExpandParent: true,
    currentTitle: false,
    selectedMessageType: '', //已选报文类型

    // 解析execl表格数据后对应的存放地址
    tableName: [],
    tableData: [],
    tableHeader: [],

    columns: [
      {
        title: '中文名称',
        key: 'chineseName',
        dataIndex: 'chineseName',
        align: 'left',
        width: '20%',
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              readOnly
              value={record.chineseName}
              onChange={e => {
                this.setDataSource(e, 'chineseName', index, record);
              }}
              bordered={false}
              placeholder="请输入名称"
            />
          );
        },
      },
      {
        title: '英文名称',
        key: 'metadataId',
        dataIndex: 'metadataId',
        align: 'left',
        width: '20%',
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              readOnly
              value={record.metadataId}
              onChange={e => {
                this.setDataSource(e, 'metadataId', index, record);
              }}
              bordered={false}
              placeholder="请输入英文名称"
            />
          );
        },
      },
      {
        title: '类型',
        key: 'type',
        dataIndex: 'type',
        align: 'left',
        width: '20%',
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              readOnly
              value={record.type}
              onChange={e => {
                this.setDataSource(e, 'type', index, record);
              }}
              bordered={false}
              placeholder="请输入类型"
            />
          );
        },
      },
      {
        title: '已配置值',
        key: 'title',
        dataIndex: 'title',
        align: 'left',
        width: '24%',
      },
      {
        title: '设置',
        key: 'set',
        dataIndex: 'set',
        align: 'left',
        width: '24%',
        render: (text: any, record: any, index: any) => {
          return (
            <a
              onClick={() => {
                this.showEdit(record);
              }}
            >
              值设置
            </a>
          );
        },
      },
    ],
  };

  componentDidMount() {
    console.log('当前是否展示props', this.props.display);
    this.props.onRef(this);
    //公共接口取值
    this.fetchCommonData();
    //回显
    this.setEcho();
    this.creatStorageRef();
  }

  //组件卸载后对state进行清除
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  //各表单ref

  storageFormRef: any = React.createRef();

  //当清分规则为多条时创建多个Ref获取起表单数据（有部分可能出现的问题）
  creatStorageRef = () => {
    this.props.clearRuleData.map((item, index) => {
      index = React.createRef();
      this.index = index;
    });
  };

  // 服务调度
  dispatchFormRef: any = React.createRef();

  // 结果文件
  editFormRef: any = React.createRef();

  // 文件合并
  fileMergeFormRef: any = React.createRef();

  //设置当前页回显配置项
  setEcho = async () => {
    //查看or编辑回显
    if (
      Object.keys(this.props.showFileTemplConfig).length > 0 ||
      Object.keys(this.props.showServerDispatch).length > 0 ||
      Object.keys(this.props.showMergeConfig).length > 0
    ) {
      //删除后端传回数据的三个key值
      delete this.props.showFileTemplConfig.busCode;
      delete this.props.showFileTemplConfig.chnNo;
      delete this.props.showFileTemplConfig.batType;
      delete this.props.showServerDispatch[0].busCode;
      delete this.props.showServerDispatch[0].chnNo;
      delete this.props.showServerDispatch[0].batType;
      delete this.props.showServerDispatch[0].txnCode;

      console.log(
        '当前的this.props.showFileTemplConfig：',
        this.props.showFileTemplConfig,
      );
      this.editFormRef.current.setFieldsValue({
        ...this.props.showFileTemplConfig,
      });
      // this.editFormRef.current.setFieldsValue(this.props.showFileTemplConfig);
      this.setDefaultFileValue();
      this.setDefaultMergeValue();
      var inColumnDatAra = this.props.showFileTemplConfig.inColumnDatAra;
      var outColumnDatAra = this.props.showFileTemplConfig.outColumnDatAra;
      var datAraParserType = this.props.showFileTemplConfig.datAraParserType;
      var parserType = this.props.showFileTemplConfig.parserType;
      this.editFormRef.current.setFieldsValue({
        inColumnDatAra: inColumnDatAra === 'datAra' ? true : false,
      });
      this.editFormRef.current.setFieldsValue({
        outColumnDatAra: outColumnDatAra === 'datAra' ? true : false,
      });
      this.setState(
        {
          clearDispatchData: this.props.showServerDispatch,
          showClearDispatch: true,
          condition: inColumnDatAra === 'datAra' ? true : false,
          outCondition: outColumnDatAra === 'datAra' ? true : false,
          showInDelemiters: parserType === 'FIXED' ? false : true,
          showDatAraInDelimiters: datAraParserType === 'FIXED' ? false : true,
        },
        () => {
          if (this.props.clearRuleData?.length > 0) {
            this.state.clearDispatchData.map((item: any, index: any) => {
              this.dispatchFormRef.current.setFieldsValue({
                [`aacCode_${index}`]: item?.aacCode,
                [`srvName_${index}`]: item?.srvName,
                [`srvMethod_${index}`]: item?.srvMethod,
                [`srvVerNo_${index}`]: item?.srvVerNo,
                [`serviceType_${index}`]: item?.serviceType,
                [`timeReviewFlag_${index}`]: 'OFF',
                [`clearCenterNo_${index}`]: item?.clearCenterNo,
                initialDelay: '1',
                [`srvLevel_${index}`]: item?.srvLevel,
                delay: '5',
                [`idcCode_${index}`]: item?.idcCode,
                [`dcnCode_${index}`]: item?.dcnCode,
                // aacCode: '002',
                runMode: 'D',
                errorContinFlg: 'Y',
                runLevel: 'H',
              });
            });
          } else {
            this.dispatchFormRef.current.setFieldsValue({
              ...this.props.showServerDispatch[0],
            });
          }
        },
      );
    }
    //上一步数据回显
    else if (
      this.props.param.saveStorageFormRef ||
      this.props.param.saveDispatchData ||
      this.props.param.saveEditFormRef ||
      this.props.param.saveFileData
    ) {
      console.log(
        '当前是否存在',
        this.props.param.saveStorageFormRef,
        '当前是否存在',
        this.props.param.saveEditFormRef,
        '当前的props为',
        this.props,
      );
      if (await this.props.importData.detailFiles) {
        this.setDefaultImport();
      }
      if (this.props.clearRuleData?.length > 0) {
      } else {
        this.storageFormRef.current.setFieldsValue(
          this.props.param.saveStorageFormRef,
        );
      }
      this.dispatchFormRef.current.setFieldsValue(
        this.props.param.saveDispatchData,
      );
      this.setPreNextData(this.props);
      var inColumnDatAra = this.props.param.saveStorageFormRef.inColumnDatAra;
      // var outColumnDatAra = this.props.param.saveEditFormRef.outColumnDatAra;
      var datAraParserType = this.props.param.saveStorageFormRef
        .datAraParserType;
      var parserType = this.props.param.saveStorageFormRef.parserType;
      this.editFormRef.current.setFieldsValue({
        inColumnDatAra: inColumnDatAra === 'datAra' ? true : false,
      });
      this.editFormRef.current.setFieldsValue({
        outColumnDatAra: outColumnDatAra === 'datAra' ? true : false,
      });
      this.setState({
        condition: inColumnDatAra === 'datAra' ? true : false,
        outCondition: outColumnDatAra === 'datAra' ? true : false,
        showInDelemiters: parserType === 'FIXED' ? false : true,
        showDatAraInDelimiters: datAraParserType === 'FIXED' ? false : true,
      });
      this.editFormRef.current.setFieldsValue(this.props.param.saveEditFormRef);
      this.fileMergeFormRef.current.setFieldsValue(
        this.props.param.saveFileData,
      );
      // this.setState({
      //   showSummary: this.props.param.saveFileData.allColumns,
      // });
    } //固定回显
    else {
      this.setState({
        showInDelemiters: true,
        showDatAraInDelimiters: true,
      });
      if (await this.props.importData.detailFiles) {
        this.setDefaultImport();
        this.setCommonEchoValue();
      }
      if (this.props.clearRuleData?.length > 0) {
        this.setCommonEchoValue();
      } else {
        this.dispatchFormRef.current.setFieldsValue({
          serviceType: 'ONLINE',
          timeReviewFlag: 'OFF',
          clearCenterNo: '002',
          initialDelay: '1',
          srvLevel: '3',
          delay: '5',
          idcCode: '1',
          dcnCode: '001',
          // aacCode: '002',
          runMode: 'D',
          errorContinFlg: 'Y',
          runLevel: 'H',
        });
        this.setCommonEchoValue();
      }
    }
  };

  /**
   * 设置一些公共的回显值
   */
  setCommonEchoValue = () => {
    this.editFormRef.current.setFieldsValue(
      {
        outDelimiters: '|',
      },
      () => {
        this.editFormRef.current.getFieldsValue();
      },
    );
    this.fileMergeFormRef.current.setFieldsValue(
      {
        summaryDelemiters: '|',
        fileMerge: 'simpleMerge',
      },
      () => {
        this.fileMergeFormRef.current.getFieldsValue();
      },
    );
  };

  //设置文件下载拆分及结果文件列时文件列的回显值(编辑时的回显)
  setDefaultFileValue = () => {
    var outColumns = this.props.showFileTemplConfig.outColumns.split(',');
    var outColumnsName = this.props.showFileTemplConfig.outColumnsName.split(
      ',',
    );
    // 解析编辑or查看结果文件列与结果文件列附加域的回显展示数据
    var outColumnsData: any = [];
    var datAraOutColumnsData: any = [];
    outColumns.map((item: any, index: any) => {
      outColumnsName.map((i: any, num: any) => {
        if (index === num) {
          outColumnsData.push({
            key: index,
            metadataId: item,
            chineseName: i,
          });
        }
      });
    });
    this.setState(
      {
        resCheckedColumns: outColumnsData,
      },
      () => {
        if (this.state.resCheckedColumns) {
          this.setResCheckedValue();
          //显示结果文件列表格
          this.setState({
            showInColumnsTable: true,
          });
        }
      },
    );
    if (
      this.props.showFileTemplConfig.datAraOutColumns &&
      this.props.showFileTemplConfig.datAraOutColumns.split(',').length > 0
    ) {
      //回显结果文件列附加域
      var datAraOutColumns = this.props.showFileTemplConfig.datAraOutColumns.split(
        ',',
      );
      var datAraOutColumnsName = this.props.showFileTemplConfig.datAraOutColumnsName.split(
        ',',
      );
      var datAraOutColumnsData: any = [];
      datAraOutColumns.map((item: any, index: any) => {
        datAraOutColumnsName.map((i: any, num: any) => {
          if (index === num) {
            datAraOutColumnsData.push({
              key: index,
              metadataId: item,
              chineseName: i,
            });
          }
        });
      });
      this.setState(
        {
          resCheckedExtraColumns: datAraOutColumnsData,
        },
        () => {
          if (this.state.resCheckedColumns) {
            //显示结果文件附加列表格
            this.setState({
              showInColumnsExtraTable: true,
            });
          }
        },
      );
    }
  };

  setPreNextData = (props: any) => {
    console.log(this.state.treeData);
    this.state.treeData.map((item: any, index: any) => {
      if (index == 1) {
        console.log('结构为', item);
      }
    });
    props.param.saveStorageFormRef;
    // this.setState({
    //     checkboxData: selectedArr,
    //     suconditions: valueArr,
    // })
  };

  //请求到数据后进行数据整合
  getFileList = (type: any, getArr: any, valueArr: any, selectedArr: any) => {
    getFileList({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getDataDictionaryList',
      data: { metadataIdList: getArr },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        res.body.map(item => {
          //组转结果文件列选中值
          selectedArr.push(item.seqNo);
          //组装值设置表格设置值
          valueArr.push({
            key: item.seqNo,
            metadataId: item.metadataId,
            chineseName: item.chineseName,
          });
        });
        //结果文件列回显
        if (type === 'res') {
          console.log('当前的', this.props);
          var outputParameter = JSON.parse(
            this.props.showFileTemplConfig.outputParameter,
          );
          valueArr.map(i => {
            Object.keys(outputParameter).map(item => {
              if (item === i.metadataId) {
                (i.value = outputParameter[item]),
                  (i.title = outputParameter[item]);
              }
            });
          });
          this.setState(
            {
              resCheckboxData: selectedArr,
              resCheckedColumns: valueArr,
            },
            () => {
              if (this.state.resCheckedColumns) {
                //显示结果文件列表格
                this.setState({
                  showInColumnsTable: true,
                });
              }
            },
          );
        } else if (type === 'in' || type === 'inExtra') {
          //需要的对象属性值替换
          valueArr = valueArr.map((item: any) => {
            return {
              key: item.key,
              showValue: item.chineseName,
              showKey: item.metadataId,
            };
          });
          console.log('valueArr', valueArr);
          //文件列信息回显
          if (type === 'in') {
            this.setState(
              {
                checkboxData: selectedArr,
                suconditions: valueArr,
              },
              () => {
                this.renderCondition(this.state.suconditions, 'File');
              },
            );
            //附加文件列信息回显
          } else if (type === 'inExtra') {
            this.setState(
              {
                datAraCheckboxData: selectedArr,
                datAraInColumns: valueArr,
              },
              () => {
                this.renderCondition(this.state.datAraInColumns, 'Extra');
              },
            );
          }
        } else {
          this.setState(
            {
              resExtraCheckboxData: selectedArr,
              resCheckedExtraColumns: valueArr,
            },
            () => {
              if (this.state.resCheckedColumns) {
                //显示结果文件附加列表格
                this.setResExtraCheckedValue();
                this.setState({
                  showInColumnsExtraTable: true,
                });
              }
            },
          );
        }
      }
    });
  };

  //设置文件合并编辑or查看时回显的值
  setDefaultMergeValue = () => {
    delete this.props.showMergeConfig.busCode;
    delete this.props.showMergeConfig.chnNo;
    delete this.props.showMergeConfig.batType;
    this.fileMergeFormRef.current.setFieldsValue(this.props.showMergeConfig);
    var summaryInfoConfig = JSON.parse(
      this.props.showMergeConfig.summaryInfoConfig,
    );
    var length = Object.keys(summaryInfoConfig).length;
    this.setState({
      showSummary: length,
    });
    this.fileMergeFormRef.current.setFieldsValue({
      allColumns: length,
      summaryDelemiters: '|',
      fileMerge: 'simpleMerge',
    });
    //设置文件列数中选择框的回显值
    for (let i = 0; i < length; i++) {
      this.fileMergeFormRef.current.setFieldsValue({
        [`column${i}`]: summaryInfoConfig[i],
      });
    }
  };

  //参数设置Modal
  showEdit = (record: any) => {
    if (record.children) {
      message.warning('当前参数存在children，不可设置参数值');
      return;
    }
    console.log('record为：', record);

    const { key } = record;
    this.fetchResultParamSetup();
    // 计算上游有效节点（准确的说，应该是计算来源树）
    // this.computeUpstreamValidService();
    setTimeout(() => {
      this.setState({
        currentRowKey: key,
        loadingForSourceTree: false,
        visible: true,
        // treeDataForParam: []
      });
    }, 250);
  };

  // 当存在编辑/查看数据时,为结果文件值设置默认值
  setResCheckedValue = () => {
    var resCheckedColumns = cloneDeep(this.state.resCheckedColumns);
    // 设置结果文件列默认值
    var outputParameter = JSON.parse(
      this.props.showFileTemplConfig.outputParameter,
    );
    resCheckedColumns.map(i => {
      Object.keys(outputParameter).map(item => {
        if (item === i.metadataId) {
          (i.value = outputParameter[item]), (i.title = outputParameter[item]);
        }
      });
    });
    this.setState({
      resCheckedColumns,
    });
  };

  // 当存在编辑/查看数据时,为结果文件附加域值设置默认值
  setResExtraCheckedValue = () => {
    var resCheckedExtraColumns = cloneDeep(this.state.resCheckedExtraColumns);
    // 设置结果文件列默认值
    var outputParameter = JSON.parse(
      this.props.showFileTemplConfig.outputParameter,
    )['datAra'];
    resCheckedExtraColumns.map(i => {
      Object.keys(outputParameter).map(item => {
        if (item === i.metadataId) {
          (i.value = outputParameter[item]), (i.title = outputParameter[item]);
        }
      });
    });
    this.setState({
      resCheckedExtraColumns,
    });
  };

  // 对应设置结果文件值设置默认值
  setResCheckedDefaultValue = async () => {
    if (this.props.importData.detailFiles) {
      console.log(
        'default res data',
        this.props.resDefaultData.btrDetailMap,
        this.props.resDefaultData.btrTaskMessage,
        this.props.resDefaultData.btrFileTempl,
        this.props.resDefaultData.btrParam,
      );
      var detailFiles = cloneDeep(this.props.importData.detailFiles);
      // var DefaultData = cloneDeep(await this.state.resCheckedColumns);
      console.log('DefaultData', await this.state.resCheckedColumns);
      // 设置结果文件列默认值
      await this.state.resCheckedColumns.map(item => {
        this.props.resDefaultData.btrDetailMap.map(n => {
          if (item.metadataId == n.paramKey) {
            item.value = `$.[${n.paramType}][${item.metadataId}]`;
            item.title = `$.[${n.paramType}][${n.paramValue}]`;
          }
        });
        this.props.resDefaultData.btrTaskMessage.map(n => {
          if (item.metadataId == n.paramKey) {
            item.value = `$.[${n.paramType}][${item.metadataId}]`;
            item.title = `$.[${n.paramType}][${n.paramValue}]`;
          }
        });
        this.props.resDefaultData.btrFileTempl.map(n => {
          if (item.metadataId == n.paramKey) {
            item.value = `$.[${n.paramType}][${item.metadataId}]`;
            item.title = `$.[${n.paramType}][${n.paramValue}]`;
          }
        });
        this.props.resDefaultData.btrParam.map(n => {
          if (item.metadataId == n.paramKey) {
            item.value = `$.[${n.paramType}][${item.metadataId}]`;
            item.title = `$.[${n.paramType}][${n.paramValue}]`;
          }
        });
        detailFiles.uploadDetailFilesList.map(n => {
          if (item.metadataId == n.field) {
            item.value = `$.[${n.attribution}][${n.field}]`;
            item.title = `$.[${n.attribution}][${n.field}]`;
          }
        });
      });
      // this.setState({
      //   resCheckedColumns: DefaultData,
      // });
    }
  };

  // 保存设置的参数值
  handleOk = () => {
    let Datasource = cloneDeep(this.state.resCheckedColumns);
    console.log('Datasource', Datasource);

    let ExtraDatasource = cloneDeep(this.state.resCheckedExtraColumns);
    if (this.state.currentSource == '自定义信息') {
      //遍历更改数组数据(结果文件默认值)
      Datasource.map(item => {
        if (this.state.currentRowKey == item.key) {
          item.value = this.state.customValue;
          item.title = `$.[自定义信息][${this.state.customValue}]`;
        }
      });
      ExtraDatasource.map(item => {
        if (this.state.currentRowKey == item.key) {
          item.value = this.state.customValue;
          item.title = `$.[自定义信息][${this.state.customValue}]`;
        }
      });
    } else if (
      this.state.currentSource == '批次详情' ||
      this.state.currentSource == '文件列' ||
      this.state.currentSource == '附加数据域'
    ) {
      Datasource.map(item => {
        if (this.state.currentRowKey == item.key) {
          item.value = `$.[${this.state.currentSelect}][${this.state.secondListSelect}]`;
          item.title = `$.[${this.state.currentSource}][${this.state.secondSource}]`;
        }
      });
      ExtraDatasource.map(item => {
        if (this.state.currentRowKey == item.key) {
          item.value = `$.[${this.state.currentSelect}][${this.state.secondListSelect}]`;
          item.title = `$.[${this.state.currentSource}][${this.state.secondSource}]`;
        }
      });
    } else if (this.state.currentSource == '批量交易结果返回') {
      Datasource.map(item => {
        if (this.state.currentRowKey == item.key) {
          item.value = `$.[${this.state.currentSelect}][${this.state.secondListSelect}][${this.state.thirdListSelect}][${this.state.fourthListSelect}]`;
          item.title = `$.[${this.state.currentSource}][${this.state.secondSource}][${this.state.thirdSource}][${this.state.fourthSource}]`;
        }
      });
      ExtraDatasource.map(item => {
        if (this.state.currentRowKey == item.key) {
          item.value = `$.[${this.state.currentSelect}][${this.state.secondListSelect}][${this.state.thirdListSelect}][${this.state.fourthListSelect}]`;
          item.title = `$.[${this.state.currentSource}][${this.state.secondSource}][${this.state.thirdSource}][${this.state.fourthSource}]`;
        }
      });
    }
    message.destroy();
    message.success('保存成功');
    this.setState({
      resCheckedColumns: Datasource,
      resCheckedExtraColumns: ExtraDatasource,
      visible: false,
    });
  };

  // 关闭
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //请求resultParamSetup
  fetchResultParamSetup = () => {
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'resultParamSetup' },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        const upstreamValidNodeArray: any = [];
        res.body.map(item => {
          upstreamValidNodeArray.push({
            title: item.paramValue,
            key: item.paramKey,
          });
        });
        this.setState({
          treeDataForSource: upstreamValidNodeArray,
        });
      }
    });
  };
  //请求btrDetailMap
  fetchBtrDetailMap = () => {
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'btrDetailMap' },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        const upstreamValidNodeArray: any = [];
        res.body.map(item => {
          upstreamValidNodeArray.push({
            title: item.paramValue,
            key: item.paramKey,
          });
        });
        this.setState({
          secondListData: upstreamValidNodeArray,
        });
      }
    });
  };

  //设置resultData树值(值设置第二列固定值)
  fetchResultData = () => {
    var result = [
      {
        key: 'sysHead',
        title: '系统报文头',
        value: 'sysHead',
      },
      {
        key: 'localHead',
        title: '本地报文头',
        value: 'localHead',
      },
      {
        key: 'body',
        title: '报文体',
        value: 'body',
      },
    ];
    this.setState({
      secondListData: result,
    });
    // this.state.searchResSetVal.responseParams.sysHead;
    // this.state.searchResSetVal.responseParams.localHead
    // this.state.searchResSetVal.responseParams.body
  };

  /**
   * 选中树形结构，点击不同的给定项去获取不同的数据源
   * @param selectedKeys 选中的key值
   * @param e 选中的树形控件节点信息
   */
  onSelectForSourceTree = (selectedKeys: any, e: any) => {
    // 未选退出
    console.log(
      '选中',
      e,
      'e.node',
      e.node,
      '选中的东西：',
      e.selectedNodes[0],
    );

    if (e.selected === false) {
      this.setState({
        currentSource: '',
      });
      return;
    } else if (e.node.title !== '批量交易结果返回') {
      this.setState({
        currentTitle: false,
      });
    }
    // loading
    this.setState({
      loadingForParamTree: true,
      selectedMessageType: false,
      paramType: false,
      currentSource: '自定义信息',
    });
    setTimeout(() => {
      this.setState({
        loadingForParamTree: false,
        currentSource: e.selectedNodes[0].title,
      });
    }, 150);
    const { title } = e.selectedNodes[0];
    this.setState({
      currentSelect: selectedKeys,
      currentSource: title,
    });
    // 情况一：批次详情
    if (title === '批次详情') {
      this.fetchBtrDetailMap();
    }
    // 情况二：自定义信息
    if (title === '自定义信息') {
      this.setState({
        treeDataForParam: '自定义信息',
      });
    }
    if (title === '文件列') {
      this.setState({
        secondListData: this.props.fileColumns,
      });
      console.log(this.state.currentSource);
    }
    if (title === '附加数据域') {
      this.setState({
        secondListData: this.props.dataAraFileColumns,
      });
      console.log(this.state.currentSource);
    }
    if (title === '批量交易结果返回') {
      console.log(this.state.currentSource);
      this.fetchResultData();
    }
    // if (e.node.isLeaf() === true) {
    //   if (title.includes('当前节点')) {
    //     this.setState({
    //       currentSource: title
    //     });
    //     this.computeParamTreeForCurrentNode();
    //   } else if (title.includes('自定义信息') === false) {
    //     // this.computeParamTree(props.parentKey, props.title);
    //   }
    // } else {
    //   this.setState({
    //     treeDataForParam: []
    //   });
    // }
  };

  /**
   * 选中报文类型（sysHead、localHead、body）时触发的事件
   * @param selectedKeys 选中的key值
   * @param e 选中的树形控件节点信息事件对象
   */
  onSelectForMessageType = (selectedKeys: any, e: any) => {
    console.log(
      '选中报文类型',
      selectedKeys,
      e,
      this.props.importData.onlineFile,
    );
    var startTag = '';
    var endTag = '';
    if (e.selected === false) {
      return;
    }
    if (this.props.importData.onlineFile[0]) {
      var fourthListData: any = [];
      this.props.importData.onlineFile[0].serviceVoFieldList.map(
        (item: any, index: any) => {
          if (item.descripTion === 'Start') {
            startTag = index;
          } else if (item.descripTion === 'End') {
            endTag = index;
          }
        },
      );
      this.props.importData.onlineFile[0].serviceVoFieldList
        .slice(startTag + 1, endTag)
        .map((item: any) => {
          fourthListData.push({
            title: item.fieldName,
            key: item.field,
          });
        });
      this.setState({
        fourthListData,
      });
    }
    this.setState({
      thirdSource: e.node.title,
      thirdListSelect: selectedKeys,
    });
  };

  /**
   * 选中对应服务时触发的事件
   * @param selectedKeys 选中的key值
   * @param e 选中的树形控件节点信息事件对象
   */
  onSelectFourthColumn = (selectedKeys: any, e: any) => {
    console.log('选中报文类型', selectedKeys, e);
    if (e.selected === false) {
      return;
    }
    this.setState({
      fourthSource: e.node.title,
      fourthListSelect: selectedKeys,
    });
  };

  /**
   * 获取自定义输入框中的值
   * @param e 自定义输入框中事件对象
   */
  customValue = e => {
    this.setState({
      customValue: e.target.value,
    });
  };

  /**
   * 选中参数类型（出入参）时触发的事件
   */
  onSelectForParamType = (selectedKeys, e) => {
    if (e.selected === false) {
      this.setState({
        selectResData: false,
      });
      return;
    }
    console.log('选中参数类型', selectedKeys, 'e', e);
    // 所选参数类型
    const { title } = e.selectedNodes[0];
    // 获取对应参数
    if (title === '系统报文头') {
      const sysHead: any = [];
      this.state.searchResSetVal.responseParams.sysHead.map(item => {
        sysHead.push({
          title: item.structAlias,
          key: item.structName,
        });
      });
      this.setState({
        selectResData: true,
        thirdListTag: title,
        thirdListData: sysHead,
      });
      console.log('系统报文头');
      console.log(this.state.searchResSetVal.responseParams.sysHead);
    }
    if (title === '本地报文头') {
      const localHead: any = [];
      this.state.searchResSetVal.responseParams.localHead.map(item => {
        localHead.push({
          title: item.structAlias,
          key: item.structName,
        });
      });
      this.setState({
        selectResData: true,
        thirdListTag: title,
        thirdListData: localHead,
      });
      console.log('本地报文头');
      console.log(this.state.searchResSetVal.responseParams.localHead);
    }
    if (title === '报文体') {
      const body: any = [];
      this.state.searchResSetVal.responseParams.body.map(item => {
        body.push({
          title: item.structAlias,
          key: item.structName,
        });
      });
      this.setState({
        selectResData: true,
        thirdListTag: title,
        thirdListData: body,
      });
      console.log('报文体');
      console.log(this.state.searchResSetVal.responseParams.body);
    }
    this.setState({
      secondSource: e.node.title,
      secondListSelect: selectedKeys,
    });
  };

  //表头input设置
  setDataSource = (e: any, key: any, index: any, record: any) => {
    var dataSource = cloneDeep(this.state.dataSource);
    // var resCheckedColumns = cloneDeep(this.state.resCheckedColumns)
    console.log('index/key', dataSource[index][key]);
    dataSource[index][key] = e.target.value;
    this.setState({
      dataSource,
    });
  };
  //设置显示某个配置表单
  getDisplay = (display: object | boolean) => {};
  hide = () => {
    this.setState({
      resAraClicked: false,
      resExtraClicked: false,
      datAraClicked: false,
      clicked: false,
      hovered: false,
    });
  };
  handleHoverChange = (visible: any) => {
    this.setState({
      clicked: false,
      hovered: visible,
    });
  };
  //设置文件列展示
  handleClickChange = (visible: any) => {
    this.setState({
      clicked: visible,
      hovered: false,
    });
  };
  handleDateHoverChange = (visible: any) => {
    this.setState({
      datAraClicked: false,
      datAraHovered: visible,
    });
  };
  handleDateClickChange = (visible: any) => {
    this.setState({
      datAraClicked: visible,
      datAraHovered: false,
    });
  };
  handleResClickChange = (visible: any) => {
    this.setState({
      resAraClicked: visible,
    });
  };
  handleResExtraClickChange = (visible: any) => {
    this.setState({
      resExtraClicked: visible,
    });
  };
  changeCondition = (value: any) => {
    console.log(value);
    this.setState({
      condition: value,
    });
  };
  changeOutCondition = (value: any) => {
    console.log(value);
    this.setState({
      outCondition: value,
    });
  };
  //文件列选中栏
  Checkbox = (checked: any) => {
    console.log(checked);
    this.setState({
      isCheck: true,
      checkboxData: checked,
    });
  };

  //文件列附加域选中
  datAraCheckbox = (checked: any) => {
    console.log(checked);
    this.setState({
      isDatAraCheck: true,
      datAraCheckboxData: checked,
    });
  };
  //结果文件列选中
  resCheckbox = (checked: any) => {
    this.setState({
      isResCheck: true,
      resCheckboxData: checked,
    });
  };
  //结果文件列附加域选中
  resExtraCheckbox = (checked: any) => {
    console.log(checked);
    this.setState({
      isResExtraCheck: true,
      resExtraCheckboxData: checked,
    });
  };

  //获取公共数据
  fetchCommonData = () => {
    //获取文件内容分割符
    this.getCommon('separator');
    //获取运行等级
    this.getCommon('runLevel');
    //获取服务级别
    this.getCommon('serviceLevel');
    //获取idcCode
    this.getCommon('idcCode');
    //获取dcnCode
    this.getCommon('dcnCode');
    //获取clearCenterNo
    this.getCommon('clearCenterNo');
    //获取svcType
    this.getCommon('svcType');
    //获取timeReviewFlag
    this.getCommon('timeReviewFlag');
    //获取serviceType
    this.getCommon('serviceType');
    //获取aacCode
    this.getCommon('aacCode');
    //获取文件合并列
    this.getCommon('mergeConf');
  };

  //公共代码
  getCommon = (paramType: any) => {
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState(() => ({
          [paramType]: res.body,
        }));
      }
    });
  };

  /**
   * 通过设置数据分隔符的类型来展示其不同的显示状态（文件列数据域）
   * @param type 当前数据分隔符的类型
   */
  setInDelemiters = type => {
    if (type === 'fixed') {
      this.setState({
        showInDelemiters: false,
      });
      this.storageFormRef.current.setFieldsValue({
        inDelemiters: undefined,
      });
    } else {
      this.setState({
        showInDelemiters: true,
      });
      this.storageFormRef.current.setFieldsValue({
        inDelemiters: '|',
      });
    }
  };

  /**
   * 通过设置数据分隔符的类型来展示其不同的显示状态（文件列附加数据域）
   * @param type 当前数据分隔符的类型
   */
  setDatAraInDelimiters = type => {
    if (type === 'fixed') {
      this.setState({
        showDatAraInDelimiters: false,
      });
      this.storageFormRef.current.setFieldsValue({
        datAraInDelimiters: undefined,
      });
    } else {
      this.setState({
        showDatAraInDelimiters: true,
      });
      this.storageFormRef.current.setFieldsValue({
        datAraInDelimiters: '|',
      });
    }
  };

  /**
   * 通过获取汇总行列数来生成对应的汇总行
   * @param e 当前元素的事件驱动源（事件对象event）
   */
  createSummary = (e: any) => {
    this.setState({
      showSummary: e.target.value,
    });
  };

  //绑定解析入库子组件
  splitFilesRef = (ref: any) => {
    this.splitFiles = ref;
  };

  //绑定导入子组件
  clearFilesRef = (ref: any) => {
    this.clearFiles = ref;
  };

  //获取导入后解析的文件
  getClearFiles = (res, status) => {
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveImport', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        id: 'clearFiles',
        data: res.body,
      },
    });
    // 当上传成功后存储状态
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveUploadStatus', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        uploadStatus: status,
      },
    });
  };

  //接受对应的前端解析后的表格数据
  sendAnalyzeData = data => {
    this.setState({
      tableName: data.tableName,
      tableData: data.tableData,
      tableHeader: data.tableHeader,
    });
  };

  //绑定导入子组件
  importRef = (ref: any) => {
    this.child = ref;
  };

  //获取导入后解析的文件
  getImportFile = res => {
    console.log(res);
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveImport', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        id: 'onlineFile',
        data: res.body,
      },
    });
    this.setState(
      {
        showClearDispatch: true,
      },
      () => {
        this.renderClearDispatch(res);
      },
    );
  };

  //根据导入数据渲染
  renderClearDispatch = res => {
    this.setState(
      {
        clearDispatchData: res.body,
      },
      () => {
        //当清分规则不存在（即不是清分配置时）
        if (this.state.showClearDispatch) {
          if (this.props.clearRuleData?.length === 0) {
            this.dispatchFormRef.current.setFieldsValue({
              aacCode: this.state.clearDispatchData[0]?.serviceConfigVoList[5]
                .paramVo,
              srvName: this.state.clearDispatchData[0]?.serviceConfigVoList[0]
                .paramVo,
              srvMethod: this.state.clearDispatchData[0]?.serviceConfigVoList[1]
                .paramVo,
              srvVerNo: this.state.clearDispatchData[0]?.serviceConfigVoList[2]
                .paramVo,
            });
          }
          // 当为清分时设置对应的字段数值
          else if (this.props.clearRuleData?.length > 0) {
            this.state.clearDispatchData.map((item: any, index: any) => {
              this.dispatchFormRef.current.setFieldsValue({
                [`aacCode_${index}`]: item?.serviceConfigVoList[5].paramVo,
                [`srvName_${index}`]: item?.serviceConfigVoList[0].paramVo,
                [`srvMethod_${index}`]: item?.serviceConfigVoList[1].paramVo,
                [`srvVerNo_${index}`]: item?.serviceConfigVoList[2].paramVo,
                [`serviceType_${index}`]: item?.serviceConfigVoList[6].paramVo,
                [`timeReviewFlag_${index}`]: 'OFF',
                [`clearCenterNo_${index}`]: item?.serviceConfigVoList[7]
                  .paramVo,
                initialDelay: '1',
                [`srvLevel_${index}`]: '3',
                delay: '5',
                [`idcCode_${index}`]: '1',
                [`dcnCode_${index}`]: '001',
                // aacCode: '002',
                runMode: 'D',
                errorContinFlg: 'Y',
                runLevel: 'H',
              });
            });
          }
        }
      },
    );
  };

  //若有导入数据则自动填充至各表单(目前只有结果文件配置页面)
  setDefaultImport = async () => {
    var detailFiles = await cloneDeep(this.props.importData.detailFiles);
    console.log(detailFiles);
    //结果文件列字段导入
    var resCheckedColumns = detailFiles.downloadDetailFilesList.map(
      (item: any) => {
        return {
          key: item.seqNo,
          metadataId: item.field,
          chineseName: item.fieldName,
          type: item.type,
        };
      },
    );
    if (resCheckedColumns.length > 0) {
      this.setState({
        showInColumnsTable: true,
      });
      this.setResCheckedDefaultValue();
    }
    if (detailFiles.downloadDetailFilesDatAraList.length > 0) {
      this.setState({
        showInColumnsExtraTable: true,
      });
    }

    //结果文件列附加域字段导入
    var resCheckedExtraColumns = detailFiles.downloadDetailFilesDatAraList.map(
      (item: any) => {
        return {
          key: item.seqNo,
          metadataId: item.field,
          chineseName: item.fieldName,
          type: item.type,
        };
      },
    );

    // 文件合并数据导入
    this.fileMergeFormRef.current.setFieldsValue(
      {
        allColumns: detailFiles.downloadFileSummaryList.length,
      },
      () => {},
    );

    // 组装对应字段名对象
    var valueKeyList: any = [];
    detailFiles.downloadFileSummaryList.map((item: any, index: any) => {
      valueKeyList.push((index = `column${index}`));
    });
    //文件合并具体字段值设置(具体的每个字段值)
    detailFiles.downloadFileSummaryList.map((item: any, index: any) => {
      this.fileMergeFormRef.current.setFieldsValue({
        [valueKeyList[index]]: item.field,
      });
    });

    this.setState({
      showSummary: detailFiles.downloadFileSummaryList.length,
      resCheckedColumns,
      resCheckedExtraColumns,
    });
  };

  /**
   * 将 获取到的每个Form对象存入对应的Form数据数组中（对具体的清分生成的Form表单暂时无需进行操作）
   */
  getFormListData = () => {
    var formListData = [];
    console.log('的数据为：', this.index.current.getFieldsValue());
    for (let i = 0; i < this.props.clearRuleData?.length; i++) {
      var oneFormData = this.index.current.getFieldsValue();
      formListData.push(oneFormData);
    }
    console.log('当期的数据为：', formListData);
  };

  //遍历去重
  removeDup = (arr: any) => {
    var newArr: any = []; //去重结束后存放数据
    for (let item of arr) {
      let flag = true; //判断是否重复
      for (let i of newArr) {
        if (item.key == i.key) {
          flag = false;
        }
      }
      if (flag) {
        newArr.push(item);
      }
    }
    return newArr;
  };

  //新增各类文件列信息
  addCondition = (item: any, type: any) => {
    switch (type) {
      case 'File':
        var suconditions = cloneDeep(this.state.suconditions);
        if (this.state.suconditions.length > 0) {
          for (let i in this.state.treeData) {
            if (this.state.treeData[i].seqNo == item) {
              var showValue = this.state.treeData[i].chineseName;
              var showKey = this.state.treeData[i].metadataId;
              var showType = this.state.treeData[i].type;
              conditionArr.push({
                key: item,
                showValue: showValue,
                showKey: showKey,
                showType: showType,
              });
              let newobj = {};
              //去重
              conditionArr = conditionArr.reduce((preVal, curVal) => {
                newobj[curVal.key]
                  ? ''
                  : (newobj[curVal.key] = preVal.push(curVal));
                return preVal;
              }, []);
              suconditions = [...suconditions, ...conditionArr];
              suconditions = this.removeDup(suconditions);
              console.log('suconditions', suconditions);
              numCounter = suconditions.length;
              //直接将旧的替换成新的
              this.setState({
                suconditions,
              });
            }
          }
        } else {
          for (let i in this.state.treeData) {
            if (this.state.treeData[i].seqNo == item) {
              var showValue = this.state.treeData[i].chineseName;
              var showKey = this.state.treeData[i].metadataId;
              var showType = this.state.treeData[i].type;
              conditionArr.push({
                key: item,
                showValue: showValue,
                showKey: showKey,
                showType: showType,
              });

              this.setState(
                {
                  suconditions: [...this.state.suconditions, ...conditionArr],
                },
                () => {
                  numCounter = this.state.suconditions.length;
                },
              );
            }
          }
        }
        break;
      case 'Extra':
        var datAraInColumns = cloneDeep(this.state.datAraInColumns);
        if (this.state.datAraInColumns.length > 0) {
          for (let i in this.state.treeExtraData) {
            if (this.state.treeExtraData[i].seqNo == item) {
              var showValue = this.state.treeExtraData[i].chineseName;
              var showKey = this.state.treeData[i].metadataId;
              var showType = this.state.treeData[i].type;
              conditionArrData.push({
                key: item,
                showValue: showValue,
                showKey: showKey,
                showType: showType,
              });
              let newobj = {};
              //去重
              conditionArrData = conditionArrData.reduce((preVal, curVal) => {
                newobj[curVal.key]
                  ? ''
                  : (newobj[curVal.key] = preVal.push(curVal));
                return preVal;
              }, []);
              datAraInColumns = [...datAraInColumns, ...conditionArrData];
              datAraInColumns = this.removeDup(datAraInColumns);
              numExtraCounter = datAraInColumns.length;
              //直接将旧的替换成新的
              this.setState({
                datAraInColumns,
              });
            }
          }
        } else {
          for (let i in this.state.treeExtraData) {
            if (this.state.treeExtraData[i].seqNo == item) {
              var showValue = this.state.treeExtraData[i].chineseName;
              var showKey = this.state.treeData[i].metadataId;
              var showType = this.state.treeData[i].type;
              conditionArrData.push({
                key: item,
                showValue: showValue,
                showKey: showKey,
                showType: showType,
              });
              this.setState(
                {
                  datAraInColumns: [
                    ...this.state.datAraInColumns,
                    ...conditionArrData,
                  ],
                },
                () => {
                  numExtraCounter = this.state.datAraInColumns.length;
                },
              );
            }
          }
        }
        break;
      case 'Res':
        var resCheckedColumns = cloneDeep(this.state.resCheckedColumns);
        if (this.state.resCheckedColumns.length > 0) {
          for (let i in this.state.treeResData) {
            if (this.state.treeExtraData[i].seqNo == item) {
              var metadataId = this.state.treeResData[i].metadataId;
              var showValue = this.state.treeResData[i].chineseName;
              var type = this.state.treeResData[i].type;
              resArrData.push({
                key: item,
                metadataId: metadataId,
                chineseName: showValue,
                type: type,
              });
              let newobj = {};
              //去重
              resArrData = resArrData.reduce((preVal, curVal) => {
                newobj[curVal.key]
                  ? ''
                  : (newobj[curVal.key] = preVal.push(curVal));
                return preVal;
              }, []);
              resCheckedColumns = [...resCheckedColumns, ...resArrData];
              resCheckedColumns = this.removeDup(resCheckedColumns);
              //直接将旧的替换成新的
              this.setState(
                {
                  resCheckedColumns,
                },
                () => {
                  console.log('结果文件列为：', this.state.resCheckedColumns);
                },
              );
            }
          }
        } else {
          for (let i in this.state.treeResData) {
            if (this.state.treeResData[i].seqNo == item) {
              var metadataId = this.state.treeResData[i].metadataId;
              var showValue = this.state.treeResData[i].chineseName;
              var type = this.state.treeResData[i].type;
              resArrData.push({
                key: item,
                metadataId: metadataId,
                chineseName: showValue,
                type: type,
                // set:this.state.dataSource
              });
              this.setState(
                {
                  resCheckedColumns: [...resArrData],
                },
                () => {
                  console.log('结果文件列为：', this.state.resCheckedColumns);
                },
              );
            }
          }
        }
        break;
      case 'ResExtra':
        var resCheckedExtraColumns = cloneDeep(
          this.state.resCheckedExtraColumns,
        );
        if (this.state.resCheckedExtraColumns.length > 0) {
          for (let i in this.state.treeResExtraData) {
            if (this.state.treeResExtraData[i].seqNo == item) {
              var metadataId = this.state.treeResData[i].metadataId;
              var showValue = this.state.treeResData[i].chineseName;
              var type = this.state.treeResData[i].type;
              resExtraArrData.push({
                key: item,
                metadataId: metadataId,
                chineseName: showValue,
                type: type,
              });
              let newobj = {};
              //去重
              resExtraArrData = resExtraArrData.reduce((preVal, curVal) => {
                newobj[curVal.key]
                  ? ''
                  : (newobj[curVal.key] = preVal.push(curVal));
                return preVal;
              }, []);
              resCheckedExtraColumns = [
                ...resCheckedExtraColumns,
                ...resExtraArrData,
              ];
              resCheckedExtraColumns = this.removeDup(resCheckedExtraColumns);
              //直接将旧的替换成新的
              this.setState({
                resCheckedExtraColumns,
              });
            }
          }
        } else {
          for (let i in this.state.treeResExtraData) {
            if (this.state.treeResExtraData[i].seqNo == item) {
              var metadataId = this.state.treeResData[i].metadataId;
              var showValue = this.state.treeResData[i].chineseName;
              var type = this.state.treeResData[i].type;
              resExtraArrData.push({
                key: item,
                metadataId: metadataId,
                chineseName: showValue,
                type: type,
              });
              this.setState({
                resCheckedExtraColumns: [
                  ...this.state.resCheckedExtraColumns,
                  ...resExtraArrData,
                ],
              });
            }
          }
        }
        break;
    }
  };
  //搜索(中/英文固定模糊查询)
  searchinColumns = (value: any) => {
    var isZhReg = /[\u4e00-\u9fa5]$/;
    var isEnReg = /[a-zA-Z.\s]$/;
    this.setState({
      searchValue: value,
    });
    if (isZhReg.test(value)) {
      console.log('输入的是中文');
      getSerDataDicList({
        stdSvcInd: 'BatchEngineSetupSVC',
        stdIntfcInd: 'getServiceDataDictionaryList',
        data: { chineseName: value },
      }).then(res => {
        if (res && res.sysHead.retCd == '000000') {
          this.setState({
            treeData: res.body.list,
            treeExtraData: res.body.list,
            treeResData: res.body.list,
            treeResExtraData: res.body.list,
            total: res.body.total,
            pageNum: res.body.pageNum,
            pageSize: res.body.pageSize,
          });
        }
      });
    } else if (isEnReg.test(value)) {
      console.log('输入的是英文');
      getSerDataDicList({
        stdSvcInd: 'BatchEngineSetupSVC',
        stdIntfcInd: 'getServiceDataDictionaryList',
        data: { metadataId: value },
      }).then(res => {
        if (res && res.sysHead.retCd == '000000') {
          this.setState({
            treeData: res.body.list,
            treeExtraData: res.body.list,
            treeResData: res.body.list,
            treeResExtraData: res.body.list,
            total: res.body.total,
            pageNum: res.body.pageNum,
            pageSize: res.body.pageSize,
          });
        }
      });
    } else if (!value) {
      this.getInColumns();
    }
  };
  //删除
  delCondition = (key: any, type: any) => {
    //删除条件
    switch (type) {
      //文件列
      case 'File':
        console.log('this.state.suconditions:', this.state.suconditions);
        const suconditions = this.state.suconditions.filter(item => {
          console.log('item', item, 'key', key);
          return item.key != key;
        });
        const checkboxData = this.state.checkboxData.filter(item => {
          console.log('选中框：', item);
          return item != key;
        });
        console.log('suconditions', suconditions, 'checkboxData', checkboxData);
        this.setState({
          suconditions,
        });
        break;
      //额外文件列数据
      case 'Extra':
        const datAraInColumns = this.state.datAraInColumns.filter(item => {
          return item.key != key;
        });
        this.setState({
          datAraInColumns,
        });
        break;
      //结果文件列
      case 'Res':
        const resCheckedColumns = this.state.resCheckedColumns.filter(item => {
          return item.key != key;
        });
        this.setState({
          resCheckedColumns,
        });
        break;
      //结果文件列附加域
      case 'ResExtra':
        const resCheckedExtraColumns = this.state.resCheckedExtraColumns.filter(
          item => {
            return item.key != key;
          },
        );
        this.setState({
          resCheckedExtraColumns,
        });
        break;
    }
  };

  //获取文件列信息
  getInColumns = () => {
    getSerDataDicList({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getServiceDataDictionaryList',
      data: { metadataId: this.state.searchValue },
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          treeData: res.body.list,
          treeExtraData: res.body.list,
          treeResData: res.body.list,
          treeResExtraData: res.body.list,
          total: res.body.total,
          pageNum: res.body.pageNum,
          pageSize: res.body.pageSize,
        });
      }
    });
  };

  showinColumns = () => {
    console.log(this.state.checkboxData);
    this.getInColumns();
  };
  //分页事件
  onChange = (page: any, pageSize: any) => {
    this.setState({
      pageSize,
      pageNum: page,
    });
    getSerDataDicList({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getServiceDataDictionaryList',
      data: {
        pageSize,
        pageNum: page,
        metadataId: this.state.searchValue,
      },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          treeData: res.body.list,
          treeExtraData: res.body.list,
          treeResData: res.body.list,
          treeResExtraData: res.body.list,
          total: res.body.total,
          pageNum: res.body.pageNum,
          pageSize: res.body.pageSize,
        });
      }
    });
  };
  //数组去重
  unique = (arr: any) => {
    return Array.from(new Set(arr));
  };
  //结果文件列保存
  saveInColumns = (type: any) => {
    this.saveInColumnsInfo(type);
    switch (type) {
      case 'Res':
        setTimeout(() => {
          if (this.state.resCheckedColumns.length > 0) {
            this.setState({
              showInColumnsTable: true,
            });
          } else {
            this.setState({
              showInColumnsTable: false,
            });
          }
          message.destroy();
          message.success('保存成功');
        }, 0);
        break;
      case 'ResExtra':
        setTimeout(() => {
          if (this.state.resCheckedExtraColumns.length > 0) {
            this.setState({
              showInColumnsTable: false,
              showInColumnsExtraTable: true,
            });
          } else {
            this.setState({
              showInColumnsTable: false,
              showInColumnsExtraTable: false,
            });
          }
          message.destroy();
          message.success('保存成功');
        }, 0);
        break;
    }
  };
  //保存文件列信息
  saveInColumnsInfo = (type: any) => {
    switch (type) {
      //保存文件列信息
      case 'File':
        for (let item of this.state.checkboxData) {
          this.addCondition(item, type);
        }
        conditionArr = [];
        this.setState({
          clicked: false,
        });
        break;
      //保存附加文件列信息
      case 'Extra':
        for (let item of this.state.datAraCheckboxData) {
          this.addCondition(item, type);
        }
        this.setState({
          datAraClicked: false,
        });
        conditionArrData = [];
        break;
      case 'Res':
        for (let item of this.state.resCheckboxData) {
          this.addCondition(item, type);
        }
        this.setState({
          resAraClicked: false,
        });
        resArrData = [];
        break;
      case 'ResExtra':
        for (let item of this.state.resExtraCheckboxData) {
          this.addCondition(item, type);
        }
        this.setState({
          resExtraClicked: false,
        });
        resExtraArrData = [];
        break;
    }
  };
  //通过能力中心查询标准服务标志（去重）
  getStdSvcIndByAac = () => {
    const dispatchData = this.dispatchFormRef.current.getFieldsValue();
    getStdSvcIndByAac({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getStdSvcIndByAac',
      data: {
        cmptyCenter: dispatchData.aacCode,
        serviceName: dispatchData.srvName,
      },
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          srvName: res.body,
        });
      }
    });
  };
  //获取标准服务名
  changeStdSvcInd = (value: any) => {
    const dispatchData = this.dispatchFormRef.current.getFieldsValue();
    console.log(value);
    getStdIntfIndBySvc({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getStdIntfIndBySvc',
      data: {
        cmptyCenter: dispatchData.aacCode,
        serviceName: value,
      },
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          srvMethod: res.body,
        });
      }
    });
    this.setState({
      selectSvcInd: value,
    });
  };
  //获取版本号
  changeStdIntfInd = (value: any) => {
    const dispatchData = this.dispatchFormRef.current.getFieldsValue();
    console.log(value);
    getVersionByService({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getVersionByService',
      data: {
        cmptyCenter: dispatchData.aacCode,
        serviceName: this.state.selectSvcInd,
        interfaceName: value,
      },
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          versionNo: res.body,
        });
      }
    });
    this.setState({
      selectStdIntfInd: value,
    });
  };

  getMoadl = (isShow: any) => {
    this.setState({
      showSearchRes: isShow,
    });
  };
  // 获取服务细节
  changeVersionNo = (value: any) => {
    const dispatchData = this.dispatchFormRef.current.getFieldsValue();
    console.log('value', value);
    getNgParamOapsDetails({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getSoaServiceParams',
      data: {
        aacCode: dispatchData.aacCode,
        versionNo: value,
        stdSvcInd: this.state.selectSvcInd,
        stdIntfInd: this.state.selectStdIntfInd,
      },
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState(
          {
            searchResSetVal: res.body,
            showSearchRes: true,
          },
          () => console.log('showSearchRes', this.state.showSearchRes),
        );
      }
    });
  };

  // 获取服务细节（一清二拆）
  getServerInfo = (item: any) => {
    console.log('value', item);
    getNgParamOapsDetails({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'getSoaServiceParams',
      data: {
        aacCode: item?.serviceConfigVoList
          ? item.serviceConfigVoList[5].paramVo
          : item.aacCode,
        versionNo: item?.serviceConfigVoList
          ? item.serviceConfigVoList[2].paramVo
          : item.srvVerNo,
        stdSvcInd: item?.serviceConfigVoList
          ? item.serviceConfigVoList[0].paramVo
          : item.srvName,
        stdIntfInd: item?.serviceConfigVoList
          ? item.serviceConfigVoList[1].paramVo
          : item.srvMethod,
      },
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        var data: any = [];
        //当为一清二拆时需替换输入的报文头数据
        if (item?.serviceConfigVoList) {
          item.serviceVoFieldList.map((i, index) => {
            if (i.require === '') {
              i.require = 'n';
            }
            data.push({
              seqNo: index,
              structAlias: i.fieldName,
              structName: i.field,
              type: i.dataType,
              remark: i.descripTion,
              required: i.require,
              headType: 'body',
            });
            return data;
          });
          res.body.requestParams.body = data;
        } else if (Object.keys(this.props.showServerDispatch).length > 0) {
          this.props.showServerDispatch.map((i, index) => {
            var inputParameter = JSON.parse(i.inputParameter);
            if (i.require === '') {
              i.require = 'n';
            }
            Object.keys(inputParameter.body).map(e => {
              data.push({
                seqNo: index,
                structName: e,
                title: inputParameter.body[e],
                required: i.require,
                headType: 'body',
              });
              return data;
            });
          });
          res.body.requestParams.body = data;
        }
        this.setState({
          searchResSetVal: res.body,
          showSearchRes: true,
        });
      }
    });
  };

  //Map转对象
  strMapToObj = (Map: any) => {
    let obj = Object.create(null);
    for (let [key, value] of Map) {
      if (typeof value == 'object') {
        obj[key] = value;
        for (let [k, v] of value) {
          obj[key][k] = v;
        }
      } else {
        obj[key] = value;
      }
    }
    return obj;
  };

  //处理分片文件结果数据(目前未与el表达式合并)
  splitResCreateTo = () => {
    const editFormRef = this.editFormRef.current.getFieldsValue();
    const saveEditFormRef = this.editFormRef.current.getFieldsValue();
    this.props.dispatch({
      type: 'tableList/saveParam',
      payload: {
        id: 'saveEditFormRef',
        data: saveEditFormRef,
      },
    });
    console.log('editFormRef:', editFormRef);
    console.log('datasource', this.state.resCheckedColumns);
    const outColumnsName: any = [];
    const outColumnsType: any = [];
    const outColumns: any = [];
    const datAraOutColumns: any = [];
    const datAraOutColumnsName: any = [];
    const datAraOutColumnsType: any = [];
    if (this.state.resCheckedColumns.length > 0) {
      var resCheckedColumns = cloneDeep(this.state.resCheckedColumns);
      resCheckedColumns.map(item => {
        outColumns.push(item.metadataId);
        outColumnsName.push(item.chineseName);
        outColumnsType.push(item.type);
      });
    }

    if (this.state.resCheckedExtraColumns.length > 0) {
      var resCheckedExtraColumns = cloneDeep(this.state.resCheckedExtraColumns);
      resCheckedExtraColumns.map(item => {
        datAraOutColumns.push(item.metadataId);
        datAraOutColumnsName.push(item.chineseName);
        datAraOutColumnsType.push(item.type);
      });
    }
    //将英文名与分片文件按key:value存入对象中
    var resCheckedColumns = cloneDeep(this.state.resCheckedColumns);
    var resCheckedExtraColumns = cloneDeep(this.state.resCheckedExtraColumns);
    var outputParameter = new Map();
    var child = new Map();
    //结果文件列el表达式
    resCheckedColumns.map((i, index) => {
      outColumns.map((item: any, num: any) => {
        console.log('循环', i, item);
        if (i.metadataId == item) {
          if (i.value) {
            outputParameter.set(`${item}`, i.value);
          } else {
            outputParameter.set(`${item}`, '');
          }
        }
      });
    });
    //结果文件列附加域el表达式
    resCheckedExtraColumns.map((i, index) => {
      datAraOutColumns.map((item: any) => {
        if (i.metadataId == item) {
          if (i.value) {
            child.set(`${item}`, i.value);
          } else {
            child.set(`${item}`, '');
          }
        }
      });
    });
    if (Object.keys(child).length > 0) {
      outputParameter.set('datAra', child);
    }
    //Map转换为对象值
    outputParameter = JSON.stringify(this.strMapToObj(outputParameter));
    editFormRef.outputParameter = outputParameter;
    //数据附加域
    editFormRef.outColumnDatAra = this.state.outCondition ? 'datAra' : '';

    editFormRef.outColumns = outColumns.toString();
    editFormRef.outColumnsName = outColumnsName.toString();
    editFormRef.outColumnsType = outColumnsType.toString();
    editFormRef.datAraOutColumns = datAraOutColumns.toString();
    editFormRef.datAraOutColumnsName = datAraOutColumnsName.toString();
    editFormRef.datAraOutColumnsType = datAraOutColumnsType.toString();
    console.log('editFormRef-change:', editFormRef);
    this.props.saveSplitResCreate(editFormRef);
  };

  //处理联机服务调度数据
  serverDispatchTo = () => {
    if (this.props.clearRuleData?.length > 0) {
      // 当为上传了服务调度文件后
      if (this.state.showClearDispatch) {
        var dispatchDataArr: any = [];
        const dispatchData = this.dispatchFormRef.current.getFieldsValue();
        // 拼接组装对应的字段
        this.state.clearDispatchData.map((item: any, index: any) => {
          dispatchDataArr.push({
            aacCode: item?.serviceConfigVoList
              ? item?.serviceConfigVoList[5].paramVo
              : item.aacCode,
            srvName: item?.serviceConfigVoList
              ? item?.serviceConfigVoList[0].paramVo
              : item.srvName,
            srvMethod: item?.serviceConfigVoList
              ? item?.serviceConfigVoList[1].paramVo
              : item.srvMethod,
            srvVerNo: item?.serviceConfigVoList
              ? item?.serviceConfigVoList[2].paramVo
              : item.srvVerNo,
            batType: this.props.batType.value,
            chnNo: this.props.chnNo.value,
            txnCode: this.props.busCode.value,
            fileType: this.props.fileType,
            inputParameter: JSON.stringify(this.props.inputParameter),
            stepExeParameter: `{"flag":"$.[btrTaskMessage].clearCenterNo == '${dispatchData.clearCenterNo}'"}`,
            runMode: dispatchData.runMode,
            errorContinFlg: dispatchData.errorContinFlg,
            runLevel: dispatchData.runLevel,
            initialDelay: dispatchData.initialDelay,
            delay: dispatchData.delay,
            idcCode: '1',
            dcnCode: '001',
            srvLevel: '2',
            serviceType: item?.serviceConfigVoList
              ? item?.serviceConfigVoList[6].paramVo
              : item.serviceType,
            timeReviewFlag: dispatchData[`timeReviewFlag_${index}`],
            clearCenterNo: item?.serviceConfigVoList
              ? item?.serviceConfigVoList[7].paramVo
              : item.clearCenterNo,
            seqNo: item?.serviceConfigVoList ? '' : item.seqNo,
          });
        });
        const saveDispatchData = this.dispatchFormRef.current.getFieldsValue();
        this.props.dispatch({
          type: 'tableList/saveParam',
          payload: {
            id: 'saveDispatchData',
            data: saveDispatchData,
          },
        });
        this.props.saveServerDispatch(dispatchDataArr);
      }
    } else {
      var dispatchDataArr = [];
      const dispatchData = this.dispatchFormRef.current.getFieldsValue();
      const saveDispatchData = this.dispatchFormRef.current.getFieldsValue();
      this.props.dispatch({
        type: 'tableList/saveParam',
        payload: {
          id: 'saveDispatchData',
          data: saveDispatchData,
        },
      });
      dispatchData.inputParameter = JSON.stringify(this.props.inputParameter);
      dispatchData.batType = this.props.batType.value;
      dispatchData.chnNo = this.props.chnNo.value;
      dispatchData.txnCode = this.props.busCode.value;
      dispatchData.fileType = this.props.fileType;
      dispatchData.stepExeParameter = dispatchData.clearCenterNo
        ? `{"flag":"$.[btrTaskMessage].clearCenterNo == '${dispatchData.clearCenterNo}'"}`
        : `{"flag":"$.[btrTaskMessage].clearCenterNo == '002'"}`;
      console.log('dispatchData:', dispatchData);
      dispatchDataArr.push(dispatchData);
      this.props.saveServerDispatch(dispatchDataArr);
    }
  };

  //处理文件合并
  btrMergeConfigTo = () => {
    const fileData = this.fileMergeFormRef.current.getFieldsValue();
    const saveFileData = this.fileMergeFormRef.current.getFieldsValue();
    this.props.dispatch({
      type: 'tableList/saveParam',
      payload: {
        id: 'saveFileData',
        data: saveFileData,
      },
    });
    var summaryInfoConfig = new Object();
    fileData.batType = this.props.batType.value;
    fileData.chnNo = this.props.chnNo.value;
    fileData.busCode = this.props.busCode.value;
    fileData.fileType = this.props.fileType;
    for (let i = 0; i < Number(this.state.showSummary); i++) {
      if (fileData[`column${i}`]) {
        summaryInfoConfig[`${i + 1}`] = fileData[`column${i}`];
      } else {
        summaryInfoConfig[`${i + 1}`] = '';
      }
    }
    fileData.summaryInfoConfig = JSON.stringify(summaryInfoConfig);
    console.log('fileData:', fileData);
    this.props.saveBtrMergeConfig(fileData);
  };

  //保存接口传数据
  handleAddOk = () => {
    this.splitResCreateTo();
    this.serverDispatchTo();
    this.btrMergeConfigTo();
    this.splitFiles.splitFileInStorageTo();
    this.child.getClearMergeData();
    this.child.getTraFileResultData();
    this.props.skipToSec(3);
  };

  /**
   * 渲染新增文件列
   * @param conditions 对应的文件列（附加数据域）数据源
   * @param type 文件列对应的类型
   */
  renderCondition = (conditions: any, type: any) => {
    return conditions.map(item => {
      return (
        <Col span={3} offset={1}>
          <span>
            <span>
              <Input
                readOnly
                value={item.showValue}
                style={{ marginBottom: '15px', width: 150 }}
              />
              <CloseCircleOutlined
                onClick={() => this.delCondition(item.key, type)}
                style={{
                  margin: '0 5px 0 5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              />
            </span>
          </span>
        </Col>
      );
    });
  };

  //渲染结果文件列
  renderResList = () => {
    return (
      <Table
        rowKey={record => record.metadataId}
        columns={this.state.columns}
        dataSource={this.state.resCheckedColumns}
        pagination={false}
      ></Table>
    );
  };

  //渲染结果文件附加列
  renderResExtraList = () => {
    return (
      <Table
        rowKey={record => record.metadataId}
        columns={this.state.columns}
        dataSource={this.state.resCheckedExtraColumns}
        pagination={false}
      ></Table>
    );
  };

  render() {
    var newSummary = [];
    for (let i = 0; i < Number(this.state.showSummary); i++) {
      newSummary.push(
        <Col span={3} offset={1}>
          <Form.Item label={`第${i + 1}列`} name={`column${i}`}>
            <Select
              allowClear={true}
              style={{ width: '100px', marginBottom: '20px' }}
            >
              {this.state.mergeConf.map((item: any, index: any) => (
                <Option key={index} value={item.paramKey}>
                  {item.paramValue}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>,
      );
    }
    return (
      <div className={styles.batchTaskConfig}>
        <BatchNodeTable translateDisplay={this.getDisplay} />
        {/* 分片文件解析入库表单 */}
        <div style={{ display: this.props.fileListDisplay }}>
          {this.state.showSplitFileInStorage && (
            <div
              className={styles.splitFileInStorageForm}
              id="splitFileInStorage"
              style={{ display: this.state.display }}
            >
              {this.props.clearRuleData?.length > 0 ? (
                <>
                  <Row>
                    <Col span={12} offset={6}>
                      <Import
                        onRef={this.clearFilesRef}
                        fieldsFlag="3"
                        pushImportFile={this.getClearFiles}
                        sendAnalyzeData={this.sendAnalyzeData}
                      />
                    </Col>
                  </Row>

                  <Tabs defaultActiveKey="1">
                    {this.state.tableHeader.map((i, current) => {
                      {
                        return this.state.tableData.map((item, index) => {
                          if (current === index) {
                            return (
                              <Tabs.TabPane
                                tab={this.state.tableName[index]}
                                key={index}
                              >
                                <Table
                                  columns={i}
                                  dataSource={item}
                                  showHeader={false}
                                />
                              </Tabs.TabPane>
                            );
                          }
                        });
                      }
                    })}
                  </Tabs>
                  {/* 未用到此处配置，暂不展示 */}
                  <Tabs defaultActiveKey="1" style={{ display: 'none' }}>
                    {this.props.clearRuleData.map((item, index) => {
                      return (
                        <Tabs.TabPane tab={`清分${index + 1}`} key={index + 1}>
                          <SplitFileInStorage
                            onRef={this.splitFilesRef}
                            showFileTemplConfig={this.props.showFileTemplConfig}
                            isClear="0"
                          />
                        </Tabs.TabPane>
                      );
                    })}
                  </Tabs>
                </>
              ) : (
                <SplitFileInStorage
                  onRef={this.splitFilesRef}
                  showFileTemplConfig={this.props.showFileTemplConfig}
                  isClear="1"
                />
              )}
            </div>
          )}

          {/* 服务调度表单 */}
          {this.state.showServerDispatch && (
            <div
              className={styles.serverDispatchForm}
              id="serverDispatch"
              style={{ display: this.state.display }}
            >
              <Form
                {...layout}
                name="serverDispatchForm"
                validateMessages={this.validateMessages}
                ref={this.dispatchFormRef}
                scrollToFirstError={true}
                initialValues={{
                  batType: this.props.batType.label,
                  chnNo: this.props.chnNo.label,
                  txnCode: this.props.busCode.label,
                  fileType: this.props.fileType,
                }}
              >
                <Divider orientation="left" className={styles.showConfig}>
                  批次信息配置
                </Divider>
                <Row gutter={16}>
                  <Col span={7}>
                    <Form.Item
                      name="batType"
                      label="批量类型"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      name="chnNo"
                      label="渠道号"
                      rules={[
                        {
                          required: true,
                          pattern: /^[0-9]*$/,
                          message: '渠道号为纯数字',
                        },
                      ]}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      name="txnCode"
                      label="交易码"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={7}>
                    <Form.Item
                      valuePropName="checked"
                      name="fileType"
                      label="文件类型"
                      style={{ display: 'none' }}
                    >
                      <Select>
                        <Select.Option disabled value="txt">
                          txt格式
                        </Select.Option>
                        <Select.Option disabled value="csv">
                          csv格式
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} offset={6}>
                    <Import
                      onRef={this.importRef}
                      fieldsFlag="2"
                      pushImportFile={this.getImportFile}
                    />
                  </Col>
                </Row>
                <Divider orientation="left" className={styles.showConfig}>
                  服务信息配置
                </Divider>
                {this.props.clearRuleData?.length > 0 ? (
                  // this.state.showClearDispatch &&
                  <div className={styles.tabStyle}>
                    <Tabs defaultActiveKey="1">
                      {this.state.clearDispatchData.map((item, index) => {
                        return (
                          <Tabs.TabPane
                            tab={`清分服务-${
                              Object.keys(this.props.showServerDispatch)
                                .length > 0
                                ? item?.srvName
                                : item?.serviceConfigVoList[0]?.paramVo
                            }`}
                            key={index}
                          >
                            <Row>
                              <Col span={7}>
                                <Form.Item
                                  name={`serviceType_${index}`}
                                  label="服务类型"
                                >
                                  <Select
                                    onSelect={value => {
                                      if (
                                        value === 'NOTIFY' ||
                                        value === 'TIME'
                                      ) {
                                        this.setState({
                                          showTimeReviewFlag: true,
                                        });
                                      } else {
                                        this.setState({
                                          showTimeReviewFlag: false,
                                        });
                                      }
                                      console.log('选中服务类型：', value);
                                    }}
                                  >
                                    {this.state.svcType.map(
                                      (item: any, index: number) => (
                                        <Option
                                          key={index}
                                          value={item.paramKey}
                                        >
                                          {item.paramValue}
                                        </Option>
                                      ),
                                    )}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                {this.state.showTimeReviewFlag && (
                                  <Form.Item
                                    name={`timeReviewFlag_${index}`}
                                    label="定时回查标志"
                                    valuePropName="checked"
                                  >
                                    <Select>
                                      {this.state.timeReviewFlag.map(
                                        (item: any, index: number) => (
                                          <Option
                                            key={index}
                                            value={item.paramKey}
                                          >
                                            {item.paramValue}
                                          </Option>
                                        ),
                                      )}
                                    </Select>
                                  </Form.Item>
                                )}
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  name={`clearCenterNo_${index}`}
                                  label="清分中心编号"
                                >
                                  <Select>
                                    {this.state.clearCenterNo.map(
                                      (item: any, index: number) => (
                                        <Option
                                          key={index}
                                          value={item.paramKey}
                                        >
                                          {item.paramValue}
                                        </Option>
                                      ),
                                    )}
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={7}>
                                <Form.Item
                                  name={`idcCode_${index}`}
                                  label="IDC编号"
                                  rules={[
                                    {
                                      required: true,
                                      pattern: /^[0-9]*$/,
                                      message: '只能为数字',
                                    },
                                  ]}
                                >
                                  <Select>
                                    {this.state.idcCode.map(
                                      (item: any, index: number) => (
                                        <Option
                                          key={index}
                                          value={item.paramKey}
                                        >
                                          {item.paramValue}
                                        </Option>
                                      ),
                                    )}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  name={`dcnCode_${index}`}
                                  label="DCN编号"
                                  rules={[
                                    {
                                      required: true,
                                      pattern: /^[0-9]*$/,
                                      message: '只能为数字',
                                    },
                                  ]}
                                >
                                  <Select>
                                    {this.state.dcnCode.map(
                                      (item: any, index: number) => (
                                        <Option
                                          key={index}
                                          value={item.paramKey}
                                        >
                                          {item.paramValue}
                                        </Option>
                                      ),
                                    )}
                                  </Select>
                                </Form.Item>
                              </Col>

                              <Col span={7}>
                                <Form.Item
                                  name={`aacCode_${index}`}
                                  label="AAC编号"
                                  rules={[
                                    {
                                      required: true,
                                      pattern: /^[0-9]*$/,
                                      message: '只能为数字',
                                    },
                                  ]}
                                >
                                  <Input readOnly />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={7}>
                                <Form.Item
                                  name={`srvName_${index}`}
                                  label="执行服务名称"
                                  rules={[{ required: true }]}
                                >
                                  <Input readOnly />
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  name={`srvMethod_${index}`}
                                  label="执行服务方法"
                                  rules={[{ required: true }]}
                                >
                                  <Input readOnly />
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  name={`srvVerNo_${index}`}
                                  label="版本号"
                                  rules={[{ required: true }]}
                                >
                                  <Input readOnly />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  style={{ display: 'none' }}
                                  name={`srvLevel_${index}`}
                                  label="服务级别"
                                  rules={[{ required: true }]}
                                >
                                  <Select>
                                    {this.state.serviceLevel.map(
                                      (item: any, index: number) => (
                                        <Option
                                          key={index}
                                          value={item.paramKey}
                                        >
                                          {item.paramValue}
                                        </Option>
                                      ),
                                    )}
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row justify="end">
                              <Button
                                onClick={() =>
                                  this.setState({ showClearDispatch: false })
                                }
                              >
                                返回普通配置
                              </Button>
                              <Button
                                className={styles.setButton}
                                type="primary"
                                onClick={() => this.getServerInfo(item)}
                              >
                                值设置
                              </Button>
                            </Row>
                          </Tabs.TabPane>
                        );
                      })}
                    </Tabs>
                  </div>
                ) : (
                  <>
                    <Row>
                      <Col span={7}>
                        <Form.Item name="serviceType" label="服务类型">
                          <Select
                            onSelect={value => {
                              if (value === 'NOTIFY' || value === 'TIME') {
                                this.setState({ showTimeReviewFlag: true });
                              } else {
                                this.setState({ showTimeReviewFlag: false });
                              }
                              console.log('选中服务类型：', value);
                            }}
                          >
                            {this.state.svcType.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.paramKey}>
                                  {item.paramValue}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        {this.state.showTimeReviewFlag && (
                          <Form.Item
                            name="timeReviewFlag"
                            label="定时回查标志"
                            valuePropName="checked"
                          >
                            <Select>
                              {this.state.timeReviewFlag.map(
                                (item: any, index: number) => (
                                  <Option key={index} value={item.paramKey}>
                                    {item.paramValue}
                                  </Option>
                                ),
                              )}
                            </Select>
                          </Form.Item>
                        )}
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          name="clearCenterNo"
                          label="清分中心编号"
                          style={{ display: 'none' }}
                        >
                          <Select>
                            {this.state.clearCenterNo.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.paramKey}>
                                  {item.paramValue}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={7}>
                        <Form.Item
                          name="idcCode"
                          label="IDC编号"
                          rules={[
                            {
                              required: true,
                              pattern: /^[0-9]*$/,
                              message: '只能为数字',
                            },
                          ]}
                        >
                          <Select>
                            {this.state.idcCode.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.paramKey}>
                                  {item.paramValue}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          name="dcnCode"
                          label="DCN编号"
                          rules={[
                            {
                              required: true,
                              pattern: /^[0-9]*$/,
                              message: '只能为数字',
                            },
                          ]}
                        >
                          <Select>
                            {this.state.dcnCode.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.paramKey}>
                                  {item.paramValue}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          name="aacCode"
                          label="AAC编号"
                          rules={[
                            {
                              required: true,
                              pattern: /^[0-9]*$/,
                              message: '只能为数字',
                            },
                          ]}
                        >
                          <Select>
                            {this.state.aacCode.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.paramKey}>
                                  {item.paramValue}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={7}>
                        <Form.Item
                          name="srvName"
                          label="执行服务名称"
                          rules={[{ required: true }]}
                        >
                          <Select
                            showSearch
                            allowClear={true}
                            placeholder="请选择执行服务名称"
                            showArrow={true}
                            optionFilterProp="children"
                            onChange={this.changeStdSvcInd}
                            onSearch={this.getStdSvcIndByAac}
                            onFocus={this.getStdSvcIndByAac}
                            filterOption={(input, option: any) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                          >
                            {this.state.srvName.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.serviceName}>
                                  {item.serviceName}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          name="srvMethod"
                          label="执行服务方法"
                          rules={[{ required: true }]}
                        >
                          <Select
                            showSearch
                            allowClear={true}
                            placeholder="请选择执行服务方法"
                            showArrow={true}
                            optionFilterProp="children"
                            onChange={this.changeStdIntfInd}
                            filterOption={(input, option: any) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {this.state.srvMethod.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.interfaceName}>
                                  {item.interfaceName}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          name="srvVerNo"
                          label="版本号"
                          rules={[{ required: true }]}
                        >
                          <Select
                            showSearch
                            allowClear={true}
                            placeholder="请选择对应版本号"
                            showArrow={true}
                            optionFilterProp="children"
                            // onChange={this.changeVersionNo}
                            onSelect={this.changeVersionNo}
                            filterOption={(input, option: any) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {this.state.versionNo.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.version}>
                                  {item.version}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          style={{ display: 'none' }}
                          name="srvLevel"
                          label="服务级别"
                          rules={[{ required: true }]}
                        >
                          <Select>
                            {this.state.serviceLevel.map(
                              (item: any, index: number) => (
                                <Option key={index} value={item.paramKey}>
                                  {item.paramValue}
                                </Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    {this.state.showClearDispatch &&
                      this.state.clearDispatchData.map((item, index) => {
                        return (
                          <Row justify="end">
                            <Button
                              className={styles.setButton}
                              type="primary"
                              onClick={() => this.getServerInfo(item)}
                            >
                              值设置
                            </Button>
                          </Row>
                        );
                      })}
                  </>
                )}

                <Divider orientation="left" className={styles.showConfig}>
                  运行信息配置
                </Divider>
                <Row gutter={16}>
                  <Col span={7}>
                    <Form.Item name="runMode" label="运行模式">
                      <Radio.Group>
                        <Radio value="D">日间模式</Radio>
                        <Radio value="P">夜间模式</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name="errorContinFlg" label="错误续跑标志">
                      <Radio.Group>
                        <Radio value="Y">允许</Radio>
                        <Radio value="N">不允许</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name="runLevel" label="运行等级">
                      <Select>
                        {this.state.runLevel.map((item: any, index: number) => (
                          <Option key={index} value={item.paramKey}>
                            {item.paramValue}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={7}>
                    <Form.Item name="retryTimes" label="重试最大次数">
                      <InputNumber defaultValue={0}></InputNumber>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name="intervalDays" label="重试相隔最大天数">
                      <InputNumber defaultValue={0}></InputNumber>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name="receiptDays" label="重试天数预留">
                      <InputNumber defaultValue={0}></InputNumber>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={7}>
                    <Form.Item
                      name="initialDelay"
                      label="初始延时时间"
                      style={{ display: 'none' }}
                    >
                      <InputNumber></InputNumber>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      name="delay"
                      label="延时时间"
                      style={{ display: 'none' }}
                    >
                      <InputNumber></InputNumber>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              {this.state.showSearchRes && (
                <ServiceTaskNode
                  showModal={this.getMoadl}
                  searchResSetVal={this.state.searchResSetVal}
                  detailFiles={this.props.importData.detailFiles}
                  defaultDispatch={this.props.showServerDispatch}
                />
              )}
            </div>
          )}

          {this.state.showSplitResCreate && (
            <div
              className={styles.splitResCreateForm}
              id="splitResCreate"
              style={{ display: this.state.display }}
            >
              <Form
                {...layout}
                name="nest-messages"
                validateMessages={this.validateMessages}
                ref={this.editFormRef}
                scrollToFirstError={true}
              >
                <Row gutter={16}>
                  <Col span={7}>
                    <Form.Item
                      name="outDelimiters"
                      label="结果文件内容分隔"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {this.state.separator.map(
                          (item: any, index: number) => (
                            <Option key={index} value={item.paramKey}>
                              {item.paramValue}
                            </Option>
                          ),
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label="结果文件列"
                      // name=""
                      rules={[{ required: true }]}
                    >
                      <Popover
                        overlayInnerStyle={{
                          minWidth: '400px',
                          minHeight: '50vh',
                          height: '100%',
                        }}
                        content={
                          <div>
                            <Search
                              placeholder="请输入中文或英文以检索"
                              onSearch={this.searchinColumns}
                              style={{ marginBottom: '15px' }}
                            />
                            <Scrollbars autoHeightMax={410} autoHide autoHeight>
                              <Form.Item
                                name="outColumns"
                                rules={[{ required: true }]}
                              >
                                <Checkbox.Group
                                  onChange={this.resCheckbox}
                                  key="1"
                                  defaultValue={this.state.defaultData}
                                >
                                  {this.state.treeResData.map((item, index) => {
                                    return (
                                      <div>
                                        <Checkbox
                                          value={item.seqNo}
                                          key={item.seqNo}
                                        >
                                          {item.chineseName}({item.metadataId})
                                        </Checkbox>
                                        <br />
                                      </div>
                                    );
                                  })}
                                </Checkbox.Group>
                              </Form.Item>
                            </Scrollbars>
                            <Pagination
                              style={{ marginTop: '15px' }}
                              onChange={(page, pageSize) =>
                                this.onChange(page, pageSize)
                              }
                              showSizeChanger={false}
                              pageSize={this.state.pageSize}
                              total={this.state.total}
                              current={this.state.pageNum}
                            />
                            <Button
                              type="primary"
                              onClick={() => this.saveInColumns('Res')}
                              className={styles.saveButton}
                              style={{ left: '230px', margin: '15px 0' }}
                            >
                              保存
                            </Button>
                            <Button
                              onClick={() => this.hide()}
                              className={styles.cancelButton}
                              style={{
                                left: '245px',
                                margin: '15px 20px 0 0',
                              }}
                            >
                              取消
                            </Button>
                          </div>
                        }
                        title="结果文件列信息"
                        placement="rightTop"
                        trigger="click"
                        visible={this.state.resAraClicked}
                        onVisibleChange={this.handleResClickChange}
                      >
                        <img
                          onClick={this.showinColumns}
                          src={require('@/assets/common/new.png')}
                        />
                      </Popover>
                    </Form.Item>
                  </Col>
                </Row>
                {(this.state.showInColumnsTable ||
                  this.state.showInColumnsExtraTable) && (
                  <>
                    <Row gutter={16}>
                      <Col span={22} offset={2}>
                        <Form.Item
                          labelCol={{ span: 2 }}
                          wrapperCol={{ span: 20 }}
                        >
                          {this.renderResList()}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Modal
                      title="参数设置"
                      width="60%"
                      destroyOnClose
                      maskClosable={false}
                      centered={true}
                      onOk={this.handleOk}
                      onCancel={this.onClose}
                      visible={this.state.visible}
                      style={{ overflow: 'auto' }}
                    >
                      <Row>
                        <Col
                          span={6}
                          style={{
                            border: '1px solid #eee',
                            height: '400px',
                            overflow: 'auto',
                            margin: 10,
                          }}
                        >
                          <Tag color="#108ee9" style={{ marginBottom: 10 }}>
                            节点服务
                          </Tag>
                          <Spin spinning={this.state.loadingForSourceTree}>
                            <Tree
                              defaultSelectedKeys={['uuid-1']}
                              expandedKeys={this.state.expandedKeys}
                              treeData={this.state.treeDataForSource}
                              onSelect={this.onSelectForSourceTree}
                            />
                          </Spin>
                          <DoubleRightOutlined
                            style={{
                              position: 'absolute',
                              top: 180,
                              right: 0,
                              fontSize: 18,
                            }}
                          />
                        </Col>

                        {/* 如果选中的来源不是“自定义值”，就显示“参数类型/报文类型/参数” */}
                        {this.state.currentSource &&
                        this.state.currentSource !== '自定义信息' ? (
                          <>
                            <Col
                              span={6}
                              style={{
                                border: '1px solid #eee',
                                height: '400px',
                                overflow: 'auto',
                                margin: 10,
                              }}
                            >
                              <Tag color="#2db7f5" style={{ marginBottom: 10 }}>
                                {this.state.currentSource}
                              </Tag>
                              <Tree
                                treeData={this.state.secondListData}
                                onSelect={this.onSelectForParamType}
                              />
                              <DoubleRightOutlined
                                style={{
                                  position: 'absolute',
                                  top: 180,
                                  right: 0,
                                  fontSize: 18,
                                }}
                              />
                            </Col>

                            {this.state.selectResData &&
                            this.state.currentSource === '批量交易结果返回' ? (
                              <>
                                <Col
                                  span={5}
                                  style={{
                                    border: '1px solid #eee',
                                    height: '400px',
                                    overflow: 'auto',
                                    margin: 10,
                                  }}
                                >
                                  <Tag
                                    color="#2db7f5"
                                    style={{ marginBottom: 10 }}
                                  >
                                    {this.state.thirdListTag}
                                  </Tag>

                                  <Tree
                                    treeData={this.state.thirdListData}
                                    onSelect={this.onSelectForMessageType}
                                  />
                                </Col>
                                <Col
                                  span={5}
                                  style={{
                                    border: '1px solid #eee',
                                    height: '400px',
                                    overflow: 'auto',
                                    margin: 10,
                                  }}
                                >
                                  <Tag
                                    color="#2db7f5"
                                    style={{ marginBottom: 10 }}
                                  >
                                    {this.state.fourthListTag}
                                  </Tag>

                                  <Tree
                                    treeData={this.state.fourthListData}
                                    onSelect={this.onSelectFourthColumn}
                                  />
                                </Col>
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        ) : (
                          <Col
                            span={6}
                            style={{
                              border: '1px solid #eee',
                              height: '400px',
                              margin: 10,
                            }}
                          >
                            <Tag color="#2db7f5" style={{ marginBottom: 10 }}>
                              自定义信息设置
                            </Tag>
                            <br />
                            <Input
                              onChange={this.customValue}
                              placeholder="请输入自定义信息"
                            />
                          </Col>
                        )}
                      </Row>
                    </Modal>
                  </>
                )}
                <Row gutter={16}>
                  <Col span={7}>
                    <Form.Item
                      valuePropName="checked"
                      name="outColumnDatAra"
                      label="附加数据域"
                    >
                      <Switch onChange={this.changeOutCondition}></Switch>
                    </Form.Item>
                  </Col>
                </Row>
                {this.state.outCondition && (
                  <>
                    <Row gutter={16}>
                      <Col span={7}>
                        <Form.Item label="结果文件附加数据">
                          <Popover
                            overlayInnerStyle={{
                              minWidth: '400px',
                              minHeight: '50vh',
                              height: '100%',
                            }}
                            content={
                              <div>
                                <Search
                                  placeholder="请输入中文或英文以检索"
                                  onSearch={this.searchinColumns}
                                  style={{ marginBottom: '15px' }}
                                />
                                <Scrollbars
                                  autoHeightMax={410}
                                  autoHide
                                  autoHeight
                                >
                                  <Form.Item name="datAraOutColumns">
                                    <Checkbox.Group
                                      onChange={this.resExtraCheckbox}
                                      key="1"
                                      defaultValue={this.state.defaultData}
                                    >
                                      {this.state.treeResExtraData.map(
                                        (item, index) => {
                                          return (
                                            <div>
                                              <Checkbox
                                                value={item.seqNo}
                                                key={item.seqNo}
                                              >
                                                {item.chineseName}(
                                                {item.metadataId})
                                              </Checkbox>
                                              <br />
                                            </div>
                                          );
                                        },
                                      )}
                                    </Checkbox.Group>
                                  </Form.Item>
                                </Scrollbars>
                                <Pagination
                                  style={{ marginTop: '15px' }}
                                  onChange={(page, pageSize) =>
                                    this.onChange(page, pageSize)
                                  }
                                  showSizeChanger={false}
                                  pageSize={this.state.pageSize}
                                  total={this.state.total}
                                  current={this.state.pageNum}
                                />
                                <Button
                                  type="primary"
                                  className={styles.saveFileButton}
                                  onClick={() => this.saveInColumns('ResExtra')}
                                  style={{ left: '230px', margin: '15px 0' }}
                                >
                                  保存
                                </Button>
                                <Button
                                  onClick={() => this.hide()}
                                  className={styles.cancelButton}
                                  style={{
                                    left: '245px',
                                    margin: '15px 20px 0 0',
                                  }}
                                >
                                  取消
                                </Button>
                              </div>
                            }
                            title="结果文件附加域列信息"
                            placement="rightTop"
                            trigger="click"
                            visible={this.state.resExtraClicked}
                            onVisibleChange={this.handleResExtraClickChange}
                          >
                            <img
                              onClick={this.showinColumns}
                              src={require('@/assets/common/new.png')}
                            />
                          </Popover>
                        </Form.Item>
                      </Col>
                    </Row>
                    {this.state.showInColumnsExtraTable && (
                      <Row gutter={16}>
                        <Col span={22} offset={2}>
                          <Form.Item
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 20 }}
                          >
                            {this.renderResExtraList()}
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Form>
            </div>
          )}
          {/* 文件排序合并配置项 */}
          <div
            id="fileSortMerge"
            className={styles.fileSortMerge}
            style={{ display: 'none' }}
          >
            <Form
              {...layout}
              name="fileSortMergeForm"
              validateMessages={this.validateMessages}
              ref={this.fileMergeFormRef}
              scrollToFirstError={true}
            >
              <Divider orientation="left" className={styles.showConfig}>
                批次信息配置
              </Divider>
              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item
                    name="batType"
                    label="批量类型"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input defaultValue={this.props.batType.label} readOnly />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="chnNo"
                    label="渠道号"
                    rules={[
                      {
                        required: true,
                        pattern: /^[0-9]*$/,
                        message: '渠道号为纯数字',
                      },
                    ]}
                  >
                    <Input defaultValue={this.props.chnNo.label} readOnly />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="busCode"
                    label="业务代码"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input defaultValue={this.props.busCode.label} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item
                    name="fileType"
                    label="文件类型"
                    style={{ display: 'none' }}
                  >
                    <Select defaultValue={this.props.fileType}>
                      <Select.Option disabled value="txt">
                        txt格式
                      </Select.Option>
                      <Select.Option disabled value="csv">
                        csv格式
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left" className={styles.showConfig}>
                汇总行配置规则
              </Divider>
              <Row>
                <Col span={7}>
                  <Form.Item name="summaryDelemiters" label="汇总行分隔符">
                    <Select>
                      {this.state.separator.map((item: any, index: number) => (
                        <Option key={index} value={item.paramKey}>
                          {item.paramValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name={'allColumns'}
                    label="汇总行列数"
                    rules={[
                      {
                        required: true,
                        pattern: /^[0-9]*$/,
                        message: '只能为数字',
                      },
                    ]}
                  >
                    <Input
                      maxLength={2}
                      onBlur={e => this.createSummary(e)}
                      placeholder="输入汇总行的列数，如：17"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>{this.state.showSummary && newSummary}</Row>
              <Divider orientation="left" className={styles.showConfig}>
                分片文件合并规则
              </Divider>
              <Row>
                <Col span={7}>
                  <Form.Item
                    name="fileMerge"
                    label="合并规则"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      <Radio value="simpleMerge">
                        简单合并&nbsp;&nbsp;
                        <Tooltip title={'将分片文件明细拼接合并'}>
                          <ExclamationCircleOutlined className={styles.icons} />
                        </Tooltip>
                      </Radio>
                      <Radio value="ruleMerge">
                        规则合并&nbsp;&nbsp;
                        <Tooltip title={'按具体复杂规则合并'}>
                          <ExclamationCircleOutlined className={styles.icons} />
                        </Tooltip>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          {/* 结果文件融合 */}
          <div
            id="resultFileMerge"
            className={styles.resultFileMerge}
            style={{ display: 'none' }}
          >
            {/* 结果文件融合组件 */}
            <ResultFileMerge onRef={ref => (this.child = ref)} />
          </div>
        </div>

        <Button
          className={styles.addNewBatch}
          type="primary"
          onClick={this.handleAddOk}
          style={{ marginTop: this.props.display ? '40px' : '24px' }}
        >
          下一步
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    batType,
    busCode,
    chnNo,
    fileType,
    display,
    param,
    importData,
    fileColumns,
    dataAraFileColumns,
    inputParameter,
    fileListDisplay,
    current,
    clearRuleData,
    resDefaultData,
  } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
    fileType,
    display,
    param,
    importData,
    fileColumns,
    dataAraFileColumns,
    inputParameter,
    fileListDisplay,
    current,
    clearRuleData,
    resDefaultData,
  };
};

export default connect(mapStateToProps)(EngineServerSet);
