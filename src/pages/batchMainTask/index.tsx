import React from 'react';
import styles from './index.less';
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
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import Header from '../components/Header';
import {
  batchMainTask,
  getBatchType,
  getChnNo,
  getBusCode, //下拉列表公共数据
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
class BatchMainTask extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    total: '0',
    isLookModalVisible: false,
    columns: [
      {
        title: '投递单号',
        dataIndex: 'reqJrno',
        key: 'reqJrno',
        align: 'left',
      },
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
        title: '运行状态',
        align: 'left',
        dataIndex: 'batStatus',
        key: 'batStatus',
        /*  render: (text, record) => {
          if (record.batStatus == '00') return <span>待执行</span>;
          else if (record.batStatus == '01') return <span>执行中</span>;
          else if (record.batStatus == '02') return <span>执行完成</span>;
          else if (record.batStatus == '03') return <span>执行失败</span>;
        }, */
      },
      {
        title: '交易日期',
        align: 'left',
        dataIndex: 'acDte',
        key: 'acDte',
      },
      {
        title: '操作',
        align: 'left',

        key: 'action',
        render: (text, record) => (
          <div>
            <img
              src={require('@/assets/common/eye.png')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              onClick={() => this.showLookModal(record.seqNo)}
            />
          </div>
        ),
      },
    ],
    MainTaskData: [],
    pageSize: 10,
    pageNum: 1,
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
  lookFormRef = React.createRef();
  searchFormRef = React.createRef();

  //展开搜索框
  spread = () => {
    this.setState({
      isSpread: !this.state.isSpread,
    });
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
              <div className={styles.dataTitle}>数据查看</div>
            </div>
          }
          onCancel={() => {
            this.setState({
              isLookModalVisible: false,
            });
          }}
          width={1000}
        >
          <Scrollbars autoHeightMax={600} autoHide autoHeight>
            <Form
              labelAlign="left"
              name="look"
              ref={this.lookFormRef}
              {...show}
              className={styles.lookForm}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="投递单号"
                    name="reqJrno"
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
                    label="上传文件名称"
                    name="fileName"
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
                    label="渠道号"
                    name="chnNo"
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
                    label="下行文件名称"
                    name="dowloadFileName"
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
                    label="主批次号"
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
                    label="下行文件路径"
                    name="dowloadFilePath"
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
                    name="busCode"
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
                    label="委托单位账号"
                    name="batAcctNo"
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
                    label="委托单位账户名"
                    name="batAcctName"
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
                    name="acDte"
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
                    label="手续费扣收帐号"
                    name="feeAcctNo"
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
                    label="上传日期"
                    name="uploadDate"
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
                    label="总金额"
                    name="batAmt"
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
                    label="存储路径"
                    name="filePath"
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
                    label="总笔数"
                    name="batNum"
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
                    label="运行状态"
                    name="batStatus"
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
                <Form.Item label="投递单号" name="reqJrno">
                  <Input
                    placeholder="请输入投递单号"
                    value={this.state.reqJrno}
                  />
                </Form.Item>
              </Col>
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
                <Form.Item label="渠道号" name="chnNo">
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
                <Form.Item label="业务代码" name="busCode">
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
                    <Input
                      placeholder="请输入主批次号"
                      value={this.state.batNo}
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="运行状态" name="batStatus">
                    <Select placeholder="请选择运行状态">
                      {this.state.batStatusArr.map(item => (
                        <Option value={item.paramKey}>{item.paramValue}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    label="交易日期"
                    name="acDte"
                    className={styles.antFormItem}
                  >
                    <DatePicker
                      placeholder="请选择交易日期"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={5} style={{ display: 'none' }}>
                  <Form.Item
                    label="上传日期"
                    name="uploadDate"
                    className={styles.antFormItem}
                  >
                    <DatePicker
                      placeholder="请选择上传日期"
                      style={{ width: '100%' }}
                    />
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
              rowKey={record => record.seqNo}
              dataSource={this.state.MainTaskData}
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
      data: { paramType: 'lstatus' },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          batStatusArr: res.body,
        });
      }
    });
  };
  //获取数据
  getData = () => {
    const { pageNum, pageSize } = this.state;
    const Params = this.searchFormRef.current.getFieldsValue();
    this.state.batTypeArr.map((item: any) => {
      if (item.key === Params.batType) {
        Params.batType = item.showKey;
      }
    });
    if (Params && Params.acDte != undefined)
      Params.acDte = moment(Params.acDte).format('YYYY-MM-DD');
    if (Params && Params.uploadDate != undefined)
      Params.uploadDate = moment(Params.uploadDate).format('YYYY-MM-DD');
    batchMainTask({
      stdSvcInd: 'BatchRegisterSVC',
      stdIntfcInd: 'getControlTaskInfo',
      data: { ...Params, pageNum, pageSize },
    }).then(res => {
      if (res && res.body) {
        res.body.list.forEach((item, index) => {
          if (item.batStatus == 'EA') item.batStatus = '可执行';
          else if (item.batStatus == 'RU') item.batStatus = '执行中';
          else if (item.batStatus == 'SU') item.batStatus = '执行成功';
          else if ((item.batStatus = 'FA')) item.batStatus = '执行失败';
        });
        this.setState({
          MainTaskData: res.body.list,
          total: res.body.total,
          pageSize: res.body.pageSize,
          pageNum: res.body.pageNum,
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
  showLookModal = seqNo => {
    const { MainTaskData } = this.state;
    console.log('MainTaskData', MainTaskData);

    this.setState(
      {
        isLookModalVisible: true,
      },
      () => {
        let index = MainTaskData.findIndex((item, index) => {
          return item.seqNo == seqNo;
        });
        if (index != -1) {
          this.lookFormRef.current.setFieldsValue(MainTaskData[index]);
        }
      },
    );
  };
  //分页
  onPaginationChange = (pageNum, pageSize) => {
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
}
export default BatchMainTask;
