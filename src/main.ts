import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

(async () => {
  const PCA = new PublicClientApplication({
    auth: {
      clientId: 'ac0ca62a-d8d0-46a3-a8f0-67b5b8d9ceac',
      authority: 'https://login.microsoftonline.com/8fa34533-db7c-401c-a96e-22f7ea044ade',
      redirectUri: 'https://34.192.55.32',
      // redirectUri: 'http://localhost:4200'
    },
  });

  await PCA.initialize();

  bootstrapApplication(AppComponent, {
    providers: [
      ...appConfig.providers,
      provideHttpClient(),
      importProvidersFrom(
        BrowserModule,
        MsalModule.forRoot(
          PCA,
          {
            interactionType: InteractionType.Popup,
            authRequest: { scopes: ['user.read'] },
          },
          {
            interactionType: InteractionType.Redirect,
            protectedResourceMap: new Map([
              ['https://graph.microsoft.com/v1.0/me', ['user.read']],
            ]),
          }
        )
      ),
    ]
  })
    .catch(err => console.error(err));
})();
