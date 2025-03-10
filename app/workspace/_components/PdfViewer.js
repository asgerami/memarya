import React from "react";

function PdfViewer({ fileUrl }) {
  console.log(fileUrl);
  return (
    <div>
      <iframe
        src={fileUrl+"#toolbar=0"}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        className="h-screen"
      ></iframe>
    </div>
  );
}

export default PdfViewer;
