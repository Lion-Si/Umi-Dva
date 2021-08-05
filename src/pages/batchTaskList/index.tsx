import React from 'react';
import styles from './index.less';
import iconfont from './iconfont.css';
import Import from '../components/Import/index';
import Clone from '../components/Clone/index';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Card,
  Row,
  Col,
  Table,
  Modal,
  Popconfirm,
  message,
  ConfigProvider,
} from 'antd';
import { cloneDeep } from 'lodash';
import {
  EyeOutlined,
  FormOutlined,
  DeleteOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  batchTaskList,
  getBatchType,
  getChnNo,
  getBusCode,
  getBatTypeFlag,
  deleteBatchConfigMessage,
} from './service.js';
import Header from '../components/Header';
import zhCN from 'antd/lib/locale/zh_CN';
import { Link } from 'umi';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
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

class BatchTaskList extends React.Component {
  state = {
    total: '0',
    pageSize: '10',
    pageNum: '1',
    isLookModalVisible: false,
    //表格选中框
    selectedRowKeys: [],
    columns: [
      {
        title: '序号',
        dataIndex: 'num',
        key: 'num',
        align: 'left',
        width: '10%',
      },
      {
        title: '批量名称',
        dataIndex: 'batchDesc',
        key: 'batchDesc',
        align: 'left',
        ellipsis: true,
      },
      {
        title: '批量类型',
        dataIndex: 'batTypeDesc',
        key: 'batTypeDesc',
        align: 'left',
        ellipsis: true,
      },
      {
        title: '渠道号',
        dataIndex: 'chnNo',
        key: 'chnNo',
        align: 'left',
      },
      {
        title: '业务代码',
        dataIndex: 'busCode',
        key: 'busCode',
        align: 'left',
        ellipsis: true,
        render: (text, record) => {
          let tmp = this.state.busCodeArr.find(
            (item, index) => item.key == record.busCode,
          );

          return <span>{tmp ? tmp.value : record.busCode}</span>;
        },
      },

      //先进行隐藏，之后当数据有之后在释放
      // {
      //   title: '创建时间',
      //   dataIndex: 'crtTmstmp',
      //   key: 'crtTmstmp',
      //   align: 'left',
      //   ellipsis: true,
      // },
      // {
      //   title: '创建用户',
      //   dataIndex: 'crtTlrNo',
      //   key: 'crtTlrNo',
      //   align: 'left',
      // },
      // {
      //   title: '修改时间',
      //   dataIndex: 'modTmstmp',
      //   key: 'modTmstmp',
      //   align: 'left',
      //   ellipsis: true,
      // },
      // {
      //   title: '修改用户',
      //   dataIndex: 'modTlrNo',
      //   key: 'modTlrNo',
      //   align: 'left',
      // },
      {
        title: '操作',
        key: 'action',
        align: 'left',
        render: (text, record) => (
          <div>
            <img
              src={require('@/assets/common/eye.png')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              onClick={() => this.gotoTaskConfigLook(record)}
            />
            <span
              style={{ width: '15px', height: '15px', display: 'inline-block' }}
            ></span>
            <img
              src={require('@/assets/common/editor.png')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              onClick={() => this.gotoTaskConfigEdit(record)}
            />
            <span
              style={{ width: '15px', height: '15px', display: 'inline-block' }}
            ></span>

            <Popconfirm
              title="确认要删除这条数据吗？"
              onConfirm={() => {
                this.delete(record);
              }}
              onCancel={() => {}}
              okText="确定"
              cancelText="取消"
            >
              {
                <img
                  src={require('@/assets/common/delete.png')}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              }
            </Popconfirm>
            <span
              style={{ width: '15px', height: '15px', display: 'inline-block' }}
            ></span>
            <img
              src={require('@/assets/common/clone.png')}
              onClick={() => this.clone(record)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        ),
      },
    ],
    TaskListData: [],
    batTypeArr: [],
    chnNoArr: [],
    busCodeArr: [],
    isSpread: false,
    //克隆模态框状态
    CloneModalStatus: '',
    oldBatInfo: {},
    //克隆模态框
    cloneModalVisible: false,
    //导入模态框
    importModalVisible: false,
    //导出模态框
    exportModalVisible: false,
  };
  componentDidMount() {
    this.getSelectData();
    this.getData();
  }

  //展开搜索框
  spread = () => {
    this.setState({
      isSpread: !this.state.isSpread,
    });
  };

  getStatus = (status: any) => {
    this.setState({
      CloneModalStatus: status,
    });
  };
  //绑定子组件
  cloneRef = (ref: any) => {
    this.cloneChild = ref;
  };
  // 克隆
  clone = (res: any) => {
    console.log('当前的为：', res);
    this.setState({
      oldBatInfo: res,
      cloneModalVisible: true,
    });
  };
  // 关闭克隆弹窗
  onCloneClose = () => {
    this.setState({
      cloneModalVisible: false,
    });
  };
  // 克隆确认按钮
  handleCloneOk = () => {
    this.cloneChild.checkBatchMessage();
    if (this.state.CloneModalStatus !== '1') {
      this.setState({
        cloneModalVisible: false,
      });
    }
  };

  //绑定子组件
  importRef = (ref: any) => {
    this.child = ref;
  };
  //获取导入后解析的文件
  getImportFile = res => {
    console.log(res);
  };
  // 导入
  import = () => {
    console.log('导入选中的值：', this.state.selectedRowKeys);

    this.setState({
      importModalVisible: true,
    });
  };
  // 关闭导入弹窗
  onImportClose = () => {
    this.setState({
      importModalVisible: false,
      currentStep: 0,
    });
  };
  // 导入确认按钮
  handleImportOk = () => {
    const result = this.child.changeStep();
    if (result == 1) {
      this.setState({
        importModalVisible: false,
      });
    }
  };

  // 导出
  export = () => {
    this.setState({
      exportModalVisible: true,
    });
  };
  // 关闭导出弹窗
  onExportClose = () => {
    this.setState({
      exportModalVisible: false,
      currentStep: 0,
    });
  };
  // 导出确认按钮
  handleExportOk = () => {
    const result = this.child.changeStep();
    if (result == 1) {
      this.setState({
        exportModalVisible: false,
      });
    }
  };
  //选中框选中
  onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <Header />
        <Card className={styles.antCardBody} bordered={false}>
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
                <div style={{ float: 'right', marginRight: 54 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginLeft: '5px' }}
                  >
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: '36px' }}
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
          </Form>
        </Card>
        <Card
          className={styles.cardHeader}
          bordered={false}
          title={<span className={styles.tableTitle}>批次任务列表</span>}
          extra={
            <div>
              <Button onClick={this.import} className={styles.exportButton}>
                导入
              </Button>
              <Button onClick={this.export} className={styles.exportButton}>
                导出
              </Button>
            </div>
          }
        >
          <ConfigProvider locale={zhCN}>
            <Table
              rowSelection={rowSelection}
              className={styles.tableHeader}
              rowKey={record => record.key}
              columns={this.state.columns}
              dataSource={this.state.TaskListData}
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

        <Modal
          title={
            <div className={styles.modalTitle}>
              <span className={styles.modalSpan}></span> 克隆
            </div>
          }
          width="60%"
          visible={this.state.cloneModalVisible}
          onOk={this.handleCloneOk}
          onCancel={this.onCloneClose}
          cancelText={'取消'}
          okText={'确定'}
          destroyOnClose
        >
          <Clone
            onRef={this.cloneRef}
            oldBatInfo={this.state.oldBatInfo}
            getCloneModalStatus={this.getStatus}
          />
        </Modal>

        <Modal
          title={
            <div className={styles.modalTitle}>
              <span className={styles.modalSpan}></span> 导入数据
            </div>
          }
          width="60%"
          visible={this.state.importModalVisible}
          onOk={this.handleImportOk}
          onCancel={this.onImportClose}
          cancelText={'取消'}
          okText={'确定'}
          destroyOnClose
        >
          <Import
            onRef={this.importRef}
            fieldsFlag="1"
            pushImportFile={this.getImportFile}
          />
        </Modal>

        <Modal
          title={
            <div className={styles.modalTitle}>
              <span className={styles.modalSpan}></span> 导出数据
            </div>
          }
          width="60%"
          visible={this.state.exportModalVisible}
          onOk={this.handleExportOk}
          onCancel={this.onExportClose}
          cancelText={'取消'}
          okText={'确定'}
          destroyOnClose
        >
          {/* <Export onRef={this.exportRef} /> */}
        </Modal>
      </div>
    );
  }
  searchFormRef = React.createRef();
  //获取数据
  getData = () => {
    const { pageNum, pageSize } = this.state;
    const Params = this.searchFormRef.current.getFieldsValue();

    if (Params && Params.consmPltfmDt != undefined) {
      Params.consmPltfmDt = moment(Params.consmPltfmDt).format('YYYY-MM-DD');
    }
    this.state.batTypeArr.map(i => {
      console.log(i);
      if (i.key === Params.batType) {
        Params.batType = i.res;
      }
    });
    console.log('Params', Params);

    batchTaskList({
      stdSvcInd: 'BatchRegisterSVC',
      stdIntfcInd: 'getBatchTaskInfo',
      data: {
        pageSize,
        pageNum,
        ...Params,
      },
    }).then(res => {
      if (res && res.body) {
        this.setState(
          {
            TaskListData: res.body.list,
            total: res.body.total,
            pageSize: res.body.pageSize,
            pageNum: res.body.pageNum,
          },
          () => {
            var TaskListData = cloneDeep(this.state.TaskListData);
            const { pageSize, pageNum } = this.state;
            if (TaskListData) {
              TaskListData.map((item: any, index: any) => {
                item.num = `0${(pageNum - 1) * pageSize + (index + 1)}`;
                item.key = item.chnNo + item.busCode + item.batType + 'txt';
              });
            }
            this.setState({
              TaskListData,
            });
          },
        );
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
      if (res && res.body) {
        let tmpArr = res.body.map((item, index) => {
          return {
            key: item.paramKey,
            res: item.paramParent,
            value: item.paramValue,
          };
        });
        console.log('ncxxf', tmpArr);

        this.setState({
          batTypeArr: tmpArr,
        });
      }
    });
    // //渠道号
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

  //根据三必输字段转义
  getBatTypeFlag = record => {
    getBatTypeFlag({
      stdSvcInd: 'BatchMessageSetupSVC',
      stdIntfcInd: 'getBatTypeFlag',
      data: {
        chnNo: record.chnNo,
        batType: record.batType,
        busCode: record.busCode,
      },
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        return res.body.batTypeFlag;
      }
    });
  };

  //跳转到批次任务配置页面查看
  gotoTaskConfigLook = record => {
    console.log('record', record);
    record.batTypeFlag = this.getBatTypeFlag(record);
    setTimeout(() => {
      this.props.history.push({
        pathname: '/batchTaskConfig',
        query: { record, type: 'view' },
      });
    }, 540);
  };
  //跳转到批次任务配置页面编辑
  gotoTaskConfigEdit = record => {
    this.props.history.push({
      pathname: '/batchTaskConfig',
      query: { record, type: 'update' },
    });
  };
  //删除
  delete = (record: any) => {
    deleteBatchConfigMessage({
      stdSvcInd: 'BatchResultSetupSVC',
      stdIntfcInd: 'deleteBatchConfigMessage',
      data: {
        chnNo: record.chnNo,
        batType: record.batType,
        busCode: record.busCode,
        txnCode: record.busCode,
      },
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        message.destroy();
        message.success('删除成功！');
        this.getData();
      }
    });
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
export default BatchTaskList;
