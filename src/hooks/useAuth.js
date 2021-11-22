import useGoogleAuth, { getUserToken, getAuthInstance } from "./useGoogleAuth";
import { useState, useEffect, useContext } from "react";
import { context } from "../providers/AuthProvider";

export const useAuth = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { googleAuth } = useGoogleAuth(
    {
      clientId:
        "13653366925-mbpbdd6etcogio9t5b5pmcbslciju1hb.apps.googleusercontent.com",
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/fitness.activity.read openid",
    },
    (auth) => {
      console.info("google cliend installed");
    }
  );

  useEffect(() => {
    let intervalId = null;
    if (googleAuth.isSignedIn) {
      const isSignedIn = googleAuth.isSignedIn.get();
      hadleAuthStatechange(isSignedIn);
      googleAuth.isSignedIn.listen(hadleAuthStatechange);

      intervalId = startUpdateToken();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [googleAuth]);

  const hadleAuthStatechange = (signedIn, reload = false) => {
    if (signedIn)
      getUserToken()
        .then(setToken)
        .then(() => setLoading(false));
    else setToken("");
  };

  const startUpdateToken = () =>
    setInterval(() => {
      getUserToken()
        .then(setToken)
        .then(() => setLoading(false));
    }, 150_000);

  const signIn = () => {
    getAuthInstance()
      .signIn()
      .catch(() => setError("Erro ao obter credenciais"));
  };

  const signOut = () => {
    getAuthInstance().signOut();
  };

  return { token, loading, signIn, signOut, error };
};

const useAuthContext = () => useContext(context);
export default useAuthContext;
