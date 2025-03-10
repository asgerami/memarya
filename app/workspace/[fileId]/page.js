"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import PdfViewer from "../_components/PdfViewer";
import { useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function Workspace() {
  const { fileId } = useParams();
  const fileInfo = useQuery(api.fileStorage.GetFileRecord, 
    { fileId: fileId });

    useEffect(() => {
        console.log(fileInfo);
    },[fileInfo])

  return (
    <div>
      <WorkspaceHeader />

      <div className="grid grid-cols-2 gap-5">
        <div>
          {/* TODO: Text Editor */}
        </div>
        <div>
          
          <PdfViewer fileUrl={fileInfo?.fileUrl}/>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
