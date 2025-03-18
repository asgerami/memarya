"use client";
import React, { useState } from "react";
import { notifySuccess } from "@/components/ui/Notification";
import Notification from "@/components/ui/Notification";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { v4 as uuid4 } from "uuid";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

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
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      console.error("No file selected");
    }
  };

  const OnUpload = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    setLoading(true);

    try {
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
      console.log("File entry added to database", resp);

      // API call to fetch the PDF process data
      const API_Response = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
      console.log("API_Response", API_Response.data.result);

      // Embedding the document
      const embeddresult = await embeddDocument({
        splitText: API_Response.data.result,
        fileId: fileId,
      });
      console.log(embeddresult);

      setLoading(false);
      setOpen(false);

      // Show success notification
      notifySuccess("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          style={{ backgroundColor: "#05b0fc" }}
        >
          + Upload PDF File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: "#05b0fc" }}>
            Upload PDF File
          </DialogTitle>
          <DialogDescription>
            <div className="mt-5">
              <div className="flex gap-2 p-3 rounded-md border border-gray-200">
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
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogClose>
          <Button
            style={{ backgroundColor: "#05b0fc" }}
            onClick={OnUpload}
            disabled={loading}
          >
            {loading ? (
              <Loader2Icon className="animate-spin" size={20} />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      <Notification />
    </Dialog>
  );
}

export default UploadpPdfDialof;