"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-orange-50 pt-20 pb-8">
      <div className="max-w-[1170px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="font-prompt text-center md:text-left text-4xl md:text-5xl font-bold text-gray-900">
              <p>ค้นหาโอกาสใหม่</p>
              <p className="text-orange-dark mt-4">เพื่อความก้าวหน้าของคุณ</p>
            </h1>
            <p className="text-lg text-gray-700 text-center md:text-left">
              อีเว้นท์ งาน องค์กร ที่ขับเคลื่อนโดยเยาวชน มาเป็นส่วนหนึ่งในการ
              คิดและวางแผนเพื่ออนาคตกัน!
            </p>
          </div>
          <div className="relative w-full max-w-[80%] md:max-w-lg mx-auto p-6">
            <div>
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 2000,
                    stopOnInteraction: true,
                  }),
                ]}
                className="mx-auto hover:scale-105 duration-150 transition-all drop-shadow-lg"
                opts={{
                  loop: true,
                  align: "center",
                }}
              >
                <CarouselContent>
                  {[1, 2, 3].map((i, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1 w-full h-full">
                        <div className="overflow-hidden rounded-lg w-full h-full">
                          <Image
                            src={`/highlight/${i}.jpg`}
                            alt={`Slide ${index + 1}`}
                            width={800}
                            height={600}
                            quality={75}
                            priority={index === 0}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <button
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          className="w-fit"
        >
          <ChevronDown className="animate-bounce w-10 h-10 text-orange-dark" />
        </button>
      </div>
    </section>
  );
}
