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
import Header from '../components/Header';
import {
  EyeOutlined,
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  batchAbnormalFlow,
  getBatchType,
  getChnNo,
  getBusCode,
} from './service.js';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import { Link } from 'umi';
import { Item } from 'gg-editor';

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
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
class AbnormalFlow extends React.Component {
  state = {
    total: '0',
    pageSize: '10',
    pageNum: '1',
    isLookModalVisible: false,
    isSpread: false,
    columns: [
      {
        title: '批量名称',
        dataIndex: 'batchDesc',
        key: 'batchDesc',
        align: 'left',
      },
      {
        title: '主次批号',
        dataIndex: 'batNo',
        key: 'batNo',
        align: 'left',
      },
      {
        title: '子次批号',
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
        title: '错误码',
        dataIndex: 'errCde',
        key: 'errCde',
        align: 'left',
      },
      {
        title: '错误描述',
        dataIndex: 'errInf',
        key: 'errInf',
        align: 'left',
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
                this.showLookModal(record.seqNo);
              }}
            />
          </div>
        ),
      },
    ],
    AbnormalFlowData: [],
    batTypeArr: [],
    chnNoArr: [],
    busCodeArr: [],
  };
  componentDidMount() {
    this.getSelectData();
    this.homeToSearchError();
  }
  lookFormRef = React.createRef();
  searchFormRef = React.createRef();

  //展开搜索框
  spread = () => {
    this.setState({
      isSpread: !this.state.isSpread,
    });
  };

  //首页跳转异常查询 or 正常访问页面查询数据
  homeToSearchError = () => {
    if (this.props.location.query.batNo) {
      this.searchFormRef.current.setFieldsValue({
        batNo: this.props.location.query.batNo,
      });
      this.setState(
        {
          isSpread: true,
        },
        () => {
          this.getData();
        },
      );
    } else {
      this.getData();
    }
  };

  render() {
    return (
      <div>
        <Header />
        <Modal
          visible={this.state.isLookModalVisible}
          centered
          footer={null}
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
                    label="执行服务名称"
                    name="srvName"
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
                    label="处理记录数"
                    name="pssRecCnt"
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
                    label="错误堆栈信息"
                    name="errStk"
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
                    label="关键信息"
                    name="errKey"
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
                    label="错误码"
                    name="errCde"
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
                    label="文件类型"
                    name="fileType"
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
                    label="错误描述"
                    name="errInf"
                    className={styles.formLabel}
                  >
                    <TextArea
                      bordered={false}
                      autoSize={{ minRows: 1, maxRows: 4 }}
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
              <Col span={6}>
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
              <Col span={6}>
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
              <Col span={6}>
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
              <Col span={4}>
                <div>
                  <Button
                    style={{ marginLeft: 36, marginRight: 36 }}
                    type="primary"
                    htmlType="submit"
                  >
                    查询
                  </Button>
                  <Button
                    style={{ marginRight: 36 }}
                    onClick={() => {
                      this.searchFormRef.current.resetFields();
                      this.getData();
                    }}
                  >
                    重置
                  </Button>
                </div>
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
                <Col span={6}>
                  <Form.Item label="主批次号" name="batNo">
                    <Input
                      placeholder="请输入主批次号"
                      value={this.state.batNo}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="错误码" name="errCde">
                    <Input placeholder="请输入错误码" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="子批次号" name="subBatNo">
                    <Input placeholder="请输入子批次号" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="交易日期" name="consmPltfmDt">
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="请选择交易日期"
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
              rowKey={record => record.seqNo}
              columns={this.state.columns}
              dataSource={this.state.AbnormalFlowData}
              pagination={{
                showTotal: total => `共${this.state.total || 0}条数据`,
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
    console.log('Params', Params, this.state.batTypeArr);
    this.state.batTypeArr.map((item: any) => {
      if (item.key === Params.batType) {
        Params.batType = item.showKey;
      }
    });
    if (Params && Params.consmPltfmDt != undefined) {
      Params.consmPltfmDt = moment(Params.consmPltfmDt).format('YYYY-MM-DD');
    }
    batchAbnormalFlow({
      stdSvcInd: 'BatchRegisterSVC',
      stdIntfcInd: 'getAbnormalFlowListInfo',
      data: { ...Params, pageNum, pageSize },
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        this.setState({
          AbnormalFlowData: res.body.list,
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
      if (res && res.body && res.sysHead.retCd == '000000') {
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
    //渠道号
    // getChnNo({
    //   stdSvcInd: 'BatchPandectSVC',
    //   stdIntfcInd: 'getCommonCode',
    //   data: { paramType: 'chnNo' },
    // }).then(res => {
    //   if (res && res.body) {
    //     let tmpArr = res.body.map((item, index) => {
    //       return {
    //         key: item.paramKey,
    //         value: item.paramValue,
    //       };
    //     });
    //     this.setState({
    //       chnNoArr: tmpArr,
    //     });
    //   }
    // });
    //业务代码
    getBusCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'busCode' },
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
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
    const { AbnormalFlowData } = this.state;
    this.setState(
      {
        isLookModalVisible: true,
      },
      () => {
        let index = AbnormalFlowData.findIndex((item, index) => {
          return item.seqNo == seqNo;
        });
        if (index != -1) {
          this.lookFormRef.current.setFieldsValue(AbnormalFlowData[index]);
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
export default AbnormalFlow;
