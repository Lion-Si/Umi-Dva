/**
 * 将 输入输出设置里面的表格数据转化为对应的JSON数据格式
 * @Object {*} jsonObject
 */
export function tableData2json(tableData: any) {
  const compute = (tableData: any) => {
    let result = {};
    tableData.map((item: any) => {
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
