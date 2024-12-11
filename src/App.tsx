import DashBoard from "@/components/dashBoard";
import Timeline from "@/components/timeline";
import { CubeIcon } from "@heroicons/react/20/solid";
import { useMediaQuery } from "react-responsive";
import "./App.css";

function App() {
  const isTabletOrLarger = useMediaQuery({ minWidth: 768 });

  return (
    <div>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 lg:mt-12">
        <div className="overflow-hidden rounded-b-lg rounded-t-none sm:rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 shadow-lg h-56">
          <div className="px-8 py-10 sm:p-12">
            <div className="flex items-center">
              <CubeIcon className="h-16 w-16 text-white animate-bounce" />
              <h1 className="text-5xl font-extrabold text-white ml-6">
                Memory Lane
              </h1>
            </div>
            <p className="text-lg text-white mt-4 font-medium">
              A place to revisit and cherish your favorite moments. Explore your
              memories!
            </p>
          </div>
        </div>
        {isTabletOrLarger ? <DashBoard /> : <Timeline />}
      </div>
    </div>
  );
}

export default App;
