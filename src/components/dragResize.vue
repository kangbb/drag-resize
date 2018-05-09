<template>
  <div id="region" @mousemove="moveHandler" @mousedown="downHandler" @mouseup="upHandler">
    <div id="region1" :style="{height: region1Height}">
      <div id="part1" :style="{width: part1Width }"></div>
      <div id="part2" :style="{width: part2Width}"></div>
    </div>
    <div id="region2" :style="{height: region2Height}"></div>
  </div>
</template>

<script>
export default {
  name: 'DrageResize',
  data: function () {
    return {
      topResizeLineX: 0,
      topResizeLineY: 0,
      topResizeLineYWidth: 0,
      bottomResizeLineX: 0,
      bottomResizeLineY: 0,
      bottomResizeLineXWidth: 0,

      onTopLine: false,
      onBottomLine: false,

      region1Height: '500px',
      region2Height: 'calc(100% - 500px)',
      part1Width: '300px',
      part2Width: 'calc(100% - 300px)',

      mouseState: 'up'
    }
  },
  mounted: function () {
    var coordinate = this.getCoordinate('part1')
    this.topResizeLineX = coordinate[0]
    this.topResizeLineY = coordinate[1]
    this.topResizeLineYWidth = coordinate[3]

    coordinate = this.getCoordinate('region1')
    this.bottomResizeLineX = coordinate[0]
    this.bottomResizeLineY = coordinate[1]
    this.bottomResizeLineXWidth = coordinate[2]

    // window.$('#region').mousemove(this.moveHandler)
    // window.$('#region').mousedown(this.downHandler)
    // window.$('#region').mouseup(this.upHandler)
  },
  methods: {
    getCoordinate: function (id) {
      var p = window.$('#' + id).offset()
      var w = window.$('#' + id).width()
      var h = window.$('#' + id).height()
      return [p.left + w, p.top + h, w, h]
    },
    moveHandler: function (e) {
      var X = e.clientX
      var Y = e.clientY
      // 在part1和part2之间
      if (X >= this.topResizeLineX - 5 && X <= this.topResizeLineX + 5 &&
        Y >= this.topResizeLineY - this.topResizeLineYWidth && Y <= this.topResizeLineY &&
        this.mouseState !== 'down') {
        window.$('#region').addClass('col-resize')
        this.onTopLine = true
        return
      } else if (X >= this.bottomResizeLineX - this.bottomResizeLineXWidth && X <= this.bottomResizeLineX &&
        Y >= this.bottomResizeLineY - 5 && Y < this.bottomResizeLineY + 5 &&
        this.mouseState !== 'down') {
        // 在region1和region2之间
        window.$('#region').addClass('row-resize')
        this.onBottomLine = true
      } else {
        // 其他情况，判断是否需要修改onBottomLine，onTopLine
        if (this.mouseState === 'up') {
          this.onTopLine = false
          this.onBottomLine = false
          window.$('#region').removeClass('col-resize')
          window.$('#region').removeClass('row-resize')
          return
        }
      }

      // 以上位置或者在其他位置，但是onmousedown
      // 更新各个div大小
      var reg = /\d+/g
      var pos
      if (this.mouseState === 'down' && this.onTopLine) {
        var sub = X - this.topResizeLineX
        this.topResizeLineX = X
        this.part1Width = (parseInt(this.part1Width.match(reg)[0]) + sub) + 'px'
        // 通过百分比更新，布局更加灵活
        this.part2Width = 'calc(100% - ' + this.part1Width + ')'

        // 设置part2 left值, 即为part1的宽度
        pos = window.$('#part2').offset()
        window.$('#part2').offset({top: pos.top, left: parseInt(this.part1Width.match(reg)[0])})
      } else if (this.mouseState === 'down' && this.onBottomLine) {
        // 修改div大小
        sub = Y - this.bottomResizeLineY
        this.bottomResizeLineY = Y
        this.region1Height = (parseInt(this.region1Height.match(reg)[0]) + sub) + 'px'
        this.region2Height = 'calc(100% - ' + this.region1Height + ')'
        var h
        h = window.$('#part1').height()
        window.$('#part1').height(h + sub)
        h = window.$('#part2').height()
        window.$('#part2').height(h + sub)
        // 设置region2 top值,即region1的高度
        pos = window.$('#region2').offset()
        window.$('#region2').offset({top: pos.top + sub, left: pos.left})
      }
    },
    downHandler: function (e) {
      if (this.onTopLine || this.onBottomLine) {
        this.mouseState = 'down'
      }
    },
    upHandler: function (e) {
      this.mouseState = 'up'
      this.onTopLine = false
      this.onBottomLine = false
    }
  }
}
</script>

<style>
#region {
  width: 100%;
  height: 100%;
  background: saddlebrown;
  overflow: hidden;
}
#region1 {
  position: relative;
  width: 100%;
  background-color: purple;
}
#part1 {
  position: absolute;
  margin: 0;
  height: 500px;
  background-color: blue;
}
#part2 {
  position: absolute;
  margin-left: 300px;
  height: 500px;
  background-color:purple;
}
#region2 {
  position: absolute;
  margin: 0;
  width: 100%;
  background-color: saddlebrown;
}
.col-resize {
  cursor: col-resize;
}
.row-resize {
  cursor: row-resize;
}
</style>
