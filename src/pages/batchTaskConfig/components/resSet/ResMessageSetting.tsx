/* import { Checkbox, Card, Table } from 'antd';
class ResMessageSetting extends React.Component {
  state = {};
  componentDidMount() {
    console.log(this.props.res);
  }
  showEdit = () => {
    console.log('编辑');
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
      </div>
    );
  }
}

export default ResMessageSetting;
 */
import React from 'react';
import { Checkbox, Card, Table, Modal, Tag, Row, Col, Tree, Input } from 'antd';
import { getCommonCode } from '../../service.js';
import { DoubleRightOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { cloneDeep } from 'lodash';
class ResMessageSetting extends React.Component {
  state = {
    valSetModal: false,
    ModalVisible: false,
    treeDataParSource: [],
    treeDataParSource_col2: [],
    // defineVal: "",
    showDefineValInput: 'none',
    showTreeData: 'none',
    loadingForSourceTree: false,
    sysHead: '',
    localHead: '',
    reqBody: '',
    structName: '',
    col_1: '', //第一列选中的key
    col_2: '', //第二列选中的key
  };
  componentDidMount() {
    console.log(this.props.res);
    this.sysHeadStruct();
  }
  // 生成sysHead数据结构
  sysHeadStruct = () => {
    let sysHead = {};
    this.props.res.forEach((item, index) => {
      sysHead[item.structName] = '';
    });
    this.setState(
      {
        sysHead,
      },
      () => console.log(this.state.sysHead),
    );
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
              key: item.paramValue.split('_')[0],
              desc: item.paramKey,
            };
          });
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
  onSelectForSourceTree_col2 = selectedKeys => {
    console.log(selectedKeys);
    if (this.state.col_1 != 'customValue') {
      this.setState({
        col_2: selectedKeys[0],
      });
    }
  };
  // 点击参数配置的第一列
  onSelectForSourceTree = (selectedKeys, e) => {
    console.log(selectedKeys, e);
    // 自定义值：展示输入框;   默认函数信息
    if (
      selectedKeys[0] == 'customValue' ||
      selectedKeys[0] == 'defaultFunction'
    ) {
      this.setState({
        showDefineValInput: 'block',
        showTreeData: 'none',
        col_1: '',
      });
      if (selectedKeys[0] == 'defaultFunction') {
        this.getCommonCode(selectedKeys[0]);
      }
    } else {
      // 附加域参数  文件列 默认函数信息 批次模板 批次参数  批次总控 请求报文参数
      this.setState({
        showDefineValInput: 'none',
        showTreeData: 'block',
        col_1: selectedKeys[0],
      });
      if (selectedKeys[0] == 'fileData') {
        this.setState(
          {
            treeDataParSource_col2: this.props.fileColumns,
          },
          () => console.log(this.state.treeDataParSource_col2),
        );

        this.getCommonCode(selectedKeys[0]);
      } else if (selectedKeys[0] == 'datAra') {
        this.setState({
          treeDataParSource_col2: this.props.dataAraFileColumns,
        });
      } else {
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
  handleOk = () => {
    const { col_1, col_2, structName } = this.state;
    let sysHead = cloneDeep(this.state.sysHead);
    console.log(col_1);
    if (!col_1) {
      //自定义值 默认函数
      sysHead[structName] = col_2;
    } else {
      if (
        col_1 == 'btrFileTempl' ||
        col_1 == 'btrParam' ||
        col_1 == 'btrTaskMessage'
      ) {
        //批次模板 批次参数 批次总控
        sysHead[structName] = `$.[${col_1}].${col_2}`;
        this.setState({
          sysHead,
        });
      } else if (col_1 == 'fileData' || col_1 == 'reqSysHead') {
        // 文件列  请求报文
        sysHead[structName] = `$.[${col_1}][${col_2}]`;
      } else if (col_1 == 'datAra') {
        // 附加域参数
        sysHead[structName] = `$.[fileData][${col_1}][${col_2}]`;
      }
    }
    if (this.props.type == 'sysHead') {
      this.setState(
        {
          sysHead,
        },
        () => {
          console.log(this.state.sysHead);
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
          reqBody: sysHead,
        },
        () => {
          console.log(this.state.reqBody);
        },
      );
    }
    console.log('当前的', this.state.structName);
    this.props.res.map(item => {
      if (item.structName == this.state.structName) {
        item.title = sysHead[this.state.structName];
      }
    });
    console.log('当前数据源', this.props.res);
    this.setState({
      valSetModal: false,
    });
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
const mapStateToProps = state => {
  return {
    fileColumns: state.tableList.fileColumns,
    dataAraFileColumns: state.tableList.dataAraFileColumns,
  };
};

//使用dva提供的connect方法绑定mapStateToProps与页面组件，绑定过后就可以在页面通过this.props使用state
export default connect(mapStateToProps)(ResMessageSetting);

//  export default ResMessageSetting
