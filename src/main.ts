import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { JwtInterceptor } from './app/interceptors/jwt.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from './environments/environment';

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
script.async = true;
script.defer = true;

script.onload = () => {
  console.log('Google Maps API script loaded');
};

script.onerror = () => {
  console.error('Échec de chargement de Google Maps API');
};
document.head.appendChild(script);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    provideAnimationsAsync(),
  ],
});
