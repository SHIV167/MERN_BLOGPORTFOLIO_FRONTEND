import React from 'react';
import Slider from 'react-slick';

// Only one arrow (next) will be shown, styled as before
const SliderArrow = (props) => {
  const { className, style, onClick, arrowType } = props;
  return (
    <button
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(255,255,255,0.8)",
        color: "#4317b7",
        border: "none",
        borderRadius: "50%",
        width: 40,
        height: 40,
        right: arrowType === 'next' ? 16 : undefined,
        left: arrowType === 'prev' ? 16 : undefined,
        top: "50%",
        transform: arrowType === 'prev'
          ? "translate(-0%, -50%)"
          : "translate(0%, -50%)",
        zIndex: 2,
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        fontSize: 20,
        cursor: "pointer",
      }}
      aria-label={arrowType === 'next' ? 'Next Slide' : 'Previous Slide'}
      onClick={onClick}
    >
      {arrowType === 'next' ? '→' : '←'}
    </button>
  );
};

const SliderSection = ({ items, renderItem, slidesToShow = 3, ...props }) => {
  const settings = {
    dots: true,
    appendDots: dots => (
      <div>
        <ul style={{ display: 'flex', justifyContent: 'center', margin: '16px 0', padding: 0 }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: i => (
      <button style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.6)',
        border: 'none',
        margin: '0 6px',
        padding: 0,
        cursor: 'pointer',
      }} />
    ),
    infinite: items.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <SliderArrow arrowType="prev" />, // Show single style for prev
    nextArrow: <SliderArrow arrowType="next" />, // Show single style for next
    centerMode: false,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings} {...props}>
      {items.map((item, idx) => (
        <div key={item._id || idx} style={{ padding: '0 20px', minWidth: 320 }}>
          {renderItem(item)}
        </div>
      ))}
    </Slider>
  );
};

export default SliderSection;
