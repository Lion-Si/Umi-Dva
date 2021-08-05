import React from 'react';
import styles from './component.less';
import { Form, Input, Select, Row, Col, Radio, Switch } from 'antd';
import { connect } from 'umi';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;
class ResultPushSet extends React.Component {
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
    batType: [],
    chnNo: [],
    busCode: [],
    showPush: false,
    showPushWay: false,
    fetching: false,
  };
  componentDidMount() {
    this.setEcho();
    this.props.onRef(this);
  }

  //组件卸载后对state进行清除
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  //回显
  setEcho = () => {
    if (Object.keys(this.props.showResPushSet).length > 0) {
      console.log(
        '当前的this.props.showResPushSet为：',
        this.props.showResPushSet,
      );
      delete this.props.showResPushSet.busCode;
      delete this.props.showResPushSet.chnNo;
      delete this.props.showResPushSet.batType;
      this.editFormRef.current.setFieldsValue(this.props.showResPushSet);
      this.props.showResPushSet.initiativeSts === 'OFF'
        ? this.editFormRef.current.setFieldsValue({ initiativeSts: false })
        : this.editFormRef.current.setFieldsValue({ initiativeSts: true });
    }
  };

  editFormRef: any = React.createRef();
  selectInitiativeSts = (value: any) => {
    console.log('value是：', value);

    this.setState({
      showPush: value,
    });
  };
  //选择改变推送方式
  changePushWay = (e: any) => {
    if (e.target.value === '00') {
      this.setState({
        showPushWay: 'MQ',
      });
    } else if (e.target.value === '01') {
      this.setState({
        showPushWay: 'RFC',
      });
    } else {
      this.setState({
        showPushWay: false,
      });
    }
  };
  //向主页传输推送结果设置
  resPushSetTo = () => {
    // setTimeout(() => {
    const FormData = this.editFormRef.current.getFieldsValue();
    console.log('FormData', FormData);

    FormData.batType = this.props.batType.value;
    FormData.chnNo = this.props.chnNo.value;
    FormData.busCode = this.props.busCode.value;
    FormData.fileType = this.props.fileType;
    FormData.initiativeSts = this.state.showPush === 'checked' ? 'ON' : 'OFF';
    if (FormData.pushWay === '00') {
      FormData.pushParam = JSON.stringify({
        topicId: FormData.topicId,
        groupId: FormData.groupId,
        tag: FormData.tag,
      });
    } else if (FormData.pushWay === '01') {
      FormData.pushParam = JSON.stringify({
        stdSvcInd: FormData.stdSvcInd,
        stdIntfcInd: FormData.stdIntfcInd,
        stdIntfcVerNo: FormData.stdIntfcVerNo,
      });
    }
    this.props.saveResPushSet(FormData);
    // }, 0);
  };
  render() {
    const { fetching } = this.state;
    return (
      <div
        style={{ backgroundColor: 'white', paddingTop: '24px' }}
        className={styles}
      >
        <Form
          {...layout}
          name="nest-messages"
          validateMessages={this.validateMessages}
          ref={this.editFormRef}
          scrollToFirstError={true}
          onFieldsChange={this.resPushSetTo}
          initialValues={{
            batType: this.props.batType.label,
            chnNo: this.props.chnNo.label,
            busCode: this.props.busCode.label,
            fileType: this.props.fileType,
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
                style={{ display: 'none' }}
                name="fileType"
                label="文件类型"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option disabled value="txt">
                    txt格式
                  </Select.Option>
                  <Select.Option disabled value="csv">
                    csv格式
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item
                valuePropName="checked"
                name="initiativeSts"
                label="主动推送"
                rules={[{ required: true }]}
              >
                <Switch onChange={this.selectInitiativeSts}></Switch>
              </Form.Item>
            </Col>
          </Row>
          {this.state.showPush && (
            <>
              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item
                    name="pushWay"
                    label="推送方式"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group
                      onChange={e => {
                        this.changePushWay(e);
                      }}
                    >
                      <Radio value="00">MQ</Radio>
                      <Radio value="01">RFC</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              {this.state.showPushWay && (
                <>
                  {this.state.showPushWay === 'MQ' ? (
                    <Row>
                      <Col span={7}>
                        <Form.Item name="groupId" label="组">
                          <Input></Input>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item name="topicId" label="话题">
                          <Input></Input>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item name="tag" label="标签">
                          <Input></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col span={7}>
                        <Form.Item name="stdSvcInd" label="服务名">
                          <Input></Input>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item name="stdIntfcInd" label="方法名">
                          <Input></Input>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item name="stdIntfcVerNo" label="版本号">
                          <Input></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </>
          )}
        </Form>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { batType, busCode, chnNo, fileType, param } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
    fileType,
    param,
  };
};

export default connect(mapStateToProps)(ResultPushSet);
