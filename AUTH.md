
### SETTING AUTHENTICATION WITH MICROSOFT AZURE

1. Register a web application inside Microsoft Azure
The procedure is explained here : 
[https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app](Register a web app)
In french : 
[https://docs.microsoft.com/fr-fr/azure/active-directory/develop/quickstart-register-app](Service d'Identité Microsoft Azure : Inscription d'une application tierce)

This first step should easily give us the application id
X-track-share Application Id : cb57aba1-18fe-4f2d-8eae-90522dd298e0
Application secret : q157Q~PFRhB2tmLsT~g2dK1TqfT-LP5aGRLhg

Now we need to generate an aplication secret which will only last 2 years.
Application secret : ??

2. Activate Microsoft authentication inside the Firebase app settings : 

Authentication > Sign-in method

> Provide the Application ID and Application secret

Copy back in Microsoft Azure the redirect URI

