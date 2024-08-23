import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../queries";

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, error }] = useMutation(LOGIN);

  useEffect(() => {
    if (data) {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  }, [data]); // eslint-disable-line

  const submit = (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={submit}>
      <div>
        username <input value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
      {error && <div>Wrong credentials</div>}
    </form>
  );
};

export default LoginForm;
