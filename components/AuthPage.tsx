import { useState } from 'react';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuthPageProps {
  setCurrentPage: (page: string) => void;
}

export function AuthPage({ setCurrentPage }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Симуляция авторизации
    setCurrentPage('camera');
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1750451187464-90febd11576f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjByZWN5Y2xpbmclMjBlbnZpcm9ubWVudGFsfGVufDF8fHx8MTc1ODgyNTczOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Environmental background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4CAF50]/20 via-white/40 to-white/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center flex-1 px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">Анализатор мусора</h1>
          <p className="text-[#9E9E9E]">Забота об экологии начинается с вас</p>
        </div>

        {/* Auth Form */}
        <Card className="p-6 mx-auto w-full max-w-sm bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-medium text-lg">
                {isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'}
              </h2>
            </div>

            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl border-gray-200"
                />
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="rounded-xl border-gray-200 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-xl h-12"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[#00BCD4] hover:underline"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
              </button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-[#9E9E9E]">
            Используя приложение, вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    </div>
  );
}
