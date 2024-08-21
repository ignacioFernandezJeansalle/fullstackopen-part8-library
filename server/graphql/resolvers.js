import Book from "../models/book.js";
import Author from "../models/author.js";

export const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async () => {
      const allBooks = await Book.find({}).populate("author");

      return allBooks;

      /* if (!args.author && !args.genre) return books;

      let filteredBooks = [...books];
      if (args.author) filteredBooks = filteredBooks.filter((book) => book.author === args.author);
      if (args.genre) filteredBooks = filteredBooks.filter((book) => book.genres.includes(args.genre));
      return filteredBooks; */
    },
    allAuthors: async () => {
      const allAuthors = await Author.find({});

      /* bookCount: books.reduce((count, book) => (author.name === book.author ? count + 1 : count), 0) */
      return allAuthors;
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        const newAuthor = new Author({ name: args.author, born: 0 });
        author = await newAuthor.save();
      }

      const newBook = new Book({ ...args, author: author._id });
      const newBookSave = await newBook.save();

      const response = await Book.findById(newBookSave._id).populate("author");

      return response;
    },
    /* editAuthor: (root, args) => {
      const foundAuthorIndex = authors.findIndex((author) => author.name === args.name);

      if (foundAuthorIndex === -1) return null;

      const editedAuthor = { ...authors[foundAuthorIndex], born: args.setBornTo };
      authors[foundAuthorIndex] = editedAuthor;
      return editedAuthor;
    }, */
  },
};
