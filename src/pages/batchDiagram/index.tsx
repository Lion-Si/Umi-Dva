import React from 'react';
import styles from './index.less';
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  DatePicker,
  Table,
  Modal,
  ConfigProvider,
  Progress,
  Tooltip,
} from 'antd';
import {
  batchDiagram,
  getBatchType,
  getChnNo,
  getBusCode,
  getCommonCode,
} from './service.js';
import moment from 'moment';
import {
  EyeOutlined,
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import RunDiagram from './runDiagram';
import Header from '../components/Header';
import { Link } from 'umi';
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

class batachDiagram extends React.Component {
  state = {
    columns: [
      {
        title: '主批次号',
        dataIndex: 'batNo',
        key: 'batNo',
        align: 'left',
      },
      {
        title: '批量类型',
        dataIndex: 'batTypeDesc',
        key: 'batTypeDesc',
        align: 'left',
      },
      {
        title: '渠道号',
        dataIndex: 'chnNo',
        key: 'chnNo',
        align: 'left',
        // render: (text, record) => {
        //   let tmp = this.state.chnNoArr.find(
        //     (item, index) => item.key == record.chnNo,
        //   );
        //   if (tmp) {
        //     return <span>{tmp.value}</span>;
        //   }
        // },
      },
      {
        title: '业务代码',
        dataIndex: 'busCode',
        key: 'busCode',
        align: 'left',
      },
      {
        title: '投递单号',
        dataIndex: 'reqJrno',
        key: 'reqJrno',
        align: 'left',
      },
      {
        title: '交易日期',
        dataIndex: 'acDte',
        key: 'acDte',
        align: 'left',
      },
      {
        title: '运行进度',
        dataIndex: 'progress',
        key: 'progress',
        align: 'left',
        render: (text, record) => {
          return (
            <div style={{ width: 54 }}>
              <Tooltip title={record.progress + '%'}>
                <Progress
                  percent={record.progress}
                  size="small"
                  showInfo={false}
                  trailColor="#cad6ff"
                  strokeColor="#3f67ed"
                />
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: '运行状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, record) => {
          if (record.status == 'NS')
            return (
              <Tooltip title="未开始">
                <img
                  src={require('@/assets/batchDiagram/notStartLogo.svg')}
                  alt=""
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            );
          else if (record.status == 'EA')
            return (
              <Tooltip title="可运行">
                <img
                  src={require('@/assets/batchDiagram/enableExeLogo.svg')}
                  alt=""
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            );
          else if (record.status == 'RU')
            return (
              <Tooltip title="运行中">
                <img
                  src={require('@/assets/batchDiagram/doingLogo.svg')}
                  alt=""
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            );
          else if (record.status == 'SU')
            return (
              <Tooltip title="运行成功">
                <img
                  src={require('@/assets/batchDiagram/succLogo.svg')}
                  alt=""
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            );
          else if (record.status == 'FA')
            return (
              <Tooltip title="运行失败">
                <img
                  src={require('@/assets/batchDiagram/failLogo.svg')}
                  alt=""
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            );
          else if (record.status == 'RETRY')
            return (
              <Tooltip title="重试">
                <img
                  src={require('@/assets/batchDiagram/retryLogo.svg')}
                  alt=""
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            );
        },
      },
      {
        title: '运行图',
        align: 'left',
        key: 'action',
        render: (text, record) => (
          <div>
            <Button
              type="primary"
              size="small"
              onClick={() => this.showDiagram(record)}
            >
              查看
            </Button>
          </div>
        ),
      },
    ],
    DiagramData: [],
    total: '0',
    pageNum: '1',
    pageSize: '10',
    isDiagramVisible: false,
    isTableVisible: 'block',
    currentRecord: '',
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
  getData = () => {
    const { pageSize, pageNum } = this.state;
    const Params = this.searchFormRef.current.getFieldsValue();
    this.state.batTypeArr.map((item: any) => {
      if (item.key === Params.batType) {
        Params.batType = item.showKey;
      }
    });
    if (Params.acDte) Params.acDte = moment(Params.acDte).format('YYYY-MM-DD');
    if (Params.uploadDate)
      Params.uploadDate = moment(Params.uploadDate).format('YYYY-MM-DD');
    batchDiagram({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'getRunTask',
      data: {
        pageSize,
        pageNum,
        ...Params,
      },
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        this.setState({
          DiagramData: res.body.list,
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
        console.log('batType:', this.state.batTypeArr);
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
  search = () => {
    this.setState(
      {
        pageSize: 10,
        pageNum: 1,
      },
      () => this.getData(),
    );
  };
  //展示流程节点
  showDiagram = record => {
    this.setState({
      isDiagramVisible: true,
      isTableVisible: 'none',
      currentRecord: record,
    });
  };
  //获取节点数据列表
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
  //展开搜索框
  spread = () => {
    this.setState({
      isSpread: !this.state.isSpread,
    });
  };
  //切换
  setDisplay = (bol1, bol2) => {
    this.setState({
      isTableVisible: bol1,
      isDiagramVisible: bol2,
    });
  };
  render() {
    return (
      <div className={styles.diagram}>
        <Header />
        <div style={{ display: this.state.isTableVisible }}>
          <Card bordered={false}>
            <Form
              {...layout}
              name="batchDiagram"
              onFinish={this.search}
              ref={this.searchFormRef}
            >
              <Row>
                <Col span={5}>
                  <Form.Item label="投递单号" name="reqJrno">
                    <Input placeholder="请输入投递单号"></Input>
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
                      placeholder="请选择渠道号"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
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
                      placeholder="请选择业务代码"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
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
                    style={{ marginLeft: 30 }}
                  >
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: 30 }}
                    onClick={() => {
                      this.searchFormRef.current.resetFields();
                      this.setState(
                        {
                          pageNum: 1,
                          pageSize: 10,
                        },
                        () => this.getData(),
                      );
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
              <Row>
                {this.state.isSpread && (
                  <>
                    <Col span={5}>
                      <Form.Item label="主批次号" name="batNo">
                        <Input placeholder="请输入主批次号"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      {/* 需要修改 */}
                      <Form.Item label="运行状态" name="batStatus">
                        <Select placeholder="请选择任务状态">
                          {this.state.batStatusArr.map(item => (
                            <Option value={item.paramKey}>
                              {item.paramValue}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="交易日期" name="acDte">
                        <DatePicker
                          placeholder="请选择交易日期"
                          style={{ width: '100%' }}
                        ></DatePicker>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="上传日期" name="uploadDate">
                        <DatePicker
                          style={{ width: '100%' }}
                          placeholder="请选择上传日期"
                        ></DatePicker>
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>
            </Form>
          </Card>
          <div>
            <Card style={{ marginTop: '16px' }} bordered={false}>
              <ConfigProvider locale={zhCN}>
                <Table
                  className={styles.tableHeader}
                  columns={this.state.columns}
                  rowKey={record => record.seqNo}
                  dataSource={this.state.DiagramData}
                  pagination={{
                    showTotal: total => `共${this.state.total}条数据`,
                    pageSizeChanger: true,
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
        </div>
        {/* 运行图 */}
        {this.state.isDiagramVisible && (
          <RunDiagram
            setDisPlay={this.setDisplay}
            currentRecord={this.state.currentRecord}
            batTypeArr={this.state.batTypeArr}
            chnNoArr={this.state.chnNoArr}
            pageNum={this.state.pageNum}
            pageSize={this.state.pageSize}
          ></RunDiagram>
        )}
      </div>
    );
  }
}

export default batachDiagram;
