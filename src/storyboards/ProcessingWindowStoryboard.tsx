import ProcessingWindow from "@/components/ProcessingWindow";

export default function ProcessingWindowStoryboard() {
  const mockFiles = {
    slides: new File(["mock"], "presentation.pdf", { type: "application/pdf" }),
    transcript: new File(["mock"], "transcript.txt", { type: "text/plain" }),
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <ProcessingWindow
        isOpen={true}
        files={mockFiles}
        onClose={() => console.log("Closed")}
        onComplete={(data) => console.log("Complete:", data)}
        onGoHome={() => console.log("Go home")}
      />
    </div>
  );
}
