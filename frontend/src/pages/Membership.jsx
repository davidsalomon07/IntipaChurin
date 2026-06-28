import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';

// Iconos locales SVG
const CheckBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
);

const CrownLargeIcon = () => (
  <svg className="w-12 h-12 text-amber-500 animate-pulse" viewBox="0 0 100 100" fill="currentColor">
    <circle cx="15" cy="30" r="6" />
    <circle cx="50" cy="13" r="6" />
    <circle cx="85" cy="30" r="6" />
    <path d="M 22 70 C 20 70, 16 65, 15 57 L 11 44 C 10 40, 14 38, 17 41 L 30 50 C 32 51, 35 50, 36 48 L 47 28 C 48 25, 52 25, 53 28 L 64 48 C 65 50, 68 51, 70 50 L 83 41 C 86 38, 90 40, 89 44 L 85 57 C 84 65, 80 70, 78 70 Z" />
    <rect x="22" y="78" width="56" height="10" rx="5" />
  </svg>
);

const ArrowBackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const Membership = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/usuarios/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const freshData = await res.json();
          setUser(freshData);
          // Actualizar localStorage para que todo el sitio refleje cambios de VIP de inmediato
          localStorage.setItem('user', JSON.stringify({
            ...JSON.parse(storedUser),
            is_vip: freshData.is_vip
          }));
        } else {
          // Si el token expiró o falló
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error("Error al obtener perfil fresco:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      // Redirigir al login con retorno seguro
      navigate('/login?redirect=/membership');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/checkout-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo generar la sesión de pago.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Error al iniciar pasarela de Stripe.');
      }
    } catch (err) {
      toast.error(err.message || 'Error de conexión.');
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatFecha = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const faqs = [
    {
      q: "¿Cómo funciona el descuento del 15%?",
      a: "Una vez que te suscribes a la membresía VIP, el descuento del 15% se aplicará automáticamente en el total de tu carrito de compras cada vez que inicies sesión. No necesitas ingresar ningún cupón."
    },
    {
      q: "¿En qué consiste el envío gratis?",
      a: "Como socio VIP, todos tus pedidos tendrán la opción de 'Envío VIP Gratis' al momento de pagar, sin importar el monto mínimo de tu compra ni tu ubicación dentro del territorio chileno."
    },
    {
      q: "¿Puedo cancelar mi membresía en cualquier momento?",
      a: "Sí, totalmente. No tenemos cláusulas de permanencia ni contratos a largo plazo. Puedes gestionar o solicitar la cancelación de tu renovación desde tu perfil de usuario o contactando a nuestro soporte."
    },
    {
      q: "¿Cuál es el valor y método de facturación?",
      a: "La membresía tiene un costo único mensual de $5.00 USD (facturados en pesos chilenos según la conversión del día por Stripe). Se renueva automáticamente cada 30 días de forma segura."
    }
  ];

  return (
    <div className="bg-[#FCFCFC] dark:bg-[#0a0a0a] min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 pb-20 transition-colors duration-300">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 h-20 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center relative">
          <Link to="/" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest z-10">
            <ArrowBackIcon />
            Volver
          </Link>
          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 pointer-events-none dark:text-white">
            Intipa Churin
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-6 pt-36">
        
        {/* CABECERA */}
        <div className="text-center mb-16 animate-[fadeInUp_0.6s_ease-out]">
          <span className="text-amber-600 dark:text-amber-400 text-xs font-bold tracking-[0.25em] uppercase">
            Beneficios Exclusivos
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 mb-4 text-zinc-900 dark:text-white leading-tight">
            Membresía Intipa VIP
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-xl mx-auto font-light">
            Únete hoy a nuestro club de socios VIP y comienza a disfrutar de envíos gratis, descuentos del 15% automáticos y acceso prioritario.
          </p>
        </div>

        {loading ? (
          /* SKELETON LOAD */
          <div className="faq-glass rounded-3xl p-12 h-96 flex items-center justify-center animate-pulse">
            <div className="text-zinc-400 dark:text-zinc-600 font-medium">Cargando detalles de membresía...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
            
            {/* COLUMNA IZQUIERDA: TARJETA 3D E INFORMACIÓN */}
            <div className="md:col-span-7 space-y-8 animate-[fadeInUp_0.8s_ease-out]">
              
              {/* Ilustración de Tarjeta VIP */}
              <div className="relative rounded-3xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-850 p-8 border border-amber-500/20 shadow-2xl overflow-hidden aspect-[1.6/1] flex flex-col justify-between group">
                <div className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -top-20 -right-20"></div>
                
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[10px] tracking-widest text-amber-500 font-bold uppercase">Intipa Churin</p>
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mt-1">VIP MEMBER</h3>
                  </div>
                  <CrownLargeIcon />
                </div>
                
                <div className="z-10 flex justify-between items-end">
                  <div>
                    <p className="text-[8px] text-zinc-400 uppercase tracking-widest">Socio Premium</p>
                    {user ? (
                      <p className="text-sm font-semibold text-white mt-1 uppercase tracking-wider">{user.first_name} {user.last_name}</p>
                    ) : (
                      <p className="text-sm font-semibold text-zinc-500 mt-1 uppercase tracking-wider">Invitado</p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
                    ACTIVO
                  </span>
                </div>
              </div>

              {/* Lista de beneficios expandidos */}
              <div className="faq-glass rounded-3xl p-8 space-y-6">
                <h3 className="text-lg font-bold dark:text-white">Beneficios del Club VIP</h3>
                
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-amber-500/10 rounded-xl shrink-0">
                    <CheckBadgeIcon />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold dark:text-white">15% de Descuento en Todo</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                      Se aplica automáticamente en el Checkout al procesar tus productos sin importar la temporada ni promociones activas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-amber-500/10 rounded-xl shrink-0">
                    <CheckBadgeIcon />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold dark:text-white">Envíos Gratis Sin Mínimos</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                      Compra desde una prenda unitaria y recíbela en tu domicilio en cualquier parte del país sin pagar costo de despacho extra.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-amber-500/10 rounded-xl shrink-0">
                    <CheckBadgeIcon />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold dark:text-white">Acceso Prioritario (Early Access)</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                      Te daremos acceso exclusivo a nuevos drops y colecciones de edición limitada 24 horas antes que el resto del público.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA: TRIGGERS DE PAGO */}
            <div className="md:col-span-5 space-y-6 animate-[fadeInUp_1s_ease-out]">
              
              <div className="faq-glass rounded-3xl p-8 border border-amber-500/20 shadow-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Suscripción Mensual</span>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$5.00</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm font-light"> USD / mes</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                    Suscripción recurrente mensual. Sin plazos forzosos. Cancela online de manera simple en cualquier momento.
                  </p>
                </div>

                {user?.is_vip ? (
                  /* YA ES VIP */
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">¡Membresía Activa!</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                      Socio VIP desde el {formatFecha(user.membership_start)}<br />
                      Caduca el {formatFecha(user.membership_end)}
                    </p>
                    <Link to="/profile" className="w-full block bg-zinc-950 text-white dark:bg-white dark:text-black py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                      Ir a mi Perfil
                    </Link>
                  </div>
                ) : (
                  /* NO ES VIP O INVITADO */
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full py-4 bg-zinc-950 text-white dark:bg-white dark:text-black rounded-2xl text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <span>Procesando pasarela...</span>
                    ) : user ? (
                      <span>Adquirir Membresía</span>
                    ) : (
                      <span>Iniciar Sesión para Adquirir</span>
                    )}
                  </button>
                )}
              </div>

              {/* Garantía de Seguridad */}
              <div className="faq-glass rounded-2xl p-5 flex gap-4 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-zinc-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <div className="text-left">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider dark:text-white">Pago Seguro 100% cifrado</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Procesado exclusivamente por Stripe. No almacenamos tus credenciales bancarias.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* PREGUNTAS FRECUENTES (FAQ) */}
        <section className="mt-20 border-t border-zinc-100 dark:border-zinc-800 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold dark:text-white">Preguntas Frecuentes</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Dudas habituales sobre la suscripción VIP</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-glass rounded-2xl border border-zinc-200/50 dark:border-zinc-800 overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-zinc-50/50 dark:hover:bg-white/[0.01]"
                >
                  <span className="text-sm font-semibold dark:text-white">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === i ? 'max-h-40 border-t border-zinc-100 dark:border-zinc-800' : 'max-h-0'}`}
                >
                  <p className="p-6 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 font-light bg-zinc-50/20 dark:bg-black/10">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Membership;
