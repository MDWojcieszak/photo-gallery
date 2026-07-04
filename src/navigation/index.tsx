import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useLocation,
  useNavigationType,
  useOutlet,
} from 'react-router-dom';
import { About } from '~/routes/About';
import { Contact } from '~/routes/Contact';
import { GalleryPage } from '~/routes/GalleryPage';
import { Home } from '~/routes/Home';

const scrollPositions = new Map<string, number>();

const scrollToHash = (hash: string) => {
  let tries = 0;
  const attempt = () => {
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (tries++ < 12) window.setTimeout(attempt, 90);
  };
  attempt();
};

const restoreTo = (target: number) => {
  if (target <= 0) {
    window.scrollTo(0, 0);
    return;
  }
  // Keep re-applying while the async content grows until we reach the target
  // (or time out — the page may legitimately be shorter than before).
  const start = performance.now();
  const step = () => {
    window.scrollTo(0, target);
    if (window.scrollY < target - 2 && performance.now() - start < 1200) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
};

const RouteTransitions = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const element = useOutlet();
  const latest = useRef({ location, navType });
  latest.current = { location, navType };

  useEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => scrollPositions.set(location.key, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.key]);

  useEffect(() => {
    if (location.hash) scrollToHash(location.hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onExitComplete = () => {
    const { location: loc, navType: nt } = latest.current;
    if (loc.hash) {
      scrollToHash(loc.hash);
      return;
    }
    // Back/forward → restore where the user was; otherwise land at the top.
    restoreTo(nt === 'POP' ? scrollPositions.get(loc.key) ?? 0 : 0);
  };

  return (
    <AnimatePresence mode='wait' initial={false} onExitComplete={onExitComplete}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
};

const Root = () => <RouteTransitions />;

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/portfolio/:slug', element: <GalleryPage /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '*', element: <Navigate to='/' replace /> },
    ],
  },
]);

export const AppNavigation = () => <RouterProvider router={router} />;
