package com.ns4.quiz;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();

        // 🔹 Aktive JavaScript, HTML, CSS, Audio
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // 🔹 UI
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        // 🔹 Ouvri URL ekstèn
        webView.setWebViewClient(new WebViewClient());

        // 🔹 Chaje fichye lokal la (intro.html nan assets folder)
        webView.loadUrl("file:///android_asset/intro.html");
    }

    // 🔙 Back button pou navigasyon WebView
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}