import React from 'react';
import {
  Checkbox,
  Card,
  Table,
  Modal,
  Tag,
  Row,
  Col,
  Tree,
  Input,
  message,
} from 'antd';
import { getCommonCode } from '../../service.js';
import { DoubleRightOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { cloneDeep } from 'lodash';
var input_1 = new Array();
var input_2 = new Array();
var oldSysHeadData: any = [];
var oldReqBodyData: any = [];
class ReqMessageSetting extends React.Component {
  state = {
    // 是否展示过打开过对应报文的值设置
    isOpenMesSet: false,
    // 值设置窗口是否展示
    valSetModal: false,
    ModalVisible: false,
    treeDataParSource: [],
    treeDataParSource_col2: [],
    // defineVal: "",
    showDefineValInput: 'none',
    showTreeData: 'none',
    loadingForSourceTree: false,
    sysHead: {},
    localHead: {},
    reqBody: {},
    structName: '',
    col_1: '', //第一列选中的key
    col_2: '', //第二列选中的key
  };
  componentDidMount() {
    this.props.onRef(this);
    this.setAllValueSet();
    this.sysHeadStruct();
    this.setSysHeadValue();
    this.setReqBodyValue();
  }

  //当存在编辑/查看时设置默认值
  setAllValueSet = () => {
    if (this.props.defaultDispatch) {
      let sysHead = {};
      let reqBody = {};
      this.props.defaultDispatch.map((item, index) => {
        var inputParameter = JSON.parse(item.inputParameter);
        this.props.res.map((i: any) => {
          // 当为请求报文头数据时进行报文头数据组装与处理
          if (i.headType == 'sysHead') {
            Object.keys(inputParameter.sysHead).map((e: any) => {
              if (i.structName == e) {
                i.title = inputParameter.sysHead[e];
                sysHead[i.structName] = inputParameter.sysHead[e];
              }
              if (!sysHead[i.structName]) {
                sysHead[i.structName] = '';
              }
            });
            oldSysHeadData = sysHead;
            this.setState({
              sysHead,
            });
          }
          // 当为请求报文体数据时进行报文体数据组装与处理
          else if (i.headType == 'body') {
            Object.keys(inputParameter.body).map((e: any) => {
              if (i.structName == e) {
                i.title = inputParameter.body[e];
                reqBody[i.structName] = inputParameter.body[e];
              }
              if (!reqBody[i.structName]) {
                reqBody[i.structName] = '';
              }
            });
            oldReqBodyData = reqBody;
            this.setState({
              reqBody,
            });
          }
        });
      });
    }
  };

  //给报文头值设置默认值
  setSysHeadValue = () => {
    if (this.props.type == 'sysHead') {
      let sysHead = {};
      getCommonCode({
        stdSvcInd: 'BatchPandectSVC',
        stdIntfcInd: 'getCommonCode',
        data: { paramType: 'sysHeadVal' },
      }).then((res: any) => {
        if (res && res.body) {
          console.log('res.body', res.body, 'this.props.res', this.props.res);
          res.body.map((item: any, index: any) => {
            this.props.res.map((i: any) => {
              if (i.structName === item.paramKey) {
                i.title = item.paramValue;
                sysHead[i.structName] = item.paramValue;
              }
              //当未给默认值时设为空
              if (!sysHead[i.structName]) {
                sysHead[i.structName] = '';
              }
            });
          });
          oldSysHeadData = sysHead;
          this.setState({
            sysHead,
          });
        }
      });
    }
  };

  //给报文体设置默认值
  setReqBodyValue = () => {
    if (this.props.type == 'reqBody') {
      let reqBody = {};
      console.log('this.props.res', this.props.res, this.props.detailFiles);
      // 明细文件文件列匹配默认值
      if (this.props.detailFiles?.uploadDetailFilesList) {
        this.props.detailFiles?.uploadDetailFilesList.map(
          (item: any, index: any) => {
            this.props.res.map((i: any) => {
              if (i.structName === item.field) {
                //title为展示值
                i.title = `$.[${item.attribution}][${item.field}]`;
                //按照对应规则设置默认值
                reqBody[
                  i.structName
                ] = `$.[${item.attribution}][${item.field}]`;
                console.log('设置默认值了');
              }
              //当未给默认值时设为空
              if (!reqBody[i.structName]) {
                reqBody[i.structName] = '';
              }
            });
          },
        );
        //明细文件文件附加列匹配默认值
        this.props.detailFiles?.uploadDetailFilesDatAraList.map(
          (item: any, index: any) => {
            this.props.res.map((i: any) => {
              if (i.structName === item.field) {
                i.title = `$.[fileData][${item.attribution}][${item.field}]`;
                //按照对应规则设置默认值
                reqBody[
                  i.structName
                ] = `$.[fileData][${item.attribution}][${item.field}]`;
                console.log('设置默认值了');
              }
              //当未给默认值时设为空
              if (!reqBody[i.structName]) {
                reqBody[i.structName] = '';
              }
            });
          },
        );
      }
      console.log(reqBody);
      oldReqBodyData = reqBody;
      this.setState({
        reqBody,
      });
    }
  };

  // 生成sysHead数据结构
  sysHeadStruct = () => {
    // let sysHead = {};
    // let reqBody = {};
    // this.props.res.forEach((item, index) => {
    //   sysHead[item.structName] = '';
    // });
    // this.props.res.forEach((item, index) => {
    //   reqBody[item.structName] = '';
    // });
    // this.setState(
    //   {
    //     sysHead,
    //     reqBody,
    //   },
    //   () => console.log(this.state.sysHead),
    // );
  };
  showEdit = record => {
    this.setState(
      {
        valSetModal: true,
        structName: record.structName,
        col_1: '',
        col_2: '',
      },
      () => {
        console.log(this.state.structName);
        getCommonCode({
          stdSvcInd: 'BatchPandectSVC',
          stdIntfcInd: 'getCommonCode',
          data: { paramType: 'paramSetup' },
        }).then(res => {
          if (res && res.body) {
            let treeDataParSource = res.body.map((item, index) => {
              return {
                title: item.paramValue,
                key: item.paramKey,
              };
            });
            this.setState({
              treeDataParSource,
            });
          }
        });
      },
    );
  };
  getCommonCode = paramType => {
    this.setState({
      showDefineValInput: 'none',
      showTreeData: 'block',
      loadingForSourceTree: true,
    });
    getCommonCode({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getCommonCode',
      data: { paramType },
    }).then(res => {
      if (res && res.body) {
        let treeDataParSource_col2;
        if (paramType == 'defaultFunction') {
          treeDataParSource_col2 = res.body.map((item, index) => {
            return {
              title: item.paramValue.split('_')[1],
              key: item.paramKey,
              desc: item.paramValue.split('_')[0],
            };
          });
        } else if (paramType == 'sysHeadVal') {
          console.log('sysHeadVal', res);
        } else {
          treeDataParSource_col2 = res.body.map((item, index) => {
            return {
              title: item.paramValue,
              key: item.paramKey,
            };
          });
        }
        this.setState({
          treeDataParSource_col2,
          loadingForSourceTree: false,
        });
      }
    });
  };
  // 点击参数配置的第二列
  onSelectForSourceTree_col2 = (selectedKeys, e) => {
    console.log(selectedKeys, e);
    if (this.state.col_1 == 'defaultFunction') {
      console.log('454654665');
      this.setState(
        {
          col_2: e.node.desc,
        },
        () => {
          console.log(this.state.col_2);
        },
      );
    } else if (
      this.state.col_1 != 'customValue' &&
      this.state.col_1 != 'defaultFunction'
    ) {
      this.setState({
        col_2: selectedKeys[0],
      });
    }
  };
  // 点击参数配置的第一列
  onSelectForSourceTree = (selectedKeys, e) => {
    console.log(selectedKeys, e);
    // 自定义值：展示输入框;   默认函数信息
    if (selectedKeys[0] == 'customValue') {
      this.setState({
        showDefineValInput: 'block',
        showTreeData: 'none',
        col_1: '',
      });
    } else if (selectedKeys[0] == 'defaultFunction') {
      this.setState(
        {
          showDefineValInput: 'block',
          showTreeData: 'none',
          col_1: selectedKeys[0],
        },
        () => {
          this.getCommonCode(selectedKeys[0]);
        },
      );
    } else {
      // 附加域参数  文件列 默认函数信息 批次模板 批次参数  批次总控 请求报文参数
      this.setState({
        showDefineValInput: 'none',
        showTreeData: 'block',
        col_1: selectedKeys[0],
      });
      if (selectedKeys[0] == 'fileData') {
        console.log(' this.props.fileColumns', this.props.fileColumns);
        if (this.props.fileColumns.length > 0) {
          this.setState(
            {
              treeDataParSource_col2: this.props.fileColumns,
            },
            () => console.log(this.state.treeDataParSource_col2),
          );
        }
      } else if (selectedKeys[0] == 'datAra') {
        this.setState({
          treeDataParSource_col2: this.props.dataAraFileColumns,
        });
      }
      //解决每一次取消会发请求的
      else if (selectedKeys[0]) {
        this.getCommonCode(selectedKeys[0]);
      }
    }
  };
  onInputChange = e => {
    console.log(e);
    this.setState({
      col_2: e.target.value,
    });
  };

  /**
   * 点击值设置保存对应服务的值设置
   */
  handleOk = () => {
    this.setState({
      isOpenMesSet: true,
    });
    const { col_1, col_2, structName } = this.state;
    let sysHead = cloneDeep(this.state.sysHead);
    let reqBody = cloneDeep(this.state.reqBody);
    console.log(col_1);
    if (!col_1 || col_1 == 'defaultFunction') {
      //自定义值 默认函数
      sysHead[structName] = col_2;
      reqBody[structName] = col_2;
    } else {
      if (
        col_1 == 'btrFileTempl' ||
        col_1 == 'btrParam' ||
        col_1 == 'btrTaskMessage'
      ) {
        //批次模板 批次参数 批次总控
        sysHead[structName] = `$.[${col_1}].${col_2}`;
        reqBody[structName] = `$.[${col_1}].${col_2}`;
        // this.setState({
        //   sysHead,
        // });
      } else if (col_1 == 'fileData' || col_1 == 'reqSysHead') {
        // 文件列  请求报文
        sysHead[structName] = `$.[${col_1}][${col_2}]`;
        reqBody[structName] = `$.[${col_1}][${col_2}]`;
      } else if (col_1 == 'datAra') {
        // 附加域参数
        sysHead[structName] = `$.[fileData][${col_1}][${col_2}]`;
        reqBody[structName] = `$.[fileData][${col_1}][${col_2}]`;
      }
    }
    console.log('this.props.type', this.props.type);

    if (this.props.type == 'sysHead') {
      this.setState(
        {
          sysHead,
        },
        () => {
          input_1.push({
            sysHead,
          });
          console.log('sysHead_input_1', input_1);
        },
      );
    } else if (this.props.type == 'localHead') {
      this.setState(
        {
          localHead: sysHead,
        },
        () => {
          console.log(this.state.localHead);
        },
      );
    } else if (this.props.type == 'reqBody') {
      this.setState(
        {
          reqBody,
        },
        () => {
          input_2.push({
            reqBody,
          });
          console.log('reqBody_input_2', input_2);
        },
      );
    }

    //设置值设置后的值显示
    if (this.props.type == 'sysHead') {
      this.props.res.map(item => {
        if (item.structName == this.state.structName) {
          item.title = sysHead[this.state.structName];
        }
      });
    } else if (this.props.type == 'reqBody') {
      this.props.res.map(item => {
        if (item.structName == this.state.structName) {
          item.title = reqBody[this.state.structName];
        }
      });
    }
    setTimeout(() => {
      const inputParameter = new Object();
      console.log(
        'input_1',
        input_1,
        'input_2',
        input_2,
        'body:',
        this.state.reqBody,
      );
      if (input_1[0]?.sysHead) {
        inputParameter.sysHead = input_1[input_1.length - 1]?.sysHead;
      } else {
        inputParameter.sysHead = oldSysHeadData || this.state.sysHead;
      }
      if (input_2[0]?.reqBody) {
        inputParameter.body = input_2[input_2.length - 1]?.reqBody;
      } else {
        inputParameter.body = oldReqBodyData || this.state.reqBody;
      }
      inputParameter.localHead = {};
      this.props.dispatch({
        type: 'tableList/saveInputParameter',
        payload: {
          inputParameter,
        },
      });
    }, 0);
    console.log(
      'SysHead',
      this.state.sysHead,
      'Body',
      this.state.reqBody,
      'localHead',
      this.state.localHead,
    );
    input_1 = [];
    input_2 = [];
    this.setState({
      valSetModal: false,
    });
  };

  /**
   * 当未打开值设置时对应的服务调度值设置的默认值
   */
  saveDefaultInputParameter = () => {
    if (this.state.isOpenMesSet === false) {
      const inputParameter = new Object();
      inputParameter.sysHead = oldSysHeadData || this.state.sysHead;
      inputParameter.body = oldReqBodyData || this.state.reqBody;
      inputParameter.localHead = {};
      this.props.dispatch({
        type: 'tableList/saveInputParameter',
        payload: {
          inputParameter,
        },
      });
    } else {
      this.setState({
        isOpenMesSet: false,
      });
    }
  };

  render() {
    const columns = [
      {
        title: '名称(中)',
        dataIndex: 'structAlias',
        align: 'left',
        width: '15%',
      },
      {
        title: '名称(英)',
        dataIndex: 'structName',
        align: 'left',
        width: '15%',
      },
      {
        title: '类型',
        dataIndex: 'type',
        align: 'left',
        width: '10%',
      },
      {
        title: '必填',
        dataIndex: 'required',
        width: '10%',
        align: 'left',
        render: (text, record, index) => {
          const convert = record.required == 'n' ? false : true;
          return <Checkbox checked={convert} />;
        },
      },
      {
        title: '描述',
        dataIndex: 'remark',
        width: '25%',
        align: 'left',
        ellipsis: true,
      },
      {
        title: '输入值',
        dataIndex: 'title',
        width: '15%',
        align: 'left',
        ellipsis: true,
      },
      {
        title: '操作',
        align: 'left',
        render: (text, record, index) => {
          return (
            <div>
              <a
                onClick={() => {
                  this.showEdit(record);
                }}
                type="primary"
              >
                值设置
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <Card>
          <Table
            bordered
            columns={columns}
            dataSource={this.props.res}
            pagination={false}
          />
        </Card>

        <Modal
          destroyOnClose
          visible={this.state.valSetModal}
          onOk={this.handleOk}
          onCancel={() =>
            this.setState({ valSetModal: false }, () =>
              console.log(this.state.sysHead),
            )
          }
          width={800}
          okText="确认"
          cancelText="取消"
          title="参数设置"
        >
          <Row>
            <Col
              span={12}
              style={{
                border: '1px solid #eee',
                paddinTop: 12,
                height: '400px',
                overflow: 'auto',
                margin: 10,
              }}
            >
              <Tag color="#108ee9" style={{ marginBottom: 10 }}>
                参数来源
              </Tag>
              <Tree
                defaultSelectedKeys={['uuid-1']}
                treeData={this.state.treeDataParSource}
                onSelect={this.onSelectForSourceTree}
              />
              <DoubleRightOutlined
                style={{
                  position: 'absolute',
                  top: 180,
                  right: 0,
                  fontSize: 18,
                }}
              />
            </Col>
            <Col
              span={10}
              style={{
                border: '1px solid #eee',
                paddinTop: 12,
                height: '400px',
                overflow: 'auto',
                margin: 10,
              }}
            >
              <Tag color="#108ee9" style={{ marginBottom: 10 }}>
                参数
              </Tag>
              <spin spinning={this.state.loadingForSourceTree}>
                <Tree
                  style={{ display: this.state.showTreeData }}
                  defaultSelectedKeys={['uuid-1']}
                  /*  onExpand={this.onExpand}
                   expandedKeys={this.state.expandedKeys} */
                  treeData={this.state.treeDataParSource_col2}
                  onSelect={this.onSelectForSourceTree_col2}
                />
              </spin>
              <Input
                value={this.state.col_2}
                onChange={this.onInputChange}
                style={{ display: this.state.showDefineValInput }}
                placeholder="请输入自定义值"
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

// 提取model中的状态为mapStateToProps

const mapStateToProps = (state, props) => {
  const { fileColumns, dataAraFileColumns, inputParameter } = state.tableList;
  return {
    fileColumns,
    dataAraFileColumns,
    inputParameter,
  };
};

//使用dva提供的connect方法绑定mapStateToProps与页面组件，绑定过后就可以在页面通过this.props使用state
export default connect(mapStateToProps)(ReqMessageSetting);

//  export default ReqMessageSetting
