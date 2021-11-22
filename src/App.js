import logo from "./logo.svg";
import "./App.css";
import useAuthContext from "./hooks/useAuth";
import useStepHistory from "./hooks/useStepHistory";

function App() {
  const {
    signIn,
    loading: authLoading,
    token,
    error: authError,
  } = useAuthContext();
  const { error, history, loading, totalPoints } = useStepHistory();
  return (
    <div>
      <button onClick={signIn} disabled={!!token}>
        {!!token ? "Logado" : "login"}
      </button>
      {authLoading && <p>fazendo login</p>}
      {authError && <p>erro de login</p>}
      {error && <p>erro api de passos</p>}
      <p>total de pontos: {totalPoints}</p>
      {loading && <p>carregando pontos</p>}

      <ul>
        {history.map(({ initialDate, finalDate, steps, points }) => (
          <li key={+initialDate}>
            {initialDate.toLocaleDateString()} - {steps} passos | {points}{" "}
            pontos
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
