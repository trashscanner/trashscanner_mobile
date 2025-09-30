import { ArrowLeft, RefreshCw, MapPin, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AnalysisPageProps {
  setCurrentPage: (page: string) => void;
  capturedImage: string | null;
}

export function AnalysisPage({ setCurrentPage, capturedImage }: AnalysisPageProps) {
  const analysisResult = {
    type: 'Пластик',
    category: 'PET-бутылка',
    recyclingInfo: 'Отправить в контейнер для пластика',
    confidence: 95,
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Button variant="ghost" onClick={() => setCurrentPage('camera')} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-medium">Результат анализа</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pb-24">
        {/* Captured Image */}
        <div className="mb-6">
          <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden shadow-md">
            {capturedImage && (
              <ImageWithFallback
                src={capturedImage}
                alt="Captured trash"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Analysis Result Card */}
        <Card className="p-6 mb-6 border-[#4CAF50]/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-2">{analysisResult.type}</h3>
              <p className="text-[#9E9E9E] mb-3">{analysisResult.category}</p>

              <div className="bg-[#4CAF50]/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-[#4CAF50] mb-2">Рекомендация</h4>
                <p className="text-sm">{analysisResult.recyclingInfo}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9E9E9E]">Уверенность:</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#4CAF50] h-2 rounded-full"
                    style={{ width: `${analysisResult.confidence}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{analysisResult.confidence}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => setCurrentPage('camera')}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-xl h-12"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Повторить анализ
          </Button>

          <Button
            onClick={() => setCurrentPage('map')}
            variant="outline"
            className="w-full border-[#00BCD4] text-[#00BCD4] hover:bg-[#00BCD4]/5 rounded-xl h-12"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Найти пункт утилизации
          </Button>
        </div>
      </div>
    </div>
  );
}
