import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { history } from 'umi';
import { getTokenByCookie } from './getTreeParent.tsx';
const baseUrl = process.env.baseUrl;
const mock = process.env.mock;
// 是否为开发环境
const IS_DEV_MODE = process.env.NODE_ENV !== 'production';

// 开发环境请求头工具方法
function formatDate(date) {
  let myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = '0' + mymonth;
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday;
  }
  return myyear + '-' + mymonth + '-' + myweekday;
}

// 开发环境请求头工具方法
function formatTime() {
  let date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let ss = date.getMilliseconds();
  if (h < 10) {
    h = '0' + h;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }
  let time = h.toString() + m.toString() + s.toString() + ss.toString();
  return time;
}

// 开发环境请求头工具方法
function randomString(e) {
  e = e || 32;
  let t = '0123456789';
  let a = t.length;
  let n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

const codeMessage = {
  200: '成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.destroy();
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    console.log(error);
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const request = extend({
  errorHandler,
});
/**
 * 配置request请求时的默认参数
 */

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  //判断token
  let c_token = getTokenByCookie(document.cookie);
  if (history.location.pathname != '/login' && !c_token) {
    history.push('/login');
    notification.error({
      message: `请先登录`,
      duration: 2,
    });
    return;
  }
  //统一添加域名及token
  if (c_token) {
    const headers = {
      aacCode: '001',
      // cadCode: '999998',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: c_token,
    };
    // 本地报文头
    let userInfo = JSON.parse(localStorage.getItem('userInformation'));
    if (!userInfo) {
      throw new Error(
        '本地报文头 localHead 获取失败，可能原因：未登录基座，localStorage 中不存在用户信息。',
      );
    }
    const localHead = {
      // 分页信息
      pgngObjInf: {
        // 页码
        crnPgCnt: options?.data?.localHead?.pgngObjInf?.crnPgCnt,
        // 页数
        pgRcrdNum: options?.data?.localHead?.pgngObjInf?.pgRcrdNum,
      },
      // 用户信息
      usrBscInf: {
        // 员工所属机构名称
        blngInstNm: userInfo?.sysOrg?.orgName,
        // 员工所属机构号
        emplyAsgnInstNo: userInfo?.sysOrg?.orgId,
        // 员工名称
        emplyNm: userInfo?.sysUser?.empName,
        // 员工编号
        emplyNo: userInfo?.sysUser?.empNo,
        // 岗位编号
        postCd: userInfo?.sysPost.map(item => {
          return item?.positionId;
        }),
        // 岗位名称
        postNm: userInfo?.sysPost.map(item => {
          return item?.positionName;
        }),
        // 角色编号
        roleCd: userInfo?.sysRole.map(item => {
          return item?.roleId;
        }),
        // 角色名称
        roleNm: userInfo?.sysRole.map(item => {
          return item?.roleName;
        }),
      },
      // 设备指纹信息
      eqmtFpInf: {
        // IP地址
        ipAdr: '',
        // 设备指纹
        eqmtFpId: '',
        // 是否装有webdriver
        webDriver: '',
        // 操作系统名称
        oprtnSysNm: window.navigator.appVersion,
        // 浏览器名称
        brwsRdrNm: window.navigator.appVersion,
        // 浏览器版本
        brwsRdrVerNo: window.navigator.appVersion,
        // 浏览器语言
        brwsRdrLngType: window.navigator.language,
        // 分辨率
        rslRate: `${window.screen.width}*${window.screen.height}`,
        // 系统名称是否被篡改
        sysNmAmdtFlg: '',
        // 浏览器类型是否被篡改
        brwsRdrTypeAmdtFlg: '',
        // 语言是否被篡改
        lngAmdtFlg: '',
        // 分辨率是否被篡改
        rslRateAmdtFlg: '',
        // 时区
        tmZoneVal: '',
        // 内存条序列号
        mmryCrdSeqNo: '',
        // BIOS序列号
        bscInputOtptSysSeqNo: '',
        // CPU序列号
        cpuSeqNo: '',
        // 硬盘序列号
        diskSeqNo: '',
        // MAC地址
        macVal: '',
        // 主板序列号
        mainICSeqNo: '',
      },
    };
    //为测试先更改入参
    if (IS_DEV_MODE) {
      // 开发环境
      // 重构请求数据

      const data = {
        sysHead: {
          // 走网关必备四要素
          stdSvcInd: options.data.stdSvcInd,
          stdIntfcInd: options.data.stdIntfcInd,
          stdIntfcVerNo: '1.0.0',
          srcConsmSysInd: 'NGBTRA',
          //
          accCode: '001',
          chnlNo: '10',
          consmMainSrlNo: randomString(32),
          consmPltfmDt: formatDate(new Date()),
          consmSubSrlNo: '001',
          consmSvcInd: '',
          consmSysInd: 'NGBTRA',
          consmTxnCd: '001',
          consmTxnMchnDt: formatDate(new Date()),
          consmTxnMchnTm: formatTime(),
          dcnNo: '',
          glbRqsTmstmp: new Date().getTime().toString(),
          glbSrlNo: randomString(32),
          idcNo: '',
          instNo: '',
          lglPrsnCd: '01',
          macVal: '1',
          ovtmTmNum: '600',
          srcConsmTmlNo: '',
          srcConsmTmlType: '',
          sysRsrvCharStrg: '',
          sysRsrvFlgStrg: '',
          txnChrctrstcType: '0',
          txnDstcNo: '',
          usrNo: '',
        },
        body: { ...options.data.data },
        localHead,
      };
      // 最终返回
      return {
        // url: mock ? url : `${baseUrl}${url}`,
        url: mock ? url : `${baseUrl}${url}`,
        options: {
          ...options,
          headers: headers,
          data,
        },
      };
    } else {
      const newBody = {
        sysHead: {
          stdSvcInd: options.data.stdSvcInd,
          stdIntfcInd: options.data.stdIntfcInd,
          // 超时时间
          ovtmTmNum: '600',
          consmSysInd: 'NGBTRA',
          srcConsmSysInd: 'NGBTRA',
          stdIntfcVerNo: '1.0.0',
        },
        body: { ...options.data.data },
        localHead: localHead,
      };
      return {
        // url: mock ? url : `${baseUrl}${url}`,
        url: mock ? url : `${baseUrl}`,
        options: {
          ...options,
          headers: headers,
          data: newBody,
        },
      };
    }
  }
});

// response拦截器, 处理response
request.interceptors.response.use(async response => {
  response = await response.json();

  if (response.sysHead.retCd != '000000') {
    if (response.sysHead.retCd == 'NGBMRS-B-100008') {
      notification.destroy();
      notification.error({
        description: '您还未登录,请先登录',
        message: '请先登录',
        duration: 2,
      });
      window.localStorage.removeItem('empNo');
      var date = new Date();
      date.setTime(date.getTime() - 60 * 60 * 24 * 30 * 1000);
      // window.sessionStorage.removeItem('token');
      document.cookie =
        'token=' +
        getTokenByCookie(document.cookie) +
        ';expires=' +
        date.toString();
      window.localStorage.removeItem('userInformation');
      history.push('/login');
      return;
    }
    if (
      response.sysHead.retCd == 'NGBMRS-B-100009' ||
      response.sysHead.retCd == 'NGBMRS-B-100020'
    ) {
      if (
        window.localStorage.getItem('empNo') &&
        // window.sessionStorage.getItem('token')
        getTokenByCookie(document.cookie)
      ) {
        notification.destroy();
        notification.error({
          description: '登录已失效，请重新登录',
          message: '请重新登录',
          duration: 2,
        });
        window.localStorage.removeItem('empNo');
        var date = new Date();
        date.setTime(date.getTime() - 60 * 60 * 24 * 30 * 1000);
        // window.sessionStorage.removeItem('token');
        document.cookie =
          'token=' +
          getTokenByCookie(document.cookie) +
          ';expires=' +
          date.toString();
        window.localStorage.removeItem('userInformation');
        history.push('/login');
      }

      return;
    }

    if (
      window.localStorage.getItem('empNo') &&
      // window.sessionStorage.getItem('token')
      getTokenByCookie(document.cookie)
    ) {
      notification.destroy();
      notification.error({
        description: response.sysHead.retInf,
        message: response.sysHead.retCd,
      });
    }
  }

  return response;
});

export default request;
