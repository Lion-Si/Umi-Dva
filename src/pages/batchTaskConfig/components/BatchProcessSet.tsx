import React from 'react';
import styles from './component.less';
import { cloneDeep } from 'lodash';
import {
  Radio,
  Row,
  Col,
  Form,
  Input,
  Select,
  Table,
  Button,
  message,
  Tooltip,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect, Link } from 'umi';
import BatchNodeTable from './BatchNodeTable';
import ClearDismantle from './dbtoConfig/clearDismantle';
import {
  getFileCheckRule,
  addFileCheckRule,
  addFileSplitRule,
  removeFileCheckRule,
  upFileCheckRule,
} from '../service';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
var display = false;
const { Option } = Select;
class BatchProcessSet extends React.Component {
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
    nodesInfo: [],
    display: '',
    checkPancel: false,
    columns: [
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
      {
        title: '任务节点顺序号',
        dataIndex: 'seqNum',
        key: 'seqNum',
        align: 'center',
        width: 120,
      },
    ],
  };

  componentDidMount() {
    console.log('[props] ==>', this.props);
    this.props.onRef(this);
    display = this.props.display;
    const nodesInfo = cloneDeep(this.state.nodesInfo);
    nodesInfo.push({
      batType: this.props.batType.value,
      chnNo: this.props.chnNo.value,
      busCode: this.props.busCode.value,
    });
    this.setEcho();
  }

  //设置回显设置
  setEcho = async () => {
    if (
      Object.keys(this.props.showFileCheck).length > 0 ||
      Object.keys(this.props.showFileSplit).length > 0
    ) {
      //查看编辑回显
      delete this.props.showFileCheck.busCode,
        delete this.props.showFileCheck.chnNo,
        delete this.props.showFileCheck.batType;
      delete this.props.showFileSplit.busCode,
        delete this.props.showFileSplit.chnNo,
        delete this.props.showFileSplit.batType;
      var maxFileNum = JSON.parse(this.props.showFileSplit.splitCaculRule)
        .maxFileNum;
      var maxRecordSize = JSON.parse(this.props.showFileSplit.splitCaculRule)
        .maxRecordSize;
      console.log(maxFileNum, maxRecordSize);

      this.checkFormRef.current.setFieldsValue(this.props.showFileCheck);
      this.splitFormRef.current.setFieldsValue({
        ...this.props.showFileSplit,
        maxFileNum,
        maxRecordSize,
      });
      this.setState({
        checkPancel: this.props.showFileCheck.checkRule === '01' ? true : false,
      });
    } else if (
      this.props.param.saveCheckData ||
      this.props.param.saveSplitData
    ) {
      console.log('param', this.props.param);
      if (await this.props.importData.detailFiles) {
        this.setDefaultImport();
      }
      this.checkFormRef.current.setFieldsValue(this.props.param.saveCheckData);
      this.splitFormRef.current.setFieldsValue(this.props.param.saveSplitData);
    } else {
      if (await this.props.importData.detailFiles) {
        this.setDefaultImport();
      }
      this.checkFormRef.current.setFieldsValue({
        checkRule: '00',
        summaryAmtPos: '8',
        summaryNumPos: '4',
        summaryColNum: '11',
        detailColNum: '17',
      });
      this.splitFormRef.current.setFieldsValue({
        splitRule: '00',
        bufferSize: '1024',
        maxRecordSize: '50',
        maxFileNum: '10',
      });
    }
  };

  //绑定对应子组件
  clearRef = ref => {
    this.clear = ref;
  };

  //组件卸载后对state进行清除
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  checkFormRef: any = React.createRef();
  splitFormRef: any = React.createRef();

  getDisplay = (display: String) => {
    console.log('接受到的display为', this.props.display);
    this.setState({
      display: display,
    });
  };

  //若有导入数据则自动填充至各表单
  setDefaultImport = async () => {
    var detailFiles = await cloneDeep(this.props.importData.detailFiles);
    console.log(detailFiles);
    var summaryAmtPos = '';
    var summaryNumPos = '';
    var checkPos = '';
    // 解析对应字段（金额/笔数校验,金额校验位）
    detailFiles.uploadFileSummaryList.map(item => {
      if (item.fieldName.indexOf('金额') != -1) {
        summaryAmtPos = item.seqNo.split('.')[0];
        checkPos = item.seqNo.split('.')[0];
      } else if (item.fieldName.indexOf('笔数') != -1) {
        summaryNumPos = item.seqNo.split('.')[0];
      }
    });

    // 解析上传后的表格并将对应的值填充到字段上
    // 文件检查
    this.checkFormRef.current.setFieldsValue({
      checkRule: '00',
      summaryAmtPos,
      summaryNumPos,
      checkPos,
      summaryColNum: detailFiles.uploadFileSummaryList.length,
      detailColNum: detailFiles.uploadDetailFilesList.length,
    });
    // 文件拆分
    this.splitFormRef.current.setFieldsValue({
      maxRecordSize: '50',
      maxFileNum: '10',
    });
  };

  //处理文件检查数据（校验先不做）
  fileCheckTo = async () => {
    // try {
    // const values = await this.checkFormRef.current.validateFields();
    const checkData = this.checkFormRef.current.getFieldsValue();
    const saveCheckData = checkData;
    checkData.batType = this.props.batType.value;
    checkData.chnNo = this.props.chnNo.value;
    checkData.busCode = this.props.busCode.value;
    this.props.saveFileCheck(checkData);
    //暂存数据方便回显
    this.props.dispatch({
      type: 'tableList/saveParam',
      payload: {
        id: 'saveCheckData',
        data: saveCheckData,
      },
    });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  //处理文件拆分数据（校验先不做）
  fileSplitTo = async () => {
    // try {
    // const values = await this.splitFormRef.current.validateFields();
    const splitData = this.splitFormRef.current.getFieldsValue();
    const saveSplitData = this.splitFormRef.current.getFieldsValue();
    splitData.splitCaculRule = {
      maxFileNum: splitData.maxFileNum,
      maxRecordSize: splitData.maxRecordSize,
    };
    splitData.batRuleKey = `${this.props.chnNo.value}_${this.props.busCode.value}_${this.props.batType.value}`;
    splitData.splitRuleName = '阈值拆分';
    JSON.stringify(splitData.splitCaculRule);
    this.props.saveFileSplit(splitData);
    //暂存数据方便回显
    this.props.dispatch({
      type: 'tableList/saveParam',
      payload: {
        id: 'saveSplitData',
        data: saveSplitData,
      },
    });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  setNextClick = () => {
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveIsDisplay', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        nextClick: true,
      },
    });
  };

  // 接受清分规则数据
  getClearData = data => {
    this.props.dispatch({
      type: 'tableList/saveParam',
      payload: {
        id: 'saveClearRuleList',
        data: data,
      },
    });
  };

  // 传值校验先不做
  handleAddOk = async () => {
    try {
      this.setNextClick();
      if (this.props.clearRuleData?.length > 0) {
        this.clear.pushFileTempl();
      }
      // await this.checkFormRef.current.validateFields();
      // this.checkFormRef.current.getFieldsValue();
      // await this.splitFormRef.current.validateFields();
      // this.splitFormRef.current.getFieldsValue();
      this.fileCheckTo();
      this.fileSplitTo();
      this.props.skipToSec(2);
    } catch (error) {
      console.log(error);
      message.destroy();
      message.error('请完成必要字段的填写');
    } finally {
    }
  };

  render() {
    return (
      <div className={styles.batchTaskConfig}>
        <BatchNodeTable translateDisplay={this.getDisplay} />
        <div style={{ display: this.props.fileListDisplay }}>
          {/* 批次流程表 */}
          <div className={styles.fileList} id="fileList">
            {/* <Table
            className={styles.batchMesTable}
            columns={this.state.columns}
            dataSource={this.state.nodesInfo}
            pagination={false}
          /> */}
          </div>
          {/* 文件检查表 */}
          <div
            className={styles.fileCheckForm}
            id="fileCheckForm"
            style={{ display: this.state.display }}
          >
            <Form
              {...layout}
              name="checkForm"
              validateMessages={this.validateMessages}
              ref={this.checkFormRef}
              initialValues={{
                batType: this.props.batType.label,
                chnNo: this.props.chnNo.label,
                busCode: this.props.busCode.label,
              }}
            >
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
                      },
                    ]}
                  >
                    <Input readOnly />
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
                    <Input readOnly />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item
                    name="summaryColNum"
                    label="汇总信息总栏位数"
                    rules={[
                      {
                        pattern: /^[0-9]*$/,
                        message: '汇总信息总栏位数为数字',
                      },
                    ]}
                  >
                    <Input placeholder="汇总栏总位数，如：11" maxLength={3} />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="detailColNum"
                    label="明细文件栏位数"
                    rules={[
                      {
                        pattern: /^[0-9]*$/,
                        message: '明细文件栏位数为数字',
                      },
                    ]}
                  >
                    <Input
                      placeholder="明细文件栏总位数，如：17"
                      maxLength={3}
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="summaryAmtPos"
                    label="总金额栏位位置"
                    rules={[
                      { pattern: /^[0-9]*$/, message: '总金额栏位位置为数字' },
                    ]}
                  >
                    <Input
                      placeholder="明细行中第某列为金额栏位，如：8"
                      maxLength={2}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item
                    name="summaryNumPos"
                    label="总笔数栏位位置"
                    rules={[
                      { pattern: /^[0-9]*$/, message: '总笔数栏位位置为数字' },
                    ]}
                  >
                    <Input
                      placeholder="明细行中第某列为笔数栏位，如：4"
                      maxLength={2}
                    />
                  </Form.Item>
                </Col>
                <Col flex="3px"></Col>
                <Col span={8} style={{ marginLeft: '19px' }}>
                  <Form.Item
                    name="checkRule"
                    label="校验规则"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio
                        value="00"
                        onClick={() => {
                          this.setState({ checkPancel: false });
                        }}
                      >
                        校验金额和笔数
                      </Radio>
                      <Radio
                        value="01"
                        onClick={() => {
                          this.setState({ checkPancel: true });
                        }}
                      >
                        只校验笔数
                      </Radio>
                      <Radio
                        value="02"
                        onClick={() => {
                          this.setState({ checkPancel: false });
                        }}
                      >
                        只校验金额
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={7} style={{ marginLeft: '-82px' }}>
                  {!this.state.checkPancel && (
                    <Form.Item
                      name="checkPos"
                      label="金额校验位"
                      rules={[
                        {
                          pattern: /^[0-9]*$/,
                          message: '金额检查位只能为数字',
                        },
                      ]}
                    >
                      <Input
                        placeholder="标识金额是第几个栏位，如：17"
                        maxLength={2}
                      />
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
          {/* 文件拆分表 */}
          <div
            className={styles.fileSplitForm}
            id="fileSplitForm"
            style={{ display: this.state.display }}
          >
            <Form
              {...layout}
              name="splitForm"
              validateMessages={this.validateMessages}
              ref={this.splitFormRef}
              scrollToFirstError={true}
              initialValues={{
                batType: this.props.batType.label,
                chnNo: this.props.chnNo.label,
                busCode: this.props.busCode.label,
              }}
            >
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
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="busCode"
                    label="业务代码"
                    rules={[{ required: true }]}
                  >
                    <Input readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item
                    name="splitRule"
                    label="拆分规则"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      <Radio value="00">阀值拆分</Radio>
                      <Radio value="01" disabled>
                        分组拆分
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item
                    name="bufferSize"
                    label="缓冲池大小"
                    rules={[
                      {
                        required: true,
                        pattern: /^[0-9]*$/,
                        message: '只能为数字',
                      },
                    ]}
                  >
                    <Input placeholder={'输入数字'} maxLength={10} />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="maxRecordSize"
                    label="拆分记录数"
                    rules={[
                      {
                        required: true,
                        pattern: /^[0-9]*$/,
                        message: '只能为数字',
                      },
                    ]}
                  >
                    <Input placeholder={'例如: 1000'} maxLength={10} />
                  </Form.Item>
                  <Tooltip
                    title={
                      '判断条件：预计算拆分文件数 > 配置的最大拆分文件数 ? 按照最大拆分文件数进行拆分 : 按照单文件最大记录数进行拆分;可以配置配置的最大拆分文件数: 5单文件最大记录数: 500(文件记录数/单文件最大记录数) > 配置的最大拆分文件数 ?  执行1 : 执行2执行1 :  单文件条数 = (文件记录数/配置的最大拆分文件数)= count .........n  ,余数n的记录数加在第一个文件文件个数 = 配置的最大拆分文件数执行2 :  单文件条数 = 单文件最大记录数文件个数 = (文件记录数/单文件最大记录数)'
                    }
                  >
                    <ExclamationCircleOutlined className={styles.icons} />
                  </Tooltip>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="maxFileNum"
                    label="最大拆分文件数"
                    rules={[
                      {
                        required: true,
                        pattern: /^[0-9]*$/,
                        message: '只能为数字',
                      },
                    ]}
                  >
                    <Input placeholder={'例如: 24'} maxLength={10} />
                    {/* &nbsp;&nbsp; */}
                  </Form.Item>
                  <Tooltip
                    title={
                      '判断条件：预计算拆分文件数 > 配置的最大拆分文件数 ? 按照最大拆分文件数进行拆分 : 按照单文件最大记录数进行拆分;可以配置配置的最大拆分文件数: 5单文件最大记录数: 500(文件记录数/单文件最大记录数) > 配置的最大拆分文件数 ?  执行1 : 执行2执行1 :  单文件条数 = (文件记录数/配置的最大拆分文件数)= count .........n  ,余数n的记录数加在第一个文件文件个数 = 配置的最大拆分文件数执行2 :  单文件条数 = 单文件最大记录数文件个数 = (文件记录数/单文件最大记录数)'
                    }
                  >
                    <ExclamationCircleOutlined className={styles.icons} />
                  </Tooltip>
                </Col>
              </Row>
            </Form>
          </div>

          {/* 一清二拆配置项 */}
          <div
            id="clearDismantle"
            className={styles.clearDismantle}
            style={{ display: 'none' }}
          >
            {/* 一清二拆组件 */}
            <ClearDismantle
              pushClearData={this.getClearData}
              onRef={this.clearRef}
              showFileTemplConfig={this.props.showFileTemplConfig}
            />
          </div>
        </div>
        <Button
          className={styles.addNewBatch}
          type="primary"
          onClick={this.handleAddOk}
          style={{
            marginTop: this.props.display
              ? '40px'
              : this.props.nextClick
              ? '40px'
              : '24px',
          }}
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
    display,
    fileListDisplay,
    param,
    importData,
    clearRuleData,
  } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
    display,
    fileListDisplay,
    param,
    importData,
    clearRuleData,
  };
};

export default connect(mapStateToProps)(BatchProcessSet);
