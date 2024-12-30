import React from "react";


function StudentDashboard() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
    <h1 className="text-2xl font-bold mb-4 text-white-800">Bienvenue</h1>
    <div className="flex justify-center w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <video controls className="w-full h-full">
            <source src="/path-to-your-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
</div>
  );
};

export default StudentDashboard;
