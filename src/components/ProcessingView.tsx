import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@deepgram/sdk";

interface ProcessingViewProps {
  onComplete?: () => void;
  currentStage?: number;
  files?: { slides: File | null; transcript: File | null };
  onInterrupt?: () => void;
  onGoHome?: () => void;
}

const ProcessingView = ({
  onComplete = () => {},
  currentStage = 0,
  files = { slides: null, transcript: null },
  onInterrupt = () => {},
  onGoHome = () => {},
}: ProcessingViewProps) => {
  const [stages, setStages] = useState([
    { name: "Uploading files", progress: 0, complete: false },
    { name: "Enhancing with Grok AI", progress: 0, complete: false },
    { name: "Processing with Deepgram", progress: 0, complete: false },
    { name: "Generating MP3 audio", progress: 0, complete: false },
    { name: "Finalizing lecture", progress: 0, complete: false },
  ]);
  const [deepgramResults, setDeepgramResults] = useState<any>(null);
  const [grokResults, setGrokResults] = useState<any>(null);

  // Process transcript with Deepgram using Grok-enhanced text
  const processWithDeepgram = async () => {
    if (!files?.transcript || !grokResults?.editedTranscript) return;

    try {
      const deepgram = createClient(
        import.meta.env.VITE_DEEPGRAM_API_KEY || process.env.DEEPGRAM_API_KEY,
      );

      // Use the Grok-enhanced transcript for Deepgram analysis
      const { result, error } = await deepgram.read.analyzeText(
        { text: grokResults.editedTranscript },
        {
          language: "en",
          summarize: "v2",
          topics: true,
          intents: true,
          sentiment: true,
        },
      );

      if (error) {
        console.error("Deepgram analysis error:", error);
        return null;
      }

      setDeepgramResults(result);
      return result;
    } catch (error) {
      console.error("Error processing with Deepgram:", error);
      return null;
    }
  };

  // Process transcript with Grok AI for readability
  const processWithGrok = async () => {
    if (!files?.transcript) return;

    try {
      // Read transcript file content
      const transcriptText = await files.transcript.text();

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer xai-y3nHyCNNtEqyQORLEcgN4NZpywN4874QWAB50A1T4Y8Q8LSONLN1DgUP1RWgIItN27KEnBvhUaFLI5u9",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an expert educational content editor. Your task is to take raw lecture transcripts and make them more readable, clear, and understandable while preserving all the original information and meaning. Fix grammar, improve sentence structure, organize thoughts logically, and ensure the content flows naturally for educational purposes.",
            },
            {
              role: "user",
              content: `Please edit this lecture transcript to make it more readable and understandable while preserving all information:\n\n${transcriptText}`,
            },
          ],
          model: "grok-3-latest",
          stream: false,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.status}`);
      }

      const result = await response.json();
      const editedTranscript = result.choices?.[0]?.message?.content;

      if (editedTranscript) {
        setGrokResults({ editedTranscript });
        return { editedTranscript };
      }

      return null;
    } catch (error) {
      console.error("Error processing with Grok:", error);
      return null;
    }
  };

  useEffect(() => {
    // Process with Grok when we reach stage 1 (first)
    if (currentStage === 1 && files?.transcript && !grokResults) {
      processWithGrok();
    }
    // Process with Deepgram when we reach stage 2 (after Grok)
    if (
      currentStage === 2 &&
      files?.transcript &&
      grokResults &&
      !deepgramResults
    ) {
      processWithDeepgram();
    }
  }, [currentStage, files, deepgramResults, grokResults]);

  useEffect(() => {
    // Simulate processing progress
    const interval = setInterval(() => {
      setStages((prevStages) => {
        const newStages = [...prevStages];

        if (currentStage < newStages.length) {
          const currentStageObj = newStages[currentStage];

          if (currentStageObj.progress < 100) {
            // Slower progress for AI processing stages
            const increment = currentStage === 1 || currentStage === 2 ? 1 : 2;
            currentStageObj.progress += increment;
          } else if (!currentStageObj.complete) {
            currentStageObj.complete = true;

            // Move to next stage if not the last one
            if (currentStage === newStages.length - 1) {
              setTimeout(() => onComplete(), 1000);
            }
          }
        }

        return newStages;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [currentStage, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="backdrop-blur-lg bg-white/70 border border-white/20 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
              Processing Your Lecture
            </h2>

            <div className="space-y-8">
              {stages.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {stage.complete ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : index === currentStage ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Loader2 className="h-5 w-5 text-blue-500" />
                        </motion.div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span
                        className={`font-medium ${index === currentStage ? "text-blue-600" : stage.complete ? "text-green-600" : "text-gray-500"}`}
                      >
                        {stage.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {stage.progress}%
                    </span>
                  </div>

                  <Progress
                    value={stage.progress}
                    className={`h-2 ${index === currentStage ? "bg-blue-100" : stage.complete ? "bg-green-100" : "bg-gray-100"}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 text-center text-sm text-gray-500">
              <p>
                This may take a few minutes. We're transforming your content
                into an engaging lecture using AI.
              </p>
              {deepgramResults && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-medium">
                    ✓ Deepgram analysis complete
                  </p>
                  {deepgramResults.results?.summary && (
                    <p className="text-xs text-green-600 mt-1">
                      Summary generated with{" "}
                      {deepgramResults.results.summary.length} key points
                    </p>
                  )}
                </div>
              )}
              {grokResults && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    ✓ Grok AI enhancement complete
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Transcript enhanced and ready for Deepgram analysis
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>
            ProfTwo is analyzing your content with Deepgram and Grok AI to
            generate a clear, comprehensive AI-narrated lecture.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProcessingView;
