import {
  Form,
  Input,
  Row,
  Card,
  message,
  Select,
  Col,
  Tabs,
  Table,
  Switch,
} from 'antd';
import React from 'react';
import styles from './index.less';
import { checkBatchMessage, getCommonCode } from '../../../service';
import { Scrollbars } from 'react-custom-scrollbars';
import { RightOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const mergeColumns = [
  {
    title: '字段名',
    dataIndex: 'paramName',
    key: 'paramName',
    align: 'left',
  },
  {
    title: '中文描述',
    dataIndex: 'zhDesc',
    key: 'zhDesc',
    align: 'left',
  },
];

const mergeInData = [
  {
    //phDte,batNo,batSeq,qzDate,qzJrno,txDate,oAcct,nAcct,prcCcy,txAmt,txStu,txNode,unCode,unRes,acName,cCusno,datAra
    // 批次申请日期,批号,序号,综合前置周期,综合前置流水号,主机记帐日期,旧帐号/卡号,新帐号/卡号,币种,交易金额,处理状态,处理网点,失败代码,失败原因,帐户户名,客户号,附加数据域
    paramName: 'phDte',
    zhDesc: '批次申请日期',
  },
  {
    paramName: 'batNo',
    zhDesc: '批号',
  },
  {
    paramName: 'batSeq',
    zhDesc: '序号',
  },
  {
    paramName: 'qzDate',
    zhDesc: '综合前置周期',
  },
  {
    paramName: 'qzJrno',
    zhDesc: '综合前置流水号',
  },
  {
    paramName: 'txDate',
    zhDesc: '主机记帐日期',
  },
  {
    paramName: 'oAcct',
    zhDesc: '旧帐号/卡号',
  },
  {
    paramName: 'nAcct',
    zhDesc: '新帐号/卡号',
  },
  {
    paramName: 'prcCcy',
    zhDesc: '币种',
  },
  {
    paramName: 'txAmt',
    zhDesc: '交易金额',
  },
  {
    paramName: 'txStu',
    zhDesc: '处理状态',
  },
  {
    paramName: 'txNode',
    zhDesc: '处理网点',
  },
  {
    paramName: 'unCode',
    zhDesc: '失败代码',
  },
  {
    paramName: 'unRes',
    zhDesc: '失败原因',
  },
  {
    paramName: 'acName',
    zhDesc: '帐户户名',
  },
  {
    paramName: 'cCusno',
    zhDesc: '客户号',
  },
  {
    paramName: 'datAra',
    zhDesc: '附加数据域',
  },
];

//batchNo,batSeq,qzDate,reqJournalNo,txDate,oldAcct,newAcct,ccy,txAmt,txnStatus,txNode,retCode,reason,accountName,custNo,datAra
//批次号,序号,综合前置周期,请求流水号,交易日期,旧帐号/卡号/新开卡卡号,新帐号/卡号/主活期账号,币种,交易金额,交易状态,处理网点,响应代码,处理失败原因,户名,客户号,附加数据域
const mergeOutData = [
  {
    paramName: 'batchNo',
    zhDesc: '批次号',
  },
  {
    paramName: 'batSeq',
    zhDesc: '序号',
  },
  {
    paramName: 'qzDate',
    zhDesc: '综合前置周期',
  },
  {
    paramName: 'reqJournalNo',
    zhDesc: '请求流水号',
  },
  {
    paramName: 'txDate',
    zhDesc: '主机记帐日期',
  },
  {
    paramName: 'oldAcct',
    zhDesc: '旧帐号/卡号',
  },
  {
    paramName: 'newAcct',
    zhDesc: '新帐号/卡号',
  },
  {
    paramName: 'ccy',
    zhDesc: '币种',
  },
  {
    paramName: 'txAmt',
    zhDesc: '交易金额',
  },
  {
    paramName: 'txnStatus',
    zhDesc: '处理状态',
  },
  {
    paramName: 'txNode',
    zhDesc: '处理网点',
  },
  {
    paramName: 'retCode',
    zhDesc: '响应代码',
  },
  {
    paramName: 'reason',
    zhDesc: '处理失败原因',
  },
  {
    paramName: 'accountName',
    zhDesc: '户名',
  },
  {
    paramName: 'custNo',
    zhDesc: '客户号',
  },
  {
    paramName: 'datAra',
    zhDesc: '附加数据域',
  },
];

class MergeList extends React.Component {
  state = {
    //结果数据
    resData: '',
    //数据附加域
    outCondition: false,
    inCondition: false,
    mergeAraInData: [],
    mergeAraOutData: [],
  };

  componentDidMount() {
    this.props.onRef(this);
    this.fetchBatTypeInfo();
    this.resultToJson();
  }

  clearFormRef: any = React.createRef();
  // 整合数据

  //请求batType
  fetchBatTypeInfo = () => {
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'batType' },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          batType: res?.body,
        });
      }
    });
  };

  /**

    * 将 对象数组类型的报文 转换成 纯对象类型的JSON报文
    * 比如：将 系统/本地报文头与报文体表格数据 转换成 用于报文展示的JSON数据
    * @Array  {*} arrayObjectMsg  对象数组类型的报文(对象key)
    * @Array  {*} valueArrayMsg   对象数组类型的报文(对象值)
    * @String {*} keyName         需要提取的key
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

  //将字段融合映射表转化为Json格式
  resultToJson = () => {
    var outData = this.objectArrayMsgjsonMsg(
      mergeOutData,
      mergeInData,
      'paramName',
    );
    //美化JSON格式
    const resData = JSON.stringify(outData)
      .replace(/,/g, ',\n')
      .replace(/{/g, '{\n');
    this.setState({
      resData,
    });
  };

  //云核心附加数据域显示开关
  changeOutCondition = (value: any) => {
    console.log(value);
    this.setState({
      outCondition: value,
    });
  };

  //云核心附加数据域显示开关
  changeInCondition = (value: any) => {
    console.log(value);
    this.setState({
      inCondition: value,
    });
  };

  //导入数据
  importClearData = async () => {
    console.log(this.props.importData.datAraOutColumns);
    if ((await this.props.importData.datAraOutColumns.length) > 0) {
      console.log(this.props.importData.datAraOutColumns);
      this.setState({
        mergeAraOutData: this.props.importData.datAraOutColumns,
        mergeAraInData: this.props.importData.datAraInColumns,
      });
    }
  };

  render() {
    return (
      <div style={{ display: 'none' }}>
        {/* 数据域 */}
        <div style={{ marginLeft: 20 }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="输入设置" key="1">
              <Table columns={mergeColumns} dataSource={mergeInData} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="输出设置" key="2">
              <Table columns={mergeColumns} dataSource={mergeInData} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="结果展示" key="3">
              <TextArea
                value={this.state.resData}
                readOnly
                style={{ height: '100%' }}
                autoSize={true}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
        {/* 云核心数据附加域 */}
        <Row gutter={16}>
          <Col span={7}>
            <Form.Item
              valuePropName="checked"
              name="datAraOutColumns"
              label="云核心数据附加域"
              labelCol={{ span: 8 }}
              labelAlign={'left'}
            >
              <Switch onChange={this.changeOutCondition}></Switch>
            </Form.Item>
          </Col>
        </Row>
        {this.state.outCondition && (
          <>
            <Row>
              <Col span={7}>
                <Form.Item
                  name="parserType"
                  label="解析类型"
                  rules={[{ required: true }]}
                  labelCol={{ span: 6 }}
                  labelAlign={'left'}
                >
                  <Select>
                    {this.props.parserType.map((item: any, index: number) => (
                      <Option key={index} value={item.paramKey}>
                        {item.paramValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  name="datAraOutDelimiters"
                  label="文件内容分隔符"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {this.props.separator.map((item: any, index: any) => (
                      <Option key={index} value={item.paramKey}>
                        {item.paramValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  columns={mergeColumns}
                  dataSource={this.state.mergeAraOutData}
                />
              </Col>
            </Row>
          </>
        )}
        {/* 传统核心数据附加域 */}
        <Row gutter={16}>
          <Col span={7}>
            <Form.Item
              valuePropName="checked"
              name="datAraInColumns"
              label="传统核心数据附加域"
              labelCol={{ span: 8 }}
              labelAlign={'left'}
            >
              <Switch onChange={this.changeInCondition}></Switch>
            </Form.Item>
          </Col>
        </Row>
        {this.state.inCondition && (
          <>
            <Row>
              <Col span={7}>
                <Form.Item
                  name="parserType"
                  label="解析类型"
                  rules={[{ required: true }]}
                  labelCol={{ span: 6 }}
                  labelAlign={'left'}
                >
                  <Select>
                    {this.props.parserType.map((item: any, index: number) => (
                      <Option key={index} value={item.paramKey}>
                        {item.paramValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  name="datAraInDelimiters"
                  label="文件内容分隔符"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {this.props.separator.map((item: any, index: any) => (
                      <Option key={index} value={item.paramKey}>
                        {item.paramValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  columns={mergeColumns}
                  dataSource={this.state.mergeAraInData}
                />
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default MergeList;
