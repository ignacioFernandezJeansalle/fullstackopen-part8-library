import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = () => {
  const [nameAuthor, setNameAuthor] = useState("");
  const [bornAuthor, setBornAuthor] = useState("");

  const { loading, error, data } = useQuery(GET_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [{ query: GET_AUTHORS }] });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  const handleSubmit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name: nameAuthor, setBornTo: Number(bornAuthor) } });

    setNameAuthor("");
    setBornAuthor("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name: <input type="text" value={nameAuthor} onChange={({ target }) => setNameAuthor(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            Born:{" "}
            <input type="number" value={bornAuthor} onChange={({ target }) => setBornAuthor(target.value)}></input>
          </label>
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default Authors;
