package com.chaosmachine.webview;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.EdgeToEdge;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler;

import java.util.HashMap;
import java.util.Map;

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
        webSettings.setJavaScriptEnabled(true); // Required for your modules
        webSettings.setDomStorageEnabled(true);

        // Disable potentially dangerous features
        webSettings.setAllowFileAccess(false); // Changed to false for better security
        webSettings.setAllowFileAccessFromFileURLs(false);
        webSettings.setAllowUniversalAccessFromFileURLs(false);
        webSettings.setAllowContentAccess(false);
        webSettings.setGeolocationEnabled(false);
        webSettings.setDatabaseEnabled(false);
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);

        // Disable saving form data and passwords
        webSettings.setSaveFormData(false);
        webSettings.setSavePassword(false);

        // Disable mixed content (HTTP content in HTTPS pages)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }

        // Configure safer cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, false);

        // Set up asset loader for safer local content loading
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new AssetsPathHandler(this))
                .build();

        // Add JavaScript interface for native communication if needed
        webView.addJavascriptInterface(new WebAppInterface(), "Android");

        // Enhanced WebViewClient with additional security controls
        webView.setWebViewClient(new WebViewClient() {
            // For Android < 7.0 (API 24)
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrlLoading(url);
            }

            // For Android 7.0+ (API 24+)
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrlLoading(request.getUrl().toString());
            }

            private boolean handleUrlLoading(String url) {
                // Only allow HTTPS and properly structured local asset URLs
                if (url.startsWith("https://") ||
                        url.startsWith("https://appassets.androidplatform.net/assets/")) {
                    return false; // Allow loading
                }
                Log.d("WEBVIEW_SECURITY", "Blocked URL: " + url);
                return true; // Block all other URLs
            }

            // Intercept requests to load from assets securely
            @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            // Handle SSL errors - fail closed for security
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                Log.e("WEBVIEW_SECURITY", "SSL Error: " + error.getPrimaryError());
                handler.cancel(); // Fail closed - don't proceed on SSL errors

                // Optionally show an error message to the user
                // Toast.makeText(MainActivity.this, "Security error: unable to establish secure connection", Toast.LENGTH_LONG).show();
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d("WEBVIEW_TEST", "Page loaded: " + url);

                // Inject CSP header for additional XSS protection
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    view.evaluateJavascript(
                            "var cspMeta = document.createElement('meta');" +
                                    "cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');" +
                                    "cspMeta.setAttribute('content', \"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';\");" +
                                    "document.head.appendChild(cspMeta);",
                            null
                    );
                }
            }
        });

        // Configure WebChromeClient with permission restrictions
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Deny all permission requests
                request.deny();
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                // Deny geolocation permission requests
                callback.invoke(origin, false, false);
            }
        });

        // Load local content securely through asset loader
        // webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");

        // If you need to use direct file loading for legacy reasons (less secure)
        webView.loadUrl("file:///android_asset/index.html");

        ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    /**
     * JavaScript interface that provides a bridge between JavaScript and Android code.
     * All methods that should be accessible from JavaScript must use the @JavascriptInterface annotation.
     */
    private class WebAppInterface {
        @JavascriptInterface
        public void performAction(String data) {
            // Validate input before processing
            if (data == null || data.isEmpty()) {
                Log.e("WEBVIEW_SECURITY", "Invalid empty data passed to JS interface");
                return;
            }

            // Process validated data
            Log.d("WEBVIEW_JS", "Data received from JavaScript: " + data);

            // Handle the action securely
            // ...
        }
    }
}