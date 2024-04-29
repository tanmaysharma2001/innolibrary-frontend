import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Book } from "@/lib/types";
import { useEffect, useState } from "react";

function SearchComponent(props: {
  search: string;
  setSearch: (val: string) => void;
}) {
  return (
    <div className="flex flex-row justify-end w-full">
      <div className="w-[250px]">
        <Input
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
          type="text"
          placeholder="Search by name..."
        />
      </div>
    </div>
  );
}

function GenreComponent(props: {
  activeGenre: string;
  setActiveGenre: string[];
}) {}

export default function BookCarousel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genre, setGenre] = useState<string[]>();
  const [activeGenre, setActiveGenre] = useState();

  const [search, setSearch] = useState("");

  // View Books
  const [viewBooks, setViewBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Fetch Books
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/books?start=0&n=100",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: { books: Book[]; previous_n: number; next_n: number } =
          await response.json();
        setBooks(data.books); // Assuming the response data is an array of books
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const Genres = Array.from(new Set(books.map((book: Book) => book.genre)));

    setGenre(Genres);

    setViewBooks(books);
  }, [books]);

  // Search Hook
  useEffect(() => {
    if (search === "") {
      setViewBooks(books);
    } else {
      // Fetch According to search
      const fetchBooksByQuery = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/search?q=${search}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data: Book[] = await response.json();

          setViewBooks(data ? data : []); // Assuming the response data is an array of books
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchBooksByQuery();
    }
  }, [search]);

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3">
        <Carousel
          opts={{
            align: "start",
          }}
          className=""
        >
          <CarouselContent>
            {viewBooks.length !== 0 ? (
              viewBooks.map((book, index) => {
                return (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card>
                        <CardContent className="bg-gradient-to-r text-white from-indigo-500 to-blue-500 flex flex-col h-[200px] rounded-2xl items-center justify-center p-6">
                          <span className="text-3xl font-semibold">
                            {book.title}
                          </span>
                          <span className="text-2xl font-semibold">
                            {book.author}
                          </span>
                          <span className="text-xl font-semibold">
                            Genre: {book.genre}
                          </span>
                          <span className="text-lg font-semibold">
                            Reads: {book.reads}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })
            ) : (
              <></>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div>
        <SearchComponent search={search} setSearch={setSearch} />
      </div>
    </div>
  );
}
