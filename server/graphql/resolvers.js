import { GraphQLError } from "graphql";
import Book from "../models/book.js";
import Author from "../models/author.js";

export const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const query = args.genre ? { genres: { $elemMatch: { $eq: args.genre } } } : {};
      return Book.find(query).populate("author");
    },
    allAuthors: async () => Author.find({}),
  },

  Author: {
    bookCount: (root) => root.books.length,
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        const newAuthor = new Author({ name: args.author, born: 0, books: [] });

        try {
          author = await newAuthor.save();
        } catch (error) {
          /* console.error(error); */
          throw new GraphQLError(error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "author",
            },
          });
        }
      }

      const newBook = new Book({ ...args, author: author._id });

      let newBookSave;
      try {
        newBookSave = await newBook.save();
      } catch (error) {
        /* console.error(error); */
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "title",
          },
        });
      }

      author.books.push(newBookSave._id);
      await author.save();

      return Book.findById(newBookSave._id).populate("author");
    },
    editAuthor: async (root, args) => {
      let author = await Author.findOne({ name: args.name });

      if (!author) return null;

      author.born = args.setBornTo;
      return author.save();
    },
  },
};
