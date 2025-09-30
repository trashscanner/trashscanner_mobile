import { Camera, BarChart3, MapPin, User } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navigationItems = [
    { id: "camera", icon: Camera, label: "Камера" },
    { id: "stats", icon: BarChart3, label: "Статистика" },
    { id: "map", icon: MapPin, label: "Карта" },
    { id: "profile", icon: User, label: "Профиль" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive
                  ? "text-[#4CAF50]"
                  : "text-[#9E9E9E] hover:text-[#4CAF50]"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
