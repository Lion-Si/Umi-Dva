import React from 'react';
import styles from './homepage.less';
import global from './global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Card,
  Input,
  Pagination,
  Row,
  Col,
  DatePicker,
  ConfigProvider,
  Tooltip,
  Collapse,
  Tag,
} from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import {
  getBatTask,
  getExAlert,
  getStatisticalQuery,
  getStatusStatistic,
  getCommonCode,
} from './service';
import { parse } from 'uuid';
import { Link } from 'umi';

var test = [
  { status: 'RA' },
  { status: 'SU' },
  { status: 'FA' },
  { status: 'NS' },
  { status: 'SU' },
  { status: 'FA' },
];
const { Panel } = Collapse;
const day = new Date();
day.setTime(day.getTime());
//获取当前时间
const today = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
class HomePage extends React.Component {
  state = {
    percent: 0,
    batchTaskList: [],
    //批次错误详情
    sumErrInfo: [],
    sumErrCnt: '', //批次失败次数
    sumCrErrAmt: '', //贷方错误金额
    sumRunCnt: '',
    succRunCnt: '',
    failRunCnt: '',
    runningCnt: '',
    reRunCnt: '',
    sumDebitSuccCount: '',
    sumSuccCount: '',
    sumSuccAmt: '',
    sumCreditSuccCount: '',
    clicked: false,
    showCircle: true, //控制是否一开始显示
    total: '',
    pageNum: 1,
    pageSize: '',
    searchValue: '',
    paused: false,
    isSpread: false,
    //运行状态颜色
    dotColor: '',
    // 当前运行批量名称
    funcDescription: '',
    // 运行状态
    batStatus: '',
    // 轮循名
    carouse: '',
  };
  componentDidMount() {
    this.getBatTask();
    this.getExAlert();
    this.getStatusStatistic();
    this.letCircleIn();
    this.scrollIng();
  }

  componentWillUnmount() {
    clearInterval(this.state.carouse);
    //组件卸载后对state进行清除
    this.setState = (state, callback) => {
      return;
    };
  }

  //滚动条动画
  scrollIng = () => {
    var i = 0;
    setInterval(() => {
      i++;
      if (i < 101) {
        this.setState({
          percent: i,
        });
      }
    }, 100);
  };

  //set 动画
  letCircleIn = () => {
    // var showRunning = document.getElementById('showRunning');
    var circle1 = document.getElementById('circle-1');
    var circle2 = document.getElementById('circle-2');
    var circle3 = document.getElementById('circle-3');
    var circle4 = document.getElementById('circle-4');
    var word1 = document.getElementById('word-1');
    var word2 = document.getElementById('word-2');
    var word3 = document.getElementById('word-3');
    var word4 = document.getElementById('word-4');
    if (circle1) {
      // if (showRunning) {
      //   showRunning.addEventListener('click', () => {
      if (this.state.paused) {
        circle1.style.animationPlayState = 'paused';
        circle2.style.animationPlayState = 'paused';
        circle3.style.animationPlayState = 'paused';
        circle4.style.animationPlayState = 'paused';
        word1.style.animationPlayState = 'paused';
        word2.style.animationPlayState = 'paused';
        word3.style.animationPlayState = 'paused';
        word4.style.animationPlayState = 'paused';
        this.setState({
          paused: false,
        });
      } else {
        var count = 1;
        this.setState({
          showCircle: true,
          paused: true,
        });
        if (count > 1) {
          this.setState({
            clicked: true,
          });
        } else {
          setTimeout(() => {
            this.setState({
              clicked: true,
            });
          }, 900);
          count++;
        }
        circle1.style.animationPlayState = 'running';
        circle2.style.animationPlayState = 'running';
        circle3.style.animationPlayState = 'running';
        circle4.style.animationPlayState = 'running';
        word1.style.animationPlayState = 'running';
        word2.style.animationPlayState = 'running';
        word3.style.animationPlayState = 'running';
        word4.style.animationPlayState = 'running';
        this.getStatisticalQuery();
        // }
        // });
      }
    }
  };
  //不可选中时间
  disabledDate = (current: any) => {
    const curDate = new Date().getTime();
    const Day = 3 * 24 * 3600 * 1000;
    const preDay = curDate - (4 / 3) * Day;
    const nextDay = curDate;
    return current < preDay || current > nextDay;
  };
  //分页事件
  onChange = (page: any, pageSize: any) => {
    this.setState({
      pageSize,
      pageNum: page,
    });
    getBatTask({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'batTask',
      data: {
        pageNum: page,
        pageSize: pageSize,
      },
    }).then((res: any) => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        this.setState({
          batchTaskList: res.body.list,
          pageNum: res.body.pageNum,
          pageSize: res.body.pageSize,
          total: res.body.total,
        });
      }
    });
  };
  /**
   * name：rgb随机颜色生成
   * desc: 16进制生成红(R)、绿(G)、蓝(B)三个颜色通道的值，用es6模板表达式拼接好后返回color值
   */
  color16 = () => {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return color;
  };

  //千分位符
  toThousands = (num: any) => {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  };
  //精确到小数点后两位
  toPointTwo = (num: any) => {
    return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
  };

  //展开异常提醒值
  spread = () => {
    this.setState({
      isSpread: !this.state.isSpread,
    });
  };
  //获取搜索框的值
  setSearch = (e: any) => {
    this.setState({
      searchValue: e.target.value,
    });
  };
  selectDate = (value: any, dateString: any) => {
    console.log(value);
    this.getStatisticalQuery(dateString);
  };
  getBatTask = () => {
    getBatTask({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'batTask',
      data: {
        batRuleKey: this.state.searchValue, //888888_901050_12
        pageNum: 1,
        pageSize: 6,
      },
    }).then((res: any) => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        this.setState(
          {
            batchTaskList: res.body.list,
            pageNum: res.body.pageNum,
            pageSize: res.body.pageSize,
            total: res.body.total,
          },
          () => this.carouselData(),
        );
      }
    });
  };
  //获取异常信息
  getExAlert = () => {
    getExAlert({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'exAlert',
      data: {},
    }).then((res: any) => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        this.setState({
          sumErrCnt: res.body.sumErrCnt,
          sumCrErrAmt: res.body.sumCrErrAmt,
          sumErrInfo: res.body,
        });
      }
    });
  };

  // 轮循展示对应数据
  carouselData = () => {
    var batchTaskList = cloneDeep(this.state.batchTaskList);
    console.log('batchTaskList', batchTaskList);
    var current = 0;
    // 每个3.5s切换对应的轮盘显示
    var carouse = setInterval(() => {
      if (batchTaskList[current].funcDescription) {
        var funcDescription = new String();
        funcDescription = batchTaskList[current].funcDescription;
        this.setState({
          funcDescription,
          batStatus: batchTaskList[current].batStatus,
        });
        // 当前的数据位置
        current = current + 1;
        // 完成一遍后重新进行轮循
        if (current === batchTaskList.length) {
          current = 0;
        }
      }
    }, 3500);
    this.setState({
      carouse,
    });
  };

  // 获取每个批次的数据
  getStatisticalQuery = (item: any = today, e) => {
    console.log('item', item, e);
    if (item.funcDescription) {
      var funcDescription = new String();
      funcDescription = item.funcDescription;
      this.setState({
        funcDescription,
        batStatus: item.batStatus,
      });
    }
    getStatisticalQuery({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'statisticalQuery',
      data: { crtDt: item[0] ? item : today },
    }).then((res: any) => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        this.setState({
          sumDebitSuccCount: res.body.sumDebitSuccCount,
          sumSuccCount: res.body.sumSuccCount,
          sumSuccAmt: res.body.sumSuccAmt,
          sumCreditSuccCount: res.body.sumCreditSuccCount,
        });
      }
    });
    //当为时间选择框时不触发
    if (!item[0]) {
      if (!e) {
        this.letCircleIn();
      }
    }
  };
  getStatusStatistic = () => {
    getStatusStatistic({
      stdSvcInd: 'BatchPandectSVC',
      stdIntfcInd: 'statusStatistic',
      data: {},
    }).then((res: any) => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        console.log('dddddddd', res.body);
        this.setState({
          sumRunCnt: res.body.sumRunCnt,
          succRunCnt: res.body.succRunCnt,
          failRunCnt: res.body.failRunCnt,
          runningCnt: res.body.runningCnt,
          reRunCnt: res.body.reRunCnt,
        });
      }
    });
  };
  render() {
    const { batStatus } = this.state;
    const suffix = (
      <img
        onClick={() => this.getBatTask()}
        style={{ cursor: 'pointer' }}
        src={require('@/assets/homepage/search.svg')}
      />
    ) || <span />;
    const dateFormat = 'YYYY-MM-DD';
    const day = new Date();
    day.setTime(day.getTime());
    const today = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
    return (
      <div className={`${styles.whole} ${global} ${`block`}`}>
        {/* 进度条 */}
        <Row gutter={16} align="middle">
          {/* <Progress
            strokeColor="#3f67ed"
            strokeWidth={20}
            percent={this.state.percent}
            status="active"
          /> */}

          <Col span={10}>
            <Card className={styles.errorCard}>
              <>
                <img
                  src={require('@/assets/batchDiagram/failLogo.svg')}
                  alt="总数据展示"
                  style={{
                    width: '16px',
                    height: '16px',
                    margin: '0 7px 7px 0',
                  }}
                />
                <span
                  style={{
                    marginBottom: '18px',
                    display: 'inline-block',
                    fontSize: '18px',
                    color: 'black',
                    opacity: '0.65',
                    fontWeight: 500,
                    fontFamily: 'PingFangSC, PingFangSC-Medium',
                  }}
                >
                  异常提醒
                </span>
              </>
              {/* 截取前三条展示异常信息 */}
              {this.state.sumErrInfo &&
                this.state.sumErrInfo
                  .slice(0, 3)
                  .map((item: any, index: any) => {
                    return (
                      <Collapse ghost>
                        <Panel
                          showArrow={false}
                          header={
                            <Link to={`/batchAbnormalFlow?batNo=${item.batNo}`}>
                              <span>{`${item.batchDesc}(${item.batNo})`}</span>
                            </Link>
                          }
                          key={index + 1}
                        >
                          <li key={index + 1}>
                            <Tag icon={<CheckCircleOutlined />} color="success">
                              成功笔数：{item.succNum}
                            </Tag>
                            &nbsp;&nbsp;
                            <Tag icon={<CloseCircleOutlined />} color="error">
                              失败笔数：{item.failureNum}
                            </Tag>
                          </li>
                        </Panel>
                      </Collapse>
                    );
                  })}
              {this.state.isSpread &&
                this.state.sumErrInfo.slice(3).map((item: any, index: any) => {
                  return (
                    <Collapse ghost>
                      <Panel
                        header={`${item.batchDesc}(${item.batNo})`}
                        key={index + 1}
                      >
                        <ul>
                          {item.detailList.map((i: any, num: any) => {
                            return (
                              <li key={num}>
                                <Tooltip title={`${i.glbSrlNo}(${i.retMsg})`}>
                                  <a>
                                    {i.glbSrlNo}
                                    <span>({i.retMsg})</span>
                                  </a>
                                </Tooltip>
                              </li>
                            );
                          })}
                        </ul>
                      </Panel>
                    </Collapse>
                  );
                })}
              <div className={styles.showMore}>
                <Link to={'/batchAbnormalFlow'}>查看更多</Link>
                {/* 展开/收起按钮 */}
                {/* <Button
                  onClick={this.spread}
                  type="link"
                  className={styles.selectButton}
                >
                  {this.state.isSpread ? (
                    <span>
                      收起&nbsp;&nbsp;
                      <span className={styles.show}>
                        <DoubleRightOutlined />
                      </span>
                    </span>
                  ) : (
                      <span>
                        展开&nbsp;&nbsp;
                        <span className={styles.hide}>
                          <DoubleRightOutlined />
                        </span>
                      </span>
                    )}
                </Button> */}
              </div>
            </Card>
            <Row gutter={16}>
              <Col>
                <Card
                  className={styles.FirstCardType}
                  style={{ boxShadow: '0px 0px 20px 0px #cad2ff' }}
                >
                  <>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '18px',
                        color: '#3f67ed',
                        fontWeight: 600,
                        fontFamily: 'PingFangSC, PingFangSC-Medium',
                      }}
                    >
                      批次任务
                    </span>
                    <span
                      style={{
                        marginTop: '8px',
                        marginBottom: '16px',
                        display: 'block',
                        background: '#3f67ed',
                        height: '2px',
                        width: '18px',
                      }}
                    ></span>
                  </>
                  <Input
                    className={styles.searchSelect}
                    suffix={suffix}
                    placeholder="请输入对应主批次号"
                    // onChange={e => this.setSearch(e)}
                    style={{ marginBottom: '15px' }}
                  />
                  <Scrollbars autoHeightMax={230} autoHide autoHeight>
                    <ul>
                      {this.state.batchTaskList.map((item: any, index) => {
                        return (
                          <li
                            key={index}
                            style={{ marginBottom: '20px' }}
                            onClick={e => this.getStatisticalQuery(item, e)}
                          >
                            <span
                              className={styles.dot}
                              style={{
                                border: `1px solid ${
                                  item.batStatus == 'FA'
                                    ? '#fe3737'
                                    : item.batStatus == 'NS'
                                    ? '#3f67ed'
                                    : item.batStatus == 'SU'
                                    ? '#6dd400'
                                    : item.batStatus == 'RU'
                                    ? '#ff891e'
                                    : ''
                                }`,
                              }}
                            ></span>
                            <a>{item.funcDescription}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </Scrollbars>
                  <Pagination
                    style={{ marginTop: '15px', float: 'right' }}
                    onChange={(page, pageSize) => this.onChange(page, pageSize)}
                    hideOnSinglePage={true}
                    size="small"
                    showSizeChanger={false}
                    pageSize={this.state.pageSize}
                    total={this.state.total}
                    current={this.state.pageNum}
                  />
                </Card>
              </Col>
              <Col>
                <Card
                  className={styles.FirstCardType}
                  style={{
                    boxShadow: '0px 0px 20px 0px #cad2ff',
                    marginRight: '15px',
                  }}
                  hoverable
                >
                  <>
                    <div className={styles.slideshow}>
                      <img
                        className={styles.img}
                        src={require('@/assets/homepage/curve.gif')}
                        alt="总数据展示"
                      />
                    </div>
                    <span
                      style={{
                        display: 'block',
                        marginTop: '16px',
                        fontSize: '18px',
                        color: '#3f67ed',
                        fontWeight: 600,
                        fontFamily: 'PingFangSC, PingFangSC-Medium',
                      }}
                    >
                      总数据展示
                    </span>
                    <span
                      style={{
                        marginTop: '8px',
                        marginBottom: '16px',
                        display: 'block',
                        background: '#3f67ed',
                        height: '2px',
                        width: '18px',
                      }}
                    ></span>
                  </>
                  <ul>
                    <li>
                      <span className={styles.dot}></span>
                      <a>
                        当日总运行批次<span>{this.state.sumRunCnt}</span>
                      </a>
                    </li>
                    <div></div>
                    <li>
                      <span className={styles.dot}></span>
                      <a>
                        当日成功批次<span>{this.state.succRunCnt}</span>
                      </a>
                    </li>
                    <div></div>
                    <li>
                      <span className={styles.dot}></span>
                      <a>
                        当日失败批次<span>{this.state.failRunCnt}</span>
                      </a>
                    </li>
                    <div></div>
                    <li>
                      <span className={styles.dot}></span>
                      <a>
                        当日运行中批次<span>{this.state.runningCnt}</span>
                      </a>
                    </li>
                    <div></div>
                    <li>
                      <span className={styles.dot}></span>
                      <a>
                        当日重跑批次<span>{this.state.reRunCnt}</span>
                      </a>
                    </li>
                    <div> </div>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={14}>
            <div className={styles.content}>
              <ConfigProvider locale={zhCN}>
                <DatePicker
                  allowClear={false}
                  defaultValue={moment(today, dateFormat)}
                  disabledDate={this.disabledDate}
                  onChange={this.selectDate}
                  style={{
                    textAlign: 'center',
                    position: 'absolute',
                    left: '290px',
                    bottom: '-50px',
                    zIndex: '99',
                    background: '#3F67ED',
                    borderRadius: '36px',
                    height: '50px',
                    width: '150px',
                    color: '#000000',
                  }}
                  popupStyle={{ marginTop: '20px' }}
                ></DatePicker>
              </ConfigProvider>
              <img
                className={styles.dial}
                id="dial"
                src={require('@/assets/homepage/dial.svg')}
                alt="dial"
              />
              <div
                // ${this.state.showCircle ? styles.circleEnterInRight : ''}
                // ${styles.puffOutCenter}
                id="showRunning"
                className={`${styles.dialWord}`}
                onClick={this.getStatisticalQuery}
              >
                <div style={{ zIndex: '99', cursor: 'pointer' }}>
                  <span>{this.state.funcDescription || '当前批次'}</span>
                  <br />
                  <span
                    style={{
                      color:
                        batStatus == 'FA'
                          ? '#fe3737'
                          : batStatus == 'NS'
                          ? '#3f67ed'
                          : batStatus == 'SU'
                          ? '#6dd400'
                          : batStatus == 'RU'
                          ? '#ff891e'
                          : 'white',
                    }}
                  >
                    {batStatus == 'FA'
                      ? '运行失败'
                      : batStatus == 'NS'
                      ? '未开始'
                      : batStatus == 'SU'
                      ? '运行成功'
                      : batStatus == 'RU'
                      ? '运行中'
                      : '运行状态'}
                  </span>
                </div>
              </div>
              <div
                id="showRunning"
                className={`${styles.dialWord}  ${
                  this.state.showCircle ? '' : styles.puffOutCenter
                }`}
                style={{ backgroundColor: '#ffffff', opacity: '0.05' }}
              ></div>
              {/* ${this.state.showCircle ? styles.circleEnterInRight : ''
                      } ${this.state.clicked ? styles.circleRotate : ''} */}
              {this.state.showCircle && (
                <>
                  <div
                    className={`${styles.circle} ${
                      this.state.showCircle ? styles.circleEnterInRight : ''
                    } ${this.state.clicked ? styles.circleRotate : ''}`}
                    onClick={this.letCircleIn}
                    id="circle-1"
                    style={{
                      top: '104px',
                      left: '82px',
                      transformOrigin: '255% 235%',
                    }}
                  >
                    <div
                      id="word-1"
                      className={`${
                        this.state.clicked ? styles.circleBack : ''
                      }`}
                      style={{
                        transformOrigin: 'center center',
                        transform: 'none',
                      }}
                    >
                      <Tooltip title={this.state.sumDebitSuccCount}>
                        <span>{this.state.sumDebitSuccCount}</span>
                      </Tooltip>
                      <br />
                      <span>借方成功总数</span>
                    </div>
                  </div>
                  <div
                    id="circle-2"
                    className={`${styles.circle} ${
                      this.state.showCircle ? styles.circleEnterInLeft : ''
                    } ${this.state.clicked ? styles.circleRotate : ''}`}
                    style={{
                      borderColor: '#fe3737',
                      top: '483px',
                      left: '505px',
                      transformOrigin: '-155% -130%',
                    }}
                  >
                    <div
                      id="word-2"
                      className={`${
                        this.state.clicked ? styles.circleBack : ''
                      }`}
                    >
                      <Tooltip title={this.state.sumSuccCount}>
                        <span>{this.state.sumSuccCount}</span>
                      </Tooltip>
                      <br />
                      <span style={{ left: '16px' }}>成功总笔数</span>
                    </div>
                    {/* </div> */}
                  </div>
                  <div
                    id="circle-3"
                    className={`${styles.circle} ${
                      this.state.showCircle ? styles.circleEnterInLeft : ''
                    } ${this.state.clicked ? styles.circleRotate : ''}`}
                    style={{
                      top: '285px',
                      left: '591px',
                      transformOrigin: '-235% 70%',
                    }}
                  >
                    <div
                      id="word-3"
                      className={`${
                        this.state.clicked ? styles.circleBack : ''
                      }`}
                    >
                      <Tooltip title={this.state.sumSuccAmt}>
                        <span>{this.state.sumSuccAmt}</span>
                      </Tooltip>
                      <br />
                      <span style={{ left: '16px' }}>成功总金额</span>
                    </div>
                  </div>
                  <div
                    id="circle-4"
                    className={`${styles.circle} ${
                      this.state.showCircle ? styles.circleEnterInLeft : ''
                    } ${this.state.clicked ? styles.circleRotate : ''}`}
                    style={{
                      borderColor: '#3f67ed',
                      top: '77px',
                      left: '519px',
                      transformOrigin: '-160% 240%',
                    }}
                  >
                    <div
                      id="word-4"
                      className={`${
                        this.state.clicked ? styles.circleBack : ''
                      }`}
                    >
                      <Tooltip title={this.state.sumCreditSuccCount}>
                        <span>{this.state.sumCreditSuccCount}</span>
                      </Tooltip>
                      <br />
                      <span>贷方成功总数</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
