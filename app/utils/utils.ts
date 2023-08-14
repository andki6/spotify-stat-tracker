import axios from "axios";

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

export function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function generateCodeChallenge(codeVerifier: string) {
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

export async function fetchProfile(token: string): Promise<any> {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

export async function getPlaylistDetails(access_token, playlist_id) {
  const apiUrl = `https://api.spotify.com/v1/playlists/${playlist_id}`;
  const result = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await result.json();
}

export async function getTopArtistsShortTerm(access_token) {
  const apiUrl =
    "https://api.spotify.com/v1/me/top/artists?time_range=short_term";
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

export async function getTopArtistsMediumTerm(access_token) {
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

export async function getTopArtistsLongTerm(access_token) {
  const apiUrl =
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term";
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

export async function getTopTracksShortTerm(access_token) {
  const apiUrl =
    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50";
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

export async function getTopTracksMediumTerm(access_token) {
  const apiUrl = "https://api.spotify.com/v1/me/top/tracks?limit=50";
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

export async function getTopTracksLongTerm(access_token) {
  const apiUrl =
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50";
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

export async function getIsUserFollowingArtist(access_token, artistId) {
  const apiUrl = `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artistId}`;
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

export async function followArtist(access_token, artistId) {
  const apiUrl = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
  try {
    const response = await axios({
      method: "put",
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return { completed: true };
  } catch (e) {
    console.log(e);
  }
}

export async function unfollowArtist(access_token, artistId) {
  const apiUrl = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
  try {
    const response = await axios({
      method: "delete",
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return { completed: true };
  } catch (e) {
    console.log(e);
  }
}

export async function searchArtist(access_token, artistName) {
  const apiUrl = "https://api.spotify.com/v1/search";
  const queryParams = new URLSearchParams({
    q: artistName,
    type: "artist",
    limit: 3,
  });
  try {
    const response = await axios.get(`${apiUrl}?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function getArtistDetails(access_token, artistId) {
  const apiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
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

export async function getArtistAlbumsDetails(access_token, artistId) {
  const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;
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

// export async function getSeveralArtistsDetails(access_token, artistIds) {
//   const apiUrl = `https://api.spotify.com/v1/artists?ids=${artistIds}`;
//   try {
//     const response = await axios.get(apiUrl, {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//     return response.data;
//   } catch (e) {
//     console.log(e);
//   }
// }

export async function getArtistTopTracks(access_token, artistId) {
  const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
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

export async function getArtistRelatedArtists(access_token, artistId) {
  const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
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

export async function getCurrentUsersPlaylists(access_token) {
  const apiUrl = `https://api.spotify.com/v1/me/playlists?limit=50`;
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

export async function getPlaylistItemsByApiUrl(access_token, apiUrl) {
  const limit = 50;
  let offset = 0;

  let allItems = [];

  while (true) {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          limit,
          offset,
        },
      });

      const items = response.data.items;

      if (items.length === 0) {
        break;
      }

      allItems = [...allItems, ...items];
      offset += limit;
    } catch (e) {
      console.log(e);
      break;
    }
  }

  return allItems;
}

export async function getSeveralTracks(access_token, trackIds) {
  const apiUrl = `https://api.spotify.com/v1/tracks?ids=${trackIds}`;
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

// export async function getTrack(access_token, trackId) {
//   const apiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
//   try {
//     const response = await axios.get(apiUrl, {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//     return response.data;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function getAvailableMarkets(access_token) {
//   const apiUrl = `https://api.spotify.com/v1/markets`;
//   try {
//     const response = await axios.get(apiUrl, {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//     return response.data;
//   } catch (e) {
//     console.log(e);
//   }
// }
