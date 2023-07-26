"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";

const clientId = "3c00a89d0d484cbfb9bf9aba6f5d351a";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:3000");
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(
  clientId: string,
  code: string
): Promise<string> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000");
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

async function fetchProfile(token: string): Promise<any> {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

async function getPlaylistDetails(access_token, playlist_id) {
  const apiUrl = `https://api.spotify.com/v1/playlists/${playlist_id}`;
  const result = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await result.json();
}

const Home = () => {
  const [profileDetails, setProfileDetails] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        const playlistDetails = await getPlaylistDetails(
          accessToken,
          "5ndZqBh0Ffko3dXrZBHxG0"
        );
        console.log(profile);
        console.log(playlistDetails);
        setProfileDetails(profile);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <h1 className="text-center">Display Spotify Information</h1>
      <div className="flex justify-center items-center">
        <h2>
          Logged in as:{" "}
          <span className="displayName font-bold">
            {profileDetails.display_name}
          </span>
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Typography variant="h3">Search an Artist</Typography>
        <TextField className="w-3/5 rounded-xl" type="text" label="Search" />
        <Button onClick={() => router.push("/home")}>Click Me</Button>
      </div>
    </>
  );
};

export default Home;
