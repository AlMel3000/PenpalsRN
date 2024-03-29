package live.eken.penpal;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.reactlibrary.RNCardViewPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import org.wonday.orientation.OrientationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.idehub.Billing.InAppBillingBridgePackage;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new ReactNativeLocalizationPackage(),
              new RNCardViewPackage(),
              new OrientationPackage(),
              new PickerPackage(),
              new RNFetchBlobPackage(),
              new InAppBillingBridgePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Fabric.with(this, new Crashlytics());
  }
}