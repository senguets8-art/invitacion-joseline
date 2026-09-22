import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Church, Clock3, Crown, Gem, Heart, MapPin, MessageCircle, PartyPopper, Pause, Play, Sparkles, Users, Volume2, VolumeX } from "lucide-react";

const DATA = {
  name: "JOSELINE",
  dateISO: "2026-11-14T18:00:00-06:00",
  dateText: "SÁBADO 14 DE NOVIEMBRE DE 2026",
  massTime: "6:00 p. m.",
  receptionTime: "9:00 p. m.",
  church: "Iglesia María Estrella del Mar",
  churchAddress: "Carretera a Punta Sam, km 2.74, Puerto Juárez",
  churchMaps: "https://maps.app.goo.gl/zhTks43cHKMvfPWcA",
  venue: "Local del Sindicato de Taxistas",
  venueAddress: "Av. Francisco I. Madero, SM 92, calle 71",
  venueMaps: "https://maps.app.goo.gl/ZoGTEavibPR3RgHj6?g_st=aw",
  whatsapp: "525641130364",
  grandparents: ["Leoncio Becerril Razo", "Julia Martínez Marín"],
  godparents: ["Carlos Manuel Martínez Marín", "Orfelina May Chan"],
  parents: ["Sebastián Antonio López Ordóñez", "Fabiola Joseline Becerril Martínez"],
  mainPhoto: "/foto-principal.jpg",
  gallery: [
    { src: "/foto-1.jpg", label: "Un sueño que comienza" },
    { src: "/foto-2.jpg", label: "Recuerdos para siempre" },
    { src: "/foto-3.jpg", label: "Una nueva etapa" },
    { src: "/foto-4.jpg", label: "Mis XV años" }
  ],
  musicUrl: "/musica-xv.mp3",
  musicVolume: 0.28
};

const ease = [0.22, 1, 0.36, 1];
const exists = (src) => src && src !== "";

function remaining(target) {
  const d = Math.max(0, new Date(target).getTime() - Date.now());
  return { días: Math.floor(d / 86400000), horas: Math.floor((d / 3600000) % 24), minutos: Math.floor((d / 60000) % 60), segundos: Math.floor((d / 1000) % 60) };
}

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const start = direction === "left" ? { x: -44, y: 0 } : direction === "right" ? { x: 44, y: 0 } : { x: 0, y: 40 };
  return <motion.div initial={{ opacity: 0, ...start }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .8, delay, ease }} className={className}>{children}</motion.div>;
}

function GlitterBackground() {
  const glitter = Array.from({ length: 150 }, (_, i) => ({ left: `${(i*47+7)%100}%`, top: `${(i*71+11)%100}%`, size: i%17===0?8:i%11===0?6:i%5===0?4:2.5, delay:(i%18)*.16, duration:1.7+(i%7)*.34 }));
  return <div className="glitter-bg"><div className="gradient-bg"/><div className="blur-light one"/><div className="blur-light two"/>{glitter.map((p,i)=><motion.span key={i} className={`glitter ${i%8===0?'diamond':''}`} style={{left:p.left,top:p.top,width:p.size,height:p.size}} animate={{opacity:[.08,i%8===0?1:.72,.08],scale:[.45,i%8===0?1.9:1.35,.45],rotate:i%8===0?[45,135,225]:[0,35,0]}} transition={{duration:p.duration,repeat:Infinity,delay:p.delay}}/>)}</div>;
}

function Divider({Icon=Gem}) { return <div className="divider"><span/><Icon size={17}/><span/></div>; }
function Title({eyebrow,children}) { return <Reveal className="title"><small>{eyebrow}</small><h2>{children}</h2><Divider/></Reveal>; }
function Quote({children}) { return <div className="quote"><Reveal><motion.div className="quote-gem" animate={{y:[0,-5,0],rotate:[0,6,0,-6,0]}} transition={{duration:5,repeat:Infinity}}><Gem size={23}/></motion.div><Divider Icon={Sparkles}/><p>“{children}”</p></Reveal></div>; }

function Photo({src,alt,principal=false}) {
  const [failed,setFailed]=useState(false);
  if (!exists(src) || failed) return <div className="placeholder"><Sparkles size={principal?42:34}/><p>{principal?'Agrega foto-principal.jpg':'Agrega esta fotografía'}</p><small>{alt}</small></div>;
  return <img src={src} alt={alt} onError={()=>setFailed(true)}/>;
}

function Envelope({onOpen}) { return <motion.button className="envelope" whileHover={{scale:1.03}} whileTap={{scale:.97}} onClick={onOpen}><div className="envelope-body"><div className="envelope-lines"/><motion.div className="seal" animate={{boxShadow:["0 0 14px #ead9a566","0 0 42px #ead9a5ff","0 0 14px #ead9a566"]}} transition={{duration:1.8,repeat:Infinity}}><Crown size={29}/></motion.div><div className="flap"/></div></motion.button>; }

function FamilyCard({title,names,delay=0}) { return <Reveal delay={delay}><article className="card family"><Users size={28}/><h3>{title}</h3><Divider Icon={Heart}/>{names.map(n=><p key={n}>{n}</p>)}</article></Reveal>; }
function EventCard({icon:Icon,title,time,place,address,maps,direction}) { return <Reveal direction={direction}><article className="card event"><div className="icon"><Icon size={26}/></div><h3>{title}</h3><p className="time"><Clock3 size={15}/>{time}</p><strong>{place}</strong><p>{address}</p><a className="gold-btn" href={maps} target="_blank" rel="noreferrer"><MapPin size={17}/>Ver ubicación</a></article></Reveal>; }

function Carousel() {
  const [current,setCurrent]=useState(0); const [paused,setPaused]=useState(false);
  useEffect(()=>{ if(paused)return; const t=setInterval(()=>setCurrent(v=>(v+1)%DATA.gallery.length),4200); return()=>clearInterval(t);},[paused]);
  const photo=DATA.gallery[current];
  return <Reveal><div className="carousel"><div className="carousel-frame"><AnimatePresence mode="wait"><motion.div key={current} className="slide" initial={{opacity:0,scale:1.05,x:30}} animate={{opacity:1,scale:1,x:0}} exit={{opacity:0,scale:.98,x:-30}}><Photo src={photo.src} alt={photo.label}/><div className="caption">{photo.label}</div></motion.div></AnimatePresence><button className="nav prev" onClick={()=>setCurrent(v=>(v-1+DATA.gallery.length)%DATA.gallery.length)}><ChevronLeft/></button><button className="nav next" onClick={()=>setCurrent(v=>(v+1)%DATA.gallery.length)}><ChevronRight/></button><button className="nav pause" onClick={()=>setPaused(v=>!v)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></div><div className="dots">{DATA.gallery.map((_,i)=><button key={i} className={i===current?'active':''} onClick={()=>setCurrent(i)}/>)}</div></div></Reveal>;
}

export default function App() {
  const [opened,setOpened]=useState(false); const [time,setTime]=useState(()=>remaining(DATA.dateISO)); const [music,setMusic]=useState(false); const [guest,setGuest]=useState(""); const [answer,setAnswer]=useState("Sí, asistiré"); const audioRef=useRef(null);
  useEffect(()=>{const t=setInterval(()=>setTime(remaining(DATA.dateISO)),1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{if(audioRef.current)audioRef.current.volume=DATA.musicVolume;},[]);
  async function openInvitation(){setOpened(true);if(audioRef.current)try{await audioRef.current.play();setMusic(true);}catch{}}
  async function toggleMusic(){if(!audioRef.current)return;if(audioRef.current.paused)try{await audioRef.current.play();setMusic(true);}catch{}else{audioRef.current.pause();setMusic(false);}}
  const confirmUrl=`https://wa.me/${DATA.whatsapp}?text=${encodeURIComponent(`Hola, soy ${guest||"invitado"}. ${answer} a los XV años de ${DATA.name}, el sábado 14 de noviembre de 2026.`)}`;
  const calendarUrl=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('XV años de Joseline')}&dates=20261115T000000Z/20261115T060000Z&location=${encodeURIComponent(DATA.churchAddress)}`;

  return <main><GlitterBackground/><audio ref={audioRef} src={DATA.musicUrl} loop preload="auto"/>
    <AnimatePresence mode="wait">{!opened ? <motion.section key="cover" className="cover" exit={{opacity:0,scale:1.08,filter:'blur(14px)'}}><Gem/><p className="eyebrow">Tienes una invitación</p><h1>Mis XV años</h1><h2>{DATA.name}</h2><Envelope onOpen={openInvitation}/><motion.p animate={{opacity:[.4,1,.4]}} transition={{duration:1.8,repeat:Infinity}}>Presiona el sobre para abrirlo</motion.p></motion.section> :
    <motion.div key="content" initial={{opacity:0}} animate={{opacity:1}} className="content"><button className="music" onClick={toggleMusic}>{music?<Volume2 size={19}/>:<VolumeX size={19}/>}</button>
      <section className="hero section"><motion.div className="main-photo" initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}}><Photo src={DATA.mainPhoto} alt="Fotografía principal de Joseline" principal/></motion.div><Reveal><Crown size={38}/><p className="eyebrow">Mis XV años</p><h1>{DATA.name}</h1><Divider Icon={Sparkles}/><p className="intro">Quince años no son solo una fecha; son sueños, recuerdos y una ilusión que existe desde niña. En esta etapa que hoy comienza, quiero compartir mi alegría con toda la gente que me rodea.</p><p className="invite">Te invito a acompañarme en este día tan especial para mí.</p><p className="date">{DATA.dateText}</p></Reveal></section>
      <Quote>En compañía de las personas que amo, celebraré el comienzo de una nueva etapa.</Quote>
      <section className="section"><Title eyebrow="Con el amor de mi familia">Me acompañan</Title><div className="family-grid"><FamilyCard title="Mis abuelos" names={DATA.grandparents}/><FamilyCard title="Mis padrinos" names={DATA.godparents} delay={.12}/><FamilyCard title="Mis padres" names={DATA.parents} delay={.24}/></div></section>
      <Quote>El tiempo avanza y cada día falta menos para vivir una noche inolvidable.</Quote>
      <section className="section"><Title eyebrow="Cada vez falta menos">Cuenta regresiva</Title><div className="countdown">{Object.entries(time).map(([label,value],i)=><Reveal key={label} delay={i*.1}><div className="count"><b>{String(value).padStart(2,'0')}</b><small>{label}</small></div></Reveal>)}</div><a className="outline-btn" href={calendarUrl} target="_blank" rel="noreferrer"><CalendarDays size={17}/>Agregar al calendario</a></section>
      <Quote>Tu presencia hará que este día sea aún más inolvidable.</Quote>
      <section className="section"><Title eyebrow="Celebra conmigo">Ceremonia y recepción</Title><div className="event-grid"><EventCard direction="left" icon={Church} title="Misa" time={DATA.massTime} place={DATA.church} address={DATA.churchAddress} maps={DATA.churchMaps}/><EventCard direction="right" icon={PartyPopper} title="Recepción" time={DATA.receptionTime} place={DATA.venue} address={DATA.venueAddress} maps={DATA.venueMaps}/></div></section>
      <Quote>Cada fotografía guarda un recuerdo, y cada recuerdo forma parte de mi historia.</Quote>
      <section className="section"><Title eyebrow="Mis mejores momentos">Galería de fotografías</Title><Carousel/></section>
      <Quote>Deseo que seas parte de este momento que guardaré por siempre en mi corazón.</Quote>
      <section className="section rsvp"><Title eyebrow="RSVP">Confirma tu asistencia</Title><Reveal><div className="card form"><input value={guest} onChange={e=>setGuest(e.target.value)} placeholder="Escribe tu nombre"/><select value={answer} onChange={e=>setAnswer(e.target.value)}><option>Sí, asistiré</option><option>No podré asistir</option></select><a className="whatsapp" href={confirmUrl} target="_blank" rel="noreferrer"><MessageCircle size={19}/>Confirmar por WhatsApp</a><small>Confirmación de prueba al 56 4113 0364.</small></div></Reveal></section>
      <footer><Heart/><h2>{DATA.name}</h2><p>Tu presencia hará que este día sea aún más inolvidable.</p></footer>
    </motion.div>}</AnimatePresence>
  </main>;
}
