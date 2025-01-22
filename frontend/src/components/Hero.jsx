import React from 'react'
import SimpleImageSlider from "react-simple-image-slider";
const images = [
  { url: require('../assets/featuring1.jpeg') },
  { url: require('../assets/featuring1.jpeg') },
  { url: require('../assets/featuring1.jpeg') },
];

const Hero = () => {
  return (
    <div className='mt-[4rem] '>
      <div className=" h-[200px] sm:h-[350px] relative border-r-4">
        <SimpleImageSlider
          width="100%"
          height="100%"
          images={images}
          showBullets={true}
          showNavs={true}
          bgColor="transparent"
          autoPlay={true}
        />
      </div>
    </div>
  )
}

export default Hero
