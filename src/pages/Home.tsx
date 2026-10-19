import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Region = "Africa" | "Americas" | "Europe" | "Asia" | "Oceania";
type RegionFilter = "All" | Region;
type DayFilter = "Any" | "Day" | "Night";

interface Country {
  name: string;
  timeZone: string;
  region: Region;
}

// Format: "Country|IANA time zone" (capital or main zone)
const rawData: Record<Region, string> = {
  Africa: `Algeria|Africa/Algiers
Angola|Africa/Luanda
Benin|Africa/Porto-Novo
Botswana|Africa/Gaborone
Burkina Faso|Africa/Ouagadougou
Burundi|Africa/Bujumbura
Cabo Verde|Atlantic/Cape_Verde
Cameroon|Africa/Douala
Central African Republic|Africa/Bangui
Chad|Africa/Ndjamena
Comoros|Indian/Comoro
Congo (DRC)|Africa/Kinshasa
Congo (Republic)|Africa/Brazzaville
Côte d'Ivoire|Africa/Abidjan
Djibouti|Africa/Djibouti
Egypt|Africa/Cairo
Equatorial Guinea|Africa/Malabo
Eritrea|Africa/Asmara
Eswatini|Africa/Mbabane
Ethiopia|Africa/Addis_Ababa
Gabon|Africa/Libreville
Gambia|Africa/Banjul
Ghana|Africa/Accra
Guinea|Africa/Conakry
Guinea-Bissau|Africa/Bissau
Kenya|Africa/Nairobi
Lesotho|Africa/Maseru
Liberia|Africa/Monrovia
Libya|Africa/Tripoli
Madagascar|Indian/Antananarivo
Malawi|Africa/Blantyre
Mali|Africa/Bamako
Mauritania|Africa/Nouakchott
Mauritius|Indian/Mauritius
Morocco|Africa/Casablanca
Mozambique|Africa/Maputo
Namibia|Africa/Windhoek
Niger|Africa/Niamey
Nigeria|Africa/Lagos
Rwanda|Africa/Kigali
São Tomé and Príncipe|Africa/Sao_Tome
Senegal|Africa/Dakar
Seychelles|Indian/Mahe
Sierra Leone|Africa/Freetown
Somalia|Africa/Mogadishu
South Africa|Africa/Johannesburg
South Sudan|Africa/Juba
Sudan|Africa/Khartoum
Tanzania|Africa/Dar_es_Salaam
Togo|Africa/Lome
Tunisia|Africa/Tunis
Uganda|Africa/Kampala
Zambia|Africa/Lusaka
Zimbabwe|Africa/Harare`,
  Americas: `Antigua and Barbuda|America/Antigua
Argentina|America/Argentina/Buenos_Aires
Bahamas|America/Nassau
Barbados|America/Barbados
Belize|America/Belize
Bolivia|America/La_Paz
Brazil|America/Sao_Paulo
Canada|America/Toronto
Chile|America/Santiago
Colombia|America/Bogota
Costa Rica|America/Costa_Rica
Cuba|America/Havana
Dominica|America/Dominica
Dominican Republic|America/Santo_Domingo
Ecuador|America/Guayaquil
El Salvador|America/El_Salvador
Grenada|America/Grenada
Guatemala|America/Guatemala
Guyana|America/Guyana
Haiti|America/Port-au-Prince
Honduras|America/Tegucigalpa
Jamaica|America/Jamaica
Mexico|America/Mexico_City
Nicaragua|America/Managua
Panama|America/Panama
Paraguay|America/Asuncion
Peru|America/Lima
Saint Kitts and Nevis|America/St_Kitts
Saint Lucia|America/St_Lucia
Saint Vincent and the Grenadines|America/St_Vincent
Suriname|America/Paramaribo
Trinidad and Tobago|America/Port_of_Spain
USA|America/New_York
Uruguay|America/Montevideo
Venezuela|America/Caracas`,
  Europe: `Albania|Europe/Tirane
Andorra|Europe/Andorra
Austria|Europe/Vienna
Belarus|Europe/Minsk
Belgium|Europe/Brussels
Bosnia and Herzegovina|Europe/Sarajevo
Bulgaria|Europe/Sofia
Croatia|Europe/Zagreb
Cyprus|Europe/Nicosia
Czechia|Europe/Prague
Denmark|Europe/Copenhagen
Estonia|Europe/Tallinn
Finland|Europe/Helsinki
France|Europe/Paris
Germany|Europe/Berlin
Greece|Europe/Athens
Hungary|Europe/Budapest
Iceland|Atlantic/Reykjavik
Ireland|Europe/Dublin
Italy|Europe/Rome
Kosovo|Europe/Belgrade
Latvia|Europe/Riga
Liechtenstein|Europe/Vaduz
Lithuania|Europe/Vilnius
Luxembourg|Europe/Luxembourg
Malta|Europe/Malta
Moldova|Europe/Chisinau
Monaco|Europe/Monaco
Montenegro|Europe/Podgorica
Netherlands|Europe/Amsterdam
North Macedonia|Europe/Skopje
Norway|Europe/Oslo
Poland|Europe/Warsaw
Portugal|Europe/Lisbon
Romania|Europe/Bucharest
Russia|Europe/Moscow
San Marino|Europe/San_Marino
Serbia|Europe/Belgrade
Slovakia|Europe/Bratislava
Slovenia|Europe/Ljubljana
Spain|Europe/Madrid
Sweden|Europe/Stockholm
Switzerland|Europe/Zurich
Ukraine|Europe/Kiev
United Kingdom|Europe/London
Vatican City|Europe/Vatican`,
  Asia: `Afghanistan|Asia/Kabul
Armenia|Asia/Yerevan
Azerbaijan|Asia/Baku
Bahrain|Asia/Bahrain
Bangladesh|Asia/Dhaka
Bhutan|Asia/Thimphu
Brunei|Asia/Brunei
Cambodia|Asia/Phnom_Penh
China|Asia/Shanghai
Georgia|Asia/Tbilisi
India|Asia/Kolkata
Indonesia|Asia/Jakarta
Iran|Asia/Tehran
Iraq|Asia/Baghdad
Israel|Asia/Jerusalem
Japan|Asia/Tokyo
Jordan|Asia/Amman
Kazakhstan|Asia/Almaty
Kuwait|Asia/Kuwait
Kyrgyzstan|Asia/Bishkek
Laos|Asia/Vientiane
Lebanon|Asia/Beirut
Malaysia|Asia/Kuala_Lumpur
Maldives|Indian/Maldives
Mongolia|Asia/Ulaanbaatar
Myanmar|Asia/Yangon
Nepal|Asia/Kathmandu
North Korea|Asia/Pyongyang
Oman|Asia/Muscat
Pakistan|Asia/Karachi
Palestine|Asia/Gaza
Philippines|Asia/Manila
Qatar|Asia/Qatar
Saudi Arabia|Asia/Riyadh
Singapore|Asia/Singapore
South Korea|Asia/Seoul
Sri Lanka|Asia/Colombo
Syria|Asia/Damascus
Taiwan|Asia/Taipei
Tajikistan|Asia/Dushanbe
Thailand|Asia/Bangkok
Timor-Leste|Asia/Dili
Turkey|Europe/Istanbul
Turkmenistan|Asia/Ashgabat
UAE|Asia/Dubai
Uzbekistan|Asia/Tashkent
Vietnam|Asia/Ho_Chi_Minh
Yemen|Asia/Aden`,
  Oceania: `Australia|Australia/Sydney
Fiji|Pacific/Fiji
Kiribati|Pacific/Tarawa
Marshall Islands|Pacific/Majuro
Micronesia|Pacific/Pohnpei
Nauru|Pacific/Nauru
New Zealand|Pacific/Auckland
Palau|Pacific/Palau
Papua New Guinea|Pacific/Port_Moresby
Samoa|Pacific/Apia
Solomon Islands|Pacific/Guadalcanal
Tonga|Pacific/Tongatapu
Tuvalu|Pacific/Funafuti
Vanuatu|Pacific/Efate`,
};

const countries: Country[] = (Object.keys(rawData) as Region[])
  .flatMap((region) =>
    rawData[region].split("\n").map((line) => {
      const [name, timeZone] = line.split("|");
      return { name, timeZone, region };
    })
  )
  .sort((a, b) => a.name.localeCompare(b.name));

const regionFilters: RegionFilter[] = ["All", "Africa", "Americas", "Europe", "Asia", "Oceania"];
const dayFilters: DayFilter[] = ["Any", "Day", "Night"];
const defaultPinned = ["Nigeria", "USA", "United Kingdom", "UAE", "Japan", "Australia"];

/* ---------- Time helpers (formatters are cached for speed) ---------- */

const partsCache = new Map<string, Intl.DateTimeFormat>();
const dateCache = new Map<string, Intl.DateTimeFormat>();

function getParts(date: Date, timeZone: string) {
  let f = partsCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23",
      timeZoneName: "shortOffset",
    });
    partsCache.set(timeZone, f);
  }
  const parts = f.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    h: Number(get("hour")) % 24,
    m: Number(get("minute")),
    s: Number(get("second")),
    offset: get("timeZoneName"),
  };
}

function getDateText(date: Date, timeZone: string) {
  let f = dateCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    dateCache.set(timeZone, f);
  }
  return f.format(date);
}

const pad = (n: number) => String(n).padStart(2, "0");

function format12(h: number, m: number, s: number) {
  const h12 = h % 12 || 12;
  return `${pad(h12)}:${pad(m)}:${pad(s)} ${h >= 12 ? "PM" : "AM"}`;
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ---------- Fade-in animation using only Tailwind classes ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay + 20);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Big analog clock (for pinned countries) ---------- */

function AnalogClock({ country, now }: { country: Country; now: Date }) {
  const { h, m, s, offset } = getParts(now, country.timeZone);
  const secondDeg = Math.floor(now.getTime() / 1000) * 6;
  const minuteDeg = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;
  const isDay = h >= 6 && h < 18;
  const gradientId = `face-${country.name.replace(/[^a-zA-Z]/g, "")}`;

  return (
    <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.4)]">
      <div className="mb-4 flex items-center justify-between text-left">
        <div>
          <h3 className="text-lg font-semibold text-white">{country.name}</h3>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {country.region} · {offset}
          </p>
        </div>
        <span className="text-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">
          {isDay ? "☀️" : "🌙"}
        </span>
      </div>

      <svg
        viewBox="0 0 200 200"
        className="mx-auto w-full max-w-[200px] transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0b1120" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="96" fill="#22d3ee" opacity="0.15" />
        <circle cx="100" cy="100" r="92" fill={`url(#${gradientId})`} stroke="#22d3ee" strokeWidth="2" />

        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1={isHour ? 10 : 12}
              x2="100"
              y2={isHour ? 22 : 17}
              stroke={isHour ? "#e2e8f0" : "#64748b"}
              strokeWidth={isHour ? 2.5 : 1}
              transform={`rotate(${i * 6} 100 100)`}
            />
          );
        })}

        <line
          x1="100" y1="100" x2="100" y2="58"
          stroke="#f8fafc" strokeWidth="5" strokeLinecap="round"
          style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: "100px 100px" }}
        />
        <line
          x1="100" y1="100" x2="100" y2="36"
          stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round"
          style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: "100px 100px" }}
        />
        <line
          x1="100" y1="115" x2="100" y2="26"
          stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"
          style={{
            transform: `rotate(${secondDeg}deg)`,
            transformOrigin: "100px 100px",
            transition: "transform 0.4s cubic-bezier(0.4, 2.2, 0.5, 1)",
          }}
        />
        <circle cx="100" cy="100" r="5" fill="#22d3ee" />
        <circle cx="100" cy="100" r="2" fill="#0b1120" />
      </svg>

      <p className="mt-4 font-mono text-xl font-semibold tracking-wider text-white">
        {format12(h, m, s)}
      </p>
      <p className="text-sm text-slate-400">{getDateText(now, country.timeZone)}</p>
    </div>
  );
}

/* ---------- Compact card (for every country) ---------- */

function CountryCard({
  country,
  now,
  pinned,
  onTogglePin,
}: {
  country: Country;
  now: Date;
  pinned: boolean;
  onTogglePin: () => void;
}) {
  const { h, m, s, offset } = getParts(now, country.timeZone);
  const isDay = h >= 6 && h < 18;

  return (
    <div
      className={`group flex items-center justify-between rounded-2xl border p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20 ${
        pinned
          ? "border-cyan-400/50 bg-cyan-400/10"
          : "border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-white/10"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span>{isDay ? "☀️" : "🌙"}</span>
          <h3 className="truncate font-semibold text-white">{country.name}</h3>
        </div>
        <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-cyan-300">
          {format12(h, m, s)}
        </p>
        <p className="text-xs text-slate-400">
          {getDateText(now, country.timeZone)} · {offset}
        </p>
      </div>
      <button
        onClick={onTogglePin}
        title={pinned ? "Unpin clock" : "Pin as big clock"}
        className={`ml-3 rounded-full p-2 text-xl transition-all duration-300 hover:scale-125 ${
          pinned ? "text-yellow-300" : "text-slate-500 hover:text-yellow-300"
        }`}
      >
        {pinned ? "★" : "☆"}
      </button>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Home() {
  const now = useNow();
  const [region, setRegion] = useState<RegionFilter>("All");
  const [dayFilter, setDayFilter] = useState<DayFilter>("Any");
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState<string[]>(defaultPinned);

  const togglePin = (name: string) =>
    setPinned((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const local = {
    time: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(now),
    date: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now),
  };

  const filtered = countries.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesRegion = region === "All" || c.region === region;
    const matchesSearch = q === "" || c.name.toLowerCase().includes(q);
    const { h } = getParts(now, c.timeZone);
    const isDay = h >= 6 && h < 18;
    const matchesDay = dayFilter === "Any" || (dayFilter === "Day" ? isDay : !isDay);
    return matchesRegion && matchesSearch && matchesDay;
  });

  const pinnedCountries = pinned
    .map((name) => countries.find((c) => c.name === name))
    .filter((c): c is Country => Boolean(c));

  const pillBase = "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300";
  const pillActive =
    "scale-105 bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-lg shadow-cyan-500/30";
  const pillIdle =
    "border border-white/15 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:bg-white/10 hover:text-white";

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #082f49 100%)" }}
    >
      {/* Glowing background shapes (Tailwind's built-in pulse) */}
      <div className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-cyan-500/30 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-1/3 h-[28rem] w-[28rem] animate-pulse rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 left-1/3 h-96 w-96 animate-pulse rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="relative z-10">
        {/* Navbar */}
        <Reveal>
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2 text-xl font-bold tracking-wide">
              <span className="text-2xl">🌍</span>
              <span>
                Chrono<span className="text-cyan-400">Globe</span>
              </span>
            </div>
            <Link
              to="/signin"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition-all duration-300 hover:border-cyan-400 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Log out
            </Link>
          </nav>
        </Reveal>

        {/* Hero */}
        <header className="mx-auto max-w-4xl px-6 pb-12 pt-10 text-center">
          <Reveal delay={100}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              Live World Time · {countries.length} Countries
            </p>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
              One World.{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(90deg, #22d3ee, #818cf8, #e879f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Every Moment.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
              Live time for every country on Earth. Search, filter, and pin
              the places that matter to you.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="mx-auto mt-10 inline-block rounded-3xl border border-white/10 bg-white/5 px-10 py-6 backdrop-blur-md transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.4)]">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Your local time</p>
              <p className="mt-2 font-mono text-5xl font-bold tracking-wider sm:text-6xl">
                {local.time}
              </p>
              <p className="mt-2 text-slate-300">{local.date}</p>
            </div>
          </Reveal>
        </header>

        {/* Pinned analog clocks */}
        <section className="mx-auto max-w-7xl px-6 pb-14">
          <Reveal delay={500}>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold">⭐ Pinned Clocks</h2>
              <p className="text-sm text-slate-400">Pin any country with the ☆ below</p>
            </div>
          </Reveal>

          {pinnedCountries.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pinnedCountries.map((c, i) => (
                <Reveal key={c.name} delay={Math.min(i, 8) * 80}>
                  <AnalogClock country={c} now={now} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 py-12 text-center text-slate-400">
              Nothing pinned yet. Click ☆ on any country below.
            </div>
          )}
        </section>

        {/* Filters */}
        <section className="mx-auto max-w-7xl px-6 pb-8">
          <Reveal delay={600}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {regionFilters.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      className={`${pillBase} ${region === r ? pillActive : pillIdle}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-1 rounded-full border border-white/15 bg-white/5 p-1">
                    {dayFilters.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDayFilter(d)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                          dayFilter === d
                            ? "bg-cyan-400 text-slate-900"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {d === "Day" ? "☀️ Day" : d === "Night" ? "🌙 Night" : "Any"}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country..."
                    className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 sm:w-64"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* All countries */}
        <main className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">All Countries</h2>
            <p className="text-sm text-slate-400">
              Showing {filtered.length} of {countries.length}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div
              key={`${region}-${dayFilter}`}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((c, i) => (
                <Reveal key={c.name} delay={Math.min(i, 12) * 40}>
                  <CountryCard
                    country={c}
                    now={now}
                    pinned={pinned.includes(c.name)}
                    onTogglePin={() => togglePin(c.name)}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 py-20 text-center">
              <p className="text-5xl">🕰️</p>
              <p className="mt-4 text-lg text-slate-300">No countries match your filters.</p>
              <button
                onClick={() => {
                  setRegion("All");
                  setDayFilter("Any");
                  setSearch("");
                }}
                className="mt-4 rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300"
              >
                Reset filters
              </button>
            </div>
          )}
        </main>

        <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ChronoGlobe. All rights reserved. By GHOSTED
        </footer>
      </div>
    </div>
  );
}