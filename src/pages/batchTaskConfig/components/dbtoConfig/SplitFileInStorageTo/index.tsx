import {
  Form,
  Input,
  Row,
  Select,
  Col,
  Radio,
  Button,
  Popover,
  Pagination,
  Switch,
  Checkbox,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import React from 'react';
import styles from './index.less';
import { getCommonCode, getSerDataDicList } from '../../../service';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { cloneDeep } from 'lodash';

const { Option } = Select;
const { Search } = Input;

// 表单标签和展示内容所占比
const layout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 },
};

// 文件列数据
var conditionArr: any = [];

// 文件列附加数据域数据
var conditionArrData: any = [];

// 当前的文件列展示数据的条数
var numCounter = 0;

// 当前的文件列附加域展示数据的条数
var numExtraCounter = 0;

// 结果文件融合节点配置组件
class SplitFileInStorage extends React.Component {
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
  storageFormRef: any = React.createRef();
  state = {
    //文件内容分割符字段数组
    separator: [],
    showSummary: '',
    //数据分割符
    showInDelemiters: false,
    showDatAraInDelimiters: false,
    //显示定时回查标志
    showTimeReviewFlag: false,
    //显示搜索结果
    showSearchRes: false,
    isClicked: false,
    isDatAraClicked: false,
    isResAraClicked: false,
    isResExtraClicked: false,
    isHovered: false,
    isDatAraHovered: false,
    // 是否存在附加域
    isDatAraInColumns: false,
    isDatAraOutColumns: false,
    showSplitFileInStorage: true,
    //文件列选中
    isCheck: false,
    checkboxData: [],
    //附加域选择框
    isDatAraCheck: false,
    datAraCheckboxData: [],
    resCheckboxData: [],

    defaultData: [],
    //文件列选中数据
    fileColumnsData: [],
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
    display: 'none',
    total: '',
    pageNum: 1,
    pageSize: '',
    visible: false,
  };

  componentDidMount() {
    // console.log(this.props.oldBatInfo);
    this.props.onRef(this);
    this.fetchCommonData();
    this.setEcho();
  }

  //获取公共数据
  fetchCommonData = () => {
    //获取文件内容分割符
    this.getCommon('separator');
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

  //设置当前页回显配置项
  setEcho = async () => {
    //当用户查看or编辑对应批次配置时的回显数据
    if (Object.keys(this.props.showFileTemplConfig).length > 0) {
      //删除后端传回数据的三个key值
      delete this.props.showFileTemplConfig.busCode;
      delete this.props.showFileTemplConfig.chnNo;
      delete this.props.showFileTemplConfig.batType;
      if (this.props.clearRuleData.length === 0) {
        this.storageFormRef.current.setFieldsValue(
          this.props.showFileTemplConfig,
        );
      }
      this.setDefaultFileValue();
      var inColumnDatAra = this.props.showFileTemplConfig.inColumnDatAra;
      var outColumnDatAra = this.props.showFileTemplConfig.outColumnDatAra;
      var datAraParserType = this.props.showFileTemplConfig.datAraParserType;
      var parserType = this.props.showFileTemplConfig.parserType;
      this.setState(
        {
          isDatAraInColumns: inColumnDatAra === 'datAra' ? true : false,
          isDatAraOutColumns: outColumnDatAra === 'datAra' ? true : false,
          showInDelemiters: parserType === 'FIXED' ? false : true,
          showDatAraInDelimiters: datAraParserType === 'FIXED' ? false : true,
        },
        () => {
          this.storageFormRef.current.setFieldsValue({
            ...this.props.showFileTemplConfig,
          });
        },
      );
    }
    //上一步数据回显
    else if (this.props.param.saveStorageFormRef) {
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
      if (this.props.clearRuleData.length === 0) {
        this.storageFormRef.current.setFieldsValue(
          this.props.param.saveStorageFormRef,
        );
      }
      this.setPreNextData(this.props);
      var datAraParserType = this.props.param.saveStorageFormRef
        .datAraParserType;
      var parserType = this.props.param.saveStorageFormRef.parserType;
      this.setState({
        isDatAraInColumns: inColumnDatAra === 'datAra' ? true : false,
        isDatAraOutColumns: outColumnDatAra === 'datAra' ? true : false,
        showInDelemiters: parserType === 'FIXED' ? false : true,
        showDatAraInDelimiters: datAraParserType === 'FIXED' ? false : true,
      });
    } //固定回显
    else {
      if (await this.props.importData.detailFiles) {
        this.setDefaultImport();
      }
      if (this.state.showDatAraInDelimiters) {
        if (this.props.clearRuleData.length === 0) {
          this.storageFormRef.current.setFieldsValue({
            datAraInDelimiters: '|',
          });
        }
      } else {
        if (this.props.clearRuleData.length === 0) {
          this.storageFormRef.current.setFieldsValue({
            datAraInDelimiters: undefined,
          });
        }
      }
      this.storageFormRef.current.setFieldsValue({
        parserType: 'VARIABLE',
        templateName: this.props.busCode
          ? `${this.props.busCode.label.split('(')[0]}模板`
          : '',
        datAraParserType: 'VARIABLE',
      });
      this.setState(
        {
          showInDelemiters: true,
          showDatAraInDelimiters: true,
        },
        () => {
          this.storageFormRef.current.setFieldsValue({
            inDelemiters: '|',
            datAraInDelimiters: '|',
          });
        },
      );
      if (await this.props.importData.detailFiles) {
        this.setDefaultImport();
      }
    }
  };

  //设置文件下载拆分及结果文件列时文件列的回显值(编辑时的回显)
  setDefaultFileValue = () => {
    this.getInColumns();
    var inColumns = this.props.showFileTemplConfig.inColumns.split(',');
    var inColumnsName = this.props.showFileTemplConfig.inColumnsName.split(',');
    var datAraInColumns = this.props.showFileTemplConfig.datAraInColumns.split(
      ',',
    );
    var datAraInColumnsName = this.props.showFileTemplConfig.datAraInColumnsName.split(
      ',',
    );
    // 解析编辑or查看文件列与文件列附加域的回显展示数据
    var valueArr: any = [];
    var datAraInColumnsData: any = [];
    inColumns.map((item: any, index: any) => {
      inColumnsName.map((i: any, num: any) => {
        if (index === num) {
          valueArr.push({
            key: index,
            showValue: i,
            showKey: item,
          });
        }
      });
    });
    this.setState(
      {
        fileColumnsData: valueArr,
      },
      () => {
        this.renderCondition(this.state.fileColumnsData, 'File');
      },
    );

    // 可能不存在对应的文件列附加数据域数据
    datAraInColumns?.map((item: any, index: any) => {
      datAraInColumnsName?.map((i: any, num: any) => {
        if (index === num) {
          datAraInColumnsData.push({
            key: index,
            showValue: i,
            showKey: item,
          });
        }
      });
    });
    this.setState(
      {
        datAraInColumns: datAraInColumnsData,
      },
      () => {
        this.renderCondition(this.state.datAraInColumns, 'Extra');
      },
    );
    this.dealFileColumns();
  };

  //若有导入数据则自动填充至各表单
  setDefaultImport = async () => {
    var detailFiles = await cloneDeep(this.props.importData.detailFiles);
    console.log(detailFiles);
    //文件列文件字段导入
    var fileColumnsData = detailFiles.uploadDetailFilesList.map((item: any) => {
      return {
        key: item.seqNo,
        showValue: item.fieldName,
        showKey: item.field,
      };
    });
    //设置文件列附加域按钮显示
    if (detailFiles.uploadDetailFilesDatAraList.length > 0) {
      this.storageFormRef.current.setFieldsValue({
        inColumnDatAra: true,
      });
      this.setState({
        isDatAraInColumns: true,
      });
    }
    //文件列附加域字段导入
    var datAraInColumns = detailFiles.uploadDetailFilesDatAraList.map(
      (item: any) => {
        return {
          key: item.seqNo,
          showValue: item.fieldName,
          showKey: item.field,
        };
      },
    );
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

    this.dealFileColumns();
    this.setState({
      showSummary: detailFiles.downloadFileSummaryList.length,
      fileColumnsData,
      datAraInColumns,
      resCheckedExtraColumns,
    });
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
    //     fileColumnsData: valueArr,
    // })
  };

  // 处理文件列/附加数据列数据
  dealFileColumns = () => {
    this.dealFileColumnsData();
    this.dealDatAraInColumns();
  };

  //处理文件列对应数据（会在配置结果文件列中值设置中用到）
  dealFileColumnsData = async () => {
    const fileColumns: any = [];
    if (this.state.fileColumnsData.length > 0) {
      var fileColumnsData = cloneDeep(this.state.fileColumnsData);
      fileColumnsData.map(item => {
        //参数设置需要的数据
        fileColumns.push({
          title: item.showValue,
          key: item.showKey,
        });
      });
      console.log('fileColumns', fileColumns);
      this.setState({
        fileColumns,
      });
      this.props.dispatch({
        type: 'tableList/saveFileColumns',
        payload: {
          fileColumns,
        },
      });
      // 当对相应的批量进行查看or编辑时
      if (Object.keys(this.props.showFileTemplConfig).length > 0) {
        numCounter = this.state.fileColumnsData.length;
      }
      // 当存在导入数据时，将导入的数据中的数据域（类型为fileData）的长度赋予计数器
      if (await this.props.importData.detailFiles) {
        numCounter = this.state.fileColumnsData.length;
      }
      if (numCounter === fileColumns.length) {
        return;
      }
    }
    requestAnimationFrame(this.dealFileColumnsData);
  };

  //处理文件列附加域
  dealDatAraInColumns = async () => {
    const dataAraFileColumns: any = [];
    if (this.state.datAraInColumns.length > 0) {
      var datAraInColumns = cloneDeep(this.state.datAraInColumns);
      datAraInColumns.map(item => {
        dataAraFileColumns.push({
          title: item.showValue,
          key: item.showKey,
        });
      });
      this.setState({
        dataAraFileColumns,
      });
      this.props.dispatch({
        type: 'tableList/saveDataAraFileColumns',
        payload: {
          dataAraFileColumns,
        },
      });
      console.log(numExtraCounter);
      // 当对相应的批量进行查看or编辑时
      if (Object.keys(this.props.showFileTemplConfig).length > 0) {
        numExtraCounter = this.state.datAraInColumns.length;
      }
      // 当存在导入数据时，将导入的数据中的附加数据域（类型为datAra）的长度赋予计数器
      if (await this.props.importData.detailFiles) {
        numExtraCounter = this.state.datAraInColumns.length;
      }
      if (numExtraCounter === dataAraFileColumns.length) {
        return;
      }
    }
    requestAnimationFrame(this.dealDatAraInColumns);
  };

  /**
   * 通过不同的type来展示数据分隔符显示状态
   * @param type 文件分隔符的类型
   */
  setInDelemiters = type => {
    if (type === 'fixed') {
      this.setState(
        {
          showInDelemiters: false,
        },
        () => {
          if (
            this.props.importData.detailFiles &&
            this.props.importData.detailFiles.uploadDetailFilesList
          ) {
            var inDelimiters: any = [];
            var detailFiles = cloneDeep(this.props.importData.detailFiles);
            detailFiles.uploadDetailFilesList.map((item: any) => {
              inDelimiters.push(item.length.split('.')[0]);
            });
            console.log('inDelimiters', inDelimiters.toString());
            this.storageFormRef.current.setFieldsValue({
              inDelemiters: inDelimiters.toString(),
            });
          } else {
            this.storageFormRef.current.setFieldsValue({
              inDelimiters: undefined,
            });
          }
        },
      );
    } else {
      this.setState(
        {
          showInDelemiters: true,
        },
        () => {
          this.storageFormRef.current.setFieldsValue({
            inDelemiters: '|',
          });
        },
      );
    }
  };

  //设置数据附加域分隔符显示状态
  setDatAraInDelimiters = type => {
    if (type === 'fixed') {
      this.setState(
        {
          showDatAraInDelimiters: false,
        },
        () => {
          if (
            this.props.importData.detailFiles &&
            this.props.importData.detailFiles.uploadDetailFilesDatAraList
          ) {
            var datAraInDelimiters: any = [];
            var detailFiles = cloneDeep(this.props.importData.detailFiles);
            detailFiles.uploadDetailFilesDatAraList.map((item: any) => {
              console.log(item);

              datAraInDelimiters.push(item.length.split('.')[0]);
            });
            console.log('datAraInDelimiters', datAraInDelimiters.toString());

            this.storageFormRef.current.setFieldsValue({
              datAraInDelimiters: datAraInDelimiters.toString(),
            });
            console.log(this.storageFormRef.current.getFieldsValue());
          } else {
            this.storageFormRef.current.setFieldsValue({
              datAraInDelimiters: undefined,
            });
          }
        },
      );
    } else {
      this.setState(
        {
          showDatAraInDelimiters: true,
        },
        () => {
          this.storageFormRef.current.setFieldsValue({
            datAraInDelimiters: '|',
          });
        },
      );
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
          total: res.body.total,
          pageNum: res.body.pageNum,
          pageSize: res.body.pageSize,
        });
      }
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

  //设置文件列展示
  handleClickChange = (visible: any) => {
    this.setState({
      isClicked: visible,
      isHovered: false,
    });
  };

  // 点击展示文件列信息
  showinColumns = () => {
    console.log(this.state.checkboxData);
    this.getInColumns();
  };

  //打开数据附加域
  handleDateClickChange = (visible: any) => {
    this.setState({
      isDatAraClicked: visible,
      isDatAraHovered: false,
    });
  };

  // 是否展示附加域
  changeCondition = (value: any) => {
    console.log(value);
    this.setState({
      isDatAraInColumns: value,
    });
  };

  //打开文件列
  hide = () => {
    this.setState({
      isResAraClicked: false,
      isResExtraClicked: false,
      isDatAraClicked: false,
      isClicked: false,
      isHovered: false,
    });
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
          total: res.body.total,
          pageNum: res.body.pageNum,
          pageSize: res.body.pageSize,
        });
      }
    });
  };

  //结果文件列保存
  saveInColumns = (type: any) => {
    this.saveInColumnsInfo(type);
  };

  /**
   * 保存文件列信息
   * @param type 文件列对应的类型
   */
  saveInColumnsInfo = async (type: any) => {
    switch (type) {
      //保存文件列信息
      case 'File':
        for (let item of this.state.checkboxData) {
          this.addCondition(item, type);
        }
        this.dealFileColumns();
        conditionArr = [];
        this.setState({
          isClicked: false,
        });
        break;
      //保存附加文件列信息
      case 'Extra':
        for (let item of this.state.datAraCheckboxData) {
          this.addCondition(item, type);
        }
        this.dealFileColumns();
        this.setState({
          isDatAraClicked: false,
        });
        conditionArrData = [];
        break;
    }
  };

  /**
   * 新增对应的文件列
   * @param item 选中文件列数据对应的数组
   * @param type 对应的文件列类型
   */
  addCondition = (item: any, type: any) => {
    switch (type) {
      case 'File':
        var fileColumnsData = cloneDeep(this.state.fileColumnsData);
        if (this.state.fileColumnsData.length > 0) {
          for (let i in this.state.treeData) {
            if (this.state.treeData[i].seqNo == item) {
              // 当选中后获取文件列对应的信息
              var showValue = this.state.treeData[i].chineseName;
              var showKey = this.state.treeData[i].metadataId;
              var showType = this.state.treeData[i].type;
              // 组装相应的文件列附加域数据类型
              conditionArr.push({
                key: item,
                showValue: showValue,
                showKey: showKey,
                showType: showType,
              });
              let newobj = {};
              //判断前后文件列的区别，并去重
              conditionArr = conditionArr.reduce((preVal, curVal) => {
                newobj[curVal.key]
                  ? ''
                  : (newobj[curVal.key] = preVal.push(curVal));
                return preVal;
              }, []);
              fileColumnsData = [...fileColumnsData, ...conditionArr];
              fileColumnsData = this.removeDup(fileColumnsData);
              console.log('fileColumnsData', fileColumnsData);
              numCounter = fileColumnsData.length;
              //直接将旧的替换成新的
              this.setState({
                fileColumnsData,
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
                  fileColumnsData: [
                    ...this.state.fileColumnsData,
                    ...conditionArr,
                  ],
                },
                () => {
                  numCounter = this.state.fileColumnsData.length;
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
              // 组装相应的文件列附加域数据类型
              conditionArrData.push({
                key: item,
                showValue: showValue,
                showKey: showKey,
                showType: showType,
              });
              let newobj = {};
              //判断前后文件列的区别，并去重
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
    }
  };

  /**
   * 渲染新增的文件列
   * @param conditions 对应的文件列数据源
   * @param type 对应的文件列类型
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

  /**
   * 删除对应选中的文件列渲染
   * @param key 对应的文件列的key值（seqNo值）
   * @param type 对应的文件列类型
   */
  delCondition = (key: any, type: any) => {
    //删除条件
    switch (type) {
      //文件列
      case 'File':
        console.log('this.state.fileColumnsData:', this.state.fileColumnsData);
        const fileColumnsData = this.state.fileColumnsData.filter(item => {
          return item.key != key;
        });
        const checkboxData = this.state.checkboxData.filter(item => {
          return item != key;
        });
        console.log(
          'fileColumnsData',
          fileColumnsData,
          'checkboxData',
          checkboxData,
        );
        this.setState({
          fileColumnsData,
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
    }
  };

  //处理分片文件下载解析数据
  splitFileInStorageTo = () => {
    if (this.props.isClear === '1') {
      const storageFormRef = this.storageFormRef.current.getFieldsValue();
      const saveStorageFormRef = this.storageFormRef.current.getFieldsValue();
      this.props.dispatch({
        type: 'tableList/saveParam',
        payload: {
          id: 'saveStorageFormRef',
          data: saveStorageFormRef,
        },
      });
      storageFormRef.templateNo = `${this.props.chnNo.value}${this.props.busCode.value}${this.props.batType.value}${this.props.fileType}`;
      const inColumnsName: any = [];
      const inColumnsType: any = [];
      const inColumns: any = [];
      const datAraInColumns: any = [];
      const datAraInColumnsName: any = [];
      const datAraInColumnsType: any = [];
      if (this.state.fileColumnsData.length > 0) {
        var fileColumnsData = cloneDeep(this.state.fileColumnsData);
        fileColumnsData.map(item => {
          //参数设置需要的数据
          inColumns.push(item.showKey);
          inColumnsName.push(item.showValue);
          inColumnsType.push(item.showType);
        });
      }
      if (this.state.datAraInColumns.length > 0) {
        var datAraData = cloneDeep(this.state.datAraInColumns);
        datAraData.map(item => {
          datAraInColumns.push(item.showKey);
          datAraInColumnsName.push(item.showValue);
          datAraInColumnsType.push(item.showType);
        });
      }
      storageFormRef.inColumnDatAra = this.state.isDatAraInColumns
        ? 'datAra'
        : '';
      storageFormRef.inColumns = inColumns.toString();
      storageFormRef.inColumnsName = inColumnsName.toString();
      storageFormRef.inColumnsType = inColumnsType.toString();
      storageFormRef.datAraInColumns = datAraInColumns.toString();
      storageFormRef.datAraInColumnsName = datAraInColumnsName.toString();
      storageFormRef.datAraInColumnsType = datAraInColumnsType.toString();
      //新增批量类型区分标志
      storageFormRef.batTypeFlag = this.props.batType.key;

      this.props.dispatch({
        type: 'tableList/saveParam',
        payload: {
          id: 'btrStorageFormData',
          data: storageFormRef,
        },
      });
      console.log('storageFormRef', storageFormRef);
    }
  };

  render() {
    return (
      <>
        <Form
          {...layout}
          name="splitFileInStorageForm"
          validateMessages={this.validateMessages}
          ref={this.storageFormRef}
          scrollToFirstError={true}
          initialValues={{}}
          className={styles.storageForm}
        >
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item
                name="parserType"
                label="解析类型"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio
                    value="FIXED"
                    onClick={() => this.setInDelemiters('fixed')}
                  >
                    定长
                  </Radio>
                  <Radio
                    value="VARIABLE"
                    onClick={() => this.setInDelemiters('variable')}
                  >
                    变长
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="inDelemiters"
                label="文件内容分隔"
                rules={[{ required: true }]}
              >
                {this.state.showInDelemiters ? (
                  <Select>
                    {this.state.separator.map((item: any, index: any) => (
                      <Option key={index} value={item.paramKey}>
                        {item.paramValue}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input placeholder="定长配置如： 2，2，4"></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="templateName"
                label="模板名称"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item label="文件列信息" rules={[{ required: true }]}>
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
                        <Form.Item name="inColumns">
                          <Checkbox.Group onChange={this.Checkbox} key="1">
                            {this.state.treeData.map((item, index) => {
                              return (
                                <div>
                                  <Checkbox value={item.seqNo} key={item.seqNo}>
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
                        onClick={() => this.saveInColumns('File')}
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
                  title="文件列信息"
                  placement="rightTop"
                  trigger="click"
                  visible={this.state.isClicked}
                  onVisibleChange={this.handleClickChange}
                >
                  <img
                    style={{ width: '16px', height: '16px' }}
                    onClick={this.showinColumns}
                    src={require('@/assets/common/new.png')}
                  />
                </Popover>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                valuePropName="checked"
                name="inColumnAmt"
                label="交易金额字段"
                // rules={[
                //   { pattern: /^[A-Za-z]*$/, message: '只能为英文字母' },
                // ]}
              >
                <Select>
                  {this.state.fileColumnsData
                    ? this.state.fileColumnsData.map(
                        (item: any, index: any) => (
                          <Option key={index} value={item.showKey}>
                            {item.showValue}
                          </Option>
                        ),
                      )
                    : ''}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                valuePropName="checked"
                name="inColumnDc"
                label="借贷标识字段"
                // rules={[
                //   { pattern: /^[A-Za-z]*$/, message: '只能为英文字母' },
                // ]}
              >
                <Select>
                  {this.state.fileColumnsData
                    ? this.state.fileColumnsData.map(
                        (item: any, index: any) => (
                          <Option key={index} value={item.showKey}>
                            {item.showValue}
                          </Option>
                        ),
                      )
                    : ''}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {this.renderCondition(this.state.fileColumnsData, 'File')}
          </Row>
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item
                valuePropName="checked"
                name="inColumnDatAra"
                label="数据附加域"
              >
                <Switch onChange={this.changeCondition}></Switch>
              </Form.Item>
            </Col>
          </Row>
          {this.state.isDatAraInColumns && (
            <div>
              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item name="datAraParserType" label="附加域解析类型">
                    <Radio.Group>
                      <Radio
                        value="FIXED"
                        onClick={() => this.setDatAraInDelimiters('fixed')}
                      >
                        定长
                      </Radio>
                      <Radio
                        value="VARIABLE"
                        onClick={() => this.setDatAraInDelimiters('variable')}
                      >
                        变长
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="datAraInDelimiters"
                    label="附加域文件内容分隔"
                    rules={[{ required: true }]}
                  >
                    {this.state.showDatAraInDelimiters === true ? (
                      <Select>
                        {this.state.separator.map(
                          (item: any, index: number) => (
                            <Option key={index} value={item.paramKey}>
                              {item.paramValue}
                            </Option>
                          ),
                        )}
                      </Select>
                    ) : (
                      <Input placeholder="定长配置如： 2，2，4"></Input>
                    )}
                  </Form.Item>
                </Col>
                <Col span={7} className={styles.datAraInColumns}>
                  <Form.Item label="附加域列信息">
                    <Popover
                      overlayInnerStyle={{
                        minWidth: '400px',
                        minHeight: '50vh',
                        height: '100%',
                      }}
                      content={
                        <div style={{}}>
                          <Search
                            placeholder="请输入中文或英文以检索"
                            onSearch={this.searchinColumns}
                            style={{ marginBottom: '15px' }}
                          />
                          <Scrollbars autoHeightMax={410} autoHide autoHeight>
                            <Form.Item name="datAraInColumns">
                              <Checkbox.Group
                                onChange={this.datAraCheckbox}
                                key="1"
                                defaultValue={this.state.defaultData}
                              >
                                {this.state.treeExtraData.map((item, index) => {
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
                            type={'primary'}
                            onClick={() => this.saveInColumns('Extra')}
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
                      title="附加域列信息"
                      placement="rightTop"
                      trigger="click"
                      visible={this.state.isDatAraClicked}
                      onVisibleChange={this.handleDateClickChange}
                    >
                      <img
                        onClick={this.showinColumns}
                        src={require('@/assets/common/new.png')}
                      />
                    </Popover>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                {this.renderCondition(this.state.datAraInColumns, 'Extra')}
              </Row>
            </div>
          )}
        </Form>
      </>
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
  };
};
export default connect(mapStateToProps)(SplitFileInStorage);
