require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//url loader, return MD5 hash of the file content
//let yeomanImage = require('../images/yeoman.png');
let imageData = require('../data/imageData.json');

// self executed function, get img path
imageData = ((imageJsonData)=>{
  for (var i = 0, j = imageJsonData.length; i < j; i++) {
    let singleImageData = imageJsonData[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageJsonData[i] = singleImageData;
  }
  return imageJsonData;
})(imageData);

// get random number between low and high
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

class ImgFigure extends React.Component {
  render(){
    return(
      <figure className = "img-figure">
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}>
        </img>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class GalleryByReactApp extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {  // horizontal
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { // vertical
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //  rotate:0,
        //  isInverse:false
        //  isCenter:false
        //}
      ]
    }
  }


  // get pic postion
  componentDidMount() {
    // get stage size
    let stageDOM = React.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,

        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // get imgFigure size
    let imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

        //get the position of the center pic
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
          }

        //left and right pics area range
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //top pics area range
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        // place the pics
        let num = Math.floor(Math.random() * 10);
        this.rearrange(num);
  }

  /*
   * rearrange all the pics position
   * @param centerIndex
   */
   rearrange (centerIndex){
     let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = hPosRange.x,

        imgsArrangeTopArr = [],
        // random 1 or 2 pic
        topImgNum = Math.ceil(Math.random() * 2),
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        // make the center pic center
        imgsArrangeCenterArr[0].pos = centerPos;

        // get top area pic state info
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //  place top area pic
        imgsArrangeTopArr.forEach((value, index)=>{
          imgsArrangeTopArr[index].pos = {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          }
        });

   }



  render() {
    let controllerUnits = [],
        imageFigures = [];

    imageData.forEach((value, index)=>{
      if (!this.state.imgsArrangeArr[index]){
        this.stage.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imageFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}/>)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
