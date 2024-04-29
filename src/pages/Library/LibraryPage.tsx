import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
import { useAuth } from "@/hooks/useAuth";
import { Book } from "@/lib/types";
import { useState } from "react";

function PersonalBooksSection(props: { books: Book[] }) {
  return (
    <>
      <h2 className="text-start mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Your Added Books
      </h2>

      <div className="relative m-2">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {props.books.map((book, index) => (
              <Dialog>
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
                    <DialogDescription>Author: {book.author}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Button>Remove from the Reading List!</Button>
                    <div className="flex space-x-3 items-center">
                      <span>Change Reading Status:</span>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Reading Status</SelectLabel>
                            <SelectItem value="started">Started</SelectItem>
                            <SelectItem value="not-started">
                              Not Started
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
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
            {props.books.map((book, index) => (
              <AlertDialog>
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
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

export const LibraryPage = () => {
  const [personalBooks, setPersonalBooks] = useState<Book[]>([
    {
      id: 1,
      title: "Book 1",
      author: "Author 1",
      genre: "Fiction",
      reads: 100,
    },
    {
      id: 2,
      title: "Book 2",
      author: "Author 2",
      genre: "Fantasy",
      reads: 200,
    },
    {
      id: 3,
      title: "Book 3",
      author: "Author 3",
      genre: "Fiction",
      reads: 150,
    },
    {
      id: 4,
      title: "Book 4",
      author: "Author 4",
      genre: "Mystery",
      reads: 120,
    },
    {
      id: 5,
      title: "Book 5",
      author: "Author 5",
      genre: "Fantasy",
      reads: 180,
    },
  ]);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="mt-10 mx-44">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-start scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          library
        </h1>
        <Button>Logout</Button>
      </div>
      <PersonalBooksSection books={personalBooks} />
      {/* <BooksSection header={"Recommended Books"} books={personalBooks} /> */}
      <RecommendedBooks books={personalBooks} />
    </div>
  );
};
