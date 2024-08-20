import { gql, useQuery } from "@apollo/client";

const GET_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
    }
  }
`;

const Books = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);

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
          {data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
