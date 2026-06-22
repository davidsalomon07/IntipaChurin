import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MiniFooter from "../components/MiniFooter";

const faqData = {
  pedidos: [
    { q: "¿Cuánto tarda en llegar mi pedido?", a: "Los envíos dentro de Quito tardan entre 1 y 2 días hábiles. A nivel nacional el tiempo estimado es de 3 a 5 días hábiles." },
    { q: "¿Cómo puedo rastrear mi pedido?", a: "Recibirás un correo electrónico con tu código de seguimiento una vez que tu pedido sea despachado." },
    { q: "¿Realizan envíos a todo Ecuador?", a: "Sí, realizamos envíos a nivel nacional a través de nuestros operadores logísticos." }
  ],
  pagos: [
    { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos electrónicos." },
    { q: "¿Mi información de pago está protegida?", a: "Sí. Utilizamos protocolos de seguridad y cifrado SSL para proteger todos tus datos de pago." }
  ],
  tallas: [
    { q: "¿Las prendas son unisex?", a: "Sí. Todas nuestras colecciones están diseñadas sin distinción de género, para cualquier tipo de cuerpo." },
    { q: "¿Cómo elijo mi talla correcta?", a: "Puedes consultar nuestra guía de tallas disponible en la página de cada producto antes de realizar tu compra." }
  ],
  cambios: [
    { q: "¿Puedo cambiar la talla de una prenda?", a: "Sí. Dispones de 30 días calendario desde la recepción del pedido para solicitar un cambio de talla." },
    { q: "¿Puedo devolver una prenda?", a: "Sí, aceptamos devoluciones dentro de los 30 días siguientes a la recepción, siempre que la prenda conserve su estado original con etiquetas." }
  ]
};

// Nombres para mostrar en los badges de búsqueda global
const categoryNames = {
  pedidos: "Pedidos",
  pagos: "Pagos",
  tallas: "Tallas",
  cambios: "Cambios"
};

// Íconos SVG por categoría (sin emojis)
const categoryIcons = {
  pedidos: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  pagos: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  tallas: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 6H3a2 2 0 00-2 2v8a2 2 0 002 2h18a2 2 0 002-2V8a2 2 0 00-2-2z"/>
      <line x1="7" y1="6" x2="7" y2="10"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="17" y1="6" x2="17" y2="10"/>
    </svg>
  ),
  cambios: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
    </svg>
  )
};

// ============================================================
// CONFIGURACIÓN DE CONTACTO — edita solo estos valores
// WhatsApp: número en formato internacional sin + ni espacios
//           Ecuador → 593 + número sin el 0 inicial
//           Ej: si tu número es 0991234567 → "593991234567"
// Email: tu correo de soporte
// ============================================================
const WHATSAPP_NUMBER  = "593XXXXXXXXX";
const WHATSAPP_MESSAGE = "Hola, necesito ayuda con un pedido en Intipa Churin.";
const SUPPORT_EMAIL    = "soporte@intipachurin.com";
const EMAIL_SUBJECT    = "Consulta — Intipa Churin";

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState("pedidos");
  const [openIndex, setOpenIndex]           = useState(null);
  const [search, setSearch]                 = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Resetea el acordeón al cambiar categoría o al buscar
  useEffect(() => { setOpenIndex(null); }, [activeCategory, search]);

  const isSearching = search.trim().length > 0;

  // [CAMBIO] Búsqueda global: recorre todas las categorías
  const displayedFaqs = isSearching
    ? Object.entries(faqData).flatMap(([cat, items]) =>
        items
          .filter(faq =>
            faq.q.toLowerCase().includes(search.toLowerCase()) ||
            faq.a.toLowerCase().includes(search.toLowerCase())
          )
          .map(faq => ({ ...faq, cat }))
      )
    : faqData[activeCategory].map(faq => ({ ...faq, cat: activeCategory }));

  // Handlers de contacto
  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEmail = () => {
    window.location.href =
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`;
  };

  return (
    <>
      <Navbar backButton={true} />

      <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen pt-32 pb-20 transition-colors duration-300">
        <section className="max-w-3xl mx-auto px-6">

          {/* HERO */}
          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.3em] text-xs text-zinc-400 dark:text-zinc-500 mb-4 font-medium">
              Centro de Ayuda
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 text-zinc-900 dark:text-white tracking-tight">
              ¿En qué podemos ayudarte?
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto text-[15px]">
              Encuentra respuestas sobre pedidos, pagos, tallas y devoluciones.
            </p>
          </div>

          {/* BUSCADOR GLOBAL */}
          <div className="relative mb-12">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar entre todas las preguntas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-white dark:bg-zinc-900
                border border-zinc-200 dark:border-zinc-800
                rounded-2xl
                pl-12 pr-10 py-4
                text-zinc-900 dark:text-white
                placeholder-zinc-400 dark:placeholder-zinc-600
                focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600
                transition-colors duration-200 shadow-sm text-sm
              "
            />
            {isSearching && (
              <button
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* CATEGORÍAS — se ocultan al buscar */}
          {!isSearching && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {Object.entries(categoryIcons).map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`
                    faq-category rounded-2xl border p-5
                    flex flex-col items-start gap-3
                    text-left text-sm font-semibold
                    transition-all duration-200
                    ${activeCategory === key
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-md"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    }
                  `}
                >
                  <span className="opacity-60">{icon}</span>
                  {categoryNames[key]}
                </button>
              ))}
            </div>
          )}

          {/* HEADER RESULTADOS DE BÚSQUEDA */}
          {isSearching && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
              {displayedFaqs.length === 0
                ? <>Sin resultados para <span className="font-semibold text-zinc-900 dark:text-white">"{search}"</span></>
                : <>{displayedFaqs.length} resultado{displayedFaqs.length !== 1 ? "s" : ""} para <span className="font-semibold text-zinc-900 dark:text-white">"{search}"</span></>
              }
            </p>
          )}

          {/* ACORDEÓN */}
          <div className="space-y-2 mb-14">
            {displayedFaqs.length === 0 ? (
              <div className="faq-glass rounded-2xl p-10 text-center">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  No encontramos resultados.{" "}
                  <button
                    onClick={handleWhatsApp}
                    className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Contáctanos directamente
                  </button>
                  .
                </p>
              </div>
            ) : (
              displayedFaqs.map((faq, index) => (
                <div
                  key={`${faq.cat}-${index}`}
                  className="faq-accordion border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/60"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Badge de categoría — solo visible al buscar */}
                      {isSearching && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                          {categoryNames[faq.cat]}
                        </span>
                      )}
                      <span className="font-medium text-zinc-900 dark:text-white text-[15px] leading-snug">
                        {faq.q}
                      </span>
                    </div>

                    {/* Botón + que rota a × al abrir */}
                    <span className={`
                      shrink-0 w-6 h-6 rounded-full border flex items-center justify-center
                      transition-all duration-300
                      ${openIndex === index
                        ? "border-zinc-900 bg-zinc-900 dark:border-white dark:bg-white"
                        : "border-zinc-200 dark:border-zinc-700 bg-transparent"
                      }
                    `}>
                      <svg
                        width="10" height="10"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        className={`
                          transition-transform duration-300
                          ${openIndex === index
                            ? "rotate-45 text-white dark:text-zinc-900"
                            : "text-zinc-500 dark:text-zinc-400"
                          }
                        `}
                        viewBox="0 0 24 24"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </span>
                  </button>

                  {/* Respuesta con animación de altura */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: openIndex === index ? "300px" : "0px" }}
                  >
                    <div className="px-6 pb-5 text-zinc-500 dark:text-zinc-400 text-[14px] leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SECCIÓN DE SOPORTE */}
          <div className="faq-glass rounded-3xl p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                  ¿No encontraste lo que buscabas?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Nuestro equipo responde en menos de 24 horas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* BOTÓN WHATSAPP */}
                <button
                  onClick={handleWhatsApp}
                  className="
                    flex items-center justify-center gap-2
                    bg-zinc-900 dark:bg-white
                    text-white dark:text-zinc-900
                    px-6 py-3.5 rounded-xl
                    text-sm font-semibold
                    hover:bg-zinc-700 dark:hover:bg-zinc-200
                    transition-all duration-200 shadow-sm
                    whitespace-nowrap
                  "
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>

                {/* BOTÓN EMAIL */}
                <button
                  onClick={handleEmail}
                  className="
                    flex items-center justify-center gap-2
                    border border-zinc-200 dark:border-zinc-700
                    bg-white dark:bg-transparent
                    text-zinc-700 dark:text-zinc-300
                    px-6 py-3.5 rounded-xl
                    text-sm font-semibold
                    hover:border-zinc-400 dark:hover:border-zinc-500
                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                    transition-all duration-200
                    whitespace-nowrap
                  "
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Enviar correo
                </button>
              </div>
            </div>
          </div>

        </section>
      </div>

      <MiniFooter />
    </>
  );
}