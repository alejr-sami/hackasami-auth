import { useState } from "react";
import useScript from "./useScript";

const useGoogleAuth = (clientConfig, onInit) => {
  const [googleAuth, setGoogleAuth] = useState({});
  const [loading, setLoading] = useState(true);

  const onGoogleScriptLoad = () => {
    const { gapi } = window;
    gapi.load("client:auth2", () => {
      gapi.client.init(clientConfig).then(() => {
        const auth = gapi.auth2.getAuthInstance();
        setGoogleAuth(auth);
        onInit && onInit(auth);
        setLoading(false);
      });
    });
  };

  useScript("https://apis.google.com/js/api.js?onload=init", {
    onLoad: onGoogleScriptLoad,
  });

  return { googleAuth, loading };
};

export default useGoogleAuth;

export const getAuthInstance = () => window.gapi?.auth2?.getAuthInstance();

export const getUserToken = async (reload = false) => {
  const currentUser = getAuthInstance().currentUser.get();

  if (reload) {
    return currentUser.reloadAuthResponse().then((response) => {
      return response.access_token;
    });
  } else {
    return currentUser.getAuthResponse().access_token;
  }
};
