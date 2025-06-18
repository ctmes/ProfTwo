import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Play,
  FileText,
  FileImage,
  ArrowRight,
  Library,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import UploadArea from "./UploadArea";
import ProcessingView from "./ProcessingView";
import LecturePlayer from "./LecturePlayer";
import UserAuth from "./UserAuth";
import LectureLibrary from "./LectureLibrary";
import ProcessingWindow from "./ProcessingWindow";

enum AppState {
  UPLOAD,
  PROCESSING,
  PLAYBACK,
}

interface UserData {
  id: string;
  email: string;
  name: string;
}

const Home = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [uploadedFiles, setUploadedFiles] = useState<{
    slides: File | null;
    transcript: File | null;
  }>({ slides: null, transcript: null });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [lectureData, setLectureData] = useState<any>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProcessingWindow, setShowProcessingWindow] = useState(false);

  // Handle file uploads and start processing in window
  const handleFilesUploaded = (files: {
    slides: File | null;
    transcript: File | null;
  }) => {
    // Only proceed if both files are present
    if (files.slides && files.transcript) {
      setUploadedFiles(files);
      setShowProcessingWindow(true);
    } else {
      console.warn(
        "Both slides and transcript files are required before processing can begin",
      );
    }
  };

  const handleProcessingComplete = (generatedLectureData: any) => {
    setLectureData(generatedLectureData);
    setShowProcessingWindow(false);
    setAppState(AppState.PLAYBACK);
  };

  const handleProcessingInterrupt = () => {
    setShowProcessingWindow(false);
    setUploadedFiles({ slides: null, transcript: null });
  };

  const handleUserChange = (userData: UserData | null) => {
    setUser(userData);
  };

  const handleLectureSelect = (lecture: any) => {
    setLectureData(lecture);
    setShowLibrary(false);
    setAppState(AppState.PLAYBACK);
  };

  const handleBackToUpload = () => {
    setAppState(AppState.UPLOAD);
    setUploadedFiles({ slides: null, transcript: null });
    setProcessingProgress(0);
    setLectureData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                ProfTwo: AI Professor & Tutor
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Transform your lecture slides and transcripts into comprehensive
                AI-narrated lectures
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <Button
                  variant="outline"
                  onClick={() => setShowLibrary(true)}
                  className="bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/50"
                >
                  <Library className="w-4 h-4 mr-2" />
                  My Lectures
                </Button>
              )}
              <UserAuth onUserChange={handleUserChange} />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        {appState === AppState.UPLOAD && (
          <UploadArea onFilesSelected={handleFilesUploaded} />
        )}

        {/* Processing Window */}
        <ProcessingWindow
          isOpen={showProcessingWindow}
          onClose={handleProcessingInterrupt}
          onComplete={handleProcessingComplete}
          onGoHome={handleProcessingInterrupt}
          files={uploadedFiles}
        />

        {/* Lecture Library */}
        {showLibrary && user && (
          <LectureLibrary
            userId={user.id}
            onLectureSelect={handleLectureSelect}
            onClose={() => setShowLibrary(false)}
          />
        )}

        {appState === AppState.PLAYBACK && lectureData && (
          <LecturePlayer
            title={lectureData.title}
            slides={lectureData.slides}
            audioUrl={lectureData.audioUrl}
            transcript={lectureData.transcript}
          />
        )}

        {/* Features Section - Only show on upload screen */}
        {appState === AppState.UPLOAD && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid md:grid-cols-3 gap-8"
          >
            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Easy Upload</h3>
                <p className="text-gray-600 text-sm">
                  Drag & drop your slides and transcripts with our intuitive
                  interface
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">AI Processing</h3>
                <p className="text-gray-600 text-sm">
                  Advanced AI transforms your content into engaging narrated
                  lectures
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Interactive Playback</h3>
                <p className="text-gray-600 text-sm">
                  Synchronized slides, transcript, and AI voiceover with speed
                  controls
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
