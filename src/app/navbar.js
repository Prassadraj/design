// components/Navbar.js
"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange); // For browser back/forward buttons
    window.addEventListener('hashchange', handleRouteChange); // For hash-based routing (if used)

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount/unmount


  const paths = [
    { href: "/", label: "Home" },
    { href: "/design", label: "Design" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        {paths.map((path) => (
          <li className="navbar-item" key={path.href}>
            <Link href={path.href} as={path.href} legacyBehavior passHref>
              <a className="navbar-link">
                <span className={currentPath === path.href ? "active" : ""}>
                  {path.label}
                </span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;