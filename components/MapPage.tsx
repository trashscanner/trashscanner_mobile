import { Search, MapPin, Navigation, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function MapPage() {
  const recyclingPoints = [
    {
      id: 1,
      name: "Эко-центр Зелёный",
      address: "ул. Ленина, 45",
      distance: "0.3 км",
      types: ["Пластик", "Стекло", "Бумага"],
      isOpen: true
    },
    {
      id: 2,
      name: "Пункт сбора MetalCorp",
      address: "пр. Мира, 12",
      distance: "0.7 км",
      types: ["Металл", "Батарейки"],
      isOpen: true
    },
    {
      id: 3,
      name: "Городской экопункт",
      address: "ул. Садовая, 88",
      distance: "1.2 км",
      types: ["Пластик", "Бумага", "Одежда"],
      isOpen: false
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-[#4CAF50]" />
          <h1 className="font-medium">Пункты утилизации</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9E9E9E]" />
          <Input 
            placeholder="Введите адрес..."
            className="pl-10 pr-12 rounded-xl border-gray-200"
          />
          <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map Simulation */}
      <div className="flex-1 relative bg-gradient-to-br from-[#00BCD4]/5 to-[#4CAF50]/5">
        <div className="absolute inset-0 p-4">
          {/* Map placeholder with points */}
          <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Simulated map markers */}
              <div className="absolute top-6 left-8 w-6 h-6 bg-[#4CAF50] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-12 right-12 w-6 h-6 bg-[#00BCD4] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute bottom-8 left-16 w-6 h-6 bg-[#FF9800] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Current Location Button */}
          <Button className="absolute top-6 right-6 w-12 h-12 bg-white shadow-lg rounded-full border border-gray-200">
            <Navigation className="w-5 h-5 text-[#4CAF50]" />
          </Button>
        </div>
      </div>

      {/* Points List */}
      <div className="p-4 pb-24 space-y-3 max-h-60 overflow-y-auto">
        <h3 className="font-medium mb-3">Ближайшие пункты</h3>
        {recyclingPoints.map((point) => (
          <Card key={point.id} className="p-4 border-l-4 border-l-[#4CAF50]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{point.name}</h4>
                <p className="text-sm text-[#9E9E9E]">{point.address}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-[#00BCD4]">{point.distance}</span>
                <div className={`text-xs mt-1 ${point.isOpen ? 'text-[#4CAF50]' : 'text-red-500'}`}>
                  {point.isOpen ? 'Открыто' : 'Закрыто'}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {point.types.map((type, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}