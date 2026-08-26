# 🐱 PurrfectName - Smart Cat Name Generator

**PurrfectName** is a delightful, client-side React web app designed to help cat parents find the perfect name for their feline friends based on appearance, personality vibes, and naming themes.

Built with **React 19**, **TypeScript**, and **Tailwind CSS**, with **zero external APIs or database dependencies**.

---

## ✨ Features

- **🎨 Multi-Trait Cat Customizer**:
  - **Coat Appearance & Patterns**: Orange/Ginger, Midnight Black, Snow White, Calico, Tuxedo, Striped Tabby, Smoky Grey, Fluffy Longhair, Tortoiseshell, and Siamese Pointed.
  - **Personality & Behavior**: Chaotic Gremlin, Royal Highness, Velcro Cuddler, Couch Potato, Fierce Hunter, Derpy Goofball, Chatty Diva, Shadow Enigma, Brave Explorer, and Kibble Enthusiast.
  - **Name Themes**: Food & Drinks, Mythology & Gods, Distinguished Human, Punny & Whimsical, Nature & Botanicals, Cosmic & Celestial, and Pop Culture.
  - **Gender Preferences**: Any, Feminine, Masculine, or Neutral.
- **✨ Dynamic SVG Avatar**: Real-time visual feline avatar that updates coat color, markings, expression (e.g. sleepy eyes, derpy tongue), and accessories (e.g. royal crown, lightning bolt) as you customize traits.
- **🧠 Smart Matching Engine**: Client-side ranking algorithm that scores names by trait affinities and generates bespoke rationale explanations for each recommendation.
- **🔄 Instant Reroll**: Refresh button with shuffle jitter to discover more top matches.
- **💖 Saved Favorites Drawer**: Bookmark favorite names, persist them locally in `localStorage`, and copy shortlisted names with one click.
- **🎲 "Surprise Me!"**: One-click random trait generator for indecisive pet parents.
- **🎉 Delightful Micro-Interactions**: Confetti particles on bookmarking, smooth animations, and copy-to-clipboard feedback.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser and navigate to the local URL (usually `http://localhost:5173`).

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Project Structure

```text
├── index.html                  # HTML entry point with fonts & meta
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS theme extensions
├── tsconfig.json               # TypeScript configuration
└── src/
    ├── main.tsx                # React DOM root mounting
    ├── App.tsx                 # Main application state & layout
    ├── index.css               # Global styles & Tailwind directives
    ├── types.ts                # TypeScript types & interfaces
    ├── data/
    │   └── namesData.ts        # Self-contained database of curated cat names & options
    ├── utils/
    │   └── nameGenerator.ts    # Scoring engine & rationale builder
    └── components/
        ├── Header.tsx          # Navigation, actions & favorites badge
        ├── TraitSelector.tsx   # Interactive widgets for coat, vibe & themes
        ├── SuggestionsView.tsx # Suggestions container with reroll controls
        ├── NameCard.tsx        # Card for each name with tags & rationale
        ├── FavoritesDrawer.tsx # Bookmark manager with copy/export
        └── CatPreviewAvatar.tsx # Dynamic SVG cat illustration
```