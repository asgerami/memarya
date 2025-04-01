'use client';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Layout, Shield } from "lucide-react";
import Image from "next/image";
import React from "react";
import UploadpPdfDialof from "./UploadpPdfDialof";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";

const SideBar = () => {
  const { user } = useUser();
  const fileList = useQuery(api.myAction.GetUserFiles, {
    userEmail: user?.primaryEmailAddress.emailAddress,
  });
  return (
    <div className="shadow-md h-screen flex flex-col items-center pt-3">
      <Image src={"/logo.png"} alt="logo" width={170} height={170} />

      <div className="mt-9">
        <UploadpPdfDialof>
          <Button
            style={{ backgroundColor: "#05b0fc" }}
            className="w-full text-white"
          >
            + Upload PDF
          </Button>
        </UploadpPdfDialof>

        <div className="flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded lg cursor-pointer">
          <Layout color="#05b0fc" />
          <h2>Workspace</h2>
        </div>

        <div className="flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded lg cursor-pointer">
          <Shield color="#05b0fc" />
          <h2>Upgrade</h2>
        </div>
      </div>
      <div className="absolute bottom-24 w-[80%]">
        <Progress value={(fileList?.length / 10) * 100} />
        <p className="text-sm mt-2">
          {fileList?.length} pdf uploaded till date
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Use for free! No Money required
        </p>
      </div>
    </div>
  );
};

export default SideBar;
