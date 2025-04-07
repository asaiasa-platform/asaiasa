package api

import (
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/handler"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/repository"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/service"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/middleware"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func NewAuthRouter(app *fiber.App, db *gorm.DB, jwtSecret string) {
	userRepo := repository.NewUserRepository(db)
	profileRepo := repository.NewProfileRepository(db)

	// Dependencies Injections for Auth
	authService := service.NewAuthService(userRepo, profileRepo, jwtSecret)
	oauthService := service.NewOauthService(userRepo, profileRepo, jwtSecret)
	authHandler := handler.NewAuthHandler(authService)
	oauthHandler := handler.NewOauthHandler(oauthService)

	app.Get("/auth/me", middleware.AuthMiddleware(jwtSecret), oauthHandler.Me)
	app.Post("/admin/login", authHandler.LogInAdmin)
	app.Post("/admin/logout", authHandler.LogOutAdmin)
	app.Post("/signup", authHandler.SignUp)
	app.Post("/login", authHandler.LogIn)
	app.Get("/auth/google/callback", oauthHandler.GoogleCallback)
	app.Get("/admin/auth/google/callback", oauthHandler.AdminGoogleCallback)
	// app.Get("/auth/google", oauthHandler.GoogleLogin)
	app.Post("/logout", authHandler.LogOut)

	app.Get("/protected-route", middleware.AuthMiddleware(jwtSecret), func(c *fiber.Ctx) error {
		user := c.Locals("user")
		return c.JSON(fiber.Map{
			"message": "You are authenticated!",
			"user":    user,
		})
	})
	app.Get("/token-check", middleware.AuthMiddleware(jwtSecret), func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})
}
