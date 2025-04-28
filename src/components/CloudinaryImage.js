// src/components/CloudinaryImage.js
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const cld = new Cloudinary({
  cloud: {
    cloudName:
      process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME ||
      "dj15ypnx8", // Fallback to your actual cloud name
  },
});

export default function CloudinaryImage({ src, alt, ...rest }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("CloudinaryImage received src:", src);
    if (src) {
      const img = new Image();
      img.onload = () => console.log("Image loaded successfully:", src);
      img.onerror = () => {
        console.error("Failed to load image:", src);
        setError(true);
      };
      img.src = src;
    }
  }, [src]);

  // Handle cases where src might be undefined or null
  if (!src) {
    console.error("CloudinaryImage: src prop is required");
    return null;
  }

  // Check if there was an error loading the image
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", ...rest.style }}>
        <p>Error loading image.</p>
        <p>URL: {src}</p>
      </div>
    );
  }

  // IMPORTANT CHANGE: For full Cloudinary URLs, use a direct img tag
  // instead of AdvancedImage to avoid SDK processing issues
  if (src.includes("cloudinary.com")) {
    console.log("Using direct img tag for Cloudinary URL");
    return (
      <img
        src={src}
        alt={alt}
        {...rest}
        onError={(e) => {
          console.error("Cloudinary URL image failed to load:", src);
          setError(true);
        }}
      />
    );
  }

  // For relative file paths to be processed by Cloudinary
  if (!src.startsWith("http") && !src.startsWith("/")) {
    // For Cloudinary images
    try {
      // derive your publicId (including folder)
      const filename = src.split("/").pop().split(".")[0];
      const publicId = `mern_blog_uploads/${filename}`;
      console.log("Using Cloudinary with publicId:", publicId);
      const cldImg = cld.image(publicId).format("avif");
      return (
        <AdvancedImage
          cldImg={cldImg}
          alt={alt}
          {...rest}
          onError={(e) => {
            console.error("Cloudinary image failed to load:", src);
            setError(true);
          }}
        />
      );
    } catch (error) {
      console.error("Error processing Cloudinary image:", error);
      // Fallback to regular img tag if there's an error
      return (
        <img
          src={src}
          alt={alt}
          {...rest}
          onError={(e) => {
            console.error("Image failed to load:", src);
            setError(true);
          }}
        />
      );
    }
  }

  // For regular images, use a standard img tag
  return (
    <img
      src={src}
      alt={alt}
      {...rest}
      onError={(e) => {
        console.error("Image failed to load:", src);
        setError(true);
      }}
    />
  );
}

// Add PropTypes validation
CloudinaryImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string, // Removed isRequired since we have a default
};

// Default props
CloudinaryImage.defaultProps = {
  alt: "Image", // Provide a default alt text
};
