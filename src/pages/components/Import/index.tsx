import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Card,
  message,
  Upload,
  ConfigProvider,
  Progress,
  Tabs,
} from 'antd';
import XLSX from 'xlsx';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import { _ } from 'lodash';
import styles from './index.less';
import {
  ossImport,
  getOssInfo,
  getOssDownloadAccess,
  saveUploadHistory,
} from '../service';
import Preview from './showExecl';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import { Item } from 'gg-editor';

const { Dragger } = Upload;
var upState = 0;

class Import extends React.Component {
  state = {
    uid: '',
    fileList: [],
    uploading: false,
    // Oss文件的各类信息
    ossInfo: {
      accessid: '',
      policy: '',
      signature: '',
      dir: '',
      host: '',
      expire: '',
    },
    //预览模态框是否显示
    previewVisible: false,
    //预览模态框的名字
    previewTitle: '',
    importStatus: 'info',
    // 下载地址
    downloadUrl: '',
    file: [],
    //各表名
    tableName: [],
    //预览表数据
    tableData: [],
    //预览表表头
    tableHeader: [],
  };

  componentDidMount() {
    this.props.onRef(this);
    this.getOssInfo();
  }

  // 获取Oss的
  getOssInfo = () => {
    getOssInfo({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getOssUploadAccess',
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState({
          ossInfo: res.body,
        });
      }
    });
  };

  // 请求携带的参数
  getExtraData = (file: any) => {
    console.log(file);
    this.setState({
      uid: file.uid, // 获取文件的uid
    });
    return {
      key: file.uid,
      OSSAccessKeyId: this.state.ossInfo.accessid,
      policy: this.state.ossInfo.policy,
      Signature: this.state.ossInfo.signature,
    };
  };

  //上传文件预览
  uploadFilesChange(file) {
    // 通过FileReader对象读取文件
    console.log(file);

    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        // 存储获取到的数据
        let data: any = {};
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          let tempData: any = [];
          // esline-disable-next-line
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            console.log(sheet);
            data[sheet] = tempData.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
            );
          }
        }
        const excelDataArr = new Array();
        const excelHeaderArr = new Array();
        for (let i = 0; i < workbook.SheetNames.length; i++) {
          //预览表数据源
          const excelHeader = new Array();
          var excelData = data[workbook.SheetNames[i]];
          excelDataArr.push(excelData);
          // 获取预览表表头
          console.log(excelData[0]);
          for (let headerAttr in excelData[0]) {
            const header = {
              title: headerAttr,
              dataIndex: headerAttr,
              key: headerAttr,
            };
            excelHeader.push(header);
          }
          excelHeaderArr.push(excelHeader);
        }
        console.log(excelDataArr, excelHeaderArr);

        this.setState({
          tableName: workbook.SheetNames,
          tableData: excelDataArr,
          tableHeader: excelHeaderArr,
        });
        // 最终获取到并且格式化后的 json 数据
        message.destroy();
        message.success('请预览当前未上传的表格');

        console.log(this.state);
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        console.log(e);
        message.error('文件类型不正确！');
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file.file.originFileObj);
  }

  // 取消预览框
  handleCancel = () => {
    var importArea = document.getElementById('uploadStatus');
    importArea.innerHTML = `<div style='color: red;'>导入失败（您需确认导入格式是否正确）</div>`;
    this.setState({ previewVisible: false });
  };

  // 确认提交的表格
  handleOk = async () => {
    const { info } = this.state;
    var importArea = document.getElementById('uploadStatus');
    upState = 1;
    if ((await info.file.status) === 'done' && upState === 1) {
      // 第三步发起请求将上传文件的uid传给后端
      this.saveUploadHistory(info);
      upState = 0;
    } else if ((await info.file.status) === 'error' && upState === 1) {
      importArea.innerHTML = `<div style='color: red;'>导入失败（请检查网络）</div>`;
      upState = 0;
    }
    // 当为文件清分时需展示对应的解析后的表格，此处将数据传给父组件
    console.log(this.props.fieldsFlag);
    if (this.props.fieldsFlag == 3) {
      this.props.sendAnalyzeData(this.state);
    }
    this.setState({ previewVisible: false });
  };

  // 设置导入成功
  setSuccess = async () => {
    var importArea = document.getElementById('uploadStatus');
    this.setState(
      {
        importStatus: true,
      },
      () => {
        importArea.innerHTML = "<div style='color: green;'>导入成功</div>";
        return;
      },
    );
  };

  // 将Oss生成的uid传给后端，拿到上传的文件后解析完成后返回给前端
  fieldImport = async info => {
    console.log('info', info);

    ossImport({
      stdSvcInd: 'BatchMessageSetupSVC',
      stdIntfcInd: 'getFileSummaryInfo',
      data: {
        uuId: this.state.uid,
        fieldFlag: this.props.fieldsFlag,
      },
    }).then((res: any) => {
      var importArea = document.getElementById('uploadStatus');
      if (res && res.sysHead.retCd == '000000') {
        // 上传成功后将解析的数据传到对应的页面
        this.props.pushImportFile(res, info.file.status);
        this.setSuccess();
        this.props.dispatch({
          //dispatch为页面触发model中方法的函数
          type: 'tableList/saveUploadStatus', //type：'命名空间/reducer或effects中的方法名'
          payload: {
            uploadStatus: info.file.status,
          },
        });
      } else {
        this.setState(
          {
            importStatus: false,
          },
          () => {
            importArea.innerHTML = `<div style='color: red;'>导入失败（您导入的表格格式出错）</div>`;
          },
        );
      }
    });
  };

  // 维护(保存)上传历史表
  saveUploadHistory = info => {
    if (
      this.props.chnNo.value &&
      this.props.busCode.value &&
      this.props.batType.value
    ) {
      const Param = {
        /**
         * 文件名 自定义文件名
         */
        fileName: info.file.name,
        /**
         * 上传批号 uuID
         */
        uploadBatNo: info.file.uid,
        /**
         * 文件大小
         */
        fileSize: info.file.size,
        /**
         * 文件类型
         */
        fileType: info.file.name.split('.')[1],
        /**
         * 上传状态
         */
        uploadState: info.file.status,
        /**
         * 上传oss地址
         */
        uploadOssAdr: info.file.xhr.responseURL,
        /**
         *文件标识
         */
        fileFlag: this.props.fieldsFlag,
        /**
         *批次归属
         */
        belongToBatch: `${this.props.chnNo.value}${this.props.busCode.value}${this.props.batType.value}`,
      };
      saveUploadHistory({
        stdSvcInd: 'BatUploadHistorySVC',
        stdIntfcInd: 'saveUploadHistory',
        data: Param,
      }).then((res: any) => {
        if (res && res.sysHead.retCd == '000000') {
          this.fieldImport(info);
        } else {
        }
      });
    } else {
      message.destroy();
      message.error('请先填写批量类型，渠道号及业务代码！');
    }
  };

  // 请求下载地址
  downloadImport = () => {
    getOssDownloadAccess({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'getOssDownloadAccess',
      data: {
        uuId: this.state.uid,
      },
    }).then((res: any) => {
      if (res && res.sysHead.retCd == '000000') {
        this.setState(
          {
            downloadUrl: res.body.url,
          },
          () => {},
        );
      }
    });
  };

  init = async () => {
    try {
      const OSSData = await this.state.ossInfo;
      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  };

  // 上传前调用
  // beforeUpload = async file => {
  //   // const { OSSData } = this.state;
  //   // const expire = OSSData.expire * 1000;

  //   // if (expire < Date.now()) {
  //   //   await this.init();
  //   // }
  //   file.url = await this.state.downloadUrl;
  //   console.log(file.url);

  //   return file;
  // };

  // 上传改变方法
  importOnChange = info => {
    this.uploadFilesChange(info);
    console.log(info);
    this.setState({
      info,
    });
    var importArea = document.getElementById('uploadStatus');
    if (upState === 0) {
      if (info.file.status === 'removed') {
        importArea.innerHTML =
          `<div style='color: #3f67ed;'>删除成功（` +
          info.file.name +
          `）</div>`;
      } else {
        importArea.innerHTML = `<div style='color: #3f67ed;'>导入中</div>`;
        this.previewFile(info);
      }
    }
  };

  // 预览的方法
  previewFile = info => {
    this.setState({
      previewVisible: true,
      previewTitle: info.file.name,
    });
  };

  render() {
    const { host } = this.state.ossInfo;
    const { OSSData } = this.state;
    // 将当前this指向保存
    var _this = this;
    const uploadProps = {
      name: 'file',
      action: host, // 上传地址
      data: this.getExtraData, // 携带参数
      showUploadList: {
        showDownloadIcon: true,
        downloadIcon: (
          <DownloadOutlined onClick={this.downloadImport}>
            <a download="" href={`${this.state.downloadUrl}.html`}>
              下载
            </a>
          </DownloadOutlined>
        ),
        showRemoveIcon: true,
        removeIcon: (
          <DeleteOutlined
            onClick={e => console.log(e, 'custom removeIcon event')}
          />
        ),
      },
      progress: {
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: percent => `${parseFloat(percent.toFixed(2))}%`,
      },
      // 初始化
      init: _this.init,
      // 导入之前
      // beforeUpload: _this.beforeUpload,

      // 预览按钮
      //  onPreview(file) {
      //    console.log(file);
      //    let src = file.url;
      //    _this.setState({
      //      previewImage: file.url || file.preview,
      //      previewVisible: true,
      //      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      //    });
      //    if (!file.url && !file.preview) {
      //      file.preview = _this.getBase64(file.originFileObj);
      //    }

      //  }
    };
    return (
      <div className={styles.importStyle}>
        <ConfigProvider locale={zhCN}>
          <Dragger
            {...uploadProps}
            listType="picture" // 导入时
            onChange={this.importOnChange.bind(this)}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined color="#3f67ed !important" />
            </p>
            <p className="ant-upload-text">
              点击或拖拽至本区域进行上传
              <div>
                {this.state.previewVisible ? <LoadingOutlined /> : ''}
                <div id="uploadStatus"></div>
              </div>
            </p>
            <p className="ant-upload-hint">
              {this.props.fieldsFlag == 1
                ? '导入明细文件'
                : this.props.fieldsFlag == 2
                ? '导入服务文件'
                : this.props.fieldsFlag == 3
                ? '导入一清二拆文件'
                : '导入'}
            </p>
          </Dragger>
        </ConfigProvider>
        <Modal
          visible={this.state.previewVisible}
          title={this.state.previewTitle}
          width={1000}
          footer={<Button onClick={this.handleOk}>确认是否正确</Button>}
          onCancel={this.handleCancel}
        >
          <Tabs defaultActiveKey="1">
            {this.state.tableHeader.map((i, current) => {
              {
                return this.state.tableData.map((item, index) => {
                  if (current === index) {
                    return (
                      <Tabs.TabPane
                        tab={this.state.tableName[index]}
                        key={index}
                      >
                        <Table
                          columns={i}
                          dataSource={item}
                          showHeader={false}
                        />
                      </Tabs.TabPane>
                    );
                  }
                });
              }
            })}
          </Tabs>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  const { batType, busCode, chnNo } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
  };
}
export default connect(mapStateToProps)(Import);
