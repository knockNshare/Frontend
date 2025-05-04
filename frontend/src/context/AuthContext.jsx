import React, { createContext, useContext, useState, useEffect } from "react";
import { gapi } from "gapi-script";

export const AuthContext = createContext();

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const [authInstance, setAuthInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Google API
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
            setGoogleAccessToken(token);
          }

          auth.isSignedIn.listen((isSignedIn) => {
            if (isSignedIn) {
              const token = auth.currentUser.get().getAuthResponse().access_token;
              setGoogleAccessToken(token);
            } else {
              setGoogleAccessToken(null);
            }
          });
        });
    };

    gapi.load("client:auth2", start);
  }, []);

  // Load userId and googleAccessToken from localStorage on initial load
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedGoogleAccessToken = localStorage.getItem("googleAccessToken");

    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedGoogleAccessToken) {
      setGoogleAccessToken(storedGoogleAccessToken);
    }

    setLoading(false);
  }, []);

  // Login function for regular authentication
  const login = (newUserId) => {
    localStorage.setItem("userId", newUserId);
    setUserId(newUserId);
  };


  // Function to update Google Access Token
  const updateGoogleAccessToken = (token) => {
    localStorage.setItem("googleAccessToken", token);
    setGoogleAccessToken(token);
  };

  // Logout function for both regular and Google authentication
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("googleAccessToken");
    setUserId(null);
    setGoogleAccessToken(null);
    authInstance.signOut(); // Sign out from Google

  };

  const signIn = async () => {
    if (authInstance) {
      try {
        await authInstance.signIn();
        const token = authInstance.currentUser.get().getAuthResponse().access_token;
        updateGoogleAccessToken(token);
        console.log("Google account linked successfully!");
      } catch (error) {
        console.error("Error linking Google account:", error);
      }
    } else {
      console.warn("Google Auth instance not ready yet.");
    }
  };

  // Function to link Google account after normal login
  const linkGoogleAccount = async () => {
    if (authInstance) {
      try {
        await authInstance.signIn();
        const token = authInstance.currentUser.get().getAuthResponse().access_token;
        updateGoogleAccessToken(token);
        console.log("Google account linked successfully!");
      } catch (error) {
        console.error("Error linking Google account:", error);
      }
    } else {
      console.warn("Google Auth instance not ready yet.");
    }
  };

  if (loading) {
    return <div>Chargement de l'authentification...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        userId,
        googleAccessToken,
        login,
        updateGoogleAccessToken,
        logout,
        linkGoogleAccount, // Expose the function to link Google account
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);