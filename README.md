# 🎵 Music Player (React + TypeScript)

A modern, responsive **music player web app** built with **React + TypeScript**, styled with **TailwindCSS**, and designed as a portfolio-quality project showcasing **state management**, **audio playback controls**, and a clean component-driven architecture.

This project is actively evolving and will continue expanding with richer playlist features, UI enhancements, and advanced player functionality.

---

## 🚀 Live Demo

👉 **Live Site:** https://music-player-sigma-puce.vercel.app/

---

## ✨ Features

### 🎧 Playback Controls

- Play / Pause
- Next / Previous track navigation
- Playback progress bar (seekable)
- Current time + remaining time display
- Volume slider control
- Mute toggle
- Shuffle mode
- Repeat mode (repeat one / repeat all)

---

### 📃 Playlist & UI

- Playlist view with active track highlighting
- Track selection from playlist
- Responsive layout for mobile + desktop
- Modern UI icons via `lucide-react`
- Mini-player persistent bottom bar UI

---

### 🎛 Persistent Player State

The player uses a global `PlayerProvider` (React Context) to maintain playback state across the entire app, including:

- Current track + index
- Shuffle / repeat mode
- Playback state (playing/paused)
- Volume + mute
- Playback position
- Mini-player persistence across routes

State is persisted using **LocalStorage**, so playback settings survive refresh.

---

### 🖥️ Media Session API Support

This app supports the **Media Session API**, enabling:

- OS-level play/pause/skip controls
- Keyboard media key support
- Track metadata displayed in system UI (title, artist, album artwork)
- Playback state syncing (playing/paused)

---

### ⌨️ Keyboard Shortcuts

Keyboard shortcuts are supported globally (unless typing in an input):

- **Space** → Play/Pause
- **N** → Next Track
- **P** → Previous Track
- **M** → Mute Toggle
- **Arrow Right** → Seek forward (+5s)
- **Arrow Left** → Seek backward (-5s)

---

### 🧭 Routing (React Router)

This app supports multiple pages via **React Router**:

- `/` → Home
- `/now-playing` → Now Playing page

Playback continues seamlessly between routes thanks to the global player context.

---

## 🛠 Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Sass**
- **CoreUI React**
- **Lucide React (icons)**
- **rc-progress** (progress bar UI)
- **React Router DOM** (routing)

---

## 📦 Installation & Setup

Clone the repo:

```bash
git clone https://github.com/tworoniak/music-player.git
cd music-player
```
