import { Form, Input, Row, Card, message, Select, Col, Tooltip } from 'antd';
import React from 'react';
import styles from './index.less';
import {
  checkBatchMessage,
  getCommonCode,
  saveBtrClearRuleList,
  updateBtrClearRule,
} from '../../../service';
import { RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
class ClearRule extends React.Component {
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
    //批量类型
    batType: [],
    clearCenterNo: [],
    //是否涉及金钱交易
    amtFlag: [
      { paramKey: 'Y', paramValue: '是' },
      { paramKey: 'N', paramValue: '否' },
    ],
    //汇总行标志
    summaryColumnFlag: [
      { paramKey: 'Y', paramValue: '是' },
      { paramKey: 'N', paramValue: '否' },
    ],
    diagnose: [],
    bucket: [],
    fileSavePathLocal: [],
    fileSavePathOss: [],
  };

  componentDidMount() {
    this.props.onRef(this);
    this.fetchCommonData();
    this.setClearRuleData();
  }

  clearFormRef: any = React.createRef();
  // 整合数据

  //获取公共数据
  fetchCommonData = () => {
    //获取文件分隔符
    this.getCommon('batType');
    //获取文件分隔符
    this.getCommon('clearCenterNo');
    //获取clearCenterNo
    this.getCommon('diagnose');
    //获取clearMergeWay（清分方式）
    this.getCommon('bucket');
    //获取本地文件路径
    this.getCommon('fileSavePathLocal');
    //获取Oss文件路径
    this.getCommon('fileSavePathOss');
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

  //改变清分中心值
  clearCenterChange = (value: any) => {
    switch (value) {
      //对应传统核心
      case '001':
        this.clearFormRef.current.setFieldsValue({
          summaryColumnFlag: 'N',
          fileSavePathOss: 'BTR/CLEAR/',
        });
        break;
      //对应云核心
      case '002':
        this.clearFormRef.current.setFieldsValue({
          summaryColumnFlag: 'Y',
          fileSavePathOss: 'BTR/CLEAR/CLOUD/',
        });
        break;
      default:
        this.clearFormRef.current.setFieldsValue({
          summaryColumnFlag: 'N',
          fileSavePathOss: 'BTR/CLEAR/',
        });
        break;
    }
  };

  // 修改时回显清分规则数据
  setClearRuleData = () => {
    if (
      this.props.clearRuleList &&
      Object.keys(this.props.clearRuleList).length > 0
    ) {
      this.clearFormRef.current.setFieldsValue(this.props.clearRuleList);
    }
  };
  // 修改每条清分规则数据
  updateClearRuleData = async () => {
    try {
      const values = await this.clearFormRef.current.validateFields();
      const updateClearData = this.clearFormRef.current.getFieldsValue();
      updateBtrClearRule({
        stdSvcInd: 'BatchProcessSetupSVC',
        stdIntfcInd: 'updateBtrClearRule',
        data: { btrClearRuleList: [updateClearData] },
      }).then((res: any) => {
        if (res && res.sysHead.retCd == '000000') {
          message.destroy();
          message.success('修改成功');
        } else {
          message.destroy();
          message.success('修改失败');
        }
      });
    } catch (error) {
      console.log(error);
      message.error('修改失败');
    }
  };

  //获取新增数据
  getAddClearRuleData = async () => {
    try {
      //验证必输项
      const values = await this.clearFormRef.current.validateFields();
      //新增清分规则数据
      const addClearData = this.clearFormRef.current.getFieldsValue();
      //?是否处理数据
      var reBatType = new String();
      reBatType = this.props.batType.value;
      if (reBatType.indexOf('BT') != -1) {
        addClearData.batType = '99';
      } else {
        addClearData.batType = this.props.batType.value;
      }
      addClearData.busCode = this.props.busCode.value;
      addClearData.chnNo = this.props.chnNo.value;
      //请求
      saveBtrClearRuleList({
        stdSvcInd: 'BatchProcessSetupSVC',
        stdIntfcInd: 'saveBtrClearRuleList',
        data: { btrClearRuleList: [addClearData] },
      }).then((res: any) => {
        if (res && res.sysHead.retCd == '000000') {
          message.destroy();
          message.success('新增成功');
        }
      });
    } catch (error) {
      console.log(error);

      message.error('新增失败');
    }
  };

  render() {
    return (
      <Form
        {...layout}
        name="nest-messages"
        className={styles.addClearRule}
        validateMessages={this.validateMessages}
        ref={this.clearFormRef}
        scrollToFirstError={true}
        // 初始化数据
        initialValues={{
          clearCenterNo: '001',
          fileSavePathOss: 'BTR/TC/',
          fileSavePathLocal: '/home/admin/btr/clearFile/',
          amtFlag: 'N',
          clearRule: '{"result":true}',
          clearRuleName: '复制清分',
        }}
      >
        <Row>
          <Col span={11}>
            <Form.Item
              name="clearCenterNo"
              label="清分中心编号"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Select
                style={{ width: '200px' }}
                onChange={this.clearCenterChange}
              >
                {this.state.clearCenterNo.map((item: any, index: number) => (
                  <Option key={index} value={item.paramKey}>
                    {item.paramValue}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="clearRuleName"
              label="清分规则名称"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Input style={{ width: '202px' }} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="clearRule"
              label="清分规则"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <TextArea style={{ width: '202px' }} />
            </Form.Item>
            <Tooltip
              title={
                '判断当前行数据归属于哪一个清分文件，将数据行写入所属清分文件 并统计清分文件中的行数以及金额（涉及金额的交易才统计金额）'
              }
            >
              <ExclamationCircleOutlined className={styles.icons} />
            </Tooltip>
          </Col>
          <Col span={11} style={{ display: 'none' }}>
            <Form.Item
              name="amtFlag"
              label="涉及金钱交易"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="是否有金钱交易"
                showArrow={true}
                optionFilterProp="children"
                style={{ width: '200px' }}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.diagnose?.map((item, index) => (
                  <Option key={index} value={item.paramKey}>
                    {item.paramValue}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="summaryColumnFlag"
              label="汇总行标志"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="选择汇总行标志"
                showArrow={true}
                optionFilterProp="children"
                style={{ width: '200px' }}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.diagnose?.map((item, index) => (
                  <Option key={index} value={item.paramKey}>
                    {item.paramValue}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="bucketName"
              label="清分文件存储桶"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="选择清分文件存储桶"
                showArrow={true}
                optionFilterProp="children"
                style={{ width: '200px' }}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.bucket?.map((item, index) => (
                  <Option key={index} value={item.paramKey}>
                    {item.paramValue}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="fileSavePathLocal"
              label="本地保存路径"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="选择本地保存路径"
                style={{ width: '202px' }}
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="fileSavePathOss"
              label="OSS保存路径"
              labelAlign="left"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="选择OSS保存路径"
                showArrow={true}
                optionFilterProp="children"
                style={{ width: '200px' }}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.fileSavePathOss?.map((item, index) => (
                  <Option key={index} value={item.paramKey}>
                    {item.paramValue}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { param, importData, busCode, chnNo, batType } = state.tableList;
  return {
    busCode,
    chnNo,
    batType,
    param,
    importData,
  };
};
export default connect(mapStateToProps)(ClearRule);
