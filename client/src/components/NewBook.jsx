import { useState } from "react";
import { useMutation, useSubscription } from "@apollo/client";
import { ADD_BOOK, GET_AUTHORS, GET_BOOKS, BOOK_ADDED } from "../queries";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_AUTHORS }, { query: GET_BOOKS }],
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    addBook({ variables: { title, published: Number(published), author, genres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  if (loading) return <div>Submitting...</div>;
  if (error) return <div>Submission error! {error.message}</div>;

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
