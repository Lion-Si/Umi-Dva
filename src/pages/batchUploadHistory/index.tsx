import React from 'react';
import styles from './index.less';
import iconfont from './iconfont.css';
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  Table,
  message,
  ConfigProvider,
  Tag,
} from 'antd';
import { columns } from './data';
const { TextArea } = Input;
import Header from '../components/Header';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import { getAllUploadHistory, getCommonCode } from './service';
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

class BatchUploadHistory extends React.Component {
  state = {
    total: '0',
    pageSize: '10',
    pageNum: '1',
    isLookModalVisible: false,
    isSpread: false,
    columns: [
      ...columns,
      {
        title: '上传状态',
        dataIndex: 'uploadState',
        key: 'uploadState',
        align: 'left',
        render: (text, record) => {
          switch (record.uploadState) {
            case 'done':
              return <Tag color="success">上传成功</Tag>;
            case 'error':
              return <Tag color="error">上传失败</Tag>;
            default:
              return record.uploadState;
          }
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
                this.showLookModal(record.seqNo);
              }}
            />
          </div>
        ),
      },
    ],
    uploadHistoryData: [],
    batTypeArr: [],
    chnNoArr: [],
    busCodeArr: [],
    //文件类型
    fileType: [
      {
        key: 'csv',
        value: 'csv文件',
      },
      {
        key: 'xlsx',
        value: 'xlsx文件',
      },
    ],
    // 上传状态
    uploadState: [
      {
        key: 'done',
        value: '上传成功',
      },
      {
        key: 'error',
        value: '上传失败',
      },
    ],
    // 文件标识
    fileFlag: [
      {
        key: '1',
        value: '明细文件表',
      },
      {
        key: '2',
        value: '服务调度表',
      },
      {
        key: '3',
        value: '一清二拆表',
      },
    ],
  };
  componentDidMount() {
    this.getData();
  }
  searchFormRef = React.createRef();

  //展开搜索框
  spread = () => {
    this.setState({
      isSpread: !this.state.isSpread,
    });
  };

  //获取公共数据
  // fetchCommonData = () => {
  //     //获取文件类型
  //     this.getCommon('fileType');
  //     //获取上传状态
  //     this.getCommon('uploadState');
  //     //获取文件标识
  //     this.getCommon('fileFlag');

  // };
  //公共代码
  // getCommon = (paramType: any) => {
  //     getCommonCode({
  //         stdSvcInd: 'BatchPandectSVC',
  //         stdIntfcInd: 'getCommonCode',
  //         data: { paramType },
  //     }).then((res: any) => {
  //         if (res && res.sysHead.retCd == '000000') {
  //             this.setState(() => ({
  //                 [paramType]: res.body,
  //             }));
  //         }
  //     });
  // };

  //获取上传历史表
  getAllUploadHistory = () => {
    getAllUploadHistory({
      stdSvcInd: 'BatUploadHistorySVC',
      stdIntfcInd: 'getAllUploadHistory',
      data: FormData,
    }).then((res: any) => {
      if (res && res.body && res.sysHead) {
        this.setState({
          uploadHistoryData: res.body,
        });
        message.destroy();
        message.success('保存成功');
      }
    });
  };

  //获取数据
  getData = () => {
    const { pageNum, pageSize } = this.state;
    const Params = this.searchFormRef.current.getFieldsValue();

    getAllUploadHistory({
      stdSvcInd: 'BatUploadHistorySVC',
      stdIntfcInd: 'getAllUploadHistory',
      data: { ...Params, pageNum, pageSize },
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        this.setState({
          uploadHistoryData: res.body.list,
          total: res.body.total,
          pageSize: res.body.pageSize,
          pageNum: res.body.pageNum,
        });
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

  render() {
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
                <Form.Item label="上传文件名" name="fileName">
                  <Input maxLength={30} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="上传批号" name="uploadBatNo">
                  <Input maxLength={40} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="文件类型" name="fileType">
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择业务代码"
                  >
                    {this.state.fileType.map((item, index) => (
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
                    onClick={this.getData}
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
            {this.state.isSpread && (
              <Row>
                <Col span={6}>
                  <Form.Item label="上传状态" name="uploadState">
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="请选择上传状态"
                    >
                      {this.state.uploadState.map((item, index) => (
                        <Option value={item.key} key={index}>
                          {item.value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="批次归属" name="belongToBatch">
                    <Input maxLength={15} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="文件标识"
                    name="fileFlag"
                    className={styles.antFormItem}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="请选择文件标识"
                    >
                      {this.state.fileFlag.map((item, index) => (
                        <Option value={item.key} key={index}>
                          {item.value}
                        </Option>
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
              rowKey={record => record.seqNo}
              columns={this.state.columns}
              dataSource={this.state.uploadHistoryData}
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
}
export default BatchUploadHistory;
