"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Container,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

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
  params.append(
    "scope",
    "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read"
  );
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

async function getTopArtists(access_token) {
  const apiUrl = "https://api.spotify.com/v1/me/top/artists";
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

const Home = () => {
  const [profileDetails, setProfileDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailAddress: "",
      searchInput: "",
    },
  });

  const router = useRouter();
  const toast = useToast();

  async function getAllDetails(accessToken) {
    const profile = await fetchProfile(accessToken);
    const playlistDetails = await getPlaylistDetails(
      accessToken,
      "5ndZqBh0Ffko3dXrZBHxG0"
    );
    const topArtistDetails = await getTopArtists(accessToken);
    console.log(profile);
    console.log(playlistDetails);
    console.log(topArtistDetails);
    setProfileDetails(profile);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!code) {
        return;
      } else {
        const accessToken = await getAccessToken(clientId, code);
        getAllDetails(accessToken);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Text className="text-center">Display Spotify Information</Text>
      <div className="flex justify-center items-center mb-6">
        <h2>
          Logged in as:{" "}
          <span className="displayName font-bold">
            {profileDetails.display_name}
          </span>
        </h2>
      </div>
      <div className="flex flex-auto flex-col justify-center items-center">
        <div className="w-4/5 h-40 flex flex-auto flex-col justify-center items-center mb-4 bg-gray-200 rounded">
          <Text className="text-3xl mb-3 font-bold">Spotify Stat Tracker</Text>
          <Button
            onClick={() => redirectToAuthCodeFlow(clientId)}
            colorScheme="green"
          >
            Link your Spotify
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h3 className="text-2xl mb-5 font-bold">Search an Artist</h3>
        {submitError.length > 0 && (
          <Text className="text-red-500 mb-4">{submitError}</Text>
        )}
        <form
          action=""
          onSubmit={handleSubmit(async (data) => {
            setIsLoading(true);
            try {
              await axios.post("/api/search", data);
              setSubmitError("");
              setIsLoading(false);
              toast({
                title: "Message sent.",
                status: "success",
                duration: 2000,
                position: "top",
                isClosable: true,
              });
            } catch (e) {
              setSubmitError("Error submitting");
              setIsLoading(false);
            }
          })}
          className="w-2/5 flex flex-col items-center"
        >
          <FormControl
            className="flex flex-col justify-center items-center mb-2"
            isInvalid={errors.emailAddress}
          >
            <FormLabel htmlFor="email-address-input" className="mb-2">
              Email Address
            </FormLabel>
            <Input
              {...register("emailAddress", { required: "Required" })}
              className="w-full rounded-xl pl-2 py-2"
              type="email"
              id="email-address-input"
              placeholder="Email Address"
              errorBorderColor="red.300"
            />
            <FormErrorMessage className="text-red-600">
              {errors.emailAddress?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            className="flex flex-col justify-center items-center"
            isInvalid={errors.searchInput}
          >
            <FormLabel htmlFor="search-input" className="mb-2">
              Search
            </FormLabel>
            <Input
              {...register("searchInput", { required: "Required" })}
              className="w-full rounded-xl pl-2 py-2"
              type="text"
              id="search-input"
              placeholder="Search"
              errorBorderColor="red.300"
            />
            <FormErrorMessage className="text-red-600">
              {errors.searchInput?.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            className="px-6 py-2 rounded-xl cursor-pointer my-4 bg-green-400 text-white hover:bg-green-500 duration-200"
            isLoading={isLoading}
            colorScheme="blue"
          >
            Submit
          </Button>
        </form>
        <Button onClick={() => router.push("/home")}>Click Me</Button>
      </div>
    </>
  );
};

export default Home;
