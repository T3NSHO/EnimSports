import FacilityReports from "./reports";
import React from "react";

function page() {
  return (
    <div>
      <div className=" w-full md:w-auto min-h-screen bg-gray-800 flex items-center justify-center">
        <FacilityReports />
      </div>
    </div>
  );
}

export default page;
