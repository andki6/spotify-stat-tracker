"use client";

import React, { useEffect, useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import Navbar from "./components/navbar/Navbar";
import {
  redirectToAuthCodeFlow,
  generateCodeVerifier,
  generateCodeChallenge,
  getAccessToken,
  fetchProfile,
  getPlaylistDetails,
  getTopTracksShortTerm,
  getTopTracksMediumTerm,
  getTopTracksLongTerm,
  getTopArtistsShortTerm,
  getTopArtistsMediumTerm,
  getTopArtistsLongTerm,
} from "./utils/utils";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "./state/accessTokenSlice";
import { setSpotifyDetails } from "./state/spotifyDetailsSlice";

const Home = () => {
  const dispatch = useDispatch();

  const [spotifyToken, setSpotifyToken] = useState("");

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  // const clientId = "3c00a89d0d484cbfb9bf9aba6f5d351a";
  const redirectUri = "http://localhost:3000";
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const responseType = "token";
  const scope =
    "user-read-private+user-read-email+user-read-playback-state+user-modify-playback-state+user-read-recently-played+user-top-read+user-follow-modify+user-follow-read+playlist-read-private";

  const getAllDetails = async (accessToken) => {
    try {
      const profile = await fetchProfile(accessToken);
      const playlistDetails = await getPlaylistDetails(
        accessToken,
        "5ndZqBh0Ffko3dXrZBHxG0"
      );
      const topArtistsDetailsShortTerm = await getTopArtistsShortTerm(
        accessToken
      );
      const topArtistsDetailsMediumTerm = await getTopArtistsMediumTerm(
        accessToken
      );
      const topArtistsDetailsLongTerm = await getTopArtistsLongTerm(
        accessToken
      );
      const topTracksDetailsShortTerm = await getTopTracksShortTerm(
        accessToken
      );
      const topTracksDetailsMediumTerm = await getTopTracksMediumTerm(
        accessToken
      );
      const toptracksDetailsLongTerm = await getTopTracksLongTerm(accessToken);
      return {
        profile: profile,
        playlistDetails: playlistDetails,
        topArtistsDetails: {
          topArtistsDetailsShortTerm,
          topArtistsDetailsMediumTerm,
          topArtistsDetailsLongTerm,
        },
        topTracksDetails: {
          topTracksDetailsShortTerm,
          topTracksDetailsMediumTerm,
          toptracksDetailsLongTerm,
        },
      };
    } catch (e) {
      console.log(e);
    }
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const params = new URLSearchParams(window.location.search);
  //     const code = params.get("code");
  //     console.log(code);

  //     const spotifyAccessToken = localStorage.getItem("spotifyAccessToken");
  //     console.log(spotifyAccessToken);
  //     if (code && spotifyAccessToken === undefined) {
  //       console.log("hello");
  //       const accessToken = await getAccessToken(clientId, code);
  //       localStorage.setItem("spotifyAccessToken", accessToken);
  //       console.log(accessToken);
  //       setSpotifyToken(accessToken);
  //     } else {
  //       setSpotifyToken(spotifyAccessToken);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // console.log(spotifyToken);

  // console.log(localStorage.getItem("spotifyAccessToken"));

  useEffect(() => {
    const fetchData = async () => {
      const hash = window.location.hash;
      let token = localStorage.getItem("storedAccessToken");
      console.log(token);

      if (hash && !token) {
        console.log("hello");
        token = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("access_token"))
          .split("=")[1];
        window.location.hash = "";
        localStorage.setItem("storedAccessToken", token);
        dispatch(setAccessToken(token));
        const details = await getAllDetails(token);
        dispatch(setSpotifyDetails(details));
        setSpotifyToken(token);
      }
    };

    fetchData();
  }, []);

  const spotifyData = useSelector((state) => state.spotifyDetails);

  let userFirstName;
  if (spotifyData) {
    userFirstName = spotifyData.profile.display_name.split(" ")[0];
  }

  return (
    <>
      <Navbar
        spotifyToken={spotifyToken}
        setSpotifyToken={setSpotifyToken}
        spotifyData={spotifyData}
      />
      <div className="flex flex-auto flex-col justify-center items-center mt-8">
        <div className="w-4/5 h-96 flex flex-auto flex-col justify-center items-center mb-4 bg-gray-200 rounded">
          <Text className="text-3xl mb-3 font-bold">Spotify Stat Tracker</Text>
          {/* <Button
            onClick={() => redirectToAuthCodeFlow(clientId)}
            colorScheme="green"
          >
            Link your Spotify
          </Button> */}
          {spotifyData ? (
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center items-center mb-6">
                <Text className="text-xl">
                  Hey <span className="font-bold">{userFirstName}</span>!
                </Text>
                <Text>What would you like to see today?</Text>
              </div>
              <div className="flex flex-col justify-center items-center">
                <Link href="/tracks" className="mb-4">
                  <Button colorScheme="blue">See your top tracks</Button>
                </Link>
                <Link href="/artists" className="mb-4">
                  <Button colorScheme="green">See your top artists</Button>
                </Link>
                <Link href="/playlist-analyzer" className="mb-4">
                  <Button colorScheme="purple">Analyze your playlists</Button>
                </Link>
                <Link href="/search">
                  <Button colorScheme="gray">Search an Artist</Button>
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href={`${authEndpoint}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`}
            >
              <Button colorScheme="green">Link your Spotify</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
