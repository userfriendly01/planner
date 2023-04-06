import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const container = document.getElementById("root");

  useEffect(() => {
    container.scrollTo(0,0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;