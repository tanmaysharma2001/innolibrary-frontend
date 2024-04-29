import BookCarousel from "./components/Carousel";
import Header from "./components/Header";

export default function HomePage() {
  return (
    <div className="font-sans">
      <Header />
      <div className="flex flex-col items-start space-y-3">
        <h2 className="w-full text-start scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Top Trending
        </h2>
        <BookCarousel />
      </div>
    </div>
  );
}
