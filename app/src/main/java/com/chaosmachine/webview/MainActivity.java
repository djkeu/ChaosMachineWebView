package com.chaosmachine.webview;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.net.http.SslError;
import android.os.Bundle;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler;

import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends AppCompatActivity {

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getDelegate().setLocalNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        // Configure WebView
        WebView webView = findViewById(R.id.webview);
        webView.setBackgroundColor(Color.TRANSPARENT);

        // Configure WebSettings with secure defaults
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        // File access settings
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(false);
        webSettings.setAllowUniversalAccessFromFileURLs(false);
        webSettings.setAllowContentAccess(false);
        webSettings.setGeolocationEnabled(false);
        webSettings.setDatabaseEnabled(false);
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);

        // Disable mixed content
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        // Configure cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, false);

        // Set up asset loader
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new AssetsPathHandler(this))
                .build();

        // Add enhanced JavaScript interface
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");

        // Enhanced WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrlLoading(url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrlLoading(request.getUrl().toString());
            }

            private boolean handleUrlLoading(String url) {
                if (url.startsWith("https://") ||
                        url.startsWith("https://appassets.androidplatform.net/assets/") ||
                        url.startsWith("file:///android_asset/") ||
                        isAllowedFileType(url)) {
                    return false;
                }
                Log.d("WEBVIEW_SECURITY", "Blocked URL: " + url);
                return true;
            }

            private boolean isAllowedFileType(String url) {
                if (!url.startsWith("file://")) {
                    return false;
                }
                String lowerUrl = url.toLowerCase();
                return lowerUrl.endsWith(".txt") ||
                        lowerUrl.endsWith(".json") ||
                        lowerUrl.endsWith(".png") ||
                        lowerUrl.endsWith(".jpg") ||
                        lowerUrl.endsWith(".jpeg") ||
                        lowerUrl.endsWith(".gif") ||
                        lowerUrl.endsWith(".webp") ||
                        lowerUrl.endsWith(".svg") ||
                        lowerUrl.endsWith(".bmp") ||
                        lowerUrl.contains("/android_asset/");
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();

                if (url.startsWith("file://") && !url.startsWith("file:///android_asset/")) {
                    if (!isAllowedFileType(url)) {
                        Log.w("WEBVIEW_SECURITY", "Blocked file access: " + url);
                        return new WebResourceResponse("text/plain", "UTF-8",
                                new java.io.ByteArrayInputStream("Access denied".getBytes()));
                    }
                    Log.d("WEBVIEW_FILE_ACCESS", "Allowing file access: " + url);
                }

                WebResourceResponse assetResponse = assetLoader.shouldInterceptRequest(request.getUrl());
                if (assetResponse != null) {
                    return assetResponse;
                }

                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                Log.e("WEBVIEW_SECURITY", "SSL Error: " + error.getPrimaryError());
                handler.cancel();
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d("WEBVIEW_TEST", "Page loaded: " + url);

                view.evaluateJavascript(
                        "var cspMeta = document.createElement('meta');" +
                                "cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');" +
                                "cspMeta.setAttribute('content', \"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';\");" +
                                "document.head.appendChild(cspMeta);",
                        null
                );
            }
        });

        // Configure WebChromeClient
        webView.setWebChromeClient(new WebChromeClient() {

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, false, false);
            }
        });

        // Load the initial URL
        webView.loadUrl("file:///android_asset/index.html");

        ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    /**
     * Enhanced JavaScript interface with file loading capability
     */
    private class WebAppInterface {
        private MainActivity mActivity;

        // Changed parameter type from Context to MainActivity
        WebAppInterface(MainActivity activity) {
            this.mActivity = activity;
        }

        @JavascriptInterface
        public void performAction(String data) {
            if (data == null || data.isEmpty()) {
                Log.e("WEBVIEW_SECURITY", "Invalid empty data passed to JS interface");
                return;
            }
            Log.d("WEBVIEW_JS", "Data received from JavaScript: " + data);
        }

        @JavascriptInterface
        public String loadAssetFile(String path) {
            try (InputStream is = getAssets().open(path)) {
                byte[] buffer = new byte[is.available()];
                is.read(buffer);
                return new String(buffer);
            } catch (IOException e) {
                Log.e("WEBVIEW_FILE", "Error loading: " + path, e);
                return "";
            }
        }
    }
}
