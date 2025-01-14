import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"

// Links data containing route and text
const links = [
  { mcs: "Magic Conch Shell", route: "/mcs" },
  { ttt: "Tic Tac Toe", route: "/ttt" },
  { wordle: "Quackle", route: "/wordle" },
];
export default function Page() {
  return <div className="h-screen bg-black flex flex-col justify-center items-center text-white font-sans ">
      <div className="text-center justify-center flex flex-col justify-center items-center items-center">
        <Image
          src="/quack.jpg" // Make sure to place your quack.jpg in the 'public' folder
          alt="Quack Image"
          width={400} // You can adjust the width and height as needed
          height={400}
          className="max-w-[80vw] max-h-[70vh] object-contain"
        />
        <div className="flex justify-center items-center mt-8">
        <Carousel className="w-50 max-w-64	">
              <CarouselContent>
                {links.map((data, index) => {
                  const routeKey = Object.keys(data)[0]; // Extract the key (e.g., 'mcs')
                  const routeValue = data[routeKey]; // Extract the value (e.g., 'Magic Conch Shell')
                  const routePath = data.route; // Get the route (e.g., '/mcs')

                  return (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-semibold">
                              
                              <Link
                                href={routePath}
                                className="text-yellow-500 hover:underline"
                              >
                                {routeValue}{" "}
                              </Link>
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </div>
        <h2 className="mt-4 text-4xl tracking-wider uppercase">
          More Coming Soon{" "}
        </h2>

      </div>
    </div>
}