"use client";
import { useRouter } from "next/navigation";

type DashboardCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  path,
}) => {
  const router = useRouter();
  const navigateToPage = () => {
    router.push(path); // `push` from the App Router
  };
  return (
    <button
      onClick={navigateToPage}
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-xl transition duration-200 flex flex-col items-start text-left focus:outline-none border-l border-t border-emerald-600  sm:p-6 `}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition duration-200">
          {title}
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition duration-200">
        {description}
      </p>
    </button>
  );
};
export default DashboardCard;
