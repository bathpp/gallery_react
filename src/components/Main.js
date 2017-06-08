require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// url loader, return MD5 hash of the file content
// let yeomanImage = require('../images/yeoman.png');
let imageData = require('../data/imageData.json');
// json object can use map?
imageData = imageData.map((item) => {
  item.imageURL = require('../images/' + item.fileName);
  return item;
})
// imageData = ((imageJsonData)=>{
//   for (let i = 0, j = imageJsonData.length; i < j; i++) {
//     let singleImageData = imageJsonData[i];
//     singleImageData.imageURL = require('../images/' + singleImageData.fileName);
//     imageJsonData[i] = singleImageData;
//   }
//   return imageJsonData;
// })(imageData);

// get random number between low and high
let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
// random a degree to rotate, -30 ~ +30
let get30DegRandom = () => (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /*
   * handle click on img to inverse
   */
  handleClick(e) {
    if (this.props.arrange.isCenter){
      this.props.inverse();
    }
    else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    let styleObj = {};
    // populate arranged position
    if (this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    // add rotation to imgFigure
    if (this.props.arrange.rotate) {
      (['Moz', 'ms', 'Webkit', '']).map((item) => {
          styleObj[item + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }

    // add is-inverse in className
    let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': '';
    // make center pic on top
    if (this.props.arrange.isCenter) {
      styleObj['zIndex'] = 11;
    }
    return(
      <figure className = {imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}>
        </img>
        <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component {
  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return (
      <span className="controller-unit" onClick={this.handleClick}></span>
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
      imgArrangeArr: [
        // follow the format below
        // {
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //  rotate:0,
        //  isInverse:false
        //  isCenter:false
        // }
      ]
    };
  }


  // get pic position after mount
  componentDidMount() {
    // get stage size
    const stageDOM = ReactDOM.findDOMNode(this.refs.gallaryStage),
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW / 2),
          halfStageH = Math.ceil(stageH / 2);


    // get imgFigure size
    const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

        //get the position of the center pic
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
          };

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

        // random a pic for center, and then rearrange the rest
        let centerIndex = Math.floor(Math.random() * Object.keys(imageData).length);
        this.rearrange(centerIndex);
  }

  /*
   * inverse pic
   * @param index
   * @return closure, index is taken when called
   */
  inverse (index) {
    return () => {
      const imgArrangeArr = this.state.imgArrangeArr;

      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;

      this.setState(
        {imgArrangeArr: imgArrangeArr}
      )
    }
  }

  /*
   * @param index
   * @return closure, index is taken when called
   */
  center (index) {
    return () => {
      this.rearrange(index)
    }
  }
  /*
   * rearrange all the pics position
   * @param centerIndex
   */
  rearrange (centerIndex){
    let imgArrangeArr = this.state.imgArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgArrangeTopArr = [],
        // random 0 or 1 pic that on top area
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

    // make the center pic center
    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    topImgSpliceIndex = Math.floor(Math.random() * (imgArrangeArr.length - topImgNum));
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
    //  place top area pic
    imgArrangeTopArr.forEach((value, index)=>{
      imgArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });

    // place left and right pic
    for (let i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;
      // i<k is left, else is right
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      }
      else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    // insert the top pic back to array
    if (imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }
    // insert the center pic back to array
    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);
    this.setState(
      {
        imgArrangeArr: imgArrangeArr
      }
    )

  }



  render() {
    let controllerUnits = [],
        imageFigures = [];

    imageData.forEach((value, index)=>{
      if (!this.state.imgArrangeArr[index]){
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }

      imageFigures.push(
        <ImgFigure key={index}
                   data={value}
                   ref={'imgFigure'+index}
                   arrange={this.state.imgArrangeArr[index]}
                   inverse={this.inverse(index)}
                   center={this.center(index)}
        ></ImgFigure>
      )

      controllerUnits.push (
        <ControllerUnit/>
      )

    });



    return (
      <section className="stage" ref="gallaryStage">
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
