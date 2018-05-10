# UniformFlowModel
根据给定的路径点和速度，计算按顺序流动的下一个点位。

## 安装
```shell
$ npm install uniformflowmodel --save
```
## 使用
```javascript
let ufm = new UniformFlowModel(this.polyline.paths[0], speed);

//使用next方法便可以取到下一个点位，
ufm.next();
```
当流动点位到达终点时，就会又从头开始