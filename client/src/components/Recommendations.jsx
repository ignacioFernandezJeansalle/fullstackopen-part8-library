import { useQuery } from "@apollo/client";
import { ME, GET_BOOKS } from "../queries";
import { useEffect, useState } from "react";

const Recommendation = () => {
  const [favoriteGenre, setFavoriteGenre] = useState(null);
  const [books, setBooks] = useState([]);

  const { loading: uLoading, error: uError, data: uData } = useQuery(ME);
  const {
    loading: bLoading,
    error: bError,
    data: bData,
  } = useQuery(GET_BOOKS, {
    variables: { genre: favoriteGenre },
  });

  useEffect(() => {
    if (uData) setFavoriteGenre(uData.me.favoriteGenre);
  }, [uData]);

  useEffect(() => {
    if (bData) setBooks(bData.allBooks);
  }, [bData]);

  if (uLoading || bLoading) return <div>Loading...</div>;
  if (uError) return <div>Error! {uError.message}</div>;
  if (bError) return <div>Error! {bError.message}</div>;

  return (
    <div>
      <h2>recommendation</h2>
      {favoriteGenre && (
        <p>
          books in your favorite genre <b>{favoriteGenre}</b>
        </p>
      )}
      {books && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map(({ id, title, author, published }) => (
              <tr key={id}>
                <td>{title}</td>
                <td>{author.name}</td>
                <td>{published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Recommendation;
