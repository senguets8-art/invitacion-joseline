import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Church, Clock3, Crown, Gem, Heart, MapPin, PartyPopper, Pause, Play, Sparkles, Users, Volume2, VolumeX } from "lucide-react";

const DATA = {
  name: "JOSELINE",
  date: "2026-11-14T18:00:00-06:00",
  dateText: "SÁBADO 14 DE NOVIEMBRE DE 2026",
  massTime: "6:00 p. m.",
  receptionTime: "9:00 p. m.",
  church: "Iglesia María Estrella del Mar",
  churchAddress: "Carretera a Punta Sam, km 2.74, Puerto Juárez",
  churchMap: "https://maps.app.goo.gl/zhTks43cHKMvfPWcA",
  venue: "Local del Sindicato de Taxistas",
  venueAddress: "Av. Francisco I. Madero, SM 92, calle 71",
  venueMap: "https://maps.app.goo.gl/ZoGTEavibPR3RgHj6?g_st=aw",
  familyGroups: [
    { title: "Mis abuelos", names: ["Leoncio Becerril Razo", "Julia Martínez Marín"] },
    { title: "Mis padrinos de vestido", names: ["Carlos Manuel Martínez Marín", "Orfelina May Chan"] },
    { title: "Mis padrinos de misa", names: ["Fermín Pérez Pinto", "Violeta Martínez Marín"] }
  ],
  mother: ["Fabiola Joseline Becerril Martínez"],
  photos: Array.from({ length: 8 }, (_, index) => `/foto-${index + 1}.jpg`),
  music: "/musica-xv.mp3"
};

const remaining = () => {
  const ms = Math.max(0, new Date(DATA.date).getTime() - Date.now());
  return {
    Días: Math.floor(ms / 86400000),
    Horas: Math.floor(ms / 3600000) % 24,
    Minutos: Math.floor(ms / 60000) % 60,
    Segundos: Math.floor(ms / 1000) % 60
  };
};

function Reveal({ children, delay = 0 }) {
  return <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function Background() {
  return <div className="background">{Array.from({ length: 150 }, (_, index) => <motion.i key={index} style={{ left: `${(index * 47) % 100}%`, top: `${(index * 71) % 100}%`, width: index % 11 ? 3 : 8, height: index % 11 ? 3 : 8 }} animate={{ opacity: [0.08, 1, 0.08], scale: [0.5, 1.8, 0.5] }} transition={{ duration: 1.8 + (index % 6) * 0.4, repeat: Infinity, delay: (index % 15) * 0.12 }} />)}</div>;
}

function Divider() {
  return <div className="divider"><span /><Gem size={17} /><span /></div>;
}

function Quote({ children }) {
  return <Reveal><section className="quote"><Sparkles /><p>“{children}”</p></section></Reveal>;
}

function ImageWithFallback({ src, alt }) {
  const [error, setError] = useState(false);
  return error ? <div className="placeholder"><Sparkles /><p>Agrega {src.replace("/", "")} en la carpeta public</p></div> : <img src={src} alt={alt} onError={() => setError(true)} />;
}

function FamilyGroup({ title, names }) {
  return <div className="family-group"><h3>{title}</h3>{names.map(name => <p key={name}>{name}</p>)}</div>;
}

function FamilyAndGodparentsCard() {
  return <Reveal><article className="card family-card combined-family-card"><Users /><h3 className="card-main-title">Mis abuelos y padrinos</h3><Divider />{DATA.familyGroups.map((group, index) => <React.Fragment key={group.title}><FamilyGroup {...group} />{index < DATA.familyGroups.length - 1 && <div className="inner-separator" />}</React.Fragment>)}</article></Reveal>;
}

function MotherCard() {
  return <Reveal delay={0.16}><article className="card family-card mother-card"><Heart /><h3 className="card-main-title">Mi madre</h3><Divider />{DATA.mother.map(name => <p key={name}>{name}</p>)}</article></Reveal>;
}

function EventCard({ icon: Icon, title, time, place, address, href }) {
  return <article className="card event-card"><div className="icon"><Icon /></div><h3>{title}</h3><p className="time"><Clock3 size={16} />{time}</p><strong>{place}</strong><p>{address}</p><a className="button" href={href} target="_blank" rel="noreferrer"><MapPin size={17} />Ver ubicación</a></article>;
}

function Gallery() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent(value => (value + 1) % DATA.photos.length), 4200);
    return () => clearInterval(timer);
  }, [paused]);

  return <div className="gallery"><AnimatePresence mode="wait"><motion.div key={current} className="slide" initial={{ opacity: 0, x: 30, scale: 1.03 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -30, scale: 0.98 }}><ImageWithFallback src={DATA.photos[current]} alt={`Fotografía ${current + 1} de Joseline`} /><strong>Recuerdos para siempre</strong><small>{current + 1} de {DATA.photos.length}</small></motion.div></AnimatePresence><button className="gallery-button previous" onClick={() => setCurrent((current - 1 + DATA.photos.length) % DATA.photos.length)} aria-label="Fotografía anterior"><ChevronLeft /></button><button className="gallery-button next" onClick={() => setCurrent((current + 1) % DATA.photos.length)} aria-label="Fotografía siguiente"><ChevronRight /></button><button className="gallery-button pause" onClick={() => setPaused(!paused)} aria-label="Pausar o reproducir carrusel">{paused ? <Play /> : <Pause />}</button><div className="dots">{DATA.photos.map((_, index) => <button key={index} className={index === current ? "active" : ""} onClick={() => setCurrent(index)} aria-label={`Ver fotografía ${index + 1}`} />)}</div></div>;
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [time, setTime] = useState(remaining());
  const [musicOn, setMusicOn] = useState(false);
  const audio = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(remaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function openInvitation() {
    setOpened(true);
    try { audio.current.volume = 0.28; await audio.current.play(); setMusicOn(true); } catch {}
  }

  async function toggleMusic() {
    if (audio.current.paused) {
      try { await audio.current.play(); setMusicOn(true); } catch {}
    } else {
      audio.current.pause();
      setMusicOn(false);
    }
  }

  const calendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV%20a%C3%B1os%20de%20Joseline&dates=20261115T000000Z/20261115T060000Z";

  return <main><Background /><audio ref={audio} src={DATA.music} loop />{!opened ? <section className="cover"><Gem /><small>TIENES UNA INVITACIÓN</small><h1>Mis XV años</h1><h2>{DATA.name}</h2><button className="envelope" onClick={openInvitation} aria-label="Abrir invitación"><div className="flap" /><div className="seal"><Crown /></div></button><motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.8 }}>Presiona el sobre para abrirlo</motion.p></section> : <div className="content"><button className="music" onClick={toggleMusic}>{musicOn ? <Volume2 /> : <VolumeX />}</button>

    <section className="hero"><div className="portrait"><ImageWithFallback src="/foto-principal.jpg" alt="Fotografía principal de Joseline" /></div><Reveal><Crown /><small>MIS XV AÑOS</small><h1>{DATA.name}</h1><Divider /><p className="intro">Quince años no son solo una fecha; son sueños, recuerdos y una ilusión que existe desde niña. En esta etapa que hoy comienza, quiero compartir mi alegría con toda la gente que me rodea.</p><p>Te invito a acompañarme en este día tan especial para mí.</p><b className="date">{DATA.dateText}</b></Reveal></section>

    <Quote>En compañía de las personas que amo, celebraré el comienzo de una nueva etapa.</Quote>

    <section><h2>Me acompañan</h2><div className="family-list"><FamilyAndGodparentsCard /><MotherCard /></div></section>

    <Quote>El tiempo avanza y cada día falta menos para vivir una noche inolvidable.</Quote>

    <section><h2>Cuenta regresiva</h2><div className="countdown">{Object.entries(time).map(([label, value]) => <div key={label}><b>{String(value).padStart(2, "0")}</b><small>{label}</small></div>)}</div><a className="outline" href={calendarUrl} target="_blank" rel="noreferrer"><CalendarDays />Agregar al calendario</a></section>

    <Quote>Tu presencia hará que este día sea aún más inolvidable.</Quote>

    <section><h2>Ceremonia y recepción</h2><div className="event-grid"><EventCard icon={Church} title="Misa" time={DATA.massTime} place={DATA.church} address={DATA.churchAddress} href={DATA.churchMap} /><EventCard icon={PartyPopper} title="Recepción" time={DATA.receptionTime} place={DATA.venue} address={DATA.venueAddress} href={DATA.venueMap} /></div></section>

    <Quote>Cada fotografía guarda un recuerdo, y cada recuerdo forma parte de mi historia.</Quote>

    <section><h2>Galería de fotografías</h2><Gallery /></section>

    <Quote>Deseo que seas parte de este momento que guardaré por siempre en mi corazón.</Quote>

    <footer><Heart /><h2>{DATA.name}</h2><p>Tu presencia hará que este día sea aún más inolvidable.</p></footer>
  </div>}</main>;
}
