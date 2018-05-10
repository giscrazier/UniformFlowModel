//根据给定的路径点和速度，计算按顺序流动的下一个点位
let _idx = new WeakMap();
let _count = new WeakMap();
let {abs} = Math;
export default class UniformFlowModel{
    constructor(points,speed){
       this.speedU = speed;
        let lineNodes = this.points = points;
        _idx.set(this,0);
        _count.set(this,0);

        for(let i=0; i< lineNodes.length-1; i++){
            //distance
            let distance = {
                deltaX : lineNodes[i + 1][0] - lineNodes[i][0],
                deltaY : lineNodes[i + 1][1] - lineNodes[i][1],
                deltaZ : lineNodes[i + 1][2] || 0 - lineNodes[i][2] || 0
            };

            //speed
            let speed = null;
            if(abs(distance.deltaX) > abs(distance.deltaY)){
                let timeInX = abs(distance.deltaX/this.speedU);//跑完x轴花费的时间
                speed = {
                    speedX: distance.deltaX/timeInX,
                    speedY: distance.deltaY/timeInX,
                    speedZ: distance.deltaZ/timeInX
                };
            }else {
                let timeInY = abs(distance.deltaY/this.speedU);//跑完y轴花费的时间
                speed = {
                    speedX:distance.deltaX/timeInY,
                    speedY: distance.deltaY/timeInY,
                    speedZ: distance.deltaZ/timeInY
                };
            }

            Object.assign(lineNodes[i],{distance,speed});
            //console.log(lineNodes);
        }
    }
    next(){
        let lineNodes = this.points;
        let idx = _idx.get(this);
        let count = _count.get(this);
        _count.set(this,++count);

        //当前跑的路径
        let path = lineNodes[idx];
        //当一小段走完
        if(abs(count * path.speed.speedX) >= abs(path.distance.deltaX) &&
            abs(count * path.speed.speedY) >= abs(path.distance.deltaY)){
            idx = ++idx%(lineNodes.length - 1);//这里当线路的所有子线路走完是，idx重新回到0，即重新从头开始计算点位置
            _idx.set(this,idx);
            count = 0;//每一段的基数置为0
            _count.set(this,0);
        }
        //正在计算的子线路
        path = lineNodes[idx];
        return [path[0] + count * path.speed.speedX,
            path[1] + count * path.speed.speedY,
            (path[2] || 0)  + count * path.speed.speedZ];
    }
    reset(){
        _idx.set(this,0);
        _count.set(this,0);
    }
}
