'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { messages } from "@/jsons/messages.json"
import AutoPlay, { AutoplayOptionsType } from "embla-carousel-autoplay"

const autoplayOptions: AutoplayOptionsType = {
  delay: 3000,
  stopOnInteraction: false,
}

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center justify-center p-12">
      <div>
        <section className="flex flex-col items-center justify-center">
          <h1 className="md:text-5xl text-2xl font-bold">Welcome to Note<span className="text-primary">4</span>Me — Speak Freely, Anonymously!</h1>
          <p className="md:mt-8 mt-4 text-xl text-center text-primary underline underline-decoration-secondary">
            Send and receive anonymous messages. Honest thoughts, real connections.
          </p>
        </section>
        <div className="mt-8">
          <h1 className="md:text-4xl text-2xl font-bold">What is Note<span className="text-primary">4</span>Me?</h1>
          <p className="text-lg text-center mt-4">
            Note4Me is a privacy-first web app that lets users send anonymous messages to others without revealing their identity. Whether it’s a compliment, constructive feedback, or something you’ve always wanted to say — express it freely and anonymously. Create your profile, share your unique link, and start receiving honest notes from friends, colleagues, or followers. No pressure. No judgment. Just pure, anonymous communication.
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <Carousel
            className="w-full md:max-w-4xl max-w-xs overflow-hidden"
            plugins={[AutoPlay(autoplayOptions)]}
            opts={
              {
                loop: true,
                align: 'start',
                slidesToScroll: 1,
                slidesToShow: 1,
                speed: 500,
              } as AutoplayOptionsType
            }
          >
            <CarouselContent>
              {
                messages.map((message, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 basis-full">
                    <Card className="w-full h-40 md:h-60 bg-secondary text-secondary-foreground items-center justify-center">
                      <CardContent className="text-center">
                        <h2 className="text-lg font-semibold">{message.content}</h2>
                        <p className="mt-2 text-sm">{new Date(message.createdAt).toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
} 
