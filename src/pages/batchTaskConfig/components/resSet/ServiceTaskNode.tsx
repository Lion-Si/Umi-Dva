import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tabs,
  InputNumber,
  Tag,
  Icon,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { cloneDeep, isEmpty } from 'lodash';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReqMessageSetting from './ReqMessageSetting';
import ResMessageSetting from './ResMessageSetting';
import request from '@/utils/request';
import TabPanelScrollbar from './TabPanelScrollbar';
import { tableData2json } from '@/utils/common';
import { connect } from 'dva';
const method = 'POST';
const url = '/agrs';
const { Option } = Select;
/**

* 将 对象数组类型的报文 转换成 纯对象类型的JSON报文
* 比如：将 系统/本地报文头与报文体表格数据 转换成 用于报文展示的JSON数据
* @Array  {*} arrayObjectMsg  对象数组类型的报文
* @String {*} keyName         需要提取的key
*/
function objectArrayMsg2jsonMsg(arrayObjectMsg, keyName = 'structName') {
  const compute = arrayObjectMsg => {
    let result = {};
    for (const value of arrayObjectMsg) {
      if (value.hasOwnProperty(keyName) === false) {
        throw new Error(`未发现 ${keyName} （默认）属性，无法转换`);
      }
      if (value.children) {
        result[value[keyName]] = compute(value.children, keyName);
      } else {
        result[value[keyName]] = '';
      }
    }
    return result;
  };
  const jsonMsg = compute(arrayObjectMsg);
  return jsonMsg;
}

/**
 * 默认的Json视图对应的值展示
 * @param val 接收对应的服务调度值设置配置完成的值对象
 */
function dealJsonView(val) {
  let sysHead = objectArrayMsg2jsonMsg(val.sysHead);
  let localHead = objectArrayMsg2jsonMsg(val.localHead);
  let body = objectArrayMsg2jsonMsg(val.body);
  for (let key in sysHead) {
    sysHead[key] = `$.[sysHead][${key}]`;
  }
  for (let key in localHead) {
    localHead[key] = `$.[localHead][${key}]`;
  }
  for (let key in body) {
    body[key] = `$.[body][${key}]`;
  }
  let Json = {
    sysHead,
    localHead,
    body,
  };
  return JSON.stringify(Json)
    .replace(/,/g, ',\n')
    .replace(/{/g, '{\n');
}

class ServiceTaskNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reqJson: '',
      resJson: '',
      ModalVisible: true,
    };
  }
  componentDidMount() {
    if (this.props.ModalVisible) {
      console.log('this.props.ModalVisible', this.props.ModalVisible);
      this.setState({
        ModalVisible: this.props.ModalVisible,
      });
    }
    //reqJson 获取途径为填充的具体值
    let reqJson =
      JSON.stringify(this.props.inputParameter, null, 2) ||
      dealJsonView(this.props.searchResSetVal.requestParams);
    let resJson = dealJsonView(this.props.searchResSetVal.responseParams);
    this.setState({
      reqJson,
      resJson,
    });
  }

  // 弹框确认事件
  handleOk = () => {
    this.child.saveDefaultInputParameter();
    this.props.showModal(false);
    message.destroy();
    message.success('设置成功');
  };

  /**
   * 取消对应的值设置弹窗
   */
  onCancel = () => {
    this.props.showModal(false);
  };
  render() {
    return (
      <Modal
        visible={this.state.ModalVisible}
        onOk={this.handleOk}
        onCancel={this.onCancel}
        width={1200}
        okText="确认"
        cancelText="取消"
      >
        <Scrollbars autoHeightMax={600} autoHide autoHeight>
          <Divider orientation="left">结果信息设置</Divider>
          <div style={{ marginLeft: 20 }}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="输入设置" key="1">
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="系统报文头" key="1">
                    <TabPanelScrollbar>
                      <ReqMessageSetting
                        res={this.props.searchResSetVal.requestParams.sysHead}
                        detailFiles={this.props.detailFiles}
                        defaultDispatch={this.props.defaultDispatch}
                        type="sysHead"
                        onRef={(ref: any) => {
                          this.child = ref;
                        }}
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="本地报文头" key="2">
                    <TabPanelScrollbar>
                      <ReqMessageSetting
                        res={this.props.searchResSetVal.requestParams.localHead}
                        detailFiles={this.props.detailFiles}
                        defaultDispatch={this.props.defaultDispatch}
                        type="loacalHead"
                        onRef={(ref: any) => {
                          this.child = ref;
                        }}
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="请求报文体" key="3">
                    <TabPanelScrollbar>
                      <ReqMessageSetting
                        res={this.props.searchResSetVal.requestParams.body}
                        detailFiles={this.props.detailFiles}
                        defaultDispatch={this.props.defaultDispatch}
                        type="reqBody"
                        onRef={(ref: any) => {
                          this.child = ref;
                        }}
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="JSON视图" key="4">
                    <TabPanelScrollbar>
                      <Input.TextArea
                        value={this.state.reqJson}
                        readOnly
                        style={{ height: '100%' }}
                        autoSize={true}
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>

              <Tabs.TabPane tab="输出设置" key="2">
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="系统报文头" key="1">
                    <TabPanelScrollbar>
                      <ResMessageSetting
                        res={this.props.searchResSetVal.responseParams.sysHead}
                        type="loacalHead"
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="本地报文头" key="2">
                    <TabPanelScrollbar>
                      <ResMessageSetting
                        res={
                          this.props.searchResSetVal.responseParams.localHead
                        }
                        type="loacalHead"
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="请求报文体" key="3">
                    <TabPanelScrollbar>
                      <ResMessageSetting
                        res={this.props.searchResSetVal.responseParams.body}
                        type="reqBody"
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="JSON视图" key="4">
                    <TabPanelScrollbar>
                      <Input.TextArea
                        value={this.state.resJson}
                        readOnly
                        style={{ height: '100%' }}
                        autoSize={true}
                      />
                    </TabPanelScrollbar>
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Scrollbars>
      </Modal>
    );
  }
}
/* // 提取model中的状态为mapStateToProps
const mapStateToProps = state => {};

//使用dva提供的connect方法绑定mapStateToProps与页面组件，绑定过后就可以在页面通过this.props使用state
export default connect(mapStateToProps)(ServiceTaskNode);
 */

const mapStateToProps = (state, props) => {
  const { fileColumns, dataAraFileColumns, inputParameter } = state.tableList;
  return {
    fileColumns,
    dataAraFileColumns,
    inputParameter,
  };
};

//使用dva提供的connect方法绑定mapStateToProps与页面组件，绑定过后就可以在页面通过this.props使用state
export default connect(mapStateToProps)(ServiceTaskNode);
