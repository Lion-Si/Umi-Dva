import {
  Form,
  Input,
  Row,
  Card,
  message,
  Select,
  Divider,
  Col,
  Modal,
  Table,
  Popconfirm,
  Collapse,
  Tabs,
} from 'antd';
import Import from '../../../../components/Import/index';
import React from 'react';
import styles from './index.less';
import { getCommonCode } from '../../../service';
import AddClearRule from './AddClearRule';
import UpdateClearRule from './UpdateClearRule';
import { RightOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { cloneDeep } from 'lodash';
import MergeList from '../clearDismantle/mergeList';

const { Option } = Select;

const layout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 },
};

// 结果文件融合节点配置组件
class ResultFileMerge extends React.Component {
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
    //是否显示新增清分规则弹窗
    clearModalVisible: false,
    updateModalVisible: false,
    //批量类型
    batType: [],
    //清分中心编号
    clearCenterNo: [],
    //清分融合方式
    clearMergeWay: [
      { paramKey: 'SIMPLE', paramValue: '简单融合' },
      { paramKey: 'TRAFITION', paramValue: '传统融合' },
    ],
    //文件融合类
    mergeClass: [],
    //模板名称
    tempName: [],
    //文件内容分隔符
    separator: [],
    //解析类型
    parserType: [
      { paramKey: 'fixed', paramValue: '定长' },
      { paramKey: 'variable', paramValue: '变长' },
    ],
    //文件解析类
    fileResolveClass: [],
    //文件解析key
    parserKey: [],
    //清分规则列表
    clearRuleList: [],
    //清分规则列表数据源

    //导入的数据源
    importData: [],
  };

  componentDidMount() {
    // console.log(this.props.oldBatInfo);
    this.props.onRef(this);
    this.fetchCommonData();
    this.setDefaultClearMerge();
  }

  clearFormRef: any = React.createRef();
  //清分融合表
  clearMergeRef: any = React.createRef();
  //清分规则表
  clearRuleListRef: any = React.createRef();
  //字段映射表
  traFileResultRef: any = React.createRef();

  // 当配置为 编辑or查看时，回显已经配置过的数据
  setDefaultClearMerge = () => {
    if (this.props.viewOrEditData.btrTraFileResultTempl) {
      this.clearFormRef?.current?.setFieldsValue({
        ...this.props.viewOrEditData.btrTraFileResultTempl,
      });
    }
  };

  // 整合数据
  //获取清分融合表数据
  getClearMergeData = () => {
    const clearMergeData = this.clearMergeRef.current.getFieldsValue();
    const saveClearMerge = clearMergeData;
    saveClearMerge.batType = this.props.batType.value;
    saveClearMerge.busCode = this.props.busCode.value;
    saveClearMerge.chnNo = this.props.chnNo.value;
    //暂存数据至Dva中，方便回显
    this.props.dispatch({
      type: 'tableList/saveParam',
      payload: {
        id: 'saveClearMerge',
        data: saveClearMerge,
      },
    });
  };

  /**
   * 将 对象数组类型的报文 转换成 纯对象类型的JSON报文
   * 比如：将 系统/本地报文头与报文体表格数据 转换成 用于报文展示的JSON数据
   * @Array  {*} arrayObjectMsg  对象数组类型的报文(对象key)
   * @Array  {*} valueArrayMsg   对象数组类型的报文(对象值)
   * @String {*} keyName         需要提取的key名
   */
  objectArrayMsgjsonMsg = (
    arrayObjectMsg,
    valueArrayMsg,
    keyName = 'structName',
  ) => {
    const compute = arrayObjectMsg => {
      let result = {};
      for (const value of arrayObjectMsg) {
        for (const val of valueArrayMsg) {
          if (arrayObjectMsg.indexOf(value) + 1 == valueArrayMsg.indexOf(val)) {
            if (value.hasOwnProperty(keyName) === false) {
              throw new Error(`未发现 ${keyName} （默认）属性，无法转换`);
            }
            if (val.paramName) {
              if (arrayObjectMsg.indexOf(value) === 0) {
                result[
                  value[keyName]
                ] = `$.[${valueArrayMsg[0].paramName}]+[${valueArrayMsg[1].paramName}]`;
              } else {
                result[value[keyName]] = `$.[${val.paramName}]`;
              }
            } else {
              result[value[keyName]] = '';
            }
          }
        }
      }
      return result;
    };
    const jsonMsg = compute(arrayObjectMsg);
    return jsonMsg;
  };

  // 整合数据
  //获取批次文件传统清分融合字段映射数据
  getTraFileResultData = () => {
    if (this.props.clearRuleData.length > 0) {
      if (this.props.importData.clearFiles) {
        var clearFilesData = cloneDeep(this.props.importData.clearFiles);
        const traFileResultData = this.traFileResultRef.current.getFieldsValue();
        var saveTraFileResultData = traFileResultData;

        //存储对应组装的数据
        let inColumnsData: any = [];
        let inColumnsNameData: any = [];
        let datAraInColumnsData: any = [];
        let datAraInColumnsNameData: any = [];
        let outColumnsData: any = [];
        let outColumnsNameData: any = [];
        let datAraOutColumnsData: any = [];
        let datAraOutColumnsNameData: any = [];

        //输出结果配置项(目前的生成结果文件规则是固定的，若之后要变可在此处改)
        let mergeInData: any = [];
        let mergeOutData: any = [];
        let outputParameter: any = [];

        //上行明细文件字段
        clearFilesData.inClumnsVoList.map(item => {
          inColumnsData.push(item.field);
          inColumnsNameData.push(item.fieldName);
          mergeInData.push({
            paramName: item.field,
            zhDesc: item.fieldName,
          });
        });

        //其中附加数据域
        clearFilesData.inClumnsDatAraVoList.map(item => {
          datAraInColumnsData.push(item.field);
          datAraInColumnsNameData.push(item.fieldName);
        });

        //下行明细文件字段
        clearFilesData.outClumnsVoList.map(item => {
          outColumnsData.push(item.field);
          outColumnsNameData.push(item.fieldName);
          mergeOutData.push({
            paramName: item.field,
            zhDesc: item.fieldName,
          });
        });

        //其中附加数据域
        clearFilesData.outClumnsDatAraVoList.map(item => {
          datAraOutColumnsData.push(item.field);
          datAraOutColumnsNameData.push(item.fieldName);
        });

        //最终按当前固定规则生成结果配置
        outputParameter = this.objectArrayMsgjsonMsg(
          mergeOutData,
          mergeInData,
          'paramName',
        );

        if (this.props.viewOrEditData.btrTraFileResultTempl) {
          saveTraFileResultData = this.props.viewOrEditData
            .btrTraFileResultTempl;
        }

        //模板编号
        saveTraFileResultData.templateNo = `${this.props.chnNo.value}${this.props.busCode.value}${this.props.batType.value}${this.props.fileType}`;
        saveTraFileResultData.inColumns = `${inColumnsData.toString()}`;
        saveTraFileResultData.inColumnsName = `${inColumnsNameData.toString()}`;
        saveTraFileResultData.inColumnDatAra = 'datAra';
        saveTraFileResultData.datAraParserType = 'FIXED';
        saveTraFileResultData.datAraInColumns = `${datAraInColumnsData.toString()}`;
        saveTraFileResultData.datAraInColumnsName = `${datAraInColumnsNameData.toString()}`;
        saveTraFileResultData.datAraInDelimiters = '11,1';
        saveTraFileResultData.outColumnDatAra = 'datAra';
        saveTraFileResultData.datAraOutParserType = 'FIXED';
        saveTraFileResultData.outColumns = `${outColumnsData.toString()}`;
        saveTraFileResultData.outColumnsName = `${outColumnsNameData.toString()}`;
        saveTraFileResultData.outDelimiters = '|';
        saveTraFileResultData.outputParameter = outputParameter;
        saveTraFileResultData.datAraOutColumns = `${datAraOutColumnsData.toString()}`;
        saveTraFileResultData.datAraOutColumnsName = `${datAraOutColumnsNameData.toString()}`;
        saveTraFileResultData.datAraOutDelimiters = ',';

        //暂存数据至Dva中，方便回显
        this.props.dispatch({
          type: 'tableList/saveParam',
          payload: {
            id: 'saveTraFileResultData',
            data: saveTraFileResultData,
          },
        });
      } else {
        message.destroy();
        message.info('清先上传文件映射表');
      }
    }
  };

  //获取公共数据
  fetchCommonData = () => {
    //获取文件分隔符
    this.getCommon('separator');
    //获取clearCenterNo
    this.getCommon('clearCenterNo');
    //获取clearMergeWay（清分方式）
    this.getCommon('clearMergeWay');
    //获取文件融合类
    this.getCommon('mergeClass');
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
  //绑定合并列表组件
  mergeRef = (ref: any) => {
    this.mergeChild = ref;
  };
  //绑定导入子组件
  importRef = (ref: any) => {
    this.child = ref;
  };
  //获取导入后解析的文件
  getImportFile = res => {
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveImport', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        id: 'clearFiles',
        data: res.body,
      },
    });
    //导入后设置默认值
    this.setDefaultImport(res);
  };

  //若有导入数据则自动填充至各表单
  setDefaultImport = async res => {
    //文件解析Key
    var parserKey: any = [];
    //传统核心附加数据域
    var datAraInColumns: any = [];
    //云核心附加数据域
    var datAraOutColumns: any = [];
    //整合两个核心表数据源
    res.body.inClumnsVoList.map(item => {
      datAraInColumns.push({
        paramName: item.field,
        zhDesc: item.fieldName,
      });
    });
    res.body.outClumnsVoList.map(item => {
      datAraOutColumns.push({
        paramName: item.field,
        zhDesc: item.fieldName,
      });
    });
    res.body.outClumnsVoList.map(item => {
      parserKey.push({
        paramKey: item.field,
        paramValue: item.fieldName,
      });
    });
    var importData = {
      datAraInColumns,
      datAraOutColumns,
    };
    this.traFileResultRef.current.setFieldsValue({
      parserKey: ['qzDate', 'reqJournalNo'],
      secondQuery: `${res.body.outClumnsDatAraVoList[0].fieldName}(${res.body.outClumnsDatAraVoList[0].field})`,
      customerNo: `${res.body.outClumnsDatAraVoList[1].fieldName}(${res.body.outClumnsDatAraVoList[1].field})`,
    });
    this.setState(
      {
        importData,
        parserKey,
      },
      () => {
        this.mergeChild.importClearData();
      },
    );
    console.log(res);
  };

  render() {
    return (
      <>
        <Form
          {...layout}
          name="nest-messages"
          className={styles.clearForm}
          validateMessages={this.validateMessages}
          ref={this.clearMergeRef}
          scrollToFirstError={true}
          initialValues={{
            clearCenterNo: '001',
            cstmrNoPos: '11',
            scndQueryFlagPos: '1',
            clearMergeWay: 'TRADITION',
            mergeClass: 'traditionClearFileMerge',
          }}
        >
          <span className={`${styles.label} ${styles.merge}`}>
            清分融合配置{' '}
          </span>
          <Divider orientation="left" className={styles.showConfig} />
          <Row>
            <Col span={7}>
              <Form.Item
                name="clearMergeWay"
                label="清分融合方式"
                rules={[{ required: true }]}
                labelCol={{ span: 6 }}
                labelAlign={'left'}
              >
                <Select>
                  {this.state.clearMergeWay.map((item: any, index: number) => (
                    <Option key={index} value={item.paramKey}>
                      {item.paramValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="cstmrNoPos"
                label="结果文件客户号栏位"
                rules={[{ required: true }]}
                labelCol={{ span: 10 }}
              >
                <Input placeholder="薪资报酬" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="mergeClass"
                label="文件融合方式"
                rules={[{ required: true }]}
              >
                <Select>
                  {this.state.mergeClass.map((item: any, index: number) => (
                    <Option key={index} value={item.paramKey}>
                      {item.paramValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="clearCenterNo"
                label="清分中心编号"
                rules={[{ required: true }]}
                labelCol={{ span: 6 }}
                labelAlign={'left'}
              >
                <Select>
                  {this.state.clearCenterNo.map((item: any, index: number) => (
                    <Option key={index} value={item.paramKey}>
                      {item.paramValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="scndQueryFlagPos"
                label="结果文件二次查询标志栏位"
                rules={[{ required: true }]}
                labelCol={{ span: 10 }}
                labelAlign={'left'}
              >
                <Input placeholder="薪资报酬" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* <Import
                    onRef={this.importRef}
                    fieldsFlag="3"
                    pushImportFile={this.getImportFile}
                /> */}
        <br />
        <span className={`${styles.label} ${styles.mapped}`}>
          批次文件传统清分融合字段映射
        </span>
        <Divider orientation="left" className={styles.showConfig} />
        <Form
          {...layout}
          name="nest-messages"
          className={styles.clearForm}
          validateMessages={this.validateMessages}
          ref={this.traFileResultRef}
          scrollToFirstError={true}
          initialValues={{
            templateName: this.props.busCode.label
              ? `${this.props.busCode.label.split('(')[0]}模板`
              : '',
            parserKey: 'qzDate,reqJournalNo',
            secondQuery: 'bDoSusFlg',
            customerNo: 'bDoCusNo',
          }}
        >
          <Row>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="templateName"
                label="模板名称"
                rules={[{ required: true }]}
                labelCol={{ span: 6 }}
                labelAlign={'left'}
              >
                <Select>
                  {this.state.tempName.map((item: any, index: number) => (
                    <Option key={index} value={item.paramKey}>
                      {item.paramValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="parserType"
                label="解析类型"
                rules={[{ required: true }]}
                labelCol={{ span: 6 }}
                labelAlign={'left'}
              >
                <Select>
                  {this.state.parserType.map((item: any, index: number) => (
                    <Option key={index} value={item.paramKey}>
                      {item.paramValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="inDelimiters"
                label="文件内容分隔符"
                rules={[{ required: true }]}
              >
                <Select>
                  {this.state.separator.map((item: any, index: any) => (
                    <Option key={index} value={item.paramKey}>
                      {item.paramValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="parserClass"
                label="文件融合方式"
                rules={[{ required: true }]}
                labelCol={{ span: 6 }}
                labelAlign={'left'}
              >
                <Select>
                  {this.state.fileResolveClass.map(
                    (item: any, index: number) => (
                      <Option key={index} value={item.paramKey}>
                        {item.paramValue}
                      </Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="parserKey"
                label="文件解析Key"
                rules={[{ required: true }]}
              >
                <Select mode="multiple">
                  {this.state.parserKey.map((item: any, index: number) => (
                    <Option disabled key={index} value={item.paramKey}>
                      {item.paramValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="secondQuery"
                label="二次查询字段"
                rules={[{ required: true }]}
              >
                <Input placeholder="可导入二次查询字段" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7} style={{ display: 'none' }}>
              <Form.Item
                name="customerNo"
                label="客户号字段"
                rules={[{ required: true }]}
                labelCol={{ span: 6 }}
                labelAlign={'left'}
              >
                <Input placeholder="可导入客户号字段" />
              </Form.Item>
            </Col>
          </Row>
          <MergeList
            onRef={this.mergeRef}
            parserType={this.state.parserType}
            separator={this.state.separator}
            importData={this.state.importData}
          />
        </Form>
      </>
    );
  }
}
const mapStateToProps = (state, props) => {
  const {
    param,
    importData,
    batType,
    busCode,
    chnNo,
    fileType,
    clearRuleData,
    viewOrEditData,
  } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
    param,
    importData,
    fileType,
    clearRuleData,
    viewOrEditData,
  };
};
export default connect(mapStateToProps)(ResultFileMerge);
