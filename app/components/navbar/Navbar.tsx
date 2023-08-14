import React from "react";
import { Container, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const Navbar = ({ spotifyToken, setSpotifyToken, spotifyDetails }) => {
  const logout = () => {
    setSpotifyToken("");
    localStorage.clear();
    window.location.reload();
  };

  const storedAccessToken = useSelector((state) => state.accessToken);

  return (
    <>
      <div className="w-full flex justify-between items-center mt-5 border-b pb-4 border-gray-200">
        <div className="flex flex-row items-center ml-24">
          <Link className="font-bold text-2xl mr-6" href="/">
            Spotify Stat Tracker
          </Link>
          <Link className="mr-4" href="/tracks">
            Top Tracks
          </Link>
          <Link className="mr-4" href="/artists">
            Top Artists
          </Link>
          <Link className="mr-4" href="/playlist-analyzer">
            Playlist Analyzer
          </Link>
          <Link href="/search">Search Artist</Link>
        </div>
        {storedAccessToken && (
          <div className="mr-12 ml-12">
            <Button colorScheme="red" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
