import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../queries";
import { useEffect, useState } from "react";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState(null);
  const { loading, error, data } = useQuery(GET_BOOKS);

  useEffect(() => {
    if (data) {
      const newBooks = data.allBooks;
      setBooks(newBooks);

      const newGenres = newBooks
        .reduce((accumulator, currentValue) => [...accumulator, ...currentValue.genres], [])
        .filter((element, index, self) => {
          return self.indexOf(element) === index;
        });
      setGenres(newGenres);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) => {
              if (!filter) return true;
              return book.genres.includes(filter);
            })
            .map(({ id, title, author, published }) => (
              <tr key={id}>
                <td>{title}</td>
                <td>{author.name}</td>
                <td>{published}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h3>Genres: {filter ? filter : "All"}</h3>
      {genres.map((genre) => (
        <button
          key={genre}
          style={{ marginRight: 4 }}
          onClick={() => {
            setFilter(genre);
          }}
        >
          {genre}
        </button>
      ))}
      <button
        style={{ marginRight: 4 }}
        onClick={() => {
          setFilter(null);
        }}
      >
        All
      </button>
    </div>
  );
};

export default Books;
