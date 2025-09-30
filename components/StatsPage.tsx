import { BarChart3, TrendingUp, Award, Recycle } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export function StatsPage() {
  const stats = {
    totalAnalyzed: 127,
    totalRecycled: 45.2,
    weeklyGrowth: 12,
    rank: 'Эко-активист',
  };

  const wasteTypes = [
    { type: 'Пластик', count: 54, percentage: 42, color: '#4CAF50' },
    { type: 'Стекло', count: 28, percentage: 22, color: '#00BCD4' },
    { type: 'Бумага', count: 25, percentage: 20, color: '#FF9800' },
    { type: 'Металл', count: 20, percentage: 16, color: '#9C27B0' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#4CAF50]" />
          <h1 className="font-medium">Статистика</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pb-24 overflow-y-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-[#4CAF50]/5 to-[#4CAF50]/10 border-[#4CAF50]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4CAF50]/20 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-[#4CAF50]" />
              </div>
              <div>
                <p className="text-2xl font-medium">{stats.totalAnalyzed}</p>
                <p className="text-xs text-[#9E9E9E]">Проанализировано</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#00BCD4]/5 to-[#00BCD4]/10 border-[#00BCD4]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00BCD4]/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#00BCD4]" />
              </div>
              <div>
                <p className="text-2xl font-medium">{stats.totalRecycled}</p>
                <p className="text-xs text-[#9E9E9E]">кг переработано</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievement */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-[#4CAF50]/5 to-[#00BCD4]/5 border-[#4CAF50]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#4CAF50]/20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-[#4CAF50]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">Ваш статус</h3>
              <p className="text-[#4CAF50] font-medium">{stats.rank}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-[#00BCD4]" />
                <span className="text-sm text-[#9E9E9E]">+{stats.weeklyGrowth}% за неделю</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Waste Types Distribution */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">Типы отходов</h3>
          <div className="space-y-4">
            {wasteTypes.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{item.type}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Goal */}
        <Card className="p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Цель недели</h3>
            <span className="text-sm text-[#4CAF50] font-medium">7/10</span>
          </div>
          <Progress value={70} className="h-3 mb-2" />
          <p className="text-sm text-[#9E9E9E]">Проанализировать 10 предметов</p>
        </Card>
      </div>
    </div>
  );
}
