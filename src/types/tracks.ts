export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
}

const tracksData: Track[] = [
  {
    id: 1,
    title: "Rogue Momentum",
    artist: "MusicGPT",
    album: "MusicGPT",
    duration: 120,
    coverUrl:
      "/images/thumbnail_3f5afcfa-a950-4e0a-8f7b-f94eab8a6e74_action.jpg",
    audioUrl: "/music/Rogue_Momentum_FULL_SONG_MusicGPT.mp3",
  },
  {
    id: 2,
    title: "Forge of Light",
    artist: "MusicGPT",
    album: "MusicGPT",
    duration: 240,
    coverUrl:
      "/images/thumbnail_a290198b-c253-4915-bca4-45b0af609093_cinematic.jpg",
    audioUrl: "/music/Forge_of_Light_FULL_SONG_MusicGPT.mp3",
  },
  {
    id: 3,
    title: "Eternal Harmony",
    artist: "MusicGPT",
    album: "MusicGPT",
    duration: 300,
    coverUrl: "/images/ce4b514c-a875-4979-8db9-f8a04d87b01a_thumbnail.jpg",
    audioUrl: "/music/Eternal_Harmony_FULL_SONG_MusicGPT.mp3",
  },
  {
    id: 4,
    title: "Majestic Sonata",
    artist: "MusicGPT",
    album: "MusicGPT",
    duration: 300,
    coverUrl: "/images/47b971c8-50b5-453c-b052-6b3937259ed0_Classical.jpeg",
    audioUrl: "/music/Majestic_Sonata_FULL_SONG_MusicGPT.mp3",
  },
];

export default tracksData;
