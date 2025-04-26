// src/components/CloudinaryImage.js
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const cld = new Cloudinary({
  cloud: {
    cloudName:
      process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME,
  },
});

export default function CloudinaryImage({ src, alt, ...rest }) {
  // derive your publicId (including folder)
  const filename = src.split("/").pop().split(".")[0];
  const publicId = `mern_blog_uploads/${filename}`;
  const cldImg = cld.image(publicId).format("avif");

  return <AdvancedImage cldImg={cldImg} alt={alt} {...rest} />;
}
