package com.ns4.quiz;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();

        // 🔹 Basic settings
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);

        // 🔒 SECURITY SETTINGS
        webSettings.setAllowFileAccess(false); // bloke aksè dirèk nan fichye
        webSettings.setAllowContentAccess(false);

        webSettings.setAllowFileAccessFromFileURLs(false);
        webSettings.setAllowUniversalAccessFromFileURLs(false);

        // 🔹 UI
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        // 🔹 Secure WebView
        webView.setWebViewClient(new SecureWebViewClient());

        // 🔹 Load page
        webView.loadUrl("file:///android_asset/intro.html");
    }

    // 🔐 Custom WebViewClient pou sekirite
    private class SecureWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();

            // 🔒 Bloke nenpòt URL ekstèn
            if (!url.startsWith("file:///android_asset/")) {
                Toast.makeText(MainActivity.this, "Aksè entèdi ❌", Toast.LENGTH_SHORT).show();
                return true;
            }

            return false;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            Toast.makeText(MainActivity.this, "Erè chajman ❌", Toast.LENGTH_SHORT).show();
        }
    }

    // 🔙 Back button
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
                                                }
