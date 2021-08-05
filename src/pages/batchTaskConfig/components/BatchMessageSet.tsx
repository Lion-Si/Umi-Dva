import React from 'react';
import styles from './component.less';
import { cloneDeep } from 'lodash';
import { connect } from 'umi';
import Import from '../../components/Import/index';
import {
  Button,
  message,
  Card,
  Input,
  Table,
  Form,
  Row,
  Col,
  Select,
  Spin,
  Affix,
} from 'antd';
import {
  getBatchMessage,
  getCommonCode,
  getMsgStandardConfig,
  getCheckRuleCommonCode,
  checkBatchMessage,
  findBatchConfigMessage,
  findBtrClearRuleList,
  addBatchMessage,
} from '../service';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import { Item } from 'gg-editor';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;
var showMsgMappingConfig: any = [];
var showFileTemplConfig: any = [];
const selectOption = <div></div>;
class BatchMessageSet extends React.Component {
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
    batType: [],
    chnNo: [],
    busCode: [],
    tableList: [],
    checkRule: [],
    showMsgMappingConfig: [],

    btrDetailMap: [],
    btrTaskMessage: [],
    btrFileTempl: [],
    btrParam: [],

    columns: [
      {
        title: '消息域名称',
        dataIndex: 'msgFiledName',
        key: 'msgFiledName',
        align: 'left',
        width: '25%',
      },
      {
        title: '源消息域',
        key: 'sourceMsgFiled',
        align: 'left',
        width: '25%',
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              value={record.sourceMsgFiled}
              onChange={e => {
                this.setDataInput(e, 'sourceMsgFiled', index, record);
              }}
              style={{ width: '200px', cursor: 'pointer' }}
              placeholder="请输入"
            />
          );
        },
      },
      {
        title: '标准消息域',
        dataIndex: 'msgFileds',
        key: 'msgFileds',
        align: 'left',
        width: '25%',
      },
      {
        title: '规则校验',
        key: 'msgRuleContent',
        align: 'left',
        width: '25%',
        render: (text: any, record: any, index: any) => {
          return (
            <Select
              value={record.msgRuleContent}
              placeholder="请选择对应规则类型"
              filterOption={false}
              onChange={e => {
                this.setDataSelect(e, 'msgRuleContent', index, record);
              }}
              style={{ width: '200px', cursor: 'pointer' }}
              showArrow={false}
            >
              {this.state.checkRule.map((item, index) => {
                return (
                  <Select.Option key={index} value={item.seqNo}>
                    {item.ruleDesc}
                  </Select.Option>
                );
              })}
              ;
            </Select>
          );
        },
      },
    ],
  };
  componentDidMount() {
    this.props.onRef(this);
    this.getBatchInfo();
    this.fetchBatTypeInfo();
    console.log('cache', window.applicationCache);
    //回显
    this.setExistValue();
    // 获取数据
    this.fetchCommonData();
    this.searchFormRef.current.setFieldsValue({
      fileType: 'txt',
    });
  }

  //组件卸载后对state进行清除
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  //初始查询当前清分规则列表确定此批次归属
  findBtrClearRuleList = () => {
    var batType = this.props.batType.value;
    this.state.batType.map(item => {
      if (item.paramKey === batType) {
        batType = item.paramParent;
      }
    });
    console.log('11111111111');

    findBtrClearRuleList({
      stdSvcInd: 'BatchProcessSetupSVC',
      stdIntfcInd: 'findBtrClearRuleList',
      data: {
        batType,
        chnNo: this.props.chnNo.value,
        busCode: this.props.busCode.value,
      },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.props.dispatch({
          type: 'tableList/isClear',
          payload: {
            clearRuleData: res.body,
          },
        });
        this.props.skipToSec(1);
      }
    });
  };

  //如果存在更新数据请求，则回显
  setExistValue = () => {
    if (showMsgMappingConfig.length > 0) {
      console.log('没存在数据:', showMsgMappingConfig);
      //定义装载在batType的对象
      var setBatType: any = {};
      var tableList = cloneDeep(this.state.tableList);
      //将拿到的值与表格对应字段替换
      showMsgMappingConfig = JSON.parse(
        JSON.stringify(showMsgMappingConfig).replace(
          /targetMsgFiled/g,
          'msgFileds',
        ),
      );
      var checkRule = cloneDeep(this.state.checkRule);
      //将拿到的数据中的校验规则与请求到的值进行替换
      showMsgMappingConfig.map((e, i) => {
        checkRule.map((item, index) => {
          if (e.msgFileds == item.ruleElements) {
            //正确的替换
            e.msgRuleContent = item.seqNo;
          } else if (item.ruleElements == 'noCheckRule' && !e.msgRuleContent) {
            e.msgRuleContent = item.seqNo;
          }
        });
      });
      // this.searchFormRef.current.setFieldsValue({
      //   fileType: 'txt',
      // });
      showMsgMappingConfig.map((item: any, index: any) => {
        tableList[index] = item;
      });
      this.setState({
        tableList,
      });
      //当为编辑时，将请求拿到的数据封装成适合select接受的对象值(本请求无需再用)
      // getCommonCode({
      //   stdSvcInd: 'BatchPandectSVC',
      //   stdIntfcInd: 'getCommonCode',
      //   data: { paramType: 'btType' },
      // }).then((res: any) => {
      //   if (res) {
      this.state.batType.map(item => {
        if (item.paramKey === showFileTemplConfig.batTypeFlag) {
          if (showFileTemplConfig.batTypeFlag) {
            setBatType = {
              value: item.paramParent,
              label: item.paramValue,
              key: showFileTemplConfig.batTypeFlag,
            };
          }
          // else if (showFileTemplConfig.templateNo === i.paramKey) {
          //   setBatType = {
          //     value: item.paramParent,
          //     label: item.paramValue,
          //     key: showFileTemplConfig.batTypeFlag,
          //   };
          // }
        }
      });
      console.log(
        'setBatType',
        setBatType,
        this.state.batType,
        showFileTemplConfig,
      );
      this.searchFormRef?.current?.setFieldsValue({
        batType: setBatType,
      });
      this.setSelectBatType(setBatType, 'reSet');
      //   }
      // });
      return;
    }
    //递归当所有方法执行成功后结束
    //此函数执行一个动作，并要求浏览器在下次重绘前调用指定的回调（函数）去更新这个动作，这里解决请求拿值的延迟事件
    requestAnimationFrame(this.setExistValue);
  };

  //绑定导入子组件
  importRef = (ref: any) => {
    this.child = ref;
  };

  //获取导入后解析的文件
  getImportFile = res => {
    console.log(res);

    //需要处理对应的上行文件汇总行
    var uploadFileSummaryList = cloneDeep(res.body.uploadFileSummaryList);
    //存放所需提交的数据
    var btrFileTotalTempl = {};
    //上传文件汇总行/行名数据拆分
    var inColumnsData: any = [];
    var inColumnsNameData: any = [];

    //遍历数据封装所需
    uploadFileSummaryList.map((item: any) => {
      inColumnsData.push(item.field);
      inColumnsNameData.push(item.fieldName);
    });

    //组装对应字段(默认填充字段，不展示)
    btrFileTotalTempl.templateNo = `${this.props.chnNo.value}${this.props.busCode.value}${this.props.batType.value}txt`;
    btrFileTotalTempl.templateName = this.props.batType.label;
    btrFileTotalTempl.inColumns = `${inColumnsData.toString()}`;
    btrFileTotalTempl.inColumnsName = `${inColumnsNameData.toString()}`;
    btrFileTotalTempl.parserType = 'VARIABLE';
    btrFileTotalTempl.inDelimiters = '|';

    //将需要存储的文件汇总行存入dva中（需要最终放入配置数据中）
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveParam', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        id: 'btrFileTotalTempl',
        data: btrFileTotalTempl,
      },
    });

    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveImport', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        id: 'detailFiles',
        data: res.body,
      },
    });
  };

  //请求batType
  fetchBatTypeInfo = () => {
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'batType' },
    }).then((res: any) => {
      this.setState({
        batType: res.body,
      });
    });
  };

  //各表单对应
  headFormRef: any = React.createRef();
  addFormRef: any = React.createRef();
  editFormRef: any = React.createRef();
  searchFormRef: any = React.createRef();

  //获取公共数据
  fetchCommonData = () => {
    // 获取结果文件默认值设置
    this.getCommon('btrDetailMap');
    this.getCommon('btrTaskMessage');
    this.getCommon('btrFileTempl');
    this.getCommon('btrParam');
  };
  //公共代码
  getCommon = (paramType: any) => {
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState(
          () => ({
            [paramType]: res.body,
          }),
          () => {
            this.props.dispatch({
              //dispatch为页面触发model中方法的函数
              type: 'tableList/saveResDefaultData', //type：'命名空间/reducer或effects中的方法名'
              payload: {
                id: paramType,
                data: res.body,
              },
            });
          },
        );
      }
    });
  };
  //表头input设置
  setDataInput = (e: any, key: any, index: any, record: any) => {
    try {
      const searchData = this.searchFormRef.current.getFieldsValue();
      var tableList = cloneDeep(this.state.tableList);
      if (
        searchData.batType.value &&
        searchData.busCode.value &&
        searchData.chnNo.value
      ) {
        tableList[index][key] = e.target.value;
        this.setState({
          tableList,
        });
      } else {
        message.destroy();
        message.info('请先输入上面必填字段');
      }
    } catch (error) {
      message.destroy();
      message.error('必输字段不能为空');
    }
  };
  //选中批量类型
  setSelectBatType = (value: any, type: any) => {
    console.log('value', value, value.value);
    // this.state.batType.map(i => {
    //   if (i.paramKey === value.value) {
    //     value.value = i.paramParent;
    //   }
    // });
    if (type === 'reSet') {
      getCommonCode({
        stdSvcInd: 'BatchPandectSVC',
        stdIntfcInd: 'getCommonCode',
        data: { paramType: value.key },
      }).then((res: any) => {
        this.setState({
          chnNo: res.body,
        });
        if (showMsgMappingConfig.length > 0) {
          var setChnNo = {};
          this.state.chnNo.map(item => {
            console.log('item:', item);
            if (item.paramKey == showMsgMappingConfig[0].chnNo) {
              setChnNo = {
                value: item.paramKey,
                label: item.paramValue,
              };
              console.log('setChnNo', setChnNo);
            }
          });
          this.searchFormRef?.current?.setFieldsValue({
            chnNo: setChnNo,
          });

          this.setSelectChnNo(setChnNo);
        }
      });
    } else {
      getCommonCode({
        stdSvcInd: 'BatchPandectSVC',
        stdIntfcInd: 'getCommonCode',
        data: { paramType: value.value },
      }).then((res: any) => {
        this.setState({
          chnNo: res.body,
        });
      });
    }
    console.log('value-change', value, value.value);
    this.setSelectValue();
  };
  //设置选中的必填项并传进dva中
  setSelectChnNo = (value: any) => {
    //请求busCode
    console.log('value:', value.value);
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'busCode' },
    }).then((res: any) => {
      this.setState({
        busCode: res.body,
      });
      if (showMsgMappingConfig.length > 0) {
        var setBusCode = {};
        this.state.busCode.map(item => {
          if (item.paramKey == showMsgMappingConfig[0].busCode) {
            setBusCode = {
              value: item.paramKey,
              label: item.paramValue,
            };
            console.log('setBusCode', setBusCode);
          }
        });
        this.searchFormRef?.current?.setFieldsValue({
          busCode: setBusCode,
        });
        this.setSelectBusCode();
      }
    });
    this.setSelectValue();
  };
  setSelectBusCode = () => {
    this.setSelectValue();
  };
  //设置选中的值
  setSelectValue = () => {
    const searchData = this.searchFormRef?.current?.getFieldsValue();
    console.log('searchData', searchData);

    var tableList = cloneDeep(this.state.tableList);
    tableList?.map(item => {
      item.batType = searchData?.batType?.value;
      this.state.batType.map(i => {
        if (i.paramKey === searchData?.batType?.value) {
          searchData.batType.value = i.paramParent;
        }
      });
      if (searchData?.busCode) {
        item.busCode = searchData.busCode.value;
      }
      if (searchData?.chnNo) {
        item.chnNo = searchData.chnNo.value;
      }
      item.fileType = searchData?.fileType;
    });
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/changeData', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        batType: searchData?.batType,
        busCode: searchData?.busCode,
        chnNo: searchData?.chnNo,
        fileType: searchData?.fileType,
      },
    });
    console.log('列表数据：', tableList);
    this.setState({
      tableList,
    });
  };
  //设置选中值
  setDataSelect = (e: any, key: any, index: any, record: any) => {
    var tableList = cloneDeep(this.state.tableList);
    console.log('选中的值为：', e);
    tableList[index][key] = e;
    console.log('当前的表值为：', tableList);
    this.setState({
      tableList,
    });
  };
  //end
  getBatchInfo = () => {
    //回显问题解决
    if (this.props.tableList.length > 0) {
      if (this.props.batType) {
        this.searchFormRef.current.setFieldsValue({
          batType: this.props.batType,
          busCode: this.props.busCode,
          chnNo: this.props.chnNo,
        });
        this.setSelectBatType(this.props.batType, 'use');
        this.setSelectChnNo(this.props.chnNo);
        this.setSelectBusCode();
      }
    }

    getMsgStandardConfig({
      stdSvcInd: 'BatchMessageSetupSVC',
      stdIntfcInd: 'getMsgStandardConfig',
      data: {},
    }).then((res: any) => {
      if (res && res.body) {
        this.setState({
          tableList: res.body,
          //将表格的数据源设置为请求的结果列表
        });
      }
      getCheckRuleCommonCode({
        stdSvcInd: 'BatchPandectSVC',
        stdIntfcInd: 'getCheckRuleCommonCode',
        data: {},
      }).then(res => {
        console.log('进入');

        if (res && res.sysHead.retCd == '000000') {
          this.setState(
            {
              checkRule: res.body,
            },
            () => {
              //校验规则替换
              console.log('table', this.state.checkRule);
              var tableList = cloneDeep(this.state.tableList);
              var checkRule = cloneDeep(this.state.checkRule);
              tableList.map((e, i) => {
                checkRule.map((item, index) => {
                  if (e.msgFileds == item.ruleElements) {
                    //正确的替换
                    console.log(item.ruleElements);
                    e.msgRuleContent = item.seqNo;
                  } else if (
                    item.ruleElements == 'noCheckRule' &&
                    !e.msgRuleContent
                  ) {
                    e.msgRuleContent = item.seqNo;
                  }
                });
              });
              this.setState({
                tableList,
                checkRule,
              });
            },
          );
        }
      });
    });
  };

  //校验批次信息的唯一性
  checkBatchMessage = (addData: any) => {
    checkBatchMessage({
      stdSvcInd: 'BatchMessageSetupSVC',
      stdIntfcInd: 'checkBatchMessage',
      data: {
        chnNo: addData[0].chnNo,
        batType: addData[0].batType,
        busCode: addData[0].busCode,
      },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        //将数据传输到父组件并跳转
        this.props.saveMsgMappingConfig(addData);
        this.findBtrClearRuleList();
      } else {
        message.destroy();
        message.info('此条数据已有配置项');
      }
    });
  };
  set = async (addData: any) => {
    console.log('正在循环中');
    this.setSelectBatType(this.props.batType, 'use');
    if (addData[0].batType) {
      await this.checkBatchMessage(addData);
      return;
    }
  };

  //解析数据
  setDiffData = (addData: any, checkRule: any) => {
    addData.map(i => {
      checkRule.map(e => {
        if (i.msgRuleContent == e.seqNo) {
          i.msgRuleContent = e.ruleContent;
        }
      });
      //替换渠道号的key值
      this.state.batType.map(item => {
        if (item.paramKey === i.batType) {
          i.batType = item.paramParent;
        }
      });
    });
    var replaceData;
    replaceData = JSON.stringify(addData);
    replaceData = replaceData.replace(/msgFileds/g, 'targetMsgFiled');
    return replaceData;
  };

  //下一步
  handleAddOk = async (e: any) => {
    try {
      var addData = cloneDeep(this.state.tableList);
      var storeData = cloneDeep(this.state.tableList);
      var checkRule = cloneDeep(this.state.checkRule);
      addData = JSON.parse(this.setDiffData(addData, checkRule));
      console.log(addData, 'addData');
      //暂存表格数据方便回显
      this.props.dispatch({
        type: 'tableList/changeTableData',
        payload: {
          tableList: storeData,
        },
      });
      //当编辑和查看时不校验
      if (
        window.location.hash.split('&')[1] &&
        window.location.hash.split('&')[1].split('=')[1]
      ) {
        this.props.saveMsgMappingConfig(addData);
        this.props.skipToSec(1);
      } else {
        //跳到下一步
        if (this.props.tableList.length > 0) {
          if (this.props.batType) {
            this.setSelectBatType(this.props.batType, 'use');
            //利用定时器获取重新设置后的值
            let getValue = setInterval(() => {
              let newData = cloneDeep(this.state.tableList);
              if (newData[0].batType) {
                this.checkBatchMessage(newData);
                //清楚定时器
                clearInterval(getValue);
              }
            }, 100);
          } else {
            message.destroy();
            message.error('请输入必输字段');
            return false;
          }
        } else if (addData) {
          if (Object.keys(addData[0]).length < 8) {
            //限制弹出框次数
            message.destroy();
            message.error('请输入必输字段');
            return false;
          } else if (Object.keys(addData[0]).length === 8) {
            //批次配置唯一检查接口
            this.checkBatchMessage(addData);
          }
        }
      }
    } catch (error) {
      message.destroy();
      message.error('请输入必输字段');
      return false;
      console.log(error);
    }
  };
  render() {
    console.log(this.props, 'this.props');
    if (this.props.showMsgMappingConfig) {
      showFileTemplConfig = this.props.showFileTemplConfig;
      showMsgMappingConfig = this.props.showMsgMappingConfig;
    }
    return (
      <div className={styles.batchTaskConfig}>
        <Card bordered={false} className={styles.batchTask}>
          <Form
            validateMessages={this.validateMessages}
            name="nest-messages"
            ref={this.searchFormRef}
            className={styles.searchForm}
          >
            <Row gutter={16} className={styles.topRow}>
              <Col span={6} offset={6}>
                <Form.Item
                  name="batType"
                  label="批量类型"
                  rules={[{ required: true, message: '请选择批量类型' }]}
                >
                  <Select
                    labelInValue
                    showSearch
                    placeholder="请选择对应批量类型"
                    showArrow={true}
                    onChange={this.setSelectBatType}
                    optionFilterProp="children"
                    style={{ width: '200px' }}
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.batType
                      ? this.state.batType.map((item, index) => (
                          <Option key={index} value={item.paramKey}>
                            {item.paramValue}
                          </Option>
                        ))
                      : ''}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="chnNo"
                  label="渠道号"
                  labelCol={{ span: 6 }}
                  rules={[{ required: true, message: '请选择渠道号' }]}
                >
                  <Select
                    labelInValue
                    showSearch
                    placeholder="请选择对应渠道号"
                    showArrow={true}
                    onChange={this.setSelectChnNo}
                    optionFilterProp="children"
                    style={{ width: '200px' }}
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.chnNo
                      ? this.state.chnNo.map((item, index) => (
                          <Option key={item.paramKey} value={item.paramKey}>
                            {item.paramValue}
                          </Option>
                        ))
                      : ''}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <br />
            <Row gutter={16}>
              <Col span={6} offset={6}>
                <Form.Item
                  name="busCode"
                  label="业务代码"
                  rules={[{ required: true, message: '请选择业务代码' }]}
                >
                  <Select
                    labelInValue
                    showSearch
                    placeholder="请选择对应业务代码"
                    showArrow={true}
                    onChange={this.setSelectBusCode}
                    optionFilterProp="children"
                    style={{ width: '200px' }}
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.busCode ? (
                      this.state.busCode.map((item, index) => (
                        <Option key={index} value={item.paramKey}>
                          {item.paramValue}
                        </Option>
                      ))
                    ) : (
                      <Option value={''}>暂无</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="fileType"
                  label="文件类型"
                  labelCol={{ span: 6 }}
                  rules={[{ required: true, message: '请选择文件类型' }]}
                >
                  <Select
                    onChange={this.setSelect}
                    style={{ width: '200px' }}
                    placeholder={'请选择对应文件类型'}
                  >
                    <Select.Option value="txt">txt格式</Select.Option>
                    <Select.Option value="csv" disabled>
                      csv格式
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <br />
          <Row>
            <Col span={12} offset={6}>
              <Import
                onRef={this.importRef}
                fieldsFlag="1"
                pushImportFile={this.getImportFile}
              />
            </Col>
            <Col span={4} offset={2}>
              <Affix offsetTop={120}>
                <a
                  download="批次文件列格式模板"
                  href="http://dvl-ngdb-btr.oss-cn-foshan-sdebank3-d01-a.ops.aliyun-test.sdebank.com/rc-upload-1620300837191-2"
                >
                  <VerticalAlignBottomOutlined />
                  批次文件列格式模板下载
                </a>
              </Affix>
              <Affix offsetTop={140}>
                <a
                  download="字段映射格式模板"
                  href={`http://dvl-ngdb-btr.oss-cn-foshan-sdebank3-d01-a.ops.aliyun-test.sdebank.com/rc-upload-1620299305302-6`}
                >
                  <VerticalAlignBottomOutlined />
                  字段映射格式模板下载
                </a>
              </Affix>
              <Affix offsetTop={160}>
                <a
                  download="服务格式模板"
                  href={`http://dvl-ngdb-btr.oss-cn-foshan-sdebank3-d01-a.ops.aliyun-test.sdebank.com/rc-upload-1620300978299-6`}
                >
                  <VerticalAlignBottomOutlined />
                  服务格式模板下载
                </a>
              </Affix>
            </Col>
          </Row>
          <Table
            style={{ display: 'none' }}
            rowKey={record => record.msgFiledName}
            className={styles.batchMesTable}
            columns={this.state.columns}
            dataSource={this.state.tableList}
            pagination={false}
          />
        </Card>
        <Button
          type="primary"
          className={styles.addNewBatch}
          onClick={this.handleAddOk}
          style={{ pointerEvents: 'fill' }}
        >
          下一步
        </Button>
      </div>
    );
  }
}
function mapStateToProps(state: any) {
  const { batType, busCode, chnNo, tableList, importData } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
    tableList,
    importData,
  };
}
export default connect(mapStateToProps)(BatchMessageSet);

/**
 * 校验问题
 */
