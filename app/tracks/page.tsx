"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import { useSelector } from "react-redux";
import { Text, Image, Link } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const Tracks = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [prevShortTermRankings, setPrevShortTermRankings] = useState({});
  const [prevMediumTermRankings, setPrevMediumTermRankings] = useState({});
  const [prevLongTermRankings, setPrevLongTermRankings] = useState({});

  const spotifyData = useSelector((state) => state.spotifyDetails);
  console.log(spotifyData);
  const {
    topTracksDetailsShortTerm,
    topTracksDetailsMediumTerm,
    toptracksDetailsLongTerm,
  } = spotifyData.topTracksDetails;
  console.log(topTracksDetailsShortTerm);
  let shortTermRanking = 0;
  let mediumTermRanking = 0;
  let longTermRanking = 0;

  const getTrackRankings = (trackDetails) => {
    const rankings = {};
    trackDetails.items.forEach((track, index) => {
      rankings[track.id] = index + 1;
    });
    return rankings;
  };

  useEffect(() => {
    setPrevShortTermRankings(getTrackRankings(topTracksDetailsShortTerm));
    setPrevMediumTermRankings(getTrackRankings(topTracksDetailsMediumTerm));
    setPrevLongTermRankings(getTrackRankings(toptracksDetailsLongTerm));
  }, [
    topTracksDetailsShortTerm,
    topTracksDetailsMediumTerm,
    toptracksDetailsLongTerm,
  ]);

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
            Top Tracks (Last 4 Weeks)
          </Text>
        )}
        {tabIndex === 1 && (
          <Text className="text-center font-bold text-2xl mb-8">
            Top Tracks (Last 6 Months)
          </Text>
        )}
        {tabIndex === 2 && (
          <Text className="text-center font-bold text-2xl mb-8">
            Top Tracks (All Time)
          </Text>
        )}
        <TabList>
          <Tab>Last 4 Weeks</Tab>
          <Tab>Last 6 Months</Tab>
          <Tab>All Time</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="flex flex-col justify-center items-center">
            {topTracksDetailsShortTerm.items.map((track, index) => {
              const currentRanking = index + 1;
              const prevRanking =
                prevShortTermRankings[track.id] || currentRanking;

              const rankingIndicator =
                currentRanking < prevRanking
                  ? "🔼"
                  : currentRanking > prevRanking
                  ? "🔽"
                  : "";

              let artistAndFeatures = "";
              for (let i = 0; i < track.artists.length; i++) {
                let artistName = track.artists[i].name;
                if (i >= track.artists.length - 1) {
                  artistAndFeatures += artistName;
                } else {
                  artistAndFeatures += artistName + "," + " ";
                }
              }
              shortTermRanking++;
              return (
                <div
                  key={track.id}
                  className="w-full flex justify-between items-center mb-4"
                >
                  <div className="flex justify-center items-center">
                    <Text>{rankingIndicator}</Text>
                    <Text className="mr-3 w-6 font-bold">
                      {shortTermRanking}
                    </Text>
                    <Image
                      src={track.album.images[0].url}
                      boxSize="65px"
                      className="mr-3"
                    />
                    <div>
                      <Text className="font-bold">{track.name}</Text>
                      <Text>{artistAndFeatures}</Text>
                    </div>
                  </div>

                  <div>
                    <Link href={track.external_urls.spotify} isExternal>
                      <Image src="/spotifyLogo.png" boxSize="30px" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </TabPanel>
          <TabPanel className="flex flex-col justify-center items-center">
            {topTracksDetailsMediumTerm.items.map((track) => {
              let artistAndFeatures = "";
              for (let i = 0; i < track.artists.length; i++) {
                let artistName = track.artists[i].name;
                if (i >= track.artists.length - 1) {
                  artistAndFeatures += artistName;
                } else {
                  artistAndFeatures += artistName + "," + " ";
                }
              }
              mediumTermRanking++;
              return (
                <div
                  key={track.id}
                  className="w-full flex justify-between items-center mb-4"
                >
                  <div className="flex justify-center items-center">
                    <Text className="mr-3 w-6 font-bold">
                      {mediumTermRanking}
                    </Text>
                    <Image
                      src={track.album.images[0].url}
                      boxSize="65px"
                      className="mr-3"
                    />
                    <div>
                      <Text className="font-bold">{track.name}</Text>
                      <Text>{artistAndFeatures}</Text>
                    </div>
                  </div>

                  <div>
                    <Link href={track.external_urls.spotify} isExternal>
                      <Image src="/spotifyLogo.png" boxSize="30px" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </TabPanel>
          <TabPanel className="flex flex-col justify-center items-center">
            {toptracksDetailsLongTerm.items.map((track) => {
              let artistAndFeatures = "";
              for (let i = 0; i < track.artists.length; i++) {
                let artistName = track.artists[i].name;
                if (i >= track.artists.length - 1) {
                  artistAndFeatures += artistName;
                } else {
                  artistAndFeatures += artistName + "," + " ";
                }
              }
              longTermRanking++;
              return (
                <div
                  key={track.id}
                  className="w-full flex justify-between items-center mb-4"
                >
                  <div className="flex justify-center items-center">
                    <Text className="mr-3 w-6 font-bold">
                      {longTermRanking}
                    </Text>
                    <Image
                      src={track.album.images[0].url}
                      boxSize="65px"
                      className="mr-3"
                    />
                    <div>
                      <Text className="font-bold">{track.name}</Text>
                      <Text>{artistAndFeatures}</Text>
                    </div>
                  </div>

                  <div>
                    <Link href={track.external_urls.spotify} isExternal>
                      <Image src="/spotifyLogo.png" boxSize="30px" />
                    </Link>
                  </div>
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

export default Tracks;
