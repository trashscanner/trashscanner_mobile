import { User, Settings, Bell, Globe, Moon, LogOut, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

interface ProfilePageProps {
  setCurrentPage: (page: string) => void;
}

export function ProfilePage({ setCurrentPage }: ProfilePageProps) {
  const user = {
    name: 'Анна Петрова',
    email: 'anna.petrova@email.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616c13488ac?w=150&h=150&fit=crop&crop=face',
  };

  const settingsItems = [
    {
      icon: Bell,
      title: 'Уведомления',
      subtitle: 'Push-уведомления и напоминания',
      hasSwitch: true,
      value: true,
    },
    {
      icon: Globe,
      title: 'Язык',
      subtitle: 'Русский',
      hasSwitch: false,
    },
    {
      icon: Moon,
      title: 'Тёмная тема',
      subtitle: 'Автоматически',
      hasSwitch: true,
      value: false,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-[#4CAF50]" />
          <h1 className="font-medium">Профиль</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pb-24 overflow-y-auto">
        {/* User Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-[#4CAF50]/10 text-[#4CAF50]">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-medium text-lg">{user.name}</h2>
              <p className="text-[#9E9E9E] text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-[#4CAF50] rounded-full"></div>
                <span className="text-xs text-[#4CAF50]">Эко-активист</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="font-medium text-lg text-[#4CAF50]">127</p>
            <p className="text-xs text-[#9E9E9E]">Анализов</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="font-medium text-lg text-[#00BCD4]">45.2</p>
            <p className="text-xs text-[#9E9E9E]">кг</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="font-medium text-lg text-[#FF9800]">15</p>
            <p className="text-xs text-[#9E9E9E]">Дней</p>
          </Card>
        </div>

        {/* Settings */}
        <Card className="p-4 mb-6">
          <h3 className="font-medium mb-4">Настройки</h3>
          <div className="space-y-4">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#4CAF50]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-[#9E9E9E]">{item.subtitle}</p>
                    </div>
                  </div>
                  {item.hasSwitch ? (
                    <Switch checked={item.value} onCheckedChange={() => {}} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#9E9E9E]" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-4 mb-6">
          <h3 className="font-medium mb-4">Достижения</h3>
          <div className="flex gap-3 overflow-x-auto">
            {['🌱', '♻️', '🏆', '⭐', '🌍'].map((emoji, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-12 h-12 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center"
              >
                <span className="text-lg">{emoji}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Logout */}
        <Button
          onClick={() => setCurrentPage('auth')}
          variant="outline"
          className="w-full border-red-200 text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
}
