import React, { useState, useRef } from "react";
import { Upload, FileText, File, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface UploadAreaProps {
  onFilesSelected?: (files: {
    slides: File | null;
    transcript: File | null;
  }) => void;
  isProcessing?: boolean;
}

const UploadArea = ({
  onFilesSelected = () => {},
  isProcessing = false,
}: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    let newSlideFile = slideFile;
    let newTranscriptFile = transcriptFile;

    // Process dropped files - only accept valid file types
    files.forEach((file) => {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      // Check for slide files (PDF, PPT, PPTX)
      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.ms-powerpoint" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".ppt") ||
        fileName.endsWith(".pptx")
      ) {
        newSlideFile = file;
      }
      // Check for transcript files (TXT only)
      else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
        newTranscriptFile = file;
      }
    });

    // Update state only if valid files were found
    if (newSlideFile !== slideFile) {
      setSlideFile(newSlideFile);
    }
    if (newTranscriptFile !== transcriptFile) {
      setTranscriptFile(newTranscriptFile);
    }

    // Update state and simulate upload progress if files were updated
    if (newSlideFile !== slideFile || newTranscriptFile !== transcriptFile) {
      // Only trigger upload progress simulation, don't notify parent yet
      simulateUploadProgress();
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "slides" | "transcript",
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name.toLowerCase();

      if (fileType === "slides") {
        // Validate slide file types (PDF, PPT, PPTX)
        if (
          file.type === "application/pdf" ||
          file.type === "application/vnd.ms-powerpoint" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
          fileName.endsWith(".pdf") ||
          fileName.endsWith(".ppt") ||
          fileName.endsWith(".pptx")
        ) {
          setSlideFile(file);
          // Don't trigger processing until both files are present
          if (transcriptFile) {
            simulateUploadProgress();
          }
        }
      } else {
        // Validate transcript file types (TXT only)
        if (file.type === "text/plain" || fileName.endsWith(".txt")) {
          setTranscriptFile(file);
          // Don't trigger processing until both files are present
          if (slideFile) {
            simulateUploadProgress();
          }
        }
      }
    }
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Only notify parent if both files are present
          if (slideFile && transcriptFile) {
            onFilesSelected({ slides: slideFile, transcript: transcriptFile });
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleRemoveFile = (fileType: "slides" | "transcript") => {
    if (fileType === "slides") {
      setSlideFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setTranscriptFile(null);
      if (transcriptInputRef.current) transcriptInputRef.current.value = "";
    }
  };

  const handleBrowseFiles = (fileType: "slides" | "transcript") => {
    if (fileType === "slides" && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (fileType === "transcript" && transcriptInputRef.current) {
      transcriptInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white border-opacity-20">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
        Upload Your Lecture Materials
      </h2>

      <div
        className={`relative min-h-[300px] border-2 border-dashed rounded-lg p-6 transition-all ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <Upload className="w-12 h-12 text-gray-400 dark:text-gray-300" />
          <p className="text-center text-gray-600 dark:text-gray-300">
            <span className="font-medium text-red-600 dark:text-red-400">
              Both files are required:
            </span>
            <br />
            Drag and drop your lecture slides (PDF/PPT/PPTX) and transcript file
            (TXT) here, or
            <br />
            <span className="text-primary font-medium">browse files</span>
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => handleBrowseFiles("slides")}
              className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 border-white border-opacity-20"
              disabled={isProcessing}
            >
              <File className="mr-2 h-4 w-4" /> Select Slides
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBrowseFiles("transcript")}
              className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 border-white border-opacity-20"
              disabled={isProcessing}
            >
              <FileText className="mr-2 h-4 w-4" /> Select Transcript
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileInputChange(e, "slides")}
            accept=".pdf,.ppt,.pptx"
            className="hidden"
            disabled={isProcessing}
          />
          <input
            type="file"
            ref={transcriptInputRef}
            onChange={(e) => handleFileInputChange(e, "transcript")}
            accept=".txt"
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {(slideFile || transcriptFile) && (
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Selected Files
          </h3>
        )}

        <div className="space-y-3">
          {slideFile && (
            <Card className="p-4 flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm border-white border-opacity-20">
              <div className="flex items-center">
                <File className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {slideFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {(slideFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile("slides")}
                className="text-gray-500 hover:text-red-500"
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          )}

          {transcriptFile && (
            <Card className="p-4 flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm border-white border-opacity-20">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {transcriptFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {(transcriptFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile("transcript")}
                className="text-gray-500 hover:text-red-500"
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          )}
        </div>

        {(slideFile || transcriptFile) && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">
                Uploading...
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {uploadProgress === 100 && (
          <div className="flex items-center text-green-500 mt-2">
            <Check className="h-5 w-5 mr-1" />
            <span>Files uploaded successfully</span>
          </div>
        )}

        {/* Always show the button but disable it if both files aren't present */}
        <div className="mt-6 flex flex-col items-center space-y-3">
          {(!slideFile || !transcriptFile) && (
            <div className="text-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="font-medium">Both files required</p>
              <p className="text-sm mt-1">
                Please upload{" "}
                {!slideFile && !transcriptFile
                  ? "both lecture slides and transcript"
                  : !slideFile
                    ? "lecture slides"
                    : "transcript"}{" "}
                to continue
              </p>
            </div>
          )}

          <Button
            className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              isProcessing ||
              uploadProgress < 100 ||
              !slideFile ||
              !transcriptFile
            }
            onClick={() => {
              // Only proceed if we have both files
              if (slideFile && transcriptFile) {
                onFilesSelected({
                  slides: slideFile,
                  transcript: transcriptFile,
                });
              }
            }}
          >
            {isProcessing ? "Processing..." : "Generate AI Lecture"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
