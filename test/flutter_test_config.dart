import 'dart:async';
import 'dart:io';

class _NoProxyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    final client = super.createHttpClient(context);
    client.findProxy = (uri) => 'DIRECT';
    return client;
  }

  @override
  String findProxyFromEnvironment(Uri uri, Map<String, String>? environment) {
    return 'DIRECT';
  }
}

void _configureNetworking() {
  HttpOverrides.global = _NoProxyHttpOverrides();
}

FutureOr<void> testExecutable(FutureOr<void> Function() testMain) {
  _configureNetworking();
  return testMain();
}
