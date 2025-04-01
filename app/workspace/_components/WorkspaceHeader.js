import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const WorkspaceHeader = ({ fileName }) => {
  return (
    <div className="p-4 flex justify-between shadow-md">
      <Link href={"/dashboard"}>
        <Image src="/logo.png" alt="logo" width={150} height={150} />
      </Link>
      <h2 className="font-bold">{fileName}</h2>
      <div className="flex gap-2">
        <Button>Save</Button>
        <UserButton />
      </div>
    </div>
  );
};
