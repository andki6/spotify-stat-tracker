"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import { useSelector } from "react-redux";
import { Text, Image, Link, Button } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";
import {
  followArtist,
  unfollowArtist,
  getIsUserFollowingArtist,
} from "../utils/utils";

const Artists = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isFollowingArtist, setIsFollowingArtist] = useState({});
  const spotifyData = useSelector((state) => state.spotifyDetails);
  const accessToken = useSelector((state) => state.accessToken);
  console.log(spotifyData);
  const {
    topArtistsDetailsShortTerm,
    topArtistsDetailsMediumTerm,
    topArtistsDetailsLongTerm,
  } = spotifyData.topArtistsDetails;
  console.log(topArtistsDetailsShortTerm);
  let shortTermRanking = 0;
  let mediumTermRanking = 0;
  let longTermRanking = 0;

  const getFollowingData = async (artistId) => {
    const result = await getIsUserFollowingArtist(accessToken, artistId);
    setIsFollowingArtist((prevData) => ({
      ...prevData,
      [artistId]: result[0],
    }));
  };

  useEffect(() => {
    topArtistsDetailsShortTerm.items.forEach((artist) => {
      getFollowingData(artist.id);
    });
    topArtistsDetailsMediumTerm.items.forEach((artist) => {
      getFollowingData(artist.id);
    });
    topArtistsDetailsLongTerm.items.forEach((artist) => {
      getFollowingData(artist.id);
    });
  }, []);

  return (
    <>
      <Navbar />
      <Tabs
        className="mt-20"
        isFitted
        variant="enclosed"
        onChange={(index) => setTabIndex(index)}
      >
        {tabIndex === 0 && (
          <Text className="text-center font-bold text-2xl mb-8">
            Top Artists (Last 4 Weeks)
          </Text>
        )}
        {tabIndex === 1 && (
          <Text className="text-center font-bold text-2xl mb-8">
            Top Artists (Last 6 Months)
          </Text>
        )}
        {tabIndex === 2 && (
          <Text className="text-center font-bold text-2xl mb-8">
            Top Artists (All Time)
          </Text>
        )}
        <TabList>
          <Tab>Last 4 Weeks</Tab>
          <Tab>Last 6 Months</Tab>
          <Tab>All Time</Tab>
        </TabList>
        <TabPanels className="flex justify-center items-center">
          <TabPanel className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {topArtistsDetailsShortTerm.items.map((artist) => {
              const artistId = artist.id;
              shortTermRanking++;
              return (
                <div
                  key={artist.id}
                  className="flex flex-col justify-center items-center"
                >
                  <Link href={artist.external_urls.spotify} isExternal>
                    <Image
                      src={artist.images[0].url}
                      boxSize="200px"
                      objectFit="cover"
                      borderRadius="full"
                      className="mb-4"
                      alt={artist.name}
                    />
                  </Link>
                  <Text className="font-bold mb-3">
                    {shortTermRanking}. {artist.name}
                  </Text>
                  {isFollowingArtist[artistId] ? (
                    <Button
                      colorScheme="red"
                      leftIcon={<FaSpotify />}
                      onClick={async () => {
                        const unfollowArtistData = await unfollowArtist(
                          accessToken,
                          artistId
                        );
                        setIsFollowingArtist((prevData) => ({
                          ...prevData,
                          [artistId]: false,
                        }));
                      }}
                      // isLoading
                      // loadingText="Loading..."
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      colorScheme="whatsapp"
                      leftIcon={<FaSpotify />}
                      onClick={async () => {
                        const followArtistData = await followArtist(
                          accessToken,
                          artistId
                        );
                        setIsFollowingArtist((prevData) => ({
                          ...prevData,
                          [artistId]: true,
                        }));
                      }}
                      // isLoading
                      // loadingText="Loading..."
                    >
                      Follow
                    </Button>
                  )}
                </div>
              );
            })}
          </TabPanel>
          <TabPanel className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {topArtistsDetailsMediumTerm.items.map((artist) => {
              const artistId = artist.id;
              mediumTermRanking++;
              return (
                <div
                  key={artist.id}
                  className="flex flex-col justify-center items-center"
                >
                  <Link href={artist.external_urls.spotify} isExternal>
                    <Image
                      src={artist.images[0].url}
                      boxSize="200px"
                      objectFit="cover"
                      borderRadius="full"
                      className="mb-4"
                      alt={artist.name}
                    />
                  </Link>
                  <Text className="font-bold mb-3">
                    {mediumTermRanking}. {artist.name}
                  </Text>
                  {isFollowingArtist[artistId] ? (
                    <Button
                      colorScheme="red"
                      leftIcon={<FaSpotify />}
                      onClick={async () => {
                        const unfollowArtistData = await unfollowArtist(
                          accessToken,
                          artistId
                        );
                        setIsFollowingArtist((prevData) => ({
                          ...prevData,
                          [artistId]: false,
                        }));
                      }}
                      // isLoading
                      // loadingText="Loading..."
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      colorScheme="whatsapp"
                      leftIcon={<FaSpotify />}
                      onClick={async () => {
                        const followArtistData = await followArtist(
                          accessToken,
                          artistId
                        );
                        setIsFollowingArtist((prevData) => ({
                          ...prevData,
                          [artistId]: true,
                        }));
                      }}
                      // isLoading
                      // loadingText="Loading..."
                    >
                      Follow
                    </Button>
                  )}
                </div>
              );
            })}
          </TabPanel>
          <TabPanel className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {topArtistsDetailsLongTerm.items.map((artist) => {
              const artistId = artist.id;
              longTermRanking++;
              return (
                <div
                  key={artist.id}
                  className="flex flex-col justify-center items-center"
                >
                  <Link href={artist.external_urls.spotify} isExternal>
                    <Image
                      src={artist.images[0].url}
                      boxSize="200px"
                      objectFit="cover"
                      borderRadius="full"
                      className="mb-4"
                      alt={artist.name}
                    />
                  </Link>
                  <Text className="font-bold mb-3">
                    {longTermRanking}. {artist.name}
                  </Text>
                  {isFollowingArtist[artistId] ? (
                    <Button
                      colorScheme="red"
                      leftIcon={<FaSpotify />}
                      onClick={async () => {
                        const unfollowArtistData = await unfollowArtist(
                          accessToken,
                          artistId
                        );
                        setIsFollowingArtist((prevData) => ({
                          ...prevData,
                          [artistId]: false,
                        }));
                      }}
                      // isLoading
                      // loadingText="Loading..."
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      colorScheme="whatsapp"
                      leftIcon={<FaSpotify />}
                      onClick={async () => {
                        const followArtistData = await followArtist(
                          accessToken,
                          artistId
                        );
                        setIsFollowingArtist((prevData) => ({
                          ...prevData,
                          [artistId]: true,
                        }));
                      }}
                      // isLoading
                      // loadingText="Loading..."
                    >
                      Follow
                    </Button>
                  )}
                </div>
              );
            })}
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* <div>{spotifyData.topTracksDetails.items[0].name}</div> */}
    </>
  );
};

export default Artists;
