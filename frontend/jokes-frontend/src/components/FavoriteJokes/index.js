import axios from "axios";
import './index.css';
import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Joke from "../Joke";

function App() {
  const [jokes, setJokes] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Token ${token}`
    }
  }

  const getJokes = () => {
    console.log(options);
    axios
      .get("http://localhost:8000/api/favoritas/", options)
      .then((res) => {
        console.log(res.data)
        setJokes(res.data);
      });
  }

  const deletar = (id) => {
    axios
      .delete(`http://localhost:8000/api/remove/${id}`, options)
      .then(() => {
        getJokes();
      });
  }

  useEffect(() => {
    getJokes();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jokeses</h1>
        <div><Link className="textLink" to={`..`}>Back</Link></div> 
      </header>
      <div className="Jokes">
      {jokes.map((joke) => (
        <div key={`note__${joke.id}`}>
          <Joke className="piada" key={`note__${joke.id}`} title={joke.setup}> {joke.delivery}</Joke>
          <button className="delete" onClick={() => {deletar(joke.id)}}>Delete</button>
        </div>
        ))}
      </div>
    </div>
  );
}

export default App;