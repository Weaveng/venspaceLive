import { explore } from "@/lib/data";
import Link from "next/link";

export const Explore = () => {
  return (
    <div className="lg:px-[72px] lg:pt-[72px] md:p-8 p-4">
      <h4 className="lg:text-[28px] md:text-2xl text-xs text-[#001224] font-bold">
        Explore spaces in the most popular areas in Lagos
      </h4>
      <div className="mt-4 flex items-center md:gap-6 gap-4 overflow-x-auto no-scrollbar">
        {explore.map((location, index) => (
          <Link href={`/locations/${location.name}`}
            key={index}
            className="relative bg-top bg-cover bg-no-repeat lg:min-w-[400px] lg:h-[271px] min-w-[240px] h-[145px] rounded-lg"
            style={{ backgroundImage: `url(${location.image})` }}
          >
            <div
              className="absolute bottom-0 rounded-b-lg w-full lg:h-16 h-10 lg:pl-4 pl-2 lg:pt-[9px] pt-1"
              style={{
                background:
                  "linear-gradient(90.51deg, rgba(74, 74, 74, 0.5) 0%, rgba(74, 74, 74, 0.2) 100%)",
                backdropFilter: "blur(50px)",
              }}
            >
              <h6 className="lg:text-lg text-sm font-medium text-white">
                {location.name}
              </h6>
              <p className="lg:text-sm text-xs text-white">
                {location.locationNumber} locations
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
