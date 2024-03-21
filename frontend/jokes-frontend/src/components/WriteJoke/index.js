import axios from "axios";
import './index.css';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const [setup, setSetup] = useState("");
  const [delivery, setDelivery] = useState("");
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Token ${token}`
    }
  }

  const submitJoke = () => {
    const data = {
      'delivery': delivery,
      'setup': setup,
    }
    axios
      .post("http://localhost:8000/api/board/", data, options)
      .then((res) => {
        console.log(res);
        console.log("aaaaaaa")
        // Use history to redirect to the main page
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jokeses</h1>
        <div><Link className="textLink" to={`..`}>Back</Link></div> 
      </header>
      <form className="writeCard" method="post" onSubmit={submitJoke}>
        <textarea className="joke-input" type="text" name="setup" placeholder="Write a set up!" onChange={(e) => {setSetup(e.target.value)}} value={setup}></textarea>
        <textarea className="joke-input" type="text" name="delivery" placeholder="Write a delivery!" onChange={(e) => {setDelivery(e.target.value)}} value={delivery}></textarea>
      </form>
      <button className="button" type="submit" onClick={submitJoke}>Submit Joke!</button>
    </div>
  );
}

export default App;