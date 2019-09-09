/** 读写json文件 */
const fs = import('fs');

const writeJson = (params, filePath) => {
  //现将json文件读出来
  console.info(fs);
  // console.info(this.$fs);
  debugger;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return console.error(err);
    }
    let context = data.toString();//将二进制的数据转换为字符串
    let object = JSON.parse(context);//将字符串转换为json对象
    object = Object.assign({}, {object}, {params});
    let str = JSON.stringify(object);//把json对象转换成字符串重新写入json文件中
    fs.writeFile(filePath, str, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('----------新增成功-------------');
    });
  });
};

const editJson = (params, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
    }
    let object = data.toString();
    object = JSON.parse(object);
    //把数据读出来,然后进行修改
    object = Object.assign({}, object, params);
    let str = JSON.stringify(object);
    fs.writeFile(filePath, str, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('--------------------修改成功');
      console.log(object);
    });
  });
};

const deleteJson = (paramName, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
    }
    let object = data.toString();
    object = JSON.parse(object);
    //把数据读出来,然后进行修改
    let {paramName, ...result} = object;
    let str = JSON.stringify(result);
    fs.writeFile(filePath, str, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('--------------------删除成功');
      console.log(object);
    });
  });
};

const queryJson = (filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
    }
    let object = data.toString();
    object = JSON.parse(object);
    //把数据读出来
    console.log(object);
    console.log('------------------------查询成功pagePerson');
  });
};

export {
  writeJson,
  editJson,
  deleteJson,
  queryJson
};
