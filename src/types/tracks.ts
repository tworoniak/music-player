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
    title: "Arbiters of the Apocalypse",
    artist: "Revocation",
    album: "Great Is Our Sin",
    duration: 240,
    coverUrl: "/images/Revocation_-_Great_Is_Our_Sin.jpg",
    audioUrl: "/music/01_Arbiters_of_the_Apocalypse.mp3",
  },
  {
    id: 2,
    title: "Mark of the Blade",
    artist: "Whitechapel",
    album: "Mark of the Blade",
    duration: 120,
    coverUrl: "/images/Whitechapel-Mark_of_the_Blade.jpg",
    audioUrl: "/music/02_Mark_of_the_Blade.mp3",
  },
  {
    id: 3,
    title: "Tyhjyys",
    artist: "Wolfheart",
    album: "Tyhjyys",
    duration: 240,
    coverUrl: "/images/Wolfheart-Tyhjyys.jpg",
    audioUrl: "/music/08_Tyhjyys.mp3",
  },
  {
    id: 4,
    title: "Sorceress",
    artist: "Opeth",
    album: "Sorceress",
    duration: 300,
    coverUrl: "/images/Opeth_Sorceress_PromoCover_revised.jpg",
    audioUrl: "/music/02_Sorceress.mp3",
  },
  {
    id: 5,
    title: "Majestic Sonata",
    artist: "Classical",
    album: "Classical",
    duration: 300,
    coverUrl: "/images/47b971c8-50b5-453c-b052-6b3937259ed0_Classical.jpeg",
    audioUrl: "/music/Majestic_Sonata_FULL_SONG_MusicGPT.mp3",
  },
];

export default tracksData;
