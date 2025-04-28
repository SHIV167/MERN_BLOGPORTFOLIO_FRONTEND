// src/components/CloudinaryImage.js
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import React from "react";
import PropTypes from "prop-types";

const cld = new Cloudinary({
  cloud: {
    cloudName:
      process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME,
  },
});

export default function CloudinaryImage({ src, alt, ...rest }) {
  // Handle cases where src might be undefined or null
  if (!src) {
    console.error("CloudinaryImage: src prop is required");
    return null;
  }

  // Check if it's a Cloudinary URL or a regular URL
  if (
    src.includes("cloudinary.com") ||
    (!src.startsWith("http") && !src.startsWith("/"))
  ) {
    // For Cloudinary images
    try {
      // derive your publicId (including folder)
      const filename = src.split("/").pop().split(".")[0];
      const publicId = `mern_blog_uploads/${filename}`;
      const cldImg = cld.image(publicId).format("avif");
      return <AdvancedImage cldImg={cldImg} alt={alt} {...rest} />;
    } catch (error) {
      console.error("Error processing Cloudinary image:", error);
      // Fallback to regular img tag if there's an error
      return <img src={src} alt={alt} {...rest} />;
    }
  }

  // For regular images, use a standard img tag
  return <img src={src} alt={alt} {...rest} />;
}

// Add PropTypes validation
CloudinaryImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

// Default props
CloudinaryImage.defaultProps = {
  alt: "Image", // Provide a default alt text
};
