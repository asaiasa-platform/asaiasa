package initializers

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var OauthConfig *oauth2.Config
var OauthConfigAdmin *oauth2.Config

func InitOAuth() {
	ClientID := os.Getenv("GOOGLE_CLIENT_ID")
	ClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	// Use FRONTEND_URL for OAuth redirect (where the React app handles the callback)
	FrontendURL := os.Getenv("FRONTEND_URL")
	if FrontendURL == "" {
		FrontendURL = os.Getenv("BASE_EXTERNAL_URL") // Fallback to BASE_EXTERNAL_URL
	}
	RedirectURL := FrontendURL + "/auth/google/callback"

	OauthConfig = &oauth2.Config{
		ClientID:     ClientID,
		ClientSecret: ClientSecret,
		RedirectURL:  RedirectURL,
		Scopes:       []string{"email", "profile"},
		Endpoint:     google.Endpoint,
	}
}

func InitAdminOAuth() {
	ClientID := os.Getenv("GOOGLE_CLIENT_ID")
	ClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	RedirectURL := os.Getenv("ADMIN_EXTERNAL_URL") + "/admin/auth/google/callback"

	OauthConfigAdmin = &oauth2.Config{
		ClientID:     ClientID,
		ClientSecret: ClientSecret,
		RedirectURL:  RedirectURL,
		Scopes:       []string{"email", "profile"},
		Endpoint:     google.Endpoint,
	}
}
