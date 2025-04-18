import { Calendar, Users, MapPin } from "lucide-react";
import { useThemeProvider } from "../contexts/ThemeProvider";

export default function Banner() {
  const { currentTheme } = useThemeProvider();

  return (
    <div
      className={`relative w-full overflow-hidden pt-24 ${
        currentTheme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Background Image + Strong Left Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dszvpb3q5/image/upload/v1744989982/abcsna5mqigm0inps1jh.jpg"
          alt="Banner"
          className="w-full h-full object-cover object-center md:object-right"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0d0d20] via-[#0d0d20d0] to-transparent" />
      </div>

      {/* Text Content */}
      <div className="relative z-20 container mx-auto px-6 py-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Turn Up the Volume
          </h1>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {" "}
            Nikita Gandhi Live!
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-4">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>Apr 25, 2025 </span>
            </div>
          </div>
          <p className="text-base opacity-90 mb-6">
            Get ready for an unforgettable evening with the sensational singer
            Nikita Gandhi, live on campus
          </p>
        </div>
      </div>

      {/* Optional curved bottom */}
      <div
        className={`h-6 ${
          currentTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } rounded-t-3xl -mb-1`}
      ></div>
    </div>
  );
}
