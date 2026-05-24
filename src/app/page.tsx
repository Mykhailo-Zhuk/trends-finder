import { Suspense } from "react";
import HomePage from "./page-client";

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
