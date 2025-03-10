import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

function WorkspaceHeader() {
  return (
    <div className="p-4 flex justify-between shadow-md">
      <Image src="/logo.png" alt="logo" width={150} height={150} />
      <UserButton />
    </div>
  );
}

export default WorkspaceHeader;
