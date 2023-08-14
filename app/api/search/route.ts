import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  getArtistDetails,
  getArtistAlbumsDetails,
  getArtistTopTracks,
  getArtistRelatedArtists,
} from "@/app/utils/utils";

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

// const generateEmailContent = (data) => {
//   return {
//     text, html
//   }
// }

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
  },
});

export async function POST(request: Request) {
  const body = await request.json();
  const { emailAddress, searchInput, accessToken } = body;
  console.log(body);

  const artistId = searchInput;
  const artistDetails = await getArtistDetails(accessToken, artistId);
  const artistAlbumsDetails = await getArtistAlbumsDetails(
    accessToken,
    artistId
  );
  const artistTopTracks = await getArtistTopTracks(accessToken, artistId);
  const artistRelatedArtists = await getArtistRelatedArtists(
    accessToken,
    artistId
  );

  const genres = artistDetails.genres.reduce((str, genre, index) => {
    if (index >= artistDetails.genres.length - 1) {
      return (str += `${genre}`);
    } else {
      return (str += `${genre}, `);
    }
  }, "");
  // const albums = artistAlbumsDetails.items
  //   .map((album) => album.name)
  //   .join(", ");
  // console.log(albums);
  const topTracks = artistTopTracks.tracks
    .map((track) => `<li>${track.name}</li>`)
    .join("");

  const relatedArtists = artistRelatedArtists.artists
    .map((artist) => `<li>${artist.name}</li>`)
    .join("");

  const receiver = emailAddress;

  const mailOptions = {
    from: email,
    to: receiver,
  };

  try {
    const info = await transporter.sendMail({
      ...mailOptions,
      subject: "Spotify Stat Tracker",
      text: "this is a text string",
      html: `<!doctypehtml><html lang=en><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><title>Document</title><h1>${artistDetails.name}'s Spotify Metrics</h1><h3>Genres:</h3><p>${genres}<h3>Top Tracks:</h3><ol>${topTracks}</ol><h3>Related Artists:</h3><ul>${relatedArtists}</ul>`,
    });

    return NextResponse.json(searchInput);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
