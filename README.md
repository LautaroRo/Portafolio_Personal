# Portafolio personal — Lautaro Rodríguez

Portafolio web hecho con **Next.js 16**, **React 19** y **TypeScript**.

Además del modo profesional tiene cinco mundos inspirados en videojuegos: **Minecraft, Silent Hill 2, The Last of Us, Red Dead Redemption 2 y GTA VI**. Cada uno cambia la interfaz entera (textos, tipografías, tarjetas, botones y efectos como partículas, niebla, linterna o HUD), trae su pantalla de entrada, su sonido de clic y una radio con la banda sonora. El tema elegido queda guardado en el navegador.

Se puede entrar directo a un mundo con `?tema=minecraft`, `silenthill`, `thelastofus`, `redead` o `gta6` (y `&intro=0` para saltear la pantalla de entrada).

## Secciones

- **Información**: presentación con animaciones de entrada.
- **Habilidades**: inventario que se puede reordenar arrastrando (dnd-kit, también con teclado y en el celular).
- **Proyectos**: tarjetas con captura, tecnologías y enlaces.
- **Contacto**: formulario (Formspree) y acceso directo a WhatsApp.

## Correr en local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Formulario de contacto

El formulario envía por [Formspree](https://formspree.io) si existe la variable de entorno:

```
NEXT_PUBLIC_FORMSPREE_ID=xxxxxxxx
```

Sin ella, al enviar se abre WhatsApp con el mensaje ya escrito, así que nunca queda un formulario roto.
