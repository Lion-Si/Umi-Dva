import { v4 as uuidv4 } from 'uuid';

export function isDisable(editType) {
  switch (editType) {
    case 'readOnly':
      return true;
    case 'add':
      return false;
    case 'alter':
      return false;
    default:
      return true;
  }
}

export function needValidate(editType) {
  switch (editType) {
    case 'readOnly':
      return false;
    case 'add':
      return true;
    case 'alter':
      return true;
    default:
      return true;
  }
}

/**

* 将 对象数组类型的报文 转换成 纯对象类型的JSON报文
* 比如：将 系统/本地报文头与报文体表格数据 转换成 用于报文展示的JSON数据
* @Array  {*} arrayObjectMsg  对象数组类型的报文
* @String {*} keyName         需要提取的key
*/
export function objectArrayMsg2jsonMsg(arrayObjectMsg, keyName = 'structName') {
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
 * 将 输入输出设置里面的表格数据转化为对应的JSON数据格式
 * @Object {*} jsonObject
 */
export function tableData2json(tableData) {
  const compute = tableData => {
    let result = {};
    tableData.map(item => {
      if (item.children) {
        result[item.structName] = compute(item.children);
      } else {
        result[item.structName] = item.value || '';
      }
    });

    return result;
  };
  const jsonMsg = compute(tableData);
  return jsonMsg;
}

/**
 * 将 JSON 转换成 适用于系统/本地报文头与报文体表格格式的数据
 * @Object {*} jsonObject
 */
export function jsonToTable(jsonObject) {
  let result = [];
  for (const key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      if (
        Object.prototype.toString.call(jsonObject[key]) === '[object Object]'
      ) {
        result.push({
          key: uuidv4(),
          structName: key,
          type: 'String(32)',
          required: true,
          defaultValue: '',
          description: '',
          children: jsonToTable(jsonObject[key]),
        });
      } else {
        result.push({
          key: uuidv4(),
          structName: key,
          type: 'String(32)',
          required: true,
          defaultValue: '',
          description: '',
        });
      }
    }
  }
  return result;
}

/**
 * 将 JSON 转换成 适用于(输入输出设置)表格格式的数据
 * @Object {*} jsonObject
 */
export function json2ParamSettingsTable(jsonObject) {
  let result = [];
  for (const key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      if (
        Object.prototype.toString.call(jsonObject[key]) === '[object Object]'
      ) {
        result.push({
          key: uuidv4(),
          structName: key,
          value: '',
          children: jsonToTable(jsonObject[key]),
        });
      } else {
        result.push({
          key: uuidv4(),
          structName: key,
          value: jsonObject[key],
        });
      }
    }
  }
  return result;
}
