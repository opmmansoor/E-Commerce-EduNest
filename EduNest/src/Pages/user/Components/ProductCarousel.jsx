
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../Components/ProductCard";

function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  // Fetch real products from JSON Server
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return response.json();
    },
  });

  // Automatically slide every 3 seconds
  useEffect(() => {
    if (!emblaApi || products.length <= 4) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi, products.length]);

  if (isLoading) {
    return <p className="py-8 text-center">Loading products...</p>;
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-red-500">
        Failed to load products.
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="py-8 text-center">No products available.</p>;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_25%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;
