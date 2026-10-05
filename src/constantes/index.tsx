export type Track = { title: string; file: string };

export const trackKey = (t: Track) => t.file;

export type Theme = {
  name: string;
  video: string | null;
  clickSound: string | null;
  bodyClass: string;
  title: string;
  icon: string | null;
  playlist: Track[];
  // Fondo animado propio cuando el tema no tiene video (y respaldo mientras carga YouTube)
  scene?: "vice";
  // Id de un video de YouTube que se incrusta de fondo (se reproduce desde YouTube, no se descarga)
  youtube?: string;
  // Frase corta y colores para la tarjeta del selector de mundos
  tagline: string;
  swatch: [string, string];
};

export const THEMES = {
  minecraft: {
    name: "Minecraft",
    video: "/fondos_img/VideoMinecraft.mp4",
    clickSound: "/sonidos/botonMinecraft.mp3",
    bodyClass: "minecraft-mode",
    title: "MINECRAFT OST",
    icon: "/iconos/minecraft.svg",
    tagline: "Bloques y cerezos",
    swatch: ["#5d9b3a", "#6b4a32"],
    playlist: [
      { title: "Minecraft", file: "/soundtracks/minecraft/Minecraft.mp3" },
      { title: "Sweden", file: "/soundtracks/minecraft/Sweden.mp3" },
      { title: "Wet Hands", file: "/soundtracks/minecraft/WetHands.mp3" },
    ],
  },
  silenthill: {
    name: "Silent Hill 2",
    video: "/fondos_img/SilentHill2Video.mp4",
    clickSound: "/sonidos/botonSilentHill.mp3",
    bodyClass: "silenthill-mode",
    title: "SILENT HILL OST",
    icon: "/iconos/silenthill.svg",
    tagline: "Niebla y estática",
    swatch: ["#3a3a3a", "#8b1010"],
    playlist: [
      { title: "Laura Plays the Piano", file: "/soundtracks/silenthill/LauraPlaysThePiano.mp3" },
      { title: "Promise", file: "/soundtracks/silenthill/Promise.mp3" },
      { title: "The Day of Night", file: "/soundtracks/silenthill/TheDayOfNight.mp3" },
    ],
  },
  thelastofus: {
    name: "The Last of Us",
    video: "/fondos_img/TlouVideo.mp4",
    clickSound: "/sonidos/botonTlou.mp3",
    bodyClass: "tlou-mode",
    title: "TLOU OST",
    icon: "/iconos/tlou.svg",
    tagline: "Esporas y luciérnagas",
    swatch: ["#2f3d22", "#f2c14e"],
    playlist: [
      { title: "All Gone", file: "/soundtracks/thelastofus/AllGone.mp3" },
      { title: "Allowed to Be Happy", file: "/soundtracks/thelastofus/AllowedToBeHappy.mp3" },
      { title: "You and Me", file: "/soundtracks/thelastofus/YouAndMe.mp3" },
    ],
  },
  redead: {
    name: "Red Dead Redemption 2",
    video: "/fondos_img/ReadDeadVideo.mp4",
    clickSound: "/sonidos/botonRedDead.mp3",
    bodyClass: "redead-mode",
    title: "RED DEAD OST",
    icon: "/iconos/redead.svg",
    tagline: "El salvaje oeste",
    swatch: ["#5a3b22", "#9e1b17"],
    playlist: [
      { title: "Moonlight", file: "/soundtracks/reddead/Moonlight.mp3" },
      { title: "That's the Way It Is", file: "/soundtracks/reddead/ThatstheWayItIs.mp3" },
      { title: "The Fine Art of Conversation", file: "/soundtracks/reddead/TheFineArtOfConversation.mp3" },
    ],
  },
  gta6: {
    name: "GTA VI",
    video: null,
    youtube: "6_ohA33V6-A",
    clickSound: "/sonidos/clic-gta6.mp3",
    bodyClass: "gta-mode",
    title: "VICE CITY FM",
    icon: "/iconos/gta6.svg",
    tagline: "Atardecer en Leonida",
    swatch: ["#ff3e8a", "#ffb347"],
    playlist: [
      { title: "Love Is a Long Road · Tom Petty", file: "/soundtracks/gta6/LoveIsALongRoad.mp3" },
      { title: "Devil Woman · Cliff Richard", file: "/soundtracks/gta6/DevilWoman.mp3" },
      { title: "Inner Light · Elderbrook & Bob Moses", file: "/soundtracks/gta6/InnerLight.mp3" },
    ],
    scene: "vice",
  },
  profesional: {
    name: "Profesional",
    video: null,
    clickSound: null,
    bodyClass: "pro-mode",
    title: "PROFESIONAL",
    icon: null,
    tagline: "Limpio y directo",
    swatch: ["#4f46e5", "#0891b2"],
    playlist: [],
  },
} satisfies Record<string, Theme>;

export type ThemeId = keyof typeof THEMES;

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && value in THEMES;

export const getTheme = (id: ThemeId | null): Theme | null => (id ? THEMES[id] : null);

// CV para descargar. La fuente es cv/cv.html (en la raíz del repo); el PDF se regenera desde ahí.
export const CV_PDF = "/cv/CV-Lautaro-Rodriguez.pdf";
