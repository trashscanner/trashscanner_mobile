import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key, required this.onAuthenticated});

  final VoidCallback onAuthenticated;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLogin = true;
  bool _showPassword = false;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  void _toggleMode() {
    setState(() {
      _isLogin = !_isLogin;
    });
  }

  void _toggleShowPassword() {
    setState(() {
      _showPassword = !_showPassword;
    });
  }

  void _submit() {
    if (_formKey.currentState?.validate() ?? false) {
      widget.onAuthenticated();
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.network(
            'https://images.unsplash.com/photo-1750451187464-90febd11576f?auto=format&fit=crop&w=1080&q=80',
            fit: BoxFit.cover,
          ),
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x334CAF50),
                  Color(0x88FFFFFF),
                  Color(0xE6FFFFFF),
                ],
              ),
            ),
          ),
          BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 6, sigmaY: 6),
            child: const SizedBox.expand(),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: size.height - 48),
                child: IntrinsicHeight(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 32),
                      _buildLogo(context),
                      const SizedBox(height: 32),
                      _buildAuthCard(context),
                      const Spacer(),
                      const SizedBox(height: 24),
                      Text(
                        'Используя приложение, вы соглашаетесь с условиями использования',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogo(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 88,
          height: 88,
          decoration: const BoxDecoration(
            color: AppColors.primary,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Color(0x334CAF50),
                blurRadius: 20,
                offset: Offset(0, 12),
              ),
            ],
          ),
          child: const Icon(Icons.eco, color: Colors.white, size: 42),
        ),
        const SizedBox(height: 16),
        Text(
          'Анализатор мусора',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 6),
        Text(
          'Забота об экологии начинается с вас',
          style: Theme.of(context)
              .textTheme
              .bodyMedium
              ?.copyWith(color: AppColors.neutral),
        ),
      ],
    );
  }

  Widget _buildAuthCard(BuildContext context) {
    return Card(
      elevation: 12,
      shadowColor: const Color(0x14333333),
      surfaceTintColor: Colors.white,
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                _isLogin ? 'Войти в аккаунт' : 'Создать аккаунт',
                textAlign: TextAlign.center,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 24),
              if (!_isLogin) ...[
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    hintText: 'Ваше имя',
                  ),
                  textInputAction: TextInputAction.next,
                  validator: (value) {
                    if (!_isLogin && (value == null || value.trim().isEmpty)) {
                      return 'Введите имя';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
              ],
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  hintText: 'Email',
                ),
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Введите email';
                  }
                  if (!value.contains('@')) {
                    return 'Некорректный email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  hintText: 'Пароль',
                  suffixIcon: IconButton(
                    onPressed: _toggleShowPassword,
                    icon: Icon(
                      _showPassword ? Icons.visibility_off : Icons.visibility,
                      color: AppColors.neutral,
                    ),
                  ),
                ),
                obscureText: !_showPassword,
                validator: (value) {
                  if (value == null || value.length < 6) {
                    return 'Минимум 6 символов';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: _submit,
                child: Text(_isLogin ? 'Войти' : 'Зарегистрироваться'),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: _toggleMode,
                child: Text(
                  _isLogin
                      ? 'Нет аккаунта? Зарегистрируйтесь'
                      : 'Уже есть аккаунт? Войдите',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
