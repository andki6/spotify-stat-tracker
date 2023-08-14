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
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import { searchArtist } from "../utils/utils";
import { useSelector } from "react-redux";

const Search = () => {
  const router = useRouter();
  const toast = useToast();

  const accessToken = useSelector((state) => state.accessToken);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [emailAddressInput, setEmailAddressInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailAddress: "",
      searchInput: "",
    },
  });

  const handleEmailInputChange = (e) => {
    setEmailAddressInput(e.target.value);
  };

  const handleSearchInputChange = async (e) => {
    setSearchInput(e.target.value);
    if (searchInput.length > 1) {
      const searchResultsData = await searchArtist(accessToken, searchInput);
      setSearchResults(searchResultsData.artists.items);
      console.log(searchResultsData);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    setEmailAddressInput("");
    setSearchInput("");
    setSearchResults([]);
  }, []);
  console.log("state change");

  //   const getSearchResult = async () => {
  //     const searchResult = await searchArtist(accessToken, "travis scott");
  //     console.log(searchResult);
  //   };

  //   getSearchResult();

  //   console.log("State change");
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h3 className="text-4xl font-bold mb-1">Search an Artist</h3>
        <h4 className="text-l">
          Want information about your favorite artist on Spotify?
        </h4>
        <h4 className="mb-5 text-l">
          Enter your email and an artist to get a special email!
        </h4>
        {submitError.length > 0 && (
          <Text className="text-red-500 mb-4">{submitError}</Text>
        )}
        <form
          action=""
          onSubmit={handleSubmit(async (data) => {
            setIsLoading(true);
            try {
              const dataWithAccessToken = { ...data, accessToken };
              await axios.post("/api/search", dataWithAccessToken);
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
          className="w-1/5 flex flex-col items-center"
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
              onChange={handleEmailInputChange}
              value={emailAddressInput}
            />
            <FormErrorMessage className="text-red-600">
              {errors.emailAddress?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            className="relative flex flex-col justify-center items-center"
            isInvalid={errors.searchInput}
          >
            <FormLabel htmlFor="search-input" className="mb-2">
              Artist Name
            </FormLabel>
            <Input
              {...register("searchInput", { required: "Required" })}
              className="w-full rounded-xl pl-2 py-2"
              type="text"
              id="search-input"
              placeholder="Search"
              errorBorderColor="red.300"
              onChange={handleSearchInputChange}
              value={searchInput}
              name={searchInput}
            />
            <div className="absolute top-20 flex flex-col justify-center items-center w-full z-10">
              {searchResults.map((artist) => {
                return (
                  <Button
                    key={artist.id}
                    className="w-full relative"
                    border="1px"
                    borderColor="gray.300"
                    _hover={{ bg: "#ebedf0" }}
                    _active={{
                      bg: "#dddfe2",
                      transform: "scale(0.98)",
                      borderColor: "#bec3c9",
                    }}
                    onClick={() => {
                      setSearchResults([]);
                      setSearchInput(artist.name);
                      setValue("searchInput", artist.id);
                    }}
                  >
                    <div className="absolute left-0">
                      <Image
                        src={artist.images[0].url}
                        alt={artist.name}
                        boxSize="40px"
                        objectFit="cover"
                      />
                    </div>
                    {artist.name}
                  </Button>
                );
              })}
            </div>
            <FormErrorMessage className="text-red-600">
              {errors.searchInput?.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            className="px-6 py-2 rounded-xl cursor-pointer my-4 bg-green-400 text-white hover:bg-green-500 duration-200"
            isLoading={isLoading}
            colorScheme="blue"
            isDisabled={searchInput.length < 3 ? true : false}
          >
            Submit
          </Button>
        </form>
        <Button onClick={() => router.push("/home")}>Click Me</Button>
      </div>
    </>
  );
};

export default Search;
