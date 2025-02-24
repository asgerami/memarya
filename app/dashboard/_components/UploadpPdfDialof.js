"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

function UploadpPdfDialof({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const { user } = useUser();
  const embeddDocument = useAction(api.myAction.ingest);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const OnUpload = async () => {
    setLoading(true);

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!result.ok) {
      throw new Error("Failed to upload file");
    }

    const { storageId } = await result.json();
    console.log("Uploaded file with storageId", storageId);

    // Get the file URL
    const fileId = uuid4();
    const fileUrl = await getFileUrl({ storageId: storageId });
    
    // Step 3: Add an entry to the database
    const resp = await addFileEntry({
      fileId: fileId,
      storageId: storageId,
      fileName: fileName ?? "Untitled",
      fileUrl: fileUrl,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    //console.log("File entry added to database", resp);

    //API call to fetch the PDF process data
    const API_Response = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
    console.log("API_Response", API_Response.data.result);
    await embeddDocument({
      splitText: API_Response.data.result,
      fileId: "123",
    });
    setLoading(false);
    setOpen(false);
  };


  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={()=>setOpen(true)} style={{ backgroundColor: "#05b0fc" }}>+  Upload PDF File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: "#05b0fc" }}>
            Upload PDF File
          </DialogTitle>
          <DialogDescription>
            <div className="mt-5">
              <h2>Select a file to Upload</h2>
              <div className="flex gap-2 p-3 rounded-md border border-gray-200 ">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={OnFileSelect}
                />
              </div>
              <div className="mt-5">
                <label>File Name *</label>
                <Input
                  placeholder="File Name"
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div></div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button style={{ backgroundColor: "#05b0fc" }} onClick={OnUpload} disabled={loading}>
            {loading ? (
              <Loader2Icon className="animate-spin" size={20} />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadpPdfDialof;
