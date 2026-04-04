package com.ns4.quiz;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.appcompat.app.AppCompatActivity;

import java.security.MessageDigest;

public class MainActivity extends AppCompatActivity {

    WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 🔐 Verify app pa modifye
        if (isAppTampered()) {
            finish();
            return;
        }

        webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();

        // 🔹 Basic settings
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);

        // 🔒 SECURITY
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        webSettings.setAllowFileAccess(false);
        webSettings.setAllowContentAccess(false);
        webSettings.setAllowFileAccessFromFileURLs(false);
        webSettings.setAllowUniversalAccessFromFileURLs(false);

        // 🔹 UI
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        // 🌐 Allow tout URL (pou update ekstèn)
        webView.setWebViewClient(new WebViewClient());

        // 🔹 Load URL (ou ka mete sit ou la)
        webView.loadUrl("https://globalplisht.onrender.com/");
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

    // 🔐 Anti-tampering (SHA-256)
    private boolean isAppTampered() {
        try {
            PackageInfo packageInfo;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageInfo = getPackageManager().getPackageInfo(
                        getPackageName(),
                        PackageManager.GET_SIGNING_CERTIFICATES
                );

                byte[] cert = packageInfo.signingInfo
                        .getApkContentsSigners()[0]
                        .toByteArray();

                String currentSignature = sha256(cert);

                // 🔥 METE SHA-256 OFISYÈL OU ISIT
                String officialSignature = "METE_SHA256_ISIT";

                return !currentSignature.equalsIgnoreCase(officialSignature);

            } else {
                packageInfo = getPackageManager().getPackageInfo(
                        getPackageName(),
                        PackageManager.GET_SIGNATURES
                );

                byte[] cert = packageInfo.signatures[0].toByteArray();

                String currentSignature = sha256(cert);

                String officialSignature = "METE_SHA256_ISIT";

                return !currentSignature.equalsIgnoreCase(officialSignature);
            }

        } catch (Exception e) {
            return true;
        }
    }

    // 🔑 SHA-256 function
    private String sha256(byte[] cert) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(cert);

            StringBuilder hexString = new StringBuilder();
            for (byte b : digest) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();

        } catch (Exception e) {
            return "";
        }
    }
}