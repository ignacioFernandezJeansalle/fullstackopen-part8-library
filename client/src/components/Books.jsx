import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../queries";
import { useEffect, useState } from "react";

const Books = () => {
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState(null);

  const {
    loading: filteredBooksLoading,
    error: filteredBooksError,
    data: filteredBooksData,
    refetch: filteredBooksRefetch,
  } = useQuery(GET_BOOKS, {
    variables: { genre: filter },
  });

  const { loading: allBooksLoading, error: allBooksError, data: allBooksData } = useQuery(GET_BOOKS);

  useEffect(() => {
    if (allBooksData) {
      const newGenres = allBooksData.allBooks.flatMap((book) => book.genres);
      setGenres([...new Set(newGenres)]);
    }
  }, [allBooksData]);

  useEffect(() => {
    filteredBooksRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  if (allBooksLoading || filteredBooksLoading) return <div>Loading...</div>;
  if (allBooksError) return <div>Error! {allBooksError.message}</div>;
  if (filteredBooksError) return <div>Error! {filteredBooksError.message}</div>;

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
          {filteredBooksData.allBooks.map(({ id, title, author, published }) => (
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
