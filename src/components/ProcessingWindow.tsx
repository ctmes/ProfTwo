import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Home, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import ProcessingView from "./ProcessingView";

interface ProcessingWindowProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: (lectureData: any) => void;
  onGoHome?: () => void;
  files?: { slides: File | null; transcript: File | null };
}

const ProcessingWindow = ({
  isOpen = false,
  onClose = () => {},
  onComplete = () => {},
  onGoHome = () => {},
  files = { slides: null, transcript: null },
}: ProcessingWindowProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Only start processing if window is open, not completed, and both files are present
    if (isOpen && !isCompleted && files.slides && files.transcript) {
      // Simulate processing stages
      const stageInterval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev < 4) {
            return prev + 1;
          } else {
            clearInterval(stageInterval);
            setIsCompleted(true);
            // Generate mock lecture data with MP3 focus
            const lectureData = {
              id: `lecture_${Date.now()}`,
              title:
                files.slides?.name?.replace(/\.[^/.]+$/, "") ||
                "Generated Lecture",
              createdAt: new Date().toISOString(),
              duration: 300, // 5 minutes
              slideCount: 8,
              thumbnailUrl:
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
              slides: [
                {
                  id: "1",
                  url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
                },
                {
                  id: "2",
                  url: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&q=80",
                },
                {
                  id: "3",
                  url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
                },
              ],
              transcript: [
                {
                  id: "1",
                  text: "Welcome to this comprehensive lecture, carefully crafted from your materials using advanced AI processing and enhanced by Grok for optimal clarity.",
                  startTime: 0,
                  endTime: 6,
                },
                {
                  id: "2",
                  text: "Today, we will systematically explore the key concepts presented in your slides, with improved readability and understanding through AI enhancement.",
                  startTime: 6,
                  endTime: 12,
                },
                {
                  id: "3",
                  text: "Let's begin our detailed analysis of each topic, presented in a clear and engaging manner with synchronized audio narration.",
                  startTime: 12,
                  endTime: 18,
                },
              ],
              audioUrl: "https://example.com/generated-lecture-audio.mp3",
              audioFormat: "mp3",
              hasVideo: false,
            };

            // Save to user's library
            const savedLectures = localStorage.getItem("proftwo_lectures");
            const lectures = savedLectures ? JSON.parse(savedLectures) : [];
            lectures.push(lectureData);
            localStorage.setItem("proftwo_lectures", JSON.stringify(lectures));

            setTimeout(() => {
              onComplete(lectureData);
            }, 2000);
            return prev;
          }
        });
      }, 6000); // 6 seconds per stage

      return () => clearInterval(stageInterval);
    }
  }, [isOpen, isCompleted, onComplete, files]);

  const handleInterrupt = () => {
    setCurrentStage(0);
    setIsCompleted(false);
    onClose();
  };

  const handleGoHome = () => {
    setCurrentStage(0);
    setIsCompleted(false);
    onGoHome();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          opacity: 1,
          scale: isMinimized ? 0.3 : 1,
          y: isMinimized ? window.innerHeight * 0.4 : 0,
          x: isMinimized ? window.innerWidth * 0.4 : 0,
        }}
        className={`w-full ${isMinimized ? "max-w-sm" : "max-w-4xl"} transition-all duration-300`}
      >
        <Card className="bg-white/95 backdrop-blur-lg border-white/30 shadow-2xl overflow-hidden">
          {/* Window Controls */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-700">
              AI Lecture Generation
            </h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 hover:bg-white/30"
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="h-6 w-6 p-0 hover:bg-white/30"
              >
                <Home className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInterrupt}
                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <CardContent className="p-0">
              <div className="min-h-[400px]">
                <ProcessingView
                  currentStage={currentStage}
                  onComplete={() => {}} // Handled by this component
                  files={files}
                  onInterrupt={handleInterrupt}
                  onGoHome={handleGoHome}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50/50 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {isCompleted
                      ? "Processing complete! Your MP3 lecture is ready with Grok-enhanced transcript and Deepgram analysis."
                      : "Processing: Grok enhances transcript first, then Deepgram analyzes it. You can interrupt, minimize, or go home at any time."}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGoHome}
                      className="bg-white/50 hover:bg-white/70"
                    >
                      <Home className="w-4 h-4 mr-1" />
                      Go Home
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleInterrupt}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Stop Processing
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <CardContent className="p-3">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-gray-600">Processing...</p>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ProcessingWindow;
