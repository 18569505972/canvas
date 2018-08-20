function turntables() {

}
turntables.prototype = {
    //对奖品图片预加载
    preloadimages(arr) {
        var newimages = [],
            loadedimages = 0
        var postaction = function() {} //此处增加了一个postaction函数
        var arr = (typeof arr != "object") ? [arr] : arr

        function imageloadpost() {
            loadedimages++
            if (loadedimages == arr.length) {
                postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
            }
        }
        for (var i = 0; i < arr.length; i++) {
            newimages[i] = new Image()
            newimages[i].src = arr[i]
            newimages[i].onload = function() {
                imageloadpost()
            }
            newimages[i].onerror = function() {
                imageloadpost()
            }
        }
        return { //此处返回一个空白对象的done方法
            done: function(f) {
                postaction = f || postaction
            }
        }
    },
    // 渲染大转盘
    drawRouletteWheel(canvas) {
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (turnplate.restaraunts.length / 2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0, 0, 422, 422);
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
            ctx.strokeStyle = "rgba(0,0,0,0)";
            //font 属性设置或返回画布上文本内容的当前字体属性
            for (var i = 0; i < turnplate.restaraunts.length; i++) {
                //根据当前奖品索引 计算绘制的扇形开始弧度
                var angle = turnplate.startAngle + i * arc;
                //根据奖品参数 绘制扇形填充颜色
                ctx.fillStyle = turnplate.colors[i];
                //开始绘制扇形
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                //绘制大圆
                ctx.arc(212, 212, turnplate.textRadius, angle + Math.PI / 72, angle + arc - Math.PI / 72, false);
                //绘制小圆
                ctx.arc(212, 212, turnplate.insideRadius, angle + arc - Math.PI / 72, angle + Math.PI / 72, true);
                ctx.stroke();
                ctx.fill();
                //锁画布(为了保存之前的画布状态)
                ctx.save();
                //----绘制奖品开始----
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(212 + Math.cos(angle + arc / 2) * turnplate.textRadius, 212 + Math.sin(angle + arc / 2) * turnplate.textRadius);
                //rotate方法旋转当前的绘图
                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                //绘制奖品图片
                var img = new Image();
                img.src = turnplate.goodsimgArr[i];
                ctx.drawImage(img, -50, 10, 100, 70);
                //把当前画布返回（插入）到上一个save()状态之前
                ctx.restore();
                ctx.save();
                //----绘制奖品结束----
            }
        }
    },
    // 渲染转盘指针
    drawpoint() {
        var canvaspoint = document.getElementById(turnplate.pointid);
        var ctxpoint = canvaspoint.getContext("2d");
        ctxpoint.rect(0, 0, 422, 422);
        var imgpoint = new Image();
        imgpoint.src = turnplate.pointImg;
        imgpoint.onload = function() {
            ctxpoint.drawImage(this, 161, 161, 100, 100);
        }
    },
    // 大转盘背景
    drawBg() {
        var canvasbg = document.getElementById(turnplate.bgImgid);
        this.canvasbg = canvasbg;
        var ctxbg = canvasbg.getContext("2d");
        ctxbg.rect(0, 0, 422, 422);
        var img = new Image();
        img.src = turnplate.bgImg[0];
        img.width = '100%'
        img.onload = function() {
            ctxbg.drawImage(this, 0, 0, 422, 422);
        }
    },
    // 外部调用
    drawfinish() {
        var canvas = document.getElementById(turnplate.id);
        var _this = this;
        _this.drawBg();
        _this.preloadimages(turnplate.goodsimgArr).done(function(images) {
            _this.drawRouletteWheel(canvas);
        })
        _this.drawpoint(turnplate.pointid)
        return canvas
    },
    // 开始转动
    beginRotate() {
        var _this = this
        return setInterval(function() {
            _this.canvasbg.style.transform = 'rotate(' + Math.PI * 2 * turnplate.deg + 'deg)';
            canvas.style.transform = 'rotate(' + Math.PI * 2 * turnplate.deg + 'deg)';
            turnplate.deg++
        }, 10)
    },
    //停止转动
    stopRotate(stopdeg) {
        this.canvasbg.style.transform = 'rotate(-' + stopdeg + 'deg)';
        canvas.style.transform = 'rotate(-' + stopdeg + 'deg)';
    }
}