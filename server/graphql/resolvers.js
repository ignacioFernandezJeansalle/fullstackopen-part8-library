import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();
import jwt from "jsonwebtoken";
const { sign: jwtSign } = jwt;
import User from "../models/user.js";
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
    me: (root, args, context) => context.currentUser,
  },

  Author: {
    bookCount: (root) => root.books.length,
  },

  Mutation: {
    createUser: async (root, args) => {
      const newUser = new User({ username: args.username, favoriteGenre: args.favoriteGenre || "" });

      let newUserSave;
      try {
        newUserSave = await newUser.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "username",
          },
        });
      }

      return newUserSave;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = { username: user.username, id: user._id };

      return { value: jwtSign(userForToken, process.env.JWT_SECRET) };
    },
    addBook: async (root, args, context) => {
      const { currentUser } = context;
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

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

      const bookAdded = await Book.findById(newBookSave._id).populate("author");

      pubsub.publish("BOOK_ADDED", { bookAdded: bookAdded });

      return bookAdded;
    },
    editAuthor: async (root, args, context) => {
      const { currentUser } = context;
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Author.findOne({ name: args.name });

      if (!author) return null;

      author.born = args.setBornTo;
      return author.save();
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};
