import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    if (token) setToken(token);
  }, []);

  useEffect(() => {
    setPage("authors");
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      {page === "authors" && <Authors token={token} />}
      {page === "books" && <Books />}
      {page === "add" && <NewBook />}
      {page === "login" && <LoginForm setToken={setToken} />}
    </div>
  );
};

export default App;
