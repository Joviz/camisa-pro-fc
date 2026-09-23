import { useRef } from "react";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import bannerLancaImg from "../assets/images/Banner-lança.png";
import bannerPromoImg from "../assets/images/Banner-promo.png";

export const Banner = () => {
  const plugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: false }));

  const handleFiltrar = (campanha: string) => {
    console.log(`Aplicar filtro da campanha: ${campanha}`);
  };

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ loop: true }}
      className="relative w-full overflow-hidden bg-zinc-950"
    >
      <CarouselContent>
        <CarouselItem className="relative aspect-4/1 w-full pl-0">
          <button
            onClick={() => handleFiltrar("promocao")}
            className="group relative h-full w-full overflow-hidden text-left hover:cursor-pointer"
          >
            <img
              src={bannerPromoImg}
              alt="Banner Saldão e Promoções"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </button>
        </CarouselItem>

        <CarouselItem className="relative aspect-4/1 w-full pl-0">
          <button
            onClick={() => handleFiltrar("novidades")}
            className="group relative h-full w-full overflow-hidden text-left hover:cursor-pointer"
          >
            <img
              src={bannerLancaImg}
              alt="Banner Lançamentos Temporada"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </button>
        </CarouselItem>
      </CarouselContent>

      <CarouselPrevious className="hover:text-ouro absolute top-1/2 left-6 -translate-y-1/2 cursor-pointer border-zinc-800 bg-zinc-900/60 text-zinc-100 transition-colors hover:bg-zinc-800" />
      <CarouselNext className="hover:text-ouro absolute top-1/2 right-6 -translate-y-1/2 cursor-pointer border-zinc-800 bg-zinc-900/60 text-zinc-100 transition-colors hover:bg-zinc-800" />
    </Carousel>
  );
};
