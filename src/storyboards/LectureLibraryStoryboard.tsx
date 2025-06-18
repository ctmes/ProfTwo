import LectureLibrary from "@/components/LectureLibrary";

export default function LectureLibraryStoryboard() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <LectureLibrary
        userId="demo-user"
        onLectureSelect={(lecture) => console.log("Selected:", lecture)}
        onClose={() => console.log("Closed")}
      />
    </div>
  );
}
