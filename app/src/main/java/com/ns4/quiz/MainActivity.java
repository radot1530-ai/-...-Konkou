package com.ns4.quiz;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();

        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);

        // Enable LocalStorage (important for your quiz progress)
        webSettings.setDomStorageEnabled(true);

        // Enable database storage (for older Android)
        webSettings.setDatabaseEnabled(true);

        // Allow file access
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);

        // Prevent opening browser outside the app
        webView.setWebViewClient(new WebViewClient());

        // Load your page
        webView.loadUrl("file:///android_asset/intro.html");
    }
}
