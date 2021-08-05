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
import {
  getCommonCode,
  saveBtrClearRuleList,
  updateBtrClearRule,
  removeBtrClearRule,
  findBtrClearRuleList,
} from '../../../service';
import ClearRule from './ClearRule';
import UpdateClearRule from './UpdateClearRule';
import MergeList from './MergeList';
import { RightOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { cloneDeep } from 'lodash';
import { columns } from '@/pages/batchTaskConfig/data';
import { clearRuleColumns } from './data';
import SplitFileInStorage from '../splitFileInStorageTo';

const { Option } = Select;

const layout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 },
};

const addClearRuleList = [
  {
    clearCenterNo: '001',
    clearRuleName: '名称内容',
    clearRule: 'NGOAPS',
    amtFlag: 'RMB',
    summaryColumnFlag: 'Y',
  },
  {
    clearCenterNo: '002',
    clearRuleName: '名称内容',
    clearRule: 'NGOAPS',
    amtFlag: 'RMB',
    summaryColumnFlag: 'Y',
  },
];

// 一清二拆配置组件
class ClearDismantle extends React.Component {
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
    addClearRuleList: [],
    //导入的数据源
    importData: [],

    columns: [
      ...clearRuleColumns,
      {
        title: '设置',
        key: 'set',
        dataIndex: 'set',
        align: 'left',
        width: '16%',
        render: (text: any, record: any, index: any) => {
          return (
            <>
              <img
                src={require('@/assets/common/editor.png')}
                onClick={() => this.updateClearRule(record)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span
                style={{
                  width: '15px',
                  height: '15px',
                  display: 'inline-block',
                }}
              ></span>

              <Popconfirm
                title="确认要删除这条数据吗？"
                onConfirm={() => {
                  this.deleteClearRule(record);
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
            </>
          );
        },
      },
    ],
  };

  componentDidMount() {
    // console.log(this.props.oldBatInfo);
    this.props.onRef(this);
    this.fetchCommonData();
    this.findBtrClearRuleList();
  }

  clearFormRef: any = React.createRef();
  //清分融合表
  clearMergeRef: any = React.createRef();
  //清分规则表
  clearRuleListRef: any = React.createRef();
  //字段映射表
  traFileResultRef: any = React.createRef();

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
  //绑定解析入库子组件
  splitFilesRef = (ref: any) => {
    this.splitFiles = ref;
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

  //绑定子组件
  clearRef = (ref: any) => {
    this.clearChild = ref;
  };
  // 新增清分规则
  addClearRule = (res: any) => {
    console.log('当前的为：', res);
    this.setState({
      oldBatInfo: res,
      clearModalVisible: true,
    });
  };
  // 关闭新增清分规则弹窗
  onAddClose = () => {
    this.setState({
      clearModalVisible: false,
    });
  };
  // 新增清分规则确认按钮
  handleAddOk = async () => {
    console.log(this.clearChild);

    this.clearChild.getAddClearRuleData();
    //等待子组件方法的执行
    setTimeout(() => {
      this.findBtrClearRuleList();
    }, 100);
    this.setState(
      {
        clearModalVisible: false,
      },
      () => {},
    );
  };

  //查询当前清分规则列表
  findBtrClearRuleList = () => {
    var batType = this.props.batType.value;
    this.state.batType.map(item => {
      if (item.paramKey === batType) {
        batType = item.paramParent;
      }
    });
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
        this.setState(
          () => ({
            addClearRuleList: res.body,
          }),
          () => {
            this.pushClearData();
          },
        );
      }
    });
  };

  //删除具体清分规则列表中的其中一条数据
  deleteClearRule = record => {
    var batType = this.props.batType.value;
    this.state.batType.map(item => {
      if (item.paramKey === batType) {
        batType = item.paramParent;
      }
    });
    removeBtrClearRule({
      stdSvcInd: 'BatchProcessSetupSVC',
      stdIntfcInd: 'removeBtrClearRule',
      data: {
        seqNo: record.seqNo,
        batType,
        chnNo: this.props.chnNo.value,
        busCode: this.props.busCode.value,
      },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        message.destroy();
        message.success(`成功删除第${record.seqNo}条清分规则`);
        this.findBtrClearRuleList();
      }
    });
  };

  // 整合数据
  //获取清分融合表数据
  getClearMergeData = () => {
    const clearMergeData = this.clearMergeRef.current.getFieldsValue();
    const saveClearMerge = clearMergeData;
    //暂存数据至Dva中，方便回显
    this.props.dispatch({
      type: 'tableList/saveParam',
      payload: {
        id: 'saveClearMerge',
        data: saveClearMerge,
      },
    });
  };

  // 修改清分规则的某条数据
  updateClearRule = (record: any) => {
    this.setState({
      clearRuleList: record,
      updateModalVisible: true,
    });
  };
  // 关闭修改清分规则弹窗
  onUpdateClose = () => {
    this.setState({
      updateModalVisible: false,
    });
  };
  // 修改清分规则确认按钮
  handleUpdateOk = () => {
    this.clearChild.updateClearRuleData();
    //等待子组件方法的执行
    setTimeout(() => {
      this.findBtrClearRuleList();
    }, 100);
    this.setState({
      updateModalVisible: false,
    });
  };

  // 当为清分时在清分节点下保存文件模板数据
  pushFileTempl = () => {
    this.splitFiles.splitFileInStorageTo();
  };

  // 向父组件推送清分规则数据
  pushClearData = () => {
    this.props.pushClearData(this.state.addClearRuleList);
  };

  //渲染结果文件列
  renderResList = () => {
    return (
      <Table
        className={styles.clearList}
        rowKey={record => record.clearCenterNo}
        columns={this.state.columns}
        dataSource={this.state.addClearRuleList}
        pagination={false}
      ></Table>
    );
  };

  render() {
    return (
      <>
        <span className={`${styles.label} ${styles.merge}`}>
          清分规则{' '}
          <img
            className={styles.AddImg}
            onClick={this.addClearRule}
            src={require('@/assets/common/new.png')}
          />
        </span>
        <Divider orientation="left" className={styles.showConfig} />
        {/* <Row>
          <Col>
            <span className={`${styles.label} ${styles.clear}`}>清分规则</span>

          </Col>
        </Row> */}
        <Modal
          className={styles.addModal}
          title={
            <>
              <img
                className={styles.AddImg}
                src={require('@/assets/common/new.png')}
              />
              <span className={styles.modalSpan}></span> 新增
            </>
          }
          width="50%"
          visible={this.state.clearModalVisible}
          onOk={this.handleAddOk}
          onCancel={this.onAddClose}
          cancelText={'取消'}
          okText={'确定'}
          destroyOnClose
        >
          <ClearRule onRef={this.clearRef} />
        </Modal>
        <Modal
          className={styles.addModal}
          title={
            <>
              <img
                className={styles.AddImg}
                src={require('@/assets/common/editor.png')}
              />
              <span className={styles.modalSpan}></span> 修改
            </>
          }
          width="50%"
          visible={this.state.updateModalVisible}
          onOk={this.handleUpdateOk}
          onCancel={this.onUpdateClose}
          cancelText={'取消'}
          okText={'确定'}
          destroyOnClose
        >
          <ClearRule
            onRef={this.clearRef}
            clearRuleList={this.state.clearRuleList}
          />
        </Modal>
        <Row gutter={16}>
          <Col span={24} style={{ padding: '0px' }}>
            <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              {this.renderResList()}
            </Form.Item>
          </Col>
        </Row>
        {this.props.clearRuleData?.length > 0 ? (
          <SplitFileInStorage
            onRef={this.splitFilesRef}
            showFileTemplConfig={this.props.showFileTemplConfig}
            isClear={this.props.clearRuleData.length > 0 ? '1' : '0'}
          />
        ) : (
          ''
        )}
      </>
    );
  }
}
const mapStateToProps = (state, props) => {
  const {
    param,
    importData,
    busCode,
    chnNo,
    batType,
    clearRuleData,
  } = state.tableList;
  return {
    busCode,
    chnNo,
    batType,
    param,
    importData,
    clearRuleData,
  };
};
export default connect(mapStateToProps)(ClearDismantle);
