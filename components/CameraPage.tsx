import { Camera, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface CameraPageProps {
  setCurrentPage: (page: string) => void;
  setCapturedImage: (image: string | null) => void;
}

export function CameraPage({
  setCurrentPage,
  setCapturedImage,
}: CameraPageProps) {
  const handleTakePhoto = () => {
    // Симуляция захвата фото
    setCapturedImage(
      "https://images.unsplash.com/photo-1606037150583-fb842a55bae7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFzaCUyMHBsYXN0aWMlMjByZWN5Y2xpbmd8ZW58MXx8fHwxNzU4ODI1NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    );
    setCurrentPage("analysis");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-medium">Анализатор мусора</h1>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-sm aspect-square bg-gray-100 rounded-3xl overflow-hidden border-4 border-[#4CAF50]/20">
          {/* Camera preview simulation */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00BCD4]/10 to-[#4CAF50]/10">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4CAF50]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-[#4CAF50]" />
                </div>
                <p className="text-sm text-[#9E9E9E]">
                  Наведите камеру на мусор
                </p>
              </div>
            </div>
          </div>

          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-[#4CAF50] rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#4CAF50] rounded-tl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#4CAF50] rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#4CAF50] rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#4CAF50] rounded-br"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capture Button */}
      <div className="flex justify-center pb-24 px-6">
        <Button
          onClick={handleTakePhoto}
          className="w-20 h-20 bg-[#4CAF50] hover:bg-[#45a049] rounded-full shadow-lg"
        >
          <Camera className="w-8 h-8 text-white" />
        </Button>
      </div>
    </div>
  );
}
