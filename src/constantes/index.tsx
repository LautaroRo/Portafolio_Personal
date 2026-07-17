export const THEMES = {
  minecraft: {
    video: "/fondos_img/VideoMinecraft.mp4", 
    clickSound: "/sonidos/botonMinecraft.mp3",
    bodyClass: "minecraft-mode",
    title: "MINECRAFT OST",
    icon: "/iconos/minecraft_logo.png", // <--- Agregado
    playlist: [
      // Fíjate que quité "./../../public" y puse directamente la ruta desde la raíz
      { title: "Minecraft", file: "/soundtracks/minecraft/Minecraft.mp3" },
      { title: "Sweden", file: "/soundtracks/minecraft/Sweden.mp3" },
      { title: "Wet Hands", file: "/soundtracks/minecraft/WetHands.mp3" },
    ],
  },
    silenthill: {
    video: "/fondos_img/SilentHill2Video.mp4", 
    clickSound: "/sonidos/botonSilentHill.mp3",
    bodyClass: "silenthill-mode",
    title: "SILENTHILL OST",
    icon: "/iconos/silenthill_logo.png", // <--- Agregado
    playlist: [
      // Fíjate que quité "./../../public" y puse directamente la ruta desde la raíz
      { title: "LauraPlaysThePiano", file: "/soundtracks/silenthill/LauraPlaysThePiano.mp3" },
      { title: "Promise", file: "/soundtracks/silenthill/Promise.mp3" },
      { title: "TheDayOfNight", file: "/soundtracks/silenthill/TheDayOfNight.mp3" },
    ],
  },

    thelastofus: {
    video: "/fondos_img/TlouVideo.mp4", 
    clickSound: "/sonidos/botonTlou.mp3",
    bodyClass: "tlou-mode",
    title: "TLOU OST",
    icon: "/iconos/lastofus_logo.png", // <--- Agregado
    playlist: [
      // Fíjate que quité "./../../public" y puse directamente la ruta desde la raíz
      { title: "AllGone", file: "/soundtracks/thelastofus/AllGone.mp3" },
      { title: "AllowedToBeHappy", file: "/soundtracks/thelastofus/AllowedToBeHappy.mp3" },
      { title: "YouAndMe", file: "/soundtracks/thelastofus/YouAndMe.mp3" },
    ],
  },

    redead: {
    video: "/fondos_img/ReadDeadVideo.mp4", 
    clickSound: "/sonidos/botonRedDead.mp3",
    bodyClass: "redead-mode",
    title: "REDDEAD OST",
    icon: "/iconos/redead_logo.png", // <--- Agregado
    playlist: [
      // Fíjate que quité "./../../public" y puse directamente la ruta desde la raíz
      { title: "Moonlight", file: "/soundtracks/reddead/Moonlight.mp3" },
      { title: "ThatstheWayItIs", file: "/soundtracks/reddead/ThatstheWayItIs.mp3" },
      { title: "TheFineArtOfConversation", file: "/soundtracks/reddead/TheFineArtOfConversation.mp3" },
    ],
  },
  profesional: {
    video: null,
    clickSound: null,
    bodyClass: "pro-mode",
    title: "PROFESSIONAL",
    icon: null, 
  }

};