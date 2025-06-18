import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Trash2, Calendar, Clock, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface SavedLecture {
  id: string;
  title: string;
  createdAt: string;
  duration: number;
  slideCount: number;
  thumbnailUrl: string;
  data: any;
}

interface LectureLibraryProps {
  userId?: string;
  onLectureSelect?: (lecture: SavedLecture) => void;
  onClose?: () => void;
}

const LectureLibrary = ({
  userId = "",
  onLectureSelect = () => {},
  onClose = () => {},
}: LectureLibraryProps) => {
  const [lectures, setLectures] = useState<SavedLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserLectures();
    }
  }, [userId]);

  const loadUserLectures = () => {
    setIsLoading(true);
    // Simulate loading from storage
    setTimeout(() => {
      const savedLectures = localStorage.getItem("proftwo_lectures");
      if (savedLectures) {
        const allLectures = JSON.parse(savedLectures);
        const userLectures = allLectures.filter((lecture: SavedLecture) =>
          lecture.id.startsWith(userId),
        );
        setLectures(userLectures);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleDeleteLecture = (lectureId: string) => {
    const savedLectures = localStorage.getItem("proftwo_lectures");
    if (savedLectures) {
      const allLectures = JSON.parse(savedLectures);
      const updatedLectures = allLectures.filter(
        (lecture: SavedLecture) => lecture.id !== lectureId,
      );
      localStorage.setItem("proftwo_lectures", JSON.stringify(updatedLectures));
      setLectures(lectures.filter((lecture) => lecture.id !== lectureId));
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-4xl mx-4 bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your lectures...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl h-full">
          <CardHeader className="border-b border-white/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-800">
                Your Lecture Library
              </CardTitle>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {lectures.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No lectures yet
                </h3>
                <p className="text-gray-500">
                  Upload your first lecture materials to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lectures.map((lecture) => (
                  <motion.div
                    key={lecture.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 transition-all duration-200 cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg relative overflow-hidden">
                        <img
                          src={lecture.thumbnailUrl}
                          alt={lecture.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            className="bg-white/90 text-gray-800 hover:bg-white"
                            onClick={() => onLectureSelect(lecture)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Play
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                          {lecture.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(lecture.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(lecture.duration)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {lecture.slideCount} slides
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLecture(lecture.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LectureLibrary;
