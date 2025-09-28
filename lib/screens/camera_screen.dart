import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

import '../theme/app_theme.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key, required this.onCapture});

  final ValueChanged<String> onCapture;

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> with WidgetsBindingObserver {
  CameraController? _controller;
  Future<void>? _initializeControllerFuture;
  bool _isCapturing = false;
  String? _errorMessage;
  bool _permissionPermanentlyDenied = false;
  static const List<ResolutionPreset> _resolutionCandidates = <ResolutionPreset>[
    ResolutionPreset.high,
    ResolutionPreset.medium,
    ResolutionPreset.low,
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeCamera();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _disposeController();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (!mounted) {
      return;
    }

    if (state == AppLifecycleState.resumed) {
      if (_controller == null && !_permissionPermanentlyDenied) {
        _initializeCamera();
      }
    } else if (state == AppLifecycleState.inactive || state == AppLifecycleState.paused) {
      _disposeController();
    }
  }

  Future<void> _initializeCamera() async {
    if (!mounted) {
      return;
    }

    _disposeController();

    final hasPermission = await _ensurePermission();
    if (!hasPermission || !mounted) {
      return;
    }

    try {
      final cameras = await availableCameras();
      if (!mounted) return;

      if (cameras.isEmpty) {
        setState(() {
          _errorMessage = 'Камера не найдена на устройстве.';
        });
        return;
      }

      final camera = cameras.firstWhere(
        (cam) => cam.lensDirection == CameraLensDirection.back,
        orElse: () => cameras.first,
      );

      CameraException? lastCameraException;
      Object? lastError;

      for (final preset in _resolutionCandidates) {
        if (!mounted) return;

        final controller = CameraController(
          camera,
          preset,
          enableAudio: false,
          imageFormatGroup: ImageFormatGroup.jpeg,
        );

        final initializeFuture = controller.initialize();

        setState(() {
          _controller = controller;
          _initializeControllerFuture = initializeFuture;
          _errorMessage = null;
          _permissionPermanentlyDenied = false;
        });

        try {
          await initializeFuture;
          if (!mounted) return;
          setState(() {});
          return;
        } on CameraException catch (e) {
          lastCameraException = e;
          await controller.dispose();
          if (!mounted) return;
          setState(() {
            _controller = null;
            _initializeControllerFuture = null;
          });
        } catch (e) {
          lastError = e;
          await controller.dispose();
          if (!mounted) return;
          setState(() {
            _controller = null;
            _initializeControllerFuture = null;
          });
        }
      }

      if (!mounted) return;
      setState(() {
        _errorMessage = lastCameraException?.description ?? lastError?.toString() ??
            'Не удалось инициализировать камеру.';
      });
    } on CameraException catch (e) {
      setState(() {
        _errorMessage = e.description ?? 'Ошибка доступа к камере.';
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Не удалось инициализировать камеру.';
      });
    }
  }

  Future<bool> _ensurePermission() async {
    final status = await Permission.camera.status;
    if (status.isGranted) {
      return true;
    }

    final result = await Permission.camera.request();
    if (result.isGranted) {
      setState(() {
        _permissionPermanentlyDenied = false;
        _errorMessage = null;
      });
      return true;
    }

    if (result.isPermanentlyDenied) {
      setState(() {
        _permissionPermanentlyDenied = true;
        _errorMessage = 'Доступ к камере запрещён. Разрешите доступ в настройках.';
      });
    } else {
      setState(() {
        _permissionPermanentlyDenied = false;
        _errorMessage = 'Доступ к камере запрещён.';
      });
    }

    return false;
  }

  void _disposeController() {
    final controller = _controller;
    _controller = null;
    _initializeControllerFuture = null;
    controller?.dispose();
  }

  Future<void> _capturePhoto() async {
    final controller = _controller;
    final initializeFuture = _initializeControllerFuture;
    if (controller == null || initializeFuture == null || _isCapturing) {
      return;
    }

    try {
      setState(() {
        _isCapturing = true;
      });

      await initializeFuture;
      final file = await controller.takePicture();
      if (!mounted) return;

      widget.onCapture(file.path);
    } on CameraException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.description ?? 'Не удалось сделать снимок')),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Не удалось сделать снимок')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isCapturing = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context),
            const SizedBox(height: 24),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: _buildViewfinder(context),
              ),
            ),
            const SizedBox(height: 32),
            _buildCaptureButton(),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.bolt, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 12),
          Text(
            'Анализатор мусора',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildViewfinder(BuildContext context) {
    if (_errorMessage != null) {
      return _buildError(context);
    }

    final controller = _controller;
    final initializeFuture = _initializeControllerFuture;

    if (controller == null || initializeFuture == null) {
      return _buildLoadingPlaceholder(
        context,
        message: 'Подключаем камеру...',
      );
    }

    return FutureBuilder<void>(
      future: initializeFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done ||
            !controller.value.isInitialized) {
          return _buildLoadingPlaceholder(
            context,
            message: 'Подключаем камеру...',
          );
        }

        return AspectRatio(
          aspectRatio: 1,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(32),
              border: Border.all(
                color: AppColors.primary.withValues(alpha: 0.2),
                width: 6,
              ),
            ),
            clipBehavior: Clip.antiAlias,
            child: Stack(
              fit: StackFit.expand,
              children: [
                CameraPreview(controller),
                _buildPreviewOverlay(),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPreviewOverlay() {
    return Stack(
      fit: StackFit.expand,
      children: [
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color(0x0A00BCD4),
                Color(0x0A4CAF50),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(64),
          child: CustomPaint(
            painter: _CrosshairPainter(),
          ),
        ),
      ],
    );
  }

  Widget _buildLoadingPlaceholder(BuildContext context, {required String message}) {
    return _buildPlaceholder(
      context,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 68,
            height: 68,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.photo_camera,
              color: AppColors.primary,
              size: 34,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(color: AppColors.neutral),
          ),
        ],
      ),
    );
  }

  Widget _buildError(BuildContext context) {
    return _buildPlaceholder(
      context,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.warning_rounded, color: AppColors.error, size: 42),
            const SizedBox(height: 12),
            Text(
              _errorMessage ?? 'Ошибка камеры',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: 16),
            if (_permissionPermanentlyDenied) ...[
              FilledButton(
                onPressed: () async {
                  await openAppSettings();
                },
                child: const Text('Открыть настройки'),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: _initializeCamera,
                child: const Text('Проверить снова'),
              ),
            ] else
              FilledButton(
                onPressed: _initializeCamera,
                child: const Text('Повторить'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder(BuildContext context, {required Widget child}) {
    return AspectRatio(
      aspectRatio: 1,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(32),
          border: Border.all(
            color: AppColors.primary.withValues(alpha: 0.2),
            width: 6,
          ),
          gradient: const LinearGradient(
            colors: [
              Color(0x1400BCD4),
              Color(0x144CAF50),
            ],
          ),
        ),
        child: Center(child: child),
      ),
    );
  }

  Widget _buildCaptureButton() {
    final canCapture =
        _controller?.value.isInitialized == true && !_isCapturing && _errorMessage == null;

    return GestureDetector(
      onTap: canCapture ? _capturePhoto : null,
      child: AnimatedOpacity(
        opacity: canCapture ? 1 : 0.4,
        duration: const Duration(milliseconds: 200),
        child: Container(
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
          child: Center(
            child: _isCapturing
                ? const SizedBox(
                    width: 28,
                    height: 28,
                    child: CircularProgressIndicator(
                      strokeWidth: 3,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Icon(Icons.photo_camera, color: Colors.white, size: 32),
          ),
        ),
      ),
    );
  }
}

class _CrosshairPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    const radius = 12.0;

    final path = Path()
      ..moveTo(rect.left, rect.top + radius)
      ..quadraticBezierTo(rect.left, rect.top, rect.left + radius, rect.top)
      ..lineTo(rect.center.dx - 16, rect.top)
      ..moveTo(rect.center.dx + 16, rect.top)
      ..lineTo(rect.right - radius, rect.top)
      ..quadraticBezierTo(rect.right, rect.top, rect.right, rect.top + radius)
      ..lineTo(rect.right, rect.center.dy - 16)
      ..moveTo(rect.right, rect.center.dy + 16)
      ..lineTo(rect.right, rect.bottom - radius)
      ..quadraticBezierTo(rect.right, rect.bottom, rect.right - radius, rect.bottom)
      ..lineTo(rect.center.dx + 16, rect.bottom)
      ..moveTo(rect.center.dx - 16, rect.bottom)
      ..lineTo(rect.left + radius, rect.bottom)
      ..quadraticBezierTo(rect.left, rect.bottom, rect.left, rect.bottom - radius)
      ..lineTo(rect.left, rect.center.dy + 16)
      ..moveTo(rect.left, rect.center.dy - 16)
      ..lineTo(rect.left, rect.top + radius);

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
