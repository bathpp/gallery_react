require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');  --url loader
let imageData = require('../data/imageData.json');

// self executed function, get img path
imageData = ((imageDataArray)=>{
  for (var i = 0, j = imageDataArray.length; i < j; i++) {
    let singleImageData = imageDataArray[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDataArray[i] = singleImageData;
  }
  return imageDataArray;
})(imageData);


class AppComponent extends React.Component {
  render() {
    return (
      <section ClassName="stage">
        <section ClassName="img-sec">

        </section>
        <nav class ClassName="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
