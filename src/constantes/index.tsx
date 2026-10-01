export type Track = { title: string; file: string };

export type Theme = {
  name: string;
  video: string | null;
  clickSound: string | null;
  bodyClass: string;
  title: string;
  icon: string | null;
  playlist: Track[];
};

export const THEMES = {
  minecraft: {
    name: "Minecraft",
    video: "/fondos_img/VideoMinecraft.mp4",
    clickSound: "/sonidos/botonMinecraft.mp3",
    bodyClass: "minecraft-mode",
    title: "MINECRAFT OST",
    icon: "/iconos/minecraft_logo.png",
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
    icon: "/iconos/silenthill_logo.png",
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
    icon: "/iconos/lastofus_logo.png",
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
    icon: "/iconos/redead_logo.png",
    playlist: [
      { title: "Moonlight", file: "/soundtracks/reddead/Moonlight.mp3" },
      { title: "That's the Way It Is", file: "/soundtracks/reddead/ThatstheWayItIs.mp3" },
      { title: "The Fine Art of Conversation", file: "/soundtracks/reddead/TheFineArtOfConversation.mp3" },
    ],
  },
  profesional: {
    name: "Profesional",
    video: null,
    clickSound: null,
    bodyClass: "pro-mode",
    title: "PROFESIONAL",
    icon: null,
    playlist: [],
  },
} satisfies Record<string, Theme>;

export type ThemeId = keyof typeof THEMES;

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && value in THEMES;

export const getTheme = (id: ThemeId | null): Theme | null => (id ? THEMES[id] : null);
