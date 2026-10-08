import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function Hero() {
  return (
    <section className="w-full ">

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}

        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}

        pagination={{
          clickable: true,
        }}

        navigation={true}
      >

        <SwiperSlide>
          <img
            src="/image/banner 1.png"
            alt="EduNest Banner 1"
            className="w-full h-[400px] object-cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="/image/banner 2.png"
            alt="EduNest Banner 2"
            className="w-full h-[400px] object-cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="/image/banner 3.png"
            alt="EduNest Banner 3"
            className="w-full h-[400px] object-cover"
          />
        </SwiperSlide>

      </Swiper>

    </section>
  );
}

export default Hero;