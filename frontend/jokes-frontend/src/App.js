import axios from "axios";
import { useEffect, useState} from "react";
import Joke from "./components/Joke";
import { Link } from "react-router-dom";
import "./App.css";
import useToken from './useToken';

function App() {
  const [joke, setJoke] = useState('');
  const [delivery, setDelivery] = useState('');
  const [favoritou, setFavoritou] = useState(false);
  const [isCheckedCustom, setIsCheckedCustom] = useState(false);
  const [isCheckedProgramming, setIsCheckedProgramming] = useState(true);
  const [isCheckedMisc, setIsCheckedMisc] = useState(false);
  const [isCheckedDark, setIsCheckedDark] = useState(false);
  const [isCheckedPun, setIsCheckedPun] = useState(false);
  const [isCheckedSpooky, setIsCheckedSpooky] = useState(false);
  const [isCheckedChristmas, setIsCheckedChristmas] = useState(false);
  const [has, setHas] = useState(sessionStorage.getItem('has') === 'true');
  const [loginError, setLoginError] = useState('');
  const [loggedIn, setloggedIn] = useState(sessionStorage.getItem('loggedIn') === 'true');
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [audio, setAudio] = useState("vazio");
  const [flagButtonAudio, setFlagButtonAudio] = useState(false);
  const tokenAudio = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmFhMDY2ZjEtMGY5ZC00Yzk3LTkzMTYtYmMyZGQ5MDc0YmRiIiwidHlwZSI6ImFwaV90b2tlbiJ9.McXQSgEzErl9TNVFrgYGTQRDPaL6cwMaJkJibsA9OPQ";

  const getRandom = (map) => {
    let trueKeys = [];

    for (const [key, value] of Object.entries(map)) {
      if (value === true){
        trueKeys.push(key);
      }
    }
    
    return trueKeys[Math.floor(Math.random() * trueKeys.length)];
  }

  function setloggedIn_check() {
    const loggedInString = sessionStorage.getItem('loggedIn');
    setloggedIn(JSON.parse(loggedInString));
  }

  const getJoke = () => {
    if (!isCheckedCustom) {
      axios
        .get(`https://v2.jokeapi.dev/joke/Any?type=twopart&safe-mode`)
        .then((res) => {
          setJoke(res.data);
          setDelivery('');
          setFavoritou(false);
          setAudio("vazio");
        });
    }
    else {
      let categories = {
                        "Programming": isCheckedProgramming,
                        "Miscellaneous": isCheckedMisc,
                        "Dark": isCheckedDark,
                        "Pun": isCheckedPun,
                        "Spooky": isCheckedSpooky,
                        "Christmas": isCheckedChristmas};
      var category = getRandom(categories);
      console.log(category)
      axios
        .get(`https://v2.jokeapi.dev/joke/${category}?type=twopart${category === "Dark" ? '' : '&safe-mode'}`)
        .then((res) => {
          setJoke(res.data);
          setDelivery('');
          setFavoritou(false);
          setAudio("vazio");
        });
    }
  }

  const hearJoke = () => {
    setDelivery(joke.delivery);
  }

  const getAudio = () => {
    if (audio !== "vazio"){
      var music = new Audio(String(audio));
      music.play();
    }
    else{
      setFlagButtonAudio(true);
      let stringJoke = joke.setup + " " + joke.delivery;
      // console.log(stringJoke)
      const optionsAudio = {
        method: "POST",
        url: "https://api.edenai.run/v2/audio/text_to_speech",
        headers: {
          authorization: `Bearer ${tokenAudio}`,
        },
        data: {
          show_original_response: false,
          fallback_providers: "",
          providers: "openai",
          language: "en",
          text: `${stringJoke}`,
          option: "FEMALE",
        },
      };
      axios
        .request(optionsAudio)
        .then((response) => {
          // console.log(response.data);
          // console.log(response.data.openai.audio_resource_url);
          setAudio(response.data.openai.audio_resource_url);
          setFlagButtonAudio(false);
        })
    }
  }

  const playAudio = () => {
    var music = new Audio(String(audio));
    music.play();
  }

  const salvarFav = (event) => {
    event.preventDefault();
    setFavoritou(true)
    console.log('d')
    console.log(token)
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Token ${token}`
      }
    }
    const data = {
        "setup" : joke.setup,
        "delivery" : joke.delivery,
        'token' : token
    }
    axios.post("http://localhost:8000/api/favoritas/", data, options)};

  useEffect(() => {
    setloggedIn_check();
    getJoke();
  }, []);

  const fazerLogin = (event) => {
    event.preventDefault();
    setLoginError('');
    const formData = new FormData(event.target);
    const username = formData.get('usuario');
    const senha = formData.get('senha');
    const data = {
        'username': username,
        'password': senha,
    }
      axios.post('http://127.0.0.1:8000/api/token/', data)
      .then(response => {
          console.log(`user ${username} successfully logged in`);
          console.log('a')
          console.log(response.data.token)
          setToken(response.data.token)
          sessionStorage.setItem('token', response.data.token)
          sessionStorage.setItem('loggedIn', true);
          setloggedIn_check();
      })
      .catch(error => {
        if (error.response) {
          const { data } = error.response;
          switch (data.message) {
            case "Invalid username or password":
              setLoginError('Invalid username or password');
              break;
            case "User does not exist":
              setLoginError('User does not exist');
              break;
            case "Account disabled":
              setLoginError('Account disabled');
              break;
            case "Account locked":
              setLoginError('Account locked');
              break;
            default:
              alert("An error occurred.");
              setLoginError('An error occurred.');
              break;
          }
        } else {
          alert("Unable to connect to server.");
        }
  });
      sessionStorage.setItem('has', 'true');
  }

  function setarHas(){
    setHas(true);
    sessionStorage.setItem('has', 'true')
  }

  function logout(){
    sessionStorage.removeItem('has');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedIn');
    window.location.reload();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jokeses</h1>
        <div>
        {console.log('b')}
        {console.log(loggedIn)}
        {loggedIn ? (
          <div className="horizontal">
            <button className="logout-button" name="logout" onClick={logout}>Sign-out</button>
            <Link to='Board'><img className="icon" src="/meeting.png" /></Link>
            <Link className="textLink" to={`Favorites`}><img src="/favorite.png" className="icon" /></Link>
          </div>
        ) : (
          has ? (
            <div className="cabecalho">
              <form method="post" onSubmit={fazerLogin} className="form-login">
                <div className="inputs">
                  <input type="text" className="input-signin" name="usuario" placeholder="Usuário"></input>
                  <input type="password" className="input-signin" name="senha" placeholder="Senha" minLength={1} required></input>
                </div>
                <button type="submit" className="signin">Sign-in</button>
              </form>
              <p>{loginError}</p>
              <Link to={`Registro`}><button className="signin" onClick={() => {setHas(false)}}>Don't have an account? Sign-up here!</button></Link>
            </div>
          ) : (
          <div className="buttons">
            <button className="has" onClick={event => {setarHas()}}>Already have an account?</button>
            <p className="or">or</p>
            <Link className="has" to={`Registro`}>Sign-up</Link>
          </div>
          )
        )}
        
        </div>
      </header>
      <section className="big-box">
        <h2 className="text">What type of joke do you wanna hear?</h2>
        <div className="any-custom">
          <input type="checkbox" checked={!isCheckedCustom} onChange={() => {setIsCheckedCustom(!isCheckedCustom)}}/>Any
          <input type="checkbox" checked={isCheckedCustom} onChange={() => {setIsCheckedCustom(!isCheckedCustom)}}/>Custom
        </div>
        {isCheckedCustom && 
        <div className="unsafe">
          <input type="checkbox" checked={isCheckedProgramming} onChange={() => {setIsCheckedProgramming(!isCheckedProgramming)}}/>Programming
          <input type="checkbox" checked={isCheckedMisc} onChange={() => {setIsCheckedMisc(!isCheckedMisc)}}/>Misc
          <input type="checkbox" checked={isCheckedDark} onChange={() => {setIsCheckedDark(!isCheckedDark)}}/>Dark
          <input type="checkbox" checked={isCheckedPun} onChange={() => {setIsCheckedPun(!isCheckedPun)}}/>Pun
          <input type="checkbox" checked={isCheckedSpooky} onChange={() => {setIsCheckedSpooky(!isCheckedSpooky)}}/>Spooky
          <input type="checkbox" checked={isCheckedChristmas} onChange={() => {setIsCheckedChristmas(!isCheckedChristmas)}}/>Christmas
        </div>}
        {isCheckedCustom && !isCheckedProgramming && !isCheckedMisc && !isCheckedDark && !isCheckedPun && !isCheckedSpooky && !isCheckedChristmas &&
        <p className="textError">You must select at least one category!</p>}
      </section>
      <Joke className="piada" key={`joke__${joke.id}`} title={joke.setup}>{delivery}</Joke>
      <div className="botoes">
        <button className="botao new" onClick={getJoke}>Generate set up</button>
        <button className="botao hear" onClick={hearJoke}>Show punchline</button>
        {loggedIn && (<button className="botao like" onClick={salvarFav}>I like it!</button>)}
      </div>
      <div className="botoes">
        <button className="botao new" onClick={getAudio}>I wanna hear it!</button>
        {audio !== "vazio" ? <button className="botao hear" value="sound" onClick={playAudio}>Play Audio</button> : flagButtonAudio && <div className="spinner-container"><div className="loading-spinner"></div></div>}
      </div>
      {favoritou && <p className="saved"> JOKE ADDED TO FAVORITES! </p>}
      <div className="botoes">
        {loggedIn ? (<button className="botao like" ><Link className="textButton" to={`WriteJoke`}>Write a joke to the public board</Link></button>) : (<></>)}
      </div>
    </div>
  );
}

export default App;