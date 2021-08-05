import React from 'react';
import styles from './index.less';
import iconfont from './iconfont.css';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Card,
  Row,
  Col,
  DatePicker,
  Table,
  Tag,
  Pagination,
  Modal,
  Popconfirm,
  message,
  Divider,
  ConfigProvider,
} from 'antd';
const { TextArea } = Input;
import {
  EyeOutlined,
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import Header from '../components/Header';
import {
  batchInfoRegister,
  getBatchType,
  getChnNo,
  getBusCode,
  getCommonCode,
} from './service.js';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import { Link } from 'umi';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};
const show = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

class BatchInfoRegister extends React.Component {
  state = {
    total: '0',
    pageSize: '10',
    pageNum: '1',
    isLookModalVisible: false,
    columns: [
      {
        title: '批量名称',
        dataIndex: 'batchDesc',
        key: 'batchDesc',
        align: 'left',
      },
      {
        title: '主批次号',
        dataIndex: 'batNo',
        key: 'batNo',
        align: 'left',
      },
      {
        title: '子批次号',
        dataIndex: 'subBatNo',
        key: 'subBatNo',
        align: 'left',
      },

      {
        title: '交易日期',
        dataIndex: 'consmPltfmDt',
        key: 'consmPltfmDt',
        align: 'left',
      },
      {
        title: '分片文件名',
        dataIndex: 'subFileName',
        key: 'subFileName',
        align: 'left',
      },

      {
        title: '运行状态',
        dataIndex: 'sts',
        align: 'left',
        key: 'sts',
        render: (text, record) => {
          if (record.sts == 'RU') return <span>运行中</span>;
          else if (record.sts == 'SU') return <span>运行成功</span>;
          else if (record.sts == 'FA') return <span>运行失败</span>;
          else if (record.sts == 'IR') return <span>运行中断</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        align: 'left',
        render: (text, record) => (
          <div>
            <img
              src={require('@/assets/common/eye.png')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              onClick={() => {
                this.showLookModal(record.subBatNo);
              }}
            />
          </div>
        ),
      },
    ],
    InfoRegisterData: [],
    batTypeArr: [],
    chnNoArr: [],
    busCodeArr: [],
    batStatusArr: [],
    isSpread: false,
  };
  componentDidMount() {
    this.getSelectData();
    this.getData();
  }
  searchFormRef = React.createRef();
  lookFormRef = React.createRef();

  //展开搜索框
  spread = () => {
    this.setState({
      isSpread: !this.state.isSpread,
    });
  };

  //分页
  onPaginationChange = (pageNum, pageSize) => {
    console.log(pageNum, pageSize);
    this.setState(
      {
        pageNum,
        pageSize,
      },
      () => {
        this.getData();
      },
    );
  };

  render() {
    return (
      <div>
        <Header />
        <Modal
          visible={this.state.isLookModalVisible}
          footer={null}
          centered
          title={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0px',
              }}
            >
              <img
                src={require('@/assets/common/parHead.svg')}
                style={{ width: '24px', height: '24px', marginRight: '12px' }}
              />
              <div>数据查看</div>
            </div>
          }
          onCancel={() => {
            this.setState({
              isLookModalVisible: false,
            });
          }}
          width={800}
        >
          <Scrollbars autoHeightMax={600} autoHide autoHeight>
            <Form
              labelAlign={'left'}
              name="look"
              ref={this.lookFormRef}
              {...show}
              className={styles.lookForm}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="批量类型"
                    name="batType"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="错误金额"
                    name="errAmt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label=" 渠道号"
                    name="chlNo"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label=" 成功笔数"
                    name="sucCnt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="业务代码"
                    name="txnCode"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="错误笔数"
                    name="errCnt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="主流水号"
                    name="batNo"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="借方成功笔数"
                    name="drSucCnt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="子批次号"
                    name="subBatNo"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="借方成功金额"
                    name="drSucAmt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label=" 分片文件名"
                    name="subFileName"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="借方错误笔数"
                    name="drErrCnt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="交易日期"
                    name="consmPltfmDt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="借方错误金额"
                    name="drErrAmt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="分片文件路径"
                    name="subFilePath"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="贷方成功笔数"
                    name="crSucAmt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="登记总金额"
                    name="regTotAmt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="贷方成功金额"
                    name="crSucCnt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="登记总笔数"
                    name="regTotCnt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="贷方错误笔数"
                    name="crErrCnt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="成功金额"
                    name="sucAmt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="贷方错误金额"
                    name="crErrAmt"
                    className={styles.formLabel}
                  >
                    <Input
                      bordered={false}
                      disabled
                      className={styles.showInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Scrollbars>
        </Modal>

        <Card className={styles.antCardBody}>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            labelAlign="right"
            onFinish={this.search}
            ref={this.searchFormRef}
          >
            <Row>
              <Col span={5}>
                <Form.Item label="批量类型" name="batType">
                  <Select
                    showSearch
                    onChange={this.setSelectBatType}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择批量类型"
                  >
                    {this.state.batTypeArr.map((item, index) => (
                      <Option value={item.key} key={index}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="业务代码" name="txnCode">
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择业务代码"
                  >
                    {this.state.busCodeArr.map((item, index) => (
                      <Option value={item.key} key={index}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="渠道号" name="chlNo" labelCol={{ span: 6 }}>
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择渠道号"
                  >
                    {this.state.chnNoArr.map((item, index) => (
                      <Option value={item.paramKey} key={index}>
                        {item.paramValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="交易日期" name="consmPltfmDt">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择交易日期"
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 30 }}
                >
                  查询
                </Button>
                <Button
                  style={{ marginRight: 30 }}
                  onClick={() => {
                    this.searchFormRef.current.resetFields();
                    this.getData();
                  }}
                >
                  重置
                </Button>
              </Col>
              <Col span={1}>
                <Button
                  onClick={this.spread}
                  type="link"
                  className={styles.selectButton}
                >
                  {this.state.isSpread ? (
                    <span>
                      展开&nbsp;&nbsp;
                      <CaretDownOutlined className={styles.iconColor} />
                    </span>
                  ) : (
                    <span>
                      展开&nbsp;&nbsp;
                      <CaretUpOutlined className={styles.iconColor} />
                    </span>
                  )}
                </Button>
              </Col>
            </Row>
            {this.state.isSpread && (
              <Row>
                <Col span={5}>
                  <Form.Item label="主批次号" name="batNo">
                    <Input placeholder="请输入主批次号" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="子批次号" name="subBatNo">
                    <Input placeholder="请输入子批次号" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    label="分片文件名"
                    name="subFileName"
                    labelCol={{ span: 6 }}
                  >
                    <Input
                      placeholder="请输入分片文件名"
                      value={this.state.subFileName}
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="运行状态" name="sts">
                    <Select placeholder="请选择运行状态">
                      {this.state.batStatusArr.map(item => (
                        <Option value={item.paramKey}>{item.paramValue}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form>
        </Card>
        <Card style={{ marginTop: '16px' }}>
          <ConfigProvider locale={zhCN}>
            <Table
              className={styles.tableHeader}
              columns={this.state.columns}
              //rowKey={record => record.subBatNo}
              dataSource={this.state.InfoRegisterData}
              pagination={{
                showTotal: total => `共${this.state.total}条数据`,
                showSizeChanger: true,
                onChange: (page, pageSize) =>
                  this.onPaginationChange(page, pageSize),
                pageSize: this.state.pageSize,
                pageSizeOptions: ['5', '10', '15'],
                total: this.state.total,
                current: this.state.pageNum,
              }}
            ></Table>
          </ConfigProvider>
        </Card>
      </div>
    );
  }
  //获取数据
  getData = () => {
    const { pageNum, pageSize } = this.state;
    const Params = this.searchFormRef.current.getFieldsValue();
    this.state.batTypeArr.map((item: any) => {
      if (item.key === Params.batType) {
        Params.batType = item.showKey;
      }
    });
    if (Params && Params.consmPltfmDt != undefined) {
      Params.consmPltfmDt = moment(Params.consmPltfmDt).format('YYYY-MM-DD');
    }

    batchInfoRegister({
      stdSvcInd: 'BatchRegisterSVC',
      stdIntfcInd: 'getInformationRegisrationInfo',
      data: {
        pageSize,
        pageNum,
        ...Params,
      },
    }).then(res => {
      if (res && res.body) {
        this.setState({
          InfoRegisterData: res.body.list,
          total: res.body.total,
          pageSize: res.body.pageSize,
          pageNum: res.body.pageNum,
        });
      }
    });
  };

  //选中批量类型
  setSelectBatType = (value: any) => {
    getChnNo({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: value },
    }).then((res: any) => {
      this.setState({
        chnNoArr: res.body,
      });
    });
  };

  //获取下拉框数据
  getSelectData = () => {
    //批量类型
    getBatchType({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'batType' },
    }).then(res => {
      if (res && res.body) {
        let tmpArr = res.body.map((item, index) => {
          return {
            showKey: item.paramParent,
            key: item.paramKey,
            value: item.paramValue,
          };
        });
        this.setState({
          batTypeArr: tmpArr,
        });
      }
    });
    //业务代码
    getBusCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'busCode' },
    }).then(res => {
      if (res && res.body) {
        let tmpArr = res.body.map((item, index) => {
          return {
            key: item.paramKey,
            value: item.paramValue,
          };
        });
        this.setState({
          busCodeArr: tmpArr,
        });
      }
    });
    //获取运行等级
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'rstatus' },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          batStatusArr: res.body,
        });
      }
    });
  };
  //查询
  search = () => {
    this.setState(
      {
        pageSize: 10,
        pageNum: 1,
      },
      () => this.getData(),
    );
  };
  //查看弹框 回显数据
  showLookModal = subBatNo => {
    const { InfoRegisterData } = this.state;
    this.setState(
      {
        isLookModalVisible: true,
      },
      () => {
        let index = InfoRegisterData.findIndex((item, index) => {
          return item.subBatNo == subBatNo;
        });
        if (index != -1)
          this.lookFormRef.current.setFieldsValue(InfoRegisterData[index]);
      },
    );
  };
}
export default BatchInfoRegister;
