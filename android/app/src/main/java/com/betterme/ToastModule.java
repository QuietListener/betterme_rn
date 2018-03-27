package com.betterme;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Nullable;

import java.net.HttpCookie;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookieStore;


public class ToastModule extends ReactContextBaseJavaModule {

    static CookieManager cm = new java.net.CookieManager();

    static {
        CookieHandler.setDefault(cm);
    }

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public ToastModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AnotherToastAndroid"; // 不能返回ToastAndroid，这个会报错，或者需要手动指定覆盖RN已有的实现。
    }

    @ReactMethod
    public void show(String message, int duration) {
        CookieStore cookieStore = cm.getCookieStore();

        List<HttpCookie> cookieList = cookieStore.getCookies();

        String name = "cookies:";
        for (HttpCookie cookie : cookieList)
        {
           name += "\n"+ cookie.getDomain() + ";" +  cookie.getMaxAge()  +";"+ cookie.getName()+"="+cookie.getValue();
        }

        message = name;
        System.out.println(message);
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }


//    @ReactMethod
//    public void setCookie(String domain, String name, String value) {
//        CookieStore cookieStore = cm.getCookieStore();
//
//        List cookieList = cookieStore.getCookies();
//
//        for (HttpCookie cookie : cookieList)
//        {
//           String name =  cookie.getDomain() + ";" +  cookie.getMaxAge()  +";"+ cookie.getName()+"="+cookie.getValue();
//        }
//
//    }

    /**
     * [可选方法]，导出给JS使用的常量。
     *
     * @return
     */
    @Nullable
    @Override
    public Map<String, Object> getConstants() {
//    return super.getConstants();
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

}


class ToastReactPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ToastModule(reactContext));

        return modules;
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}