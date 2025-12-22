import React from "react";
import { Link, useLocation } from "react-router";
import image from "../../public/assets/noData.jpg";
import Container from "../container/Container";
const NotAvailable = ({pathname}) => {
    console.log(pathname);
  return (
    <Container>
      <div className="text-center space-y-5 sm:space-y-6 min-h-72 my- px-4">
        <img src={image} alt="" className="mx-auto size-50 rounded" />
        <h1 className="text-3xl sm:text-4xl font-bold text--600">
          {pathname === "/allListings"
            ? "No Listings Found"
            : pathname === "/myListings"
            ? "No Listings Added Yet."
            : pathname === "/myOrders"
            ? "No Orders Placed Yet"
            : ""}
        </h1>
        <div className="flex justify-center items-center flex-wrap gap-4">
          {pathname === "/allListings" ? (
            ""
          ) : (
            <Link to="/allListings">
              <button className="btn bg-grad text-white hover:scale-102 py-3">Browse Listings!</button>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
};

export default NotAvailable;
