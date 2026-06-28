import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; // Agregado
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Terms from './pages/Terms';
import Faq from './pages/Faq';
import Shipping from './pages/Shipping';
import Privacy from './pages/Privacy';
import Shop from './pages/Shop';
import UserProfile from './pages/UserProfile';
import Lookbook from './pages/Lookbook';
import Wishlist from './pages/Wishlist'; // Agregado
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Guide from './pages/Guide';
import Contact from './pages/Contact';
import Membership from './pages/Membership';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              {/* ✅ NUEVO: se agregó "w-full overflow-x-hidden" para contener todo el layout */}
              <div className="bg-fog-white dark:bg-zinc-950 min-h-screen w-full overflow-x-hidden text-fog-black dark:text-zinc-50 font-sans selection:bg-fog-gray transition-colors duration-300">
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: '#ffffff',
                      color: '#0e1014',
                      border: '1px solid #e5e7eb',
                      borderRadius: '1rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                      padding: '16px 24px',
                    },
                    success: {
                      iconTheme: {
                        primary: '#0e1014',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fee2e2',
                      },
                      iconTheme: {
                        primary: '#dc2626',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:category" element={<Shop />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/lookbook" element={<Lookbook />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/shop/producto/:id" element={<ProductDetail />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/cancel" element={<Cancel />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/membership" element={<Membership />} />
                </Routes>
                <WhatsAppButton />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;