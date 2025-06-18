import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import InteractiveTranscript from "./InteractiveTranscript";

interface LecturePlayerProps {
  title?: string;
  slides?: Array<{ id: string; url: string }>;
  audioUrl?: string;
  transcript?: Array<{
    id: string;
    text: string;
    startTime: number;
    endTime: number;
  }>;
}

const LecturePlayer = ({
  title = "Introduction to Machine Learning",
  slides = [
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
  audioUrl = "",
  transcript = [
    {
      id: "1",
      text: "Welcome to this lecture on Machine Learning fundamentals.",
      startTime: 0,
      endTime: 4,
    },
    {
      id: "2",
      text: "Today we will cover the basic concepts and applications of ML algorithms.",
      startTime: 4,
      endTime: 8,
    },
    {
      id: "3",
      text: "Let's start by understanding what machine learning actually is.",
      startTime: 8,
      endTime: 12,
    },
  ],
}: LecturePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0");
  const totalDuration =
    transcript.length > 0 ? transcript[transcript.length - 1].endTime : 0;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Audio play/pause logic would go here
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleTimeUpdate = (value: number[]) => {
    setCurrentTime(value[0]);
    // Logic to sync audio to this time would go here
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    // Logic to change audio volume would go here
  };

  const handleSpeedChange = (value: string) => {
    setPlaybackSpeed(value);
    // Logic to change playback speed would go here
  };

  const handleTranscriptClick = (startTime: number) => {
    setCurrentTime(startTime);
    // Logic to jump audio to this time would go here
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area - Slides and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Slide viewer with glassmorphism effect */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl">
              {slides.length > 0 && (
                <img
                  src={slides[currentSlideIndex].url}
                  alt={`Slide ${currentSlideIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Slide navigation overlay */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/30 backdrop-blur-md hover:bg-white/50"
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/30 backdrop-blur-md hover:bg-white/50"
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Slide counter */}
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
                {currentSlideIndex + 1} / {slides.length}
              </div>
            </div>

            {/* Playback controls with glassmorphism */}
            <Card className="bg-white/30 backdrop-blur-lg border-white/30 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={totalDuration}
                      step={0.1}
                      onValueChange={handleTimeUpdate}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(totalDuration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white/50"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>

                      <div className="flex items-center space-x-2 ml-4">
                        <Volume2 className="h-4 w-4 text-gray-600" />
                        <Slider
                          value={[volume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleVolumeChange}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Speed:</span>
                      <Select
                        value={playbackSpeed}
                        onValueChange={handleSpeedChange}
                      >
                        <SelectTrigger className="w-20 h-8 bg-white/50 border-white/30">
                          <SelectValue placeholder="1.0x" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1.0">1.0x</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2.0">2.0x</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white/50"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transcript panel */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="transcript" className="w-full">
              <TabsList className="w-full bg-white/30 backdrop-blur-lg border border-white/30">
                <TabsTrigger value="transcript" className="flex-1">
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-1">
                  Notes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="transcript" className="mt-2">
                <Card className="bg-white/30 backdrop-blur-lg border-white/30 shadow-md h-[600px] overflow-hidden">
                  <CardContent className="p-0">
                    <InteractiveTranscript
                      transcript={transcript}
                      currentTime={currentTime}
                      onSegmentClick={handleTranscriptClick}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notes" className="mt-2">
                <Card className="bg-white/30 backdrop-blur-lg border-white/30 shadow-md h-[600px]">
                  <CardContent className="p-4">
                    <textarea
                      className="w-full h-full bg-transparent border-none focus:outline-none resize-none"
                      placeholder="Take notes here..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default LecturePlayer;
