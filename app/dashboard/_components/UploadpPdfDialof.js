import React from "react";
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

function UploadpPdfDialof({ children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: "#05b0fc" }}>Upload PDF File</DialogTitle>
          <DialogDescription>
            <div className="mt-5">
              <h2>Select a file to Upload</h2>
              <div className="flex gap-2 p-3 rounded-md border border-gray-200 ">
                <input type="file" accept="application/pdf"/>
              </div>
              <div className="mt-5">
                <label>File Name *</label>
                <Input placeholder="File Name" />
              </div>
              <div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button style={{ backgroundColor: "#05b0fc" }}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadpPdfDialof;
