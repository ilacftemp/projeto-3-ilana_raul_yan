import axios from "axios";
import './index.css';
import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import JokeBoard from "../JokeBoard"

function App() {
  const [jokes, setJokes] = useState([]);
  const token = sessionStorage.getItem('token');
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Token ${token}`
    }
  }

  const getJokes = () => {
    axios
      .get("http://localhost:8000/api/board/", options)
      .then((res) => {
        setJokes(res.data);
        console.log(res.data)
      });
  }

  useEffect(() => {
    getJokes();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Public Jokes Board</h1>
        <div><Link className="textLink" to={`..`}>Back</Link></div> 
      </header>
      <div className="Jokes">
      {jokes.map((jokeBoard) => (
        <div key={`note__${jokeBoard.id}`}>
          <JokeBoard className="piada" key={`note__${jokeBoard.id}`} username={jokeBoard.usuario} title={jokeBoard.setup } >{jokeBoard.delivery}</JokeBoard>
        </div>
        ))}
      </div>
    </div>
  );
}

export default App;