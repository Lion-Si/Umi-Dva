import React from 'react';
import styles from './index.less';
import iconfont from './iconfont.css';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Card,
  Row,
  Col,
  DatePicker,
  Table,
  Tag,
  Pagination,
  Modal,
  Popconfirm,
  message,
  ConfigProvider,
  Skeleton,
  Avatar,
} from 'antd';
import Header from '../components/Header';
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import { getAllTempMessage, getCommonCode } from './service';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import { Link } from 'umi';
import { Item } from 'gg-editor';

const { Option } = Select;
const { TextArea } = Input;
const { Meta } = Card;
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

class BatchTemplateShow extends React.Component {
  state = {
    loading: false,
    // 模板列表
    templateList: [
      {
        title: '批量代付模板',
        key: '1',
        value: '明细文件表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '2',
        value: '服务调度表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '3',
        value: '一清二拆表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '1',
        value: '明细文件表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '2',
        value: '服务调度表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '3',
        value: '一清二拆表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '1',
        value: '明细文件表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '2',
        value: '服务调度表',
        description: '批量代付模板数据展示块',
      },
      {
        title: '批量代付模板',
        key: '3',
        value: '一清二拆表',
        description: '批量代付模板数据展示块',
      },
    ],
  };
  componentDidMount() {
    this.getAllTempMessage();
  }
  searchFormRef = React.createRef();

  //展开搜索框
  spread = () => {
    // this.setState({
    //     isSpread: !this.state.isSpread,
    // });
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
  getAllTempMessage = () => {
    getAllTempMessage({
      stdSvcInd: 'BatchTemplateSVC',
      stdIntfcInd: 'getAllTempMessage',
      data: FormData,
    }).then((res: any) => {
      if (res && res.body && res.sysHead) {
        this.setState({
          templateList: res.body,
        });
      }
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <Header />
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {this.state.templateList.map(item => {
            return (
              <Card
                key={item?.tempId}
                style={{ width: 300, marginTop: 24, marginRight: 24 }}
                actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}
              >
                <Skeleton loading={loading} avatar active>
                  <Meta
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={item.templateName}
                    description={`对应${item.templateNo}批次`}
                  />
                </Skeleton>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}
export default BatchTemplateShow;
