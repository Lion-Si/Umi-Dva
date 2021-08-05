import { Form, Input, Row, Card, message, Select } from 'antd';
import React from 'react';
import styles from './index.less';
import { checkBatchMessage, cloneBatchInfo, getCommonCode } from '../service';
import { RightOutlined } from '@ant-design/icons';

const { Option } = Select;

const layout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 },
};
class Clone extends React.Component {
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
  };

  componentDidMount() {
    this.props.onRef(this);
    this.fetchBatTypeInfo();
    console.log(this.props.oldBatInfo);
  }

  cloneFormRef: any = React.createRef();
  // 整合数据

  //请求batType
  fetchBatTypeInfo = () => {
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType: 'batType' },
    }).then((res: any) => {
      this.setState({
        batType: res.body,
      });
    });
  };

  //请求克隆
  requestClone = (data: any) => {
    cloneBatchInfo({
      stdSvcInd: 'BatchResultSetupSVC',
      stdIntfcInd: 'cloneBatchInfo',
      data: {
        chnNo: this.props.oldBatInfo.chnNo,
        batType: this.props.oldBatInfo.batType,
        busCode: this.props.oldBatInfo.busCode,
        newChnNo: data.chnNo,
        newBatType: data.batType.value,
        newBusCode: data.busCode,
        fileTemplName: data.fileTemplName,
      },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.props.getCloneModalStatus('0');
        message.destroy();
        message.success('克隆成功');
        //将数据传输到父组件并跳转
      } else {
        this.props.getCloneModalStatus('0');
        message.destroy();
        message.info('克隆失败');
      }
    });
  };

  //校验批次信息的唯一性后若成功则克隆
  checkBatchMessage = async () => {
    try {
      //验证必输项
      const values = await this.cloneFormRef.current.validateFields();

      const cloneData = this.cloneFormRef.current.getFieldsValue();

      //更改获得到的batType
      this.state.batType.map(i => {
        if (i.paramKey === cloneData.batType.value) {
          cloneData.batType.value = i.paramParent;
        }
      });

      //检验唯一性数据
      checkBatchMessage({
        stdSvcInd: 'BatchMessageSetupSVC',
        stdIntfcInd: 'checkBatchMessage',
        data: {
          chnNo: cloneData.chnNo,
          batType: cloneData.batType.value,
          busCode: cloneData.busCode,
        },
      }).then((res: any) => {
        if (res && res.sysHead.retCd == '000000') {
          //当检验成功后
          this.requestClone(cloneData);
        } else {
          this.props.getCloneModalStatus('0');
          message.destroy();
          message.info('此条数据中的配置项重复');
        }
      });
    } catch (error) {
      this.props.getCloneModalStatus('1');
      message.destroy();
      message.info('请输入必输项 / 检查格式是否正确');
    }
  };
  render() {
    return (
      <Form
        {...layout}
        name="nest-messages"
        className={styles.cloneForm}
        validateMessages={this.validateMessages}
        ref={this.cloneFormRef}
        scrollToFirstError={true}
      >
        <Form.Item
          name="fileTemplName"
          label="批量名称"
          labelAlign="right"
          rules={[{ required: true }]}
        >
          <Input style={{ width: '200px' }} />
        </Form.Item>
        <Form.Item
          name="batType"
          label="批量类型"
          labelAlign="right"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            labelInValue
            showSearch
            placeholder="请选择对应批量类型"
            showArrow={true}
            optionFilterProp="children"
            style={{ width: '200px' }}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.batType?.map((item, index) => (
              <Option key={index} value={item.paramKey}>
                {item.paramValue}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="chnNo"
          label="渠道号"
          labelAlign="right"
          rules={[
            {
              pattern: /^\d{6}$/,
              message: '为6位纯数字',
              required: true,
            },
          ]}
        >
          <Input style={{ width: '200px' }} placeholder="6位数字，如555555" />
        </Form.Item>
        <Form.Item
          name="busCode"
          label="业务代码"
          labelAlign="right"
          rules={[
            {
              required: true,
              pattern: /^\d{6}$/,
              message: '为6位纯数字',
            },
          ]}
        >
          <Input style={{ width: '200px' }} placeholder="6位数字，如555555" />
        </Form.Item>
      </Form>
    );
  }
}

export default Clone;
