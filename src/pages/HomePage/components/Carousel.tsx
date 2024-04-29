import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Book } from "@/lib/types";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.BACKEND_URL;

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

  const { toast } = useToast();

  // View Books
  const [viewBooks, setViewBooks] = useState<Book[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    // Fetch Books
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/books?start=0&n=100`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

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
            `${BACKEND_URL}/api/search?q=${search}`,
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

  async function handleAddToReadingCollection(bookID: number) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reads?book_id=${bookID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: `Book Added Successfully`,
      });
      return data;
    } catch (error) {
      toast({
        title: `Recommended Books:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }
  }

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
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="p-1 cursor-pointer">
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
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{book.title}</DialogTitle>
                          <DialogDescription>
                            Author: {book.author}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {!user ? (
                            <h1>
                              Login to Add this book to your reading collection.
                            </h1>
                          ) : (
                            <Button
                              onClick={() =>
                                handleAddToReadingCollection(book.id)
                              }
                            >
                              Add to your Reading Collection.
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
