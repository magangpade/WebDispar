import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Eye, EyeOff, MapPin } from 'lucide-react';
import api from '../../services/api';
import './admin.css';
import { EASE, SCALE, SPRING } from './adminMotion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.classList.add('admin-active');
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/portal-internal-dispar/dashboard', { replace: true });
    }
    return () => {
      document.body.classList.remove('admin-active');
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/portal-internal-dispar/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="admin-scope admin-login-view">
        <div className="admin-login-band" aria-hidden="true" />

        <motion.span
          className="admin-login-tag t1"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE.out }}
        >
          Patung Megalit, Poso
        </motion.span>
        <motion.span
          className="admin-login-tag t2"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: EASE.out }}
        >
          Bukit Selena, Palu
        </motion.span>
        <motion.span
          className="admin-login-tag t3"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: EASE.out }}
        >
          Danau Paisupok, Banggai
        </motion.span>

        <motion.form
          className="admin-login-card"
          onSubmit={handleSubmit}
          autoComplete="off"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: EASE.out }}
        >
          <div className="admin-login-logo">
            <MapPin style={{ width: 24, height: 24 }} />
          </div>
          <h1>Admin Panel</h1>
          <p className="admin-login-sub">Dinas Pariwisata Provinsi Sulawesi Tengah</p>

          {error && (
            <div className="admin-login-error" role="alert">
              <AlertCircle className="ic-sm" />
              <span>{error}</span>
            </div>
          )}

          <div className="admin-login-field">
            <label htmlFor="loginUser">Username</label>
            <div className="admin-field-wrap">
              <input
                id="loginUser"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="loginPass">Password</label>
            <div className="admin-field-wrap">
              <input
                id="loginPass"
                type={showPass ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-eye-btn"
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? <EyeOff className="ic" /> : <Eye className="ic" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="admin-btn-login"
            whileTap={reduce ? undefined : { scale: SCALE.press }}
            transition={SPRING.press}
          >
            {loading ? 'Memverifikasi...' : 'Login'}
          </motion.button>

          <p className="admin-login-hint">
            Portal Internal CMS — Masuk dengan akun administrator resmi.
          </p>

          <div style={{ textAlign: 'center' }}>
            <Link to="/" className="admin-login-back">
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Kembali ke Beranda Publik</span>
            </Link>
          </div>
        </motion.form>
      </div>
    </MotionConfig>
  );
};

export default Login;
