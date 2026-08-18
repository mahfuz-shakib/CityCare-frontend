import { Suspense } from "react";
import ListingSkeleton from "./ListingSkeleton";

const LazyWrapper = ({ children }) => {
  return <Suspense fallback={<ListingSkeleton />}>{children}</Suspense>;
};

export default LazyWrapper;
