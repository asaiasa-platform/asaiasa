import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router';
import { Button } from '@/components/base/buttons/button';

export const HeroSection: React.FC = () => {
  const t = useTranslations('HomePage.hero');
  
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 2000, stopOnInteraction: true })]
  );

  const handleScrollDown = () => {
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-orange-50 pt-20 pb-8">
      <div className="max-w-[1170px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="font-prompt text-center md:text-left text-4xl md:text-5xl font-bold text-gray-900">
              <p>{t('headline1')}</p>
              <p className="text-orange-600 mt-4">{t('headline2')}</p>
            </h1>
            <p className="text-lg text-gray-700 text-center md:text-left">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/events">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Explore Events
                </Button>
              </Link>
              <Link to="/jobs">
                <Button color="secondary" size="lg">
                  Find Jobs
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Carousel */}
          <div className="relative w-full max-w-[80%] md:max-w-lg mx-auto p-6">
            <div className="overflow-hidden rounded-lg hover:scale-105 duration-150 transition-all drop-shadow-lg" ref={emblaRef}>
              <div className="flex">
                {[1, 2, 3].map((i, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <div className="p-1 w-full h-full">
                      <div className="overflow-hidden rounded-lg w-full h-full">
                        <img
                          src={`/highlight/${i}.jpg`}
                          alt={`Slide ${index + 1}`}
                          className="object-cover w-full h-full"
                          width={800}
                          height={600}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Button */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <button
          onClick={handleScrollDown}
          className="w-fit"
        >
          <ChevronDown className="animate-bounce w-10 h-10 text-orange-600" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
