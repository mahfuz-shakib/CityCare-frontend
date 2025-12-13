import React from "react";
import { Link } from "react-router";
import { FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";
import Container from "../container/Container";
import useAuth from "../hooks/useAuth";
const Footer = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className="bg-[#06091A] text-neutral-content">
        <Container>
          <div className="max-w-7xl mx-auto px-3 py-10">
            <div className="lg:flex justify-between grid gap-8 sm:gap-10 md:gap-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
              <div className="max-w-68 mx-auto sm:mx-0">
                <Link to="/">
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-2 ">
                    {/* <img src={logo} alt='gren nest logo' className="size-12" /> */}
                    <span className="text-xl font-semibold">PawMart</span>
                  </div>
                </Link>
                <p className="text-gray-400 text-justify te sm:text-start mt-4 text-sm">
                  PawMart is a community-driven platform where pet owners, breeders, and shops can list pets for
                  adoption or sell pet-related products (food, toys, accessories, etc.). Buyers and adopters can browse,
                  contact, and order directly.
                </p>
              </div>

              <div>
                <h3 className="text-white text-center sm:text-start font-semibold sm:mt-3 mb-3">Quick Links</h3>
                <ul className="footer-ul">
                  <li className="px-2 first:pl-0 sm:px-0">
                    <Link to="/" className="hover:underline">
                      Home
                    </Link>
                  </li>
                  <li className="px-2 first:pl-0 sm:px-0">
                    <Link to="/allListings" className="hover:underline">
                      Pet & Supplies
                    </Link>
                  </li>
                </ul>
              </div>

              {user && (
                <div>
                  <h3 className="text-white text-center sm:text-start font-semibold sm:mt-3 mb-3"> Links</h3>
                  <ul className="footer-ul">
                    <li className="px-2 first:pl-0 sm:px-0">
                      <Link to="/addListings" className="hover:underline">
                        Add Listings
                      </Link>
                    </li>
                    <li className="px-2 first:pl-0 sm:px-0">
                      <Link to="/myListings" className="hover:underline">
                        My Listings
                      </Link>
                    </li>
                    <li className="px-2 first:pl-0 sm:px-0">
                      <Link to="/myOders" className="hover:underline">
                        My Orders
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              <div>
                <h3 className="text-white text-center sm:text-start font-semibold sm:mt-3 mb-3">Follow</h3>
                <div className="text-gray-300 text-sm sm:text-base flex flex-wrap justify-center sm:justify-start gap-1 divide-x divide-gray-600 sm:flex-col sm:gap-2 sm:divide-x-0">
                  <a
                    href="https://github.com/mahfuz-shakib"
                    target="_blank"
                    className="inline-flex items-center gap-1 sm:gap-2 hover:opacity-80 px-3 first:pl-0 sm:px-0"
                  >
                    <FaGithub aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    className="inline-flex items-center gap-1 sm:gap-2 hover:opacity-80 px-3 first:pl-0 sm:px-0"
                  >
                    <FaFacebook aria-hidden="true" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    className="inline-flex items-center gap-1 sm:gap-2 hover:opacity-80 px-3 first:pl-0 sm:px-0"
                  >
                    <FaLinkedin aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-400 border-t border-t-gray-600 text-sm mt-10 pt-6">
              <p>Copyright © {new Date().getFullYear()} PawMart 🐾 All rights reserved.</p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
