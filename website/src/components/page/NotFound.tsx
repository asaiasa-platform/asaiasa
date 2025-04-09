import Image from "next/image";
import React from "react";

export default function NotFoundSVG() {
  return (
    <main className="container mx-auto sm:py-8 mt-[65px] min-h-[60vh]">
      <div className="flex items-center justify-center mt-10">
        <div className="flex flex-col justify-center items-center gap-6">
          <Image src="/page/not-found.svg" alt="404" width={400} height={400} />
        </div>
      </div>
    </main>
  );
}
