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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";

function UploadpPdfDialof({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

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
      const fileUrl = await getFileUrl({ storageId:storageId });

      const fileId = uuid4();
      // Step 3: Add an entry to the database
      const resp = await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName ?? "Untitled",
        fileUrl: fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
      console.log("File entry added to database", resp);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
          <Button style={{ backgroundColor: "#05b0fc" }} onClick={OnUpload}>
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
