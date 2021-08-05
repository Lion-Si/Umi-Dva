//将父节点填充到数组中
const addParentKeyWrapper = (tree: any) => {
  const data = JSON.parse(JSON.stringify(tree));
  function addParentKey(data: any, parentKey: any) {
    data.forEach(ele => {
      const { children, key } = ele;
      ele.parent = parentKey;
      if (children) {
        addParentKey(children, key);
      }
    });
  }
  addParentKey(data, null);
  return data;
};
//将树扁平化，通过设置parentKey属性来建立扁平化后树的联系
const flattenTreeDataClosure = (data: any) => {
  const treeData = JSON.parse(JSON.stringify(data));
  const flattenData: any = [];
  function flattenTree(data: any, parentKey: any) {
    data.forEach(ele => {
      const { title, key, children } = ele;
      flattenData.push({ title, key, parentKey });
      if (children) {
        flattenTree(children, key);
      }
    });
  }
  flattenTree(treeData, null);
  return flattenData;
};

//找到给定子节点的所有父级节点并添加到数组中
const findParent = (item: any, flattenTree: any) => {
  const parentArr: any = [];
  function find(item: any, flattenTree: any) {
    flattenTree.forEach(ele => {
      if (ele.key === item) {
        parentArr.unshift(ele.key);
        find(ele.parentKey, flattenTree);
      }
    });
  }
  find(item, flattenTree);
  return parentArr;
};

function getTokenByCookie(cookies_str: string) {
  //不存在则返回空
  if (!cookies_str) {
    return null;
  }
  //切割Cookie
  let cookies = cookies_str.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim().split('=');
    if (cookie[0] == 'token') {
      return cookie[1];
    }
  }
  return null;
}

export { flattenTreeDataClosure, findParent, getTokenByCookie };
