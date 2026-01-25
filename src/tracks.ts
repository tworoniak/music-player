export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Arbiters of the Apocalypse",
    artist: "Revocation",
    album: "Great Is Our Sin",
    duration: 180,
    coverUrl: "/images/Revocation_-_Great_Is_Our_Sin.jpg",
    audioUrl: "/music/01_Arbiters_of_the_Apocalypse.mp3",
  },
  {
    id: 2,
    title: "Mark of the Blade",
    artist: "Whitechapel",
    album: "Mark of the Blade",
    duration: 180,
    coverUrl: "/images/Whitechapel-Mark_of_the_Blade.jpg",
    audioUrl: "/music/02_Mark_of_the_Blade.mp3",
  },
];

export default tracks;
