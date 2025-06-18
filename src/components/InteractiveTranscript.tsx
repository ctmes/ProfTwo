import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isCurrent?: boolean;
}

interface InteractiveTranscriptProps {
  segments?: TranscriptSegment[];
  currentTime?: number;
  onSegmentClick?: (segmentId: string, time: number) => void;
}

const InteractiveTranscript = ({
  segments = [
    {
      id: "1",
      text: "Welcome to this lecture on artificial intelligence and machine learning.",
      startTime: 0,
      endTime: 5,
    },
    {
      id: "2",
      text: "Today we will explore the fundamental concepts that drive modern AI systems.",
      startTime: 5,
      endTime: 10,
    },
    {
      id: "3",
      text: "Let's begin by understanding what machine learning actually is and how it differs from traditional programming.",
      startTime: 10,
      endTime: 15,
    },
    {
      id: "4",
      text: "In traditional programming, we provide explicit instructions for the computer to follow.",
      startTime: 15,
      endTime: 20,
    },
    {
      id: "5",
      text: "But in machine learning, we instead provide data and let the computer learn patterns from that data.",
      startTime: 20,
      endTime: 25,
    },
    {
      id: "6",
      text: "This paradigm shift has enabled remarkable advances in fields like computer vision, natural language processing, and robotics.",
      startTime: 25,
      endTime: 30,
    },
    {
      id: "7",
      text: "The key advantage is that machine learning systems can handle complexity and variability that would be impossible to code explicitly.",
      startTime: 30,
      endTime: 35,
    },
  ],
  currentTime = 0,
  onSegmentClick = () => {},
}: InteractiveTranscriptProps) => {
  const [activeSegmentId, setActiveSegmentId] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Find the current active segment based on currentTime
  useEffect(() => {
    const currentSegment = segments.find(
      (segment) =>
        currentTime >= segment.startTime && currentTime <= segment.endTime,
    );

    if (currentSegment && currentSegment.id !== activeSegmentId) {
      setActiveSegmentId(currentSegment.id);

      // Scroll to the active segment with smooth behavior
      if (segmentRefs.current[currentSegment.id]) {
        segmentRefs.current[currentSegment.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentTime, segments, activeSegmentId]);

  const handleSegmentClick = (segment: TranscriptSegment) => {
    setActiveSegmentId(segment.id);
    onSegmentClick(segment.id, segment.startTime);
  };

  return (
    <div className="w-full h-full bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-white/30 backdrop-blur-md">
        <h3 className="text-lg font-medium text-gray-800">
          Lecture Transcript
        </h3>
      </div>

      <ScrollArea className="h-[calc(100%-60px)] p-4" ref={scrollContainerRef}>
        <div className="space-y-4">
          {segments.map((segment) => (
            <div
              key={segment.id}
              ref={(el) => (segmentRefs.current[segment.id] = el)}
              className={cn(
                "p-3 rounded-lg transition-all duration-300 cursor-pointer",
                activeSegmentId === segment.id
                  ? "bg-primary/20 border-l-4 border-primary"
                  : "hover:bg-white/30",
              )}
              onClick={() => handleSegmentClick(segment)}
            >
              <p
                className={cn(
                  "text-sm",
                  activeSegmentId === segment.id
                    ? "text-primary font-medium"
                    : "text-gray-700",
                )}
              >
                {segment.text}
              </p>
              <div className="mt-1 text-xs text-gray-500">
                {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Helper function to format time in MM:SS format
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default InteractiveTranscript;
