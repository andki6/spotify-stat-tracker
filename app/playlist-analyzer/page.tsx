"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { useSelector } from "react-redux";
import {
  getCurrentUsersPlaylists,
  getPlaylistItemsByApiUrl,
  getArtistDetails,
} from "../utils/utils";
import { Button, Text, Image, Link, useMediaQuery } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

const PlaylistAnalyzer = () => {
  const accessToken = useSelector((state) => state.accessToken);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState({});
  const [currentPlaylistItems, setCurrentPlaylistItems] = useState([]);
  // const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([]);
  const [currentArtistsDetails, setCurrentArtistsDetails] = useState([]);
  const [playlistAnalyzerData, setPlaylistAnalyzerData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [isLargerThan780] = useMediaQuery("(min-width: 780px)");

  const getCurrentPlaylistData = async (playlist) => {
    setIsLoading(true);
    setCurrentPlaylist(playlist);
    const apiUrl = playlist.tracks.href;
    const playlistItems = await getPlaylistItemsByApiUrl(accessToken, apiUrl);
    setCurrentPlaylistItems(playlistItems);

    console.log(playlistItems);
    getSeveralArtists(playlistItems);
    setIsLoading(false);
  };

  const getSeveralArtists = async (currentPlaylistItems) => {
    const artistPromises = currentPlaylistItems.map(async (item) => {
      let artistId = item.track?.artists[0]?.id;
      let artist = await getArtistDetails(accessToken, artistId);
      return artist;
    });
    const artists = await Promise.all(artistPromises);
    console.log(artists);
    setCurrentArtistsDetails(artists);
  };

  const getNumberOfUniqueArtists = () => {
    let uniqueArtists = {};
    let uniqueArtistsCount = 0;

    currentPlaylistItems.forEach((item) => {
      item.track.artists.forEach((artist) => {
        let artistName = artist.name;
        let artistId = artist.id;
        if (!uniqueArtists[artistName]) {
          uniqueArtists[artistName] = artistId;
          uniqueArtistsCount++;
        }
      });
    });

    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      uniqueArtistsCount: uniqueArtistsCount,
    }));
  };

  const getPopularityScale = () => {
    let popularityScale = 0;
    let totalTracks = 0;
    currentPlaylistItems.forEach((item) => {
      popularityScale += item.track.popularity;
      totalTracks++;
    });
    popularityScale /= totalTracks;
    popularityScale = popularityScale.toFixed(1);
    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      popularityScale: popularityScale,
    }));
  };

  const getArtistPopularityScale = () => {
    let averageArtistsPopularity = 0;
    let totalArtists = 0;
    currentArtistsDetails.forEach((artist) => {
      averageArtistsPopularity += artist.popularity;
      totalArtists++;
    });
    averageArtistsPopularity /= totalArtists;
    averageArtistsPopularity = Math.floor(averageArtistsPopularity);

    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      averageArtistsPopularity: averageArtistsPopularity,
    }));
  };

  const getMostPopularArtists = () => {
    let artistPopularities = {};
    let artistImages = {};
    currentArtistsDetails.forEach((artist) => {
      artistPopularities[artist.name] = artist.popularity;
      artistImages[artist.name] = artist.images[0].url;
    });

    const mostPopularArtists = Object.keys(artistPopularities)
      .sort((a, b) => {
        return artistPopularities[b] - artistPopularities[a];
      })
      .slice(10);

    console.log(mostPopularArtists);

    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      mostPopularArtists: mostPopularArtists,
      artistPopularities: artistPopularities,
      artistImages: artistImages,
    }));
  };

  const getTopGenre = () => {
    const genreFrequencies = {};
    currentArtistsDetails.forEach((artist) => {
      artist.genres.forEach((genre) => {
        genreFrequencies[genre] = (genreFrequencies[genre] || 0) + 1;
      });
    });
    let topGenre = null;
    let maxFrequency = 0;

    for (const genre in genreFrequencies) {
      if (genreFrequencies[genre] > maxFrequency) {
        maxFrequency = genreFrequencies[genre];
        topGenre = genre;
      }
    }

    topGenre = topGenre
      ?.split(" ")
      .map((word) => {
        word = word.substring(0, 1).toUpperCase() + word.slice(1);
        return word;
      })
      .join(" ");
    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      topGenre: topGenre,
    }));
  };

  const getMostAppearedGenres = () => {
    const genreFrequencies = {};
    currentArtistsDetails.forEach((artist) => {
      artist.genres.forEach((genre) => {
        genreFrequencies[genre] = (genreFrequencies[genre] || 0) + 1;
      });
    });
    console.log(genreFrequencies);

    const sortedGenres = Object.keys(genreFrequencies).sort((a, b) => {
      return genreFrequencies[b] - genreFrequencies[a];
    });

    const mostAppearedGenres = sortedGenres.slice(0, 10).map((genre) => {
      genre = genre
        .split(" ")
        .map((word) => {
          word = word.substring(0, 1).toUpperCase() + word.slice(1);
          return word;
        })
        .join(" ");
      return genre;
    });

    console.log(mostAppearedGenres);

    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      mostAppearedGenres: mostAppearedGenres,
      genreFrequencies: genreFrequencies,
    }));
  };

  const getMostAppearedArtist = () => {
    const artistFrequencies = {};
    currentPlaylistItems.forEach((item) => {
      item.track.artists.forEach((artist) => {
        let artistName = artist.name;
        artistFrequencies[artistName] =
          (artistFrequencies[artistName] || 0) + 1;
      });
    });

    let mostAppearedArtist = null;
    let maxFrequency = 0;
    for (const artist in artistFrequencies) {
      if (artistFrequencies[artist] > maxFrequency) {
        maxFrequency = artistFrequencies[artist];
        mostAppearedArtist = artist;
      }
    }

    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      mostAppearedArtist: mostAppearedArtist,
    }));
  };

  const getMostAppearedArtists = () => {
    const artistFrequencies = {};
    currentPlaylistItems.forEach((item) => {
      item.track.artists.forEach((artist) => {
        let artistName = artist.name;
        artistFrequencies[artistName] =
          (artistFrequencies[artistName] || 0) + 1;
      });
    });
    console.log(artistFrequencies);
    const sortedArtists = Object.keys(artistFrequencies).sort((a, b) => {
      return artistFrequencies[b] - artistFrequencies[a];
    });

    const mostAppearedArtists = sortedArtists.slice(0, 10);
    console.log(mostAppearedArtists);

    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      mostAppearedArtists: mostAppearedArtists,
      artistFrequencies: artistFrequencies,
    }));
  };

  const getMostRecentlyAddedTrackDate = () => {
    const mostRecentlyAddedTrack =
      currentPlaylistItems[currentPlaylistItems.length - 1];
    const addedAt = mostRecentlyAddedTrack.added_at;

    const addedDate = new Date(addedAt);
    console.log(addedDate);
    const currentDate = new Date();
    const timeDifference = currentDate - addedDate;
    console.log(timeDifference);
    let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) {
      daysAgo = "today";
    }
    console.log(daysAgo);
    setPlaylistAnalyzerData((prevData) => ({
      ...prevData,
      daysAgo: daysAgo,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      const currentUsersPlaylists = await getCurrentUsersPlaylists(accessToken);
      setPlaylists(currentUsersPlaylists.items);
      console.log(currentUsersPlaylists);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (currentPlaylistItems.length > 1) {
      getNumberOfUniqueArtists();
      getPopularityScale();
      getMostRecentlyAddedTrackDate();
      getMostAppearedArtist();
      getMostAppearedArtists();
    }
  }, [currentPlaylistItems]);

  useEffect(() => {
    if (currentPlaylistItems.length > 0) {
      getTopGenre();
      getMostAppearedGenres();
      getArtistPopularityScale();
      getMostPopularArtists();
    }
  }, [currentArtistsDetails]);

  return (
    <>
      <Navbar />
      <Text className="font-bold text-center text-2xl mt-20 mb-8">
        Choose one of your playlists to analyze!
      </Text>
      <TableContainer maxHeight="500px" overflowY="auto" className="mx-8">
        <Table>
          <Thead>
            <Tr>
              <Th>Playlist Image</Th>
              <Th>Playlist Name</Th>
              <Th>Owner Name</Th>
              <Th>Playlist Status</Th>
              <Th>Number of Tracks</Th>
            </Tr>
          </Thead>
          <Tbody>
            {playlists.map((playlist) => {
              return (
                <Tr
                  key={playlist.id}
                  transition=".15s"
                  _hover={{ cursor: "pointer", bg: "#ebedf0" }}
                  _active={{
                    bg: "#dddfe2",
                    transform: "scale(0.98)",
                    borderColor: "#bec3c9",
                  }}
                  onClick={() => getCurrentPlaylistData(playlist)}
                >
                  <Td>
                    <Image
                      src={
                        playlist.images.length === 0
                          ? "/defaultMusicImage.png"
                          : playlist.images[0].url
                      }
                      alt={playlist.name}
                      boxSize="100px"
                      objectFit="cover"
                    />
                  </Td>
                  <Td className="font-bold text-2xl">{playlist.name}</Td>
                  <Td className="font-bold">{playlist.owner.display_name}</Td>
                  <Td>
                    {playlist.public ? (
                      <span className="text-green-400 font-bold">Public</span>
                    ) : (
                      <span className="text-red-400 font-bold">Private</span>
                    )}
                  </Td>
                  <Td>{playlist.tracks.total}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {Object.keys(currentPlaylist).length > 0 && (
        <div className="flex flex-col justify-center items-center mt-20 mb-80">
          <div className="w-4/5 bg-gray-100 pt-8 pb-16 rounded mb-16">
            <h1 className="ml-12 mb-12 text-3xl font-bold underline">
              Analysis
            </h1>
            <div className="flex jusitfy-between items-center mx-20 w-full">
              <Link
                href={currentPlaylist.external_urls.spotify}
                isExternal
                className="w-full h-full"
              >
                <Image
                  src={
                    currentPlaylist.images.length === 0
                      ? "/defaultMusicImage.png"
                      : currentPlaylist.images[0].url
                  }
                  alt={currentPlaylist.name}
                  boxSize="400px"
                  className="w-full"
                  objectFit="cover"
                />
              </Link>
              <div className="flex flex-col justify-center items-center w-full">
                <Text>
                  <span className="font-bold text-blue-300 text-2xl">
                    {currentPlaylist.name}
                  </span>{" "}
                  by{" "}
                  <span className="font-bold">
                    {currentPlaylist.owner.display_name}
                  </span>
                </Text>
                {isLoading ? (
                  <Text></Text>
                ) : (
                  <Text>
                    <span className="font-bold">
                      {currentPlaylist.tracks.total}
                    </span>{" "}
                    tracks by{" "}
                    <span className="font-bold">
                      {playlistAnalyzerData.uniqueArtistsCount}
                    </span>{" "}
                    unique artists
                  </Text>
                )}

                <Text>
                  Top Genre:{" "}
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <span className="font-bold">
                      {playlistAnalyzerData.topGenre}
                    </span>
                  )}
                </Text>
                <Text>
                  Most Appeared Artist:{" "}
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <span className="font-bold">
                      {playlistAnalyzerData.mostAppearedArtist}
                    </span>
                  )}
                </Text>
                <Text>
                  Popularity Scale:{" "}
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <span className="font-bold">
                      {playlistAnalyzerData.popularityScale}
                    </span>
                  )}
                </Text>
                <Text>
                  Playlist Last Updated:{" "}
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <span className="font-bold">
                      {playlistAnalyzerData.daysAgo === "today"
                        ? playlistAnalyzerData.daysAgo
                        : playlistAnalyzerData.daysAgo + " days ago"}{" "}
                    </span>
                  )}
                </Text>
              </div>
            </div>
          </div>
          {isLoading ? (
            ""
          ) : (
            <div className="w-4/5 flex flex-col justify-between items-center">
              <div
                className={
                  isLargerThan780
                    ? "w-full flex justify-between items-center mb-8"
                    : "w-full flex flex-col justify-between items-center mb-8"
                }
              >
                <div
                  className={
                    isLargerThan780
                      ? "flex flex-col justify-center items-center"
                      : "flex flex-col justify-center items-center mb-8"
                  }
                >
                  <div className="flex justify-between items-center mb-8">
                    <Text className="font-bold text-2xl text-center mr-8">
                      Top 10 Artists
                    </Text>
                    <Text className="font-bold text-2xl text-center">
                      Repeats
                    </Text>
                  </div>
                  <div className="w-full">
                    {playlistAnalyzerData.mostAppearedArtists &&
                      playlistAnalyzerData.mostAppearedArtists.map((artist) => (
                        <div
                          key={artist}
                          className="flex justify-between items-center mb-2"
                        >
                          <Text className="">{artist}</Text>
                          <Text className="mr-9">
                            {playlistAnalyzerData.artistFrequencies[artist]}
                          </Text>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex justify-between items-center mb-8">
                    <Text className="font-bold text-2xl text-center mr-8">
                      Top 10 Genres
                    </Text>
                    <Text className="font-bold text-2xl text-center">
                      Repeats
                    </Text>
                  </div>
                  <div className="w-full">
                    {playlistAnalyzerData.mostAppearedGenres &&
                      playlistAnalyzerData.mostAppearedGenres.map((genre) => (
                        <div
                          key={genre}
                          className="flex justify-between items-center mb-2"
                        >
                          <Text className="">{genre}</Text>
                          <Text className="mr-9">
                            {
                              playlistAnalyzerData.genreFrequencies[
                                genre.toLowerCase()
                              ]
                            }
                          </Text>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <Text className="mb-8">
                Average Artists Popularity:{" "}
                {playlistAnalyzerData.averageArtistsPopularity}/100
              </Text>
              <Text className="text-2xl font-bold mb-8">
                Most popular artists in this playlist
              </Text>
              <div className="w-full h-60 overflow-y-auto overflow-x-hidden rounded-md">
                <div className="flex flex-col justify-start items-left space-y-2">
                  {playlistAnalyzerData.mostPopularArtists &&
                    playlistAnalyzerData.mostPopularArtists.map((artist) => {
                      return (
                        <div key={artist} className="flex">
                          <Image
                            src={playlistAnalyzerData.artistImages[artist]}
                            alt={artist}
                            boxSize="25px"
                            objectFit="cover"
                            className="mr-4"
                          />
                          <Text className="font-bold">
                            ({playlistAnalyzerData.artistPopularities[artist]}%){" "}
                            {artist}
                          </Text>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PlaylistAnalyzer;
