import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Book } from "@/lib/types";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.BACKEND_URL;

function PersonalBooksSection(props: {
  books: PersonalBook[];
  setUpdateData: (val: boolean) => void;
}) {
  const { user } = useAuth();

  const { toast } = useToast();

  async function changeReadingStatus(bookID: number, newStatus: string) {
    // update the backend with the reading status
    try {
      const requestBody = {
        book_id: bookID,
        status: newStatus,
      };

      const response = await fetch(`${BACKEND_URL}/api/reads`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();

      props.setUpdateData(true);

      toast({
        title: `Book added to Reading List:`,
      });
    } catch (error) {
      toast({
        title: `Error adding book to Reading List:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }
  }

  async function removeFromReadingList(bookID: number) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reads?book_id=${bookID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();

      props.setUpdateData(true);

      toast({
        title: `Book Deleted Successfully`,
      });
    } catch (error) {
      toast({
        title: `Error deleting the book from reading list:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }
  }

  return (
    <>
      <h2 className="text-start mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Your Added Books
      </h2>

      <div className="relative m-2">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {props.books.length !== 0 ? (
              props.books.map((book, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="p-1 cursor-pointer">
                      <Card>
                        <CardContent className="bg-gradient-to-r text-white from-indigo-500 to-blue-500 rounded-xl flex aspect-square items-center justify-center p-6">
                          <span className="text-3xl font-semibold">
                            {book.title}
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
                      <h1>Status: {book.status}</h1>
                      <Button onClick={() => removeFromReadingList(book.id)}>
                        Remove from the Reading List!
                      </Button>
                      <div className="flex space-x-3 items-center">
                        <span>Change Reading Status:</span>
                        <Select
                          defaultValue={book.status}
                          onValueChange={(val) =>
                            changeReadingStatus(book.id, val)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Reading Status</SelectLabel>
                              <SelectItem value="started">Started</SelectItem>
                              <SelectItem value="not_started">
                                Not Started
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <h1 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Nothing to show here... add books from the library home to see
                here!
              </h1>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

function RecommendedBooks(props: { books: Book[] }) {
  return (
    <>
      <h2 className="text-start mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Recommended Books
      </h2>

      <div className="relative m-2">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {props.books.length !== 0 ? (
              props.books.map((book, index) => (
                <AlertDialog key={index}>
                  <AlertDialogTrigger asChild>
                    <div className="p-1 cursor-pointer">
                      <Card>
                        <CardContent className="bg-gradient-to-r text-white from-indigo-500 to-blue-500 rounded-xl flex aspect-square items-center justify-center p-6">
                          <span className="text-3xl font-semibold">
                            {book.title}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Add the book to your Library!
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))
            ) : (
              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                No Recommendations till now, add few books to get recommended.
              </h1>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

type PersonalBook = {
  id: number;
  title: string;
  author: string;
  genre: string;
  reads: number;
  status: string;
};

export const LibraryPage = () => {
  const [personalBooks, setPersonalBooks] = useState<PersonalBook[]>([]);

  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);

  const { user } = useAuth();

  const { logout } = useAuth();

  const { toast } = useToast();

  const [updateData, setUpdateData] = useState(false);

  useEffect(() => {
    // Get Recommended Books for the User!
    async function fetchBooks(url) {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    }

    try {
      fetchBooks(`${BACKEND_URL}/api/recommend?n=100`).then((data) => {
        setRecommendedBooks(data);
      });
    } catch (error) {
      toast({
        title: `Recommended Books:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }

    try {
      fetchBooks(`${BACKEND_URL}/api/reads`).then((data) => {
        setPersonalBooks(data);
      });
    } catch (error) {
      toast({
        title: `Personal Books:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }
  }, [updateData]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="mt-10 mx-44">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-start scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {user.username}'s library
        </h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <PersonalBooksSection
        books={personalBooks}
        setUpdateData={setUpdateData}
      />
      {/* <BooksSection header={"Recommended Books"} books={personalBooks} /> */}
      <RecommendedBooks books={recommendedBooks} />
    </div>
  );
};
