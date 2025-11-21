import { Slide, Theme } from "@/lib/types";
import Image from "next/image";
import React from "react";

type Props = {
  slides: Slide;
  theme: Theme;
};

const ThumbnailPreview = ({ slides, theme }: Props) => {
  return (
    <div
      className={
        "w-full relative rounded-lg overflow-hidden transition-all duration-200 p-2"
      }
      style={{
        fontFamily: theme.fontFamily,
        color: theme.accentColor,
        backgroundColor: theme.slideBgColor,
        backgroundImage: theme.gradientBgColor,
      }}
    >
      {slides ? (
        <div className="scale-[0.5] origin-top-left w-[200%] overflow-hidden">
          This is an slide
        </div>
      ) : (
        <div className="w-full h-full bg-gray-400 justify-center items-center">
          <Image
            className="w-6 h-6 text-gray-500"
            alt="image"
            width={0}
            height={0}
            src={""}
          />
        </div>
      )}
    </div>
  );
};

export default ThumbnailPreview;
