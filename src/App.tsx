import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Handshake,
  MapPin,
  QrCode,
  RefreshCw,
  Route,
  ScanLine,
  Sparkles,
  Sprout,
  Stamp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import logo from "./assets/ruta-viva-logo-tight.png";
import { businessesPayload, categoryLabels, dashboard, interestOptions, timeOptions } from "./data";
import { buildRoute, formatRecommendationReason, getCurrentStop, getRecommendations } from "./recommendations";
import type { Business, PassportState } from "./types";

const initialPassport: PassportState = {
  active: false,
  timeMinutes: 90,
  interests: ["vino", "queso", "artesania"],
  generated: false,
};

const storageKey = "ruta-viva-passport-demo";

function App() {
  const [passport, setPassport] = useState<PassportState>(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return initialPassport;
    }

    try {
      return { ...initialPassport, ...JSON.parse(saved) };
    } catch {
      return initialPassport;
    }
  });

  const recommendations = useMemo(
    () => getRecommendations(passport.interests),
    [passport.interests],
  );
  const route = useMemo(() => buildRoute(passport.interests), [passport.interests]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(passport));
  }, [passport]);

  function activatePassport() {
    setPassport((current) => ({ ...current, active: true }));
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleInterest(interest: string) {
    setPassport((current) => {
      const exists = current.interests.includes(interest);
      const interests = exists
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest];

      return {
        ...current,
        interests: interests.length > 0 ? interests : [interest],
        generated: false,
      };
    });
  }

  function resetDemo() {
    setPassport(initialPassport);
  }

  return (
    <div className="app">
      <Header onActivate={activatePassport} />
      <main>
        <Hero onActivate={activatePassport} passport={passport} route={route} />
        <Problem />
        <HowItWorks />
        <Demo
          passport={passport}
          route={route}
          recommendations={recommendations}
          onActivate={activatePassport}
          onReset={resetDemo}
          onGenerate={() => setPassport((current) => ({ ...current, active: true, generated: true }))}
          onTimeChange={(timeMinutes) =>
            setPassport((current) => ({ ...current, timeMinutes, generated: false }))
          }
          onToggleInterest={toggleInterest}
        />
        <Value />
        <Insights />
        <Pilot />
        <ScaleAndTeam />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function Header({ onActivate }: { onActivate: () => void }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Ruta Viva inicio">
        <img src={logo} alt="" />
        <span>Ruta Viva</span>
      </a>
      <nav aria-label="Secciones principales">
        <a href="#demo">Demo</a>
        <a href="#territorio">Territorio</a>
        <a href="#insights">Insights</a>
        <a href="#piloto">Piloto</a>
      </nav>
      <button className="button button-small button-dark" type="button" onClick={onActivate}>
        <QrCode aria-hidden="true" size={17} />
        Activar demo
      </button>
    </header>
  );
}

function Hero({
  onActivate,
  passport,
  route,
}: {
  onActivate: () => void;
  passport: PassportState;
  route: Business[];
}) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <h1>Una visita no termina en un local. Empieza una ruta.</h1>
        <p>
          Ruta Viva conecta sabores, historias y comercios de Gran Canaria en recorridos
          personalizados y medibles.
        </p>
        <div className="hero-actions">
          <button className="button button-primary" type="button" onClick={onActivate}>
            <Stamp aria-hidden="true" size={19} />
            Activar pasaporte demo
          </button>
          <a className="button button-quiet" href="#territorio">
            Ver valor para el territorio
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div className="hero-proof" aria-label="Resumen del piloto">
          <span>90 dias</span>
          <span>15-20 negocios</span>
          <span>Datos agregados</span>
        </div>
      </div>
      <div className="hero-visual" aria-label="Vista previa del pasaporte Ruta Viva">
        <PhoneMock passport={passport} route={route} compact />
        <div className="floating-route" aria-hidden="true">
          <RouteSketch route={route} />
        </div>
      </div>
      <a className="scroll-cue" href="#problema" aria-label="Ir a la siguiente seccion">
        <ChevronDown aria-hidden="true" size={22} />
      </a>
    </section>
  );
}

function Problem() {
  const points = [
    "El visitante llega por una experiencia concreta.",
    "La visita suele terminar en ese establecimiento.",
    "Negocios cercanos pierden el flujo.",
    "El gestor no sabe como se mueve la gente.",
  ];

  return (
    <section className="section problem" id="problema">
      <div className="section-grid">
        <div>
          <p className="section-label">El reto</p>
          <h2>Tenemos rutas. Nos falta activar el siguiente paso.</h2>
        </div>
        <div className="problem-list">
          {points.map((point) => (
            <div className="problem-item" key={point}>
              <Check aria-hidden="true" size={18} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: ScanLine, label: "Escanea" },
    { icon: Stamp, label: "Sella" },
    { icon: Sparkles, label: "Descubre" },
    { icon: Route, label: "Recorre" },
    { icon: BarChart3, label: "Medimos" },
  ];

  return (
    <section className="section flow">
      <div className="flow-line" aria-label="Como funciona Ruta Viva">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div className="flow-step" key={step.label}>
              <span>
                <Icon aria-hidden="true" size={22} />
              </span>
              <strong>{step.label}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Demo({
  passport,
  recommendations,
  route,
  onActivate,
  onReset,
  onGenerate,
  onTimeChange,
  onToggleInterest,
}: {
  passport: PassportState;
  recommendations: Business[];
  route: Business[];
  onActivate: () => void;
  onReset: () => void;
  onGenerate: () => void;
  onTimeChange: (time: number) => void;
  onToggleInterest: (interest: string) => void;
}) {
  const currentStop = getCurrentStop();

  return (
    <section className="section demo-section" id="demo">
      <div className="demo-heading">
        <div>
          <p className="section-label">Demo interactiva</p>
          <h2>QR, sello, preferencias y siguiente parada en menos de 30 segundos.</h2>
        </div>
        <p>
          La demo funciona sin API key ni base de datos. El recomendador solo elige IDs del
          catalogo verificado.
        </p>
      </div>

      <div className="demo-grid">
        <div className="demo-panel">
          <div className="panel-title">
            <QrCode aria-hidden="true" size={20} />
            <span>Escaneo en {currentStop.name}</span>
          </div>
          <PhoneMock passport={passport} route={route} />
        </div>

        <div className="demo-controls">
          <div className="control-block">
            <div className="control-header">
              <span>1</span>
              <strong>Activa tu pasaporte</strong>
            </div>
            <button className="button button-primary full" type="button" onClick={onActivate}>
              <Stamp aria-hidden="true" size={18} />
              {passport.active ? "Primera parada completada" : "Activar pasaporte"}
            </button>
          </div>

          <div className="control-block">
            <div className="control-header">
              <span>2</span>
              <strong>Elige tiempo e intereses</strong>
            </div>
            <div className="segmented" role="group" aria-label="Tiempo disponible">
              {timeOptions.map((time) => (
                <button
                  className={passport.timeMinutes === time ? "selected" : ""}
                  key={time}
                  type="button"
                  onClick={() => onTimeChange(time)}
                >
                  <Clock3 aria-hidden="true" size={15} />
                  {time} min
                </button>
              ))}
            </div>
            <div className="chips" aria-label="Intereses">
              {interestOptions.map((interest) => (
                <button
                  className={passport.interests.includes(interest) ? "selected" : ""}
                  key={interest}
                  type="button"
                  onClick={() => onToggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <div className="control-header">
              <span>3</span>
              <strong>Genera la ruta</strong>
            </div>
            <button className="button button-dark full" type="button" onClick={onGenerate}>
              <Sparkles aria-hidden="true" size={18} />
              Descubrir mi siguiente parada
            </button>
            <button className="reset-button" type="button" onClick={onReset}>
              <RefreshCw aria-hidden="true" size={15} />
              Reiniciar demo
            </button>
          </div>

          <RecommendationList
            generated={passport.generated || passport.active}
            interests={passport.interests}
            recommendations={recommendations}
          />
        </div>

        <div className="map-panel">
          <div className="panel-title">
            <MapPin aria-hidden="true" size={20} />
            <span>Ruta corta accionable</span>
          </div>
          <RouteSketch route={route} large />
          <ol className="route-list">
            {route.map((stop, index) => (
              <li key={stop.id}>
                <span>{index + 1}</span>
                <div>
                  <strong>{stop.name}</strong>
                  <small>
                    {categoryLabels[stop.category]} · {stop.municipality}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PhoneMock({
  passport,
  route,
  compact = false,
}: {
  passport: PassportState;
  route: Business[];
  compact?: boolean;
}) {
  return (
    <div className={`phone ${compact ? "phone-compact" : ""}`}>
      <div className="phone-top">
        <span>Ruta Viva</span>
        <strong>{passport.active ? "1/3 sellos" : "Pasaporte"}</strong>
      </div>
      <div className={`stamp-card ${passport.active ? "is-active" : ""}`}>
        <div className="stamp-ring">
          <Stamp aria-hidden="true" size={compact ? 35 : 42} />
        </div>
        <div>
          <strong>{passport.active ? "Primera parada completada" : "Activa tu pasaporte"}</strong>
          <span>{passport.active ? getCurrentStop().name : "Escanea el QR del local"}</span>
        </div>
      </div>
      <div className="phone-route">
        <span>Sabores y oficios de medianias</span>
        {route.map((stop, index) => (
          <div className="phone-stop" key={stop.id}>
            <i>{index + 1}</i>
            <div>
              <strong>{stop.name}</strong>
              <small>{categoryLabels[stop.category]}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationList({
  generated,
  interests,
  recommendations,
}: {
  generated: boolean;
  interests: string[];
  recommendations: Business[];
}) {
  return (
    <div className="recommendations">
      <div className="panel-title">
        <Sparkles aria-hidden="true" size={20} />
        <span>Recomendacion desde catalogo</span>
      </div>
      {recommendations.slice(0, generated ? 3 : 2).map((business) => (
        <article className="recommendation" key={business.id}>
          <div>
            <strong>{business.name}</strong>
            <span>{business.story}</span>
            <small>{formatRecommendationReason(business, interests)}</small>
          </div>
          <a href={`https://www.openstreetmap.org/?mlat=${business.lat}&mlon=${business.lng}#map=14/${business.lat}/${business.lng}`} target="_blank" rel="noreferrer" aria-label={`Abrir ${business.name} en OpenStreetMap`}>
            <ExternalLink aria-hidden="true" size={16} />
          </a>
        </article>
      ))}
    </div>
  );
}

function RouteSketch({ route, large = false }: { route: Business[]; large?: boolean }) {
  const minLat = Math.min(...route.map((stop) => stop.lat));
  const maxLat = Math.max(...route.map((stop) => stop.lat));
  const minLng = Math.min(...route.map((stop) => stop.lng));
  const maxLng = Math.max(...route.map((stop) => stop.lng));
  const padding = large ? 44 : 32;
  const width = large ? 420 : 320;
  const height = large ? 300 : 230;

  const points = route.map((stop) => {
    const x =
      padding +
      ((stop.lng - minLng) / Math.max(maxLng - minLng, 0.001)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((stop.lat - minLat) / Math.max(maxLat - minLat, 0.001)) * (height - padding * 2);

    return { stop, x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <svg className={`route-sketch ${large ? "route-sketch-large" : ""}`} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mapa esquematico de la ruta">
      <defs>
        <linearGradient id={large ? "routeGradientLarge" : "routeGradient"} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#2d5a27" />
          <stop offset="100%" stopColor="#e06031" />
        </linearGradient>
      </defs>
      <path className="map-contour contour-a" d="M54 86 C86 26 177 24 236 57 C312 99 340 167 297 215 C244 274 119 266 66 212 C26 171 29 128 54 86Z" />
      <path className="map-contour contour-b" d="M94 106 C132 71 204 73 252 103 C286 124 301 171 278 203 C240 253 143 244 99 205 C65 175 65 132 94 106Z" />
      <path className="route-line-shadow" d={path} />
      <path className="route-line" d={path} style={{ stroke: `url(#${large ? "routeGradientLarge" : "routeGradient"})` }} />
      {points.map((point, index) => (
        <g key={point.stop.id}>
          <circle className="route-dot-halo" cx={point.x} cy={point.y} r={large ? 18 : 15} />
          <circle className="route-dot" cx={point.x} cy={point.y} r={large ? 10 : 8} />
          <text x={point.x} y={point.y + 4}>{index + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function Value() {
  const values = [
    {
      icon: Route,
      title: "Mas visitas cruzadas",
      text: "El flujo de un local se convierte en una ruta por negocios cercanos.",
    },
    {
      icon: Sprout,
      title: "Identidad y relato local",
      text: "Cada parada explica por que merece estar dentro del recorrido.",
    },
    {
      icon: BarChart3,
      title: "Datos para decidir campanas",
      text: "La entidad ve intereses, transiciones y puntos con menor flujo.",
    },
  ];

  return (
    <section className="section value" id="territorio">
      <div className="section-heading">
        <p className="section-label">Valor territorial</p>
        <h2>Una capa ligera sobre rutas que ya existen.</h2>
      </div>
      <div className="value-grid">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <article className="value-card" key={value.title}>
              <Icon aria-hidden="true" size={26} />
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Insights() {
  const kpis = [
    ["Escaneos QR", dashboard.qr_scans],
    ["Sellos", dashboard.stamps],
    ["Rutas iniciadas", dashboard.routes_started],
    ["Rutas completadas", dashboard.routes_completed],
  ];

  const bars = [
    { label: "vino", value: 82 },
    { label: "queso", value: 64 },
    { label: "artesania", value: 38 },
    { label: "mercado", value: 46 },
  ];

  return (
    <section className="section insights" id="insights">
      <div className="insights-header">
        <div>
          <p className="section-label">Ruta Viva Insights</p>
          <h2>El gestor no solo ve visitas: ve movimiento.</h2>
        </div>
        <p>{businessesPayload.disclaimer}. {dashboard.disclaimer}.</p>
      </div>
      <div className="insights-grid">
        <div className="kpi-grid">
          {kpis.map(([label, value]) => (
            <div className="kpi" key={label}>
              <strong>{Number(value).toLocaleString("es-ES")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="chart-panel">
          <div className="panel-title">
            <BarChart3 aria-hidden="true" size={20} />
            <span>Intereses elegidos</span>
          </div>
          <div className="bars">
            {bars.map((bar) => (
              <div className="bar-row" key={bar.label}>
                <span>{bar.label}</span>
                <div>
                  <i style={{ width: `${bar.value}%` }} />
                </div>
                <strong>{bar.value}%</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="insight-callout">
          <Handshake aria-hidden="true" size={28} />
          <h3>Alta transicion de vino a queso.</h3>
          <p>Oportunidad: campana conjunta de fin de semana con artesania como tercera parada.</p>
          <small>Categoria con menor flujo: {dashboard.low_flow_category}</small>
        </div>
      </div>
    </section>
  );
}

function Pilot() {
  const items = ["90 dias", "15-20 negocios", "QRs + pasaporte", "Rutas + dashboard", "Informe de impacto"];

  return (
    <section className="section pilot" id="piloto">
      <div className="pilot-offer">
        <div>
          <p className="section-label">Modelo de piloto</p>
          <h2>Piloto de dinamizacion comercial medible.</h2>
          <p>
            Un despliegue pequeno para validar flujo, mantenimiento del catalogo y valor del
            dashboard antes de escalar.
          </p>
        </div>
        <div className="price-block">
          <span>Precio hipotesis</span>
          <strong>4.900 EUR</strong>
          <small>No implica adjudicacion ni retorno garantizado.</small>
        </div>
      </div>
      <div className="pilot-items">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function ScaleAndTeam() {
  const scale = ["Vino y bochinches", "Quesos, mercados y artesania", "ZCA y otras islas"];
  const team = [
    ["Dario Perez", "CEO y producto tecnologico"],
    ["Anna Rodriguez", "Administracion y finanzas"],
    ["Ylenia Perdomo", "Marketing y marca"],
    ["Vicent Icaza", "Operaciones"],
    ["Rafa Nathani", "Ventas y alianzas"],
  ];

  return (
    <section className="section scale-team">
      <div className="scale">
        <p className="section-label">Escalado</p>
        <h2>Entramos por el estomago. Despues recorremos las calles.</h2>
        <div className="timeline">
          {scale.map((item, index) => (
            <div className="timeline-step" key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="team">
        <p className="section-label">Equipo</p>
        <h2>Cinco perfiles para cerrar el ciclo.</h2>
        <div className="team-list">
          {team.map(([name, role]) => (
            <article key={name}>
              <div>{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
              <strong>{name}</strong>
              <span>{role}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <h2>Hagamos que cada visita mueva toda una zona.</h2>
      <a className="button button-primary" href="mailto:ruta@vinosdegrancanaria.es?subject=Piloto%20Ruta%20Viva">
        <Handshake aria-hidden="true" size={19} />
        Quiero pilotar Ruta Viva
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Ruta Viva es nombre provisional.</span>
      <span>Demo de hackaton con datos sinteticos y sin validacion real de visita.</span>
    </footer>
  );
}

export default App;
