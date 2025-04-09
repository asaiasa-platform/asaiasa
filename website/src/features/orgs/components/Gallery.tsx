"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface GalleryCarouselProp {
  gallery: string[];
}

export default function GalleryCarousel({
  gallery,
}: Readonly<GalleryCarouselProp>) {
  return (
    <div className="w-full">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {gallery.map((imgUrl, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <div className="relative overflow-hidden border">
                {/* Blurry backdrop */}
                <div className="absolute inset-0 -z-10">
                  <Image
                    style={{ aspectRatio: "16 / 9" }}
                    className="w-full h-full object-cover blur-md opacity-30"
                    src={imgUrl}
                    width={500}
                    height={500}
                    alt=""
                  />
                </div>

                {/* Main image */}
                <Image
                  style={{ aspectRatio: "16 / 9" }}
                  className="w-full h-full object-contain"
                  src={imgUrl}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* prev */}
        <CarouselPrevious
          className="
            hidden sm:flex absolute left-0 top-[45%] transform -translate-y-[35%] -translate-x-1/2 
            h-12 w-12 bg-black/50 hover:bg-black/70 hover:text-white text-white border-none"
        ></CarouselPrevious>

        {/* next */}
        <CarouselNext
          className="
            hidden sm:flex absolute right-0 top-[45%] transform -translate-y-[35%] translate-x-1/2 
            h-12 w-12 bg-black/50 hover:bg-black/70 hover:text-white text-white border-none"
        ></CarouselNext>
      </Carousel>
    </div>
  );
}
