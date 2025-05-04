import React, { createContext, useEffect, useState } from "react";
import { gapi } from "gapi-script";

export const GoogleAuthContext = createContext();

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

export const GoogleAuthProvider = ({ children }) => {
    const [authInstance, setAuthInstance] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
  
    useEffect(() => {
      const start = () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: DISCOVERY_DOCS,
          })
          .then(() => {
            console.log("Auth instance loaded:", gapi.auth2.getAuthInstance());
            const auth = gapi.auth2.getAuthInstance();
            setAuthInstance(auth);
  
            // auto-connect if already signed in
            if (auth.isSignedIn.get()) {
              const token = auth.currentUser.get().getAuthResponse().access_token;
              setAccessToken(token);
            }
  
            auth.isSignedIn.listen((isSignedIn) => {
              if (isSignedIn) {
                const token = auth.currentUser.get().getAuthResponse().access_token;
                setAccessToken(token);
              } else {
                setAccessToken(null);
              }
            });
          });
      };
  
      gapi.load("client:auth2", start);
    }, []);
  
    //const getAccessToken = () => accessToken;
  
    const signIn = async () => {
      if (authInstance) {
        await authInstance.signIn();
        const token = authInstance.currentUser.get().getAuthResponse().access_token;
        setAccessToken(token);
      } else {
        console.warn("authInstance not ready yet.");
      }
    };
  
    return (
      <GoogleAuthContext.Provider value={{ token: accessToken, signIn }}>
        {children}
      </GoogleAuthContext.Provider>
    );
  };
  