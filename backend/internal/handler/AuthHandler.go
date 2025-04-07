package handler

import (
	"os"
	"time"

	"github.com/DAF-Bridge/Talent-Atmos-Backend/errs"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/internal/service"
	"github.com/DAF-Bridge/Talent-Atmos-Backend/logs"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type SignUpHandlerRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
}

func (a *AuthHandler) SignUp(c *fiber.Ctx) error {
	// parse request
	var req SignUpHandlerRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Generate token
	token, err := a.authService.SignUp(req.Name, req.Email, req.Password, req.Phone)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "authToken",
		Value:    token,                              // Token from the auth service
		Expires:  time.Now().Add(time.Hour * 24 * 7), // Set expiration for 7 days
		HTTPOnly: true,                               // Prevent JavaScript access to the cookie
		Secure:   os.Getenv("ENVIRONMENT") != "dev",  // Only send the cookie over HTTPS in production
		SameSite: fiber.CookieSameSiteNoneMode,       // Allow cross-site cookie sharing
		Path:     "/",                                // Path for which the cookie is valid
		Domain:   os.Getenv("COOKIE_DOMAIN"),         // Domain for which the cookie is valid
	})

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Sign up successful"})
}

func (a *AuthHandler) LogIn(c *fiber.Ctx) error {
	// parse request
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Generate token
	token, err := a.authService.LogIn(req.Email, req.Password)
	if err != nil {
		logs.Error(err.Error())
		return errs.SendFiberError(c, err)
	}

	// Set the JWT token in a cookie after redirect
	c.Cookie(&fiber.Cookie{
		Name:     "authToken",
		Value:    token,                              // Token from the auth service
		Expires:  time.Now().Add(time.Hour * 24 * 7), // Set expiration for 7 days
		HTTPOnly: true,                               // Prevent JavaScript access to the cookie
		Secure:   os.Getenv("ENVIRONMENT") != "dev",  // Only send the cookie over HTTPS in production
		SameSite: fiber.CookieSameSiteNoneMode,       // Allow cross-site cookie sharing
		Path:     "/",                                // Path for which the cookie is valid
		Domain:   os.Getenv("COOKIE_DOMAIN"),         // Domain for which the cookie is valid
	})

	// Send response and return nil to ensure proper handling
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Login successful"})
}

func (a *AuthHandler) LogOut(c *fiber.Ctx) error {
	// Delete JWT cookie
	c.Cookie(&fiber.Cookie{
		Name:     "authToken",
		Value:    "",                             // empty value
		Expires:  time.Now().Add(-1 * time.Hour), // set expiry in the past
		HTTPOnly: true,
		Secure:   os.Getenv("ENVIRONMENT") != "dev",
		SameSite: fiber.CookieSameSiteNoneMode,
		Path:     "/",                        // important: must match the path used when setting
		Domain:   os.Getenv("COOKIE_DOMAIN"), // Domain for which the cookie is valid
	})
	// Optionally, redirect to a logout page or send a response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Logout successful"})
}

// ----------------------------
// 			Admin
// ----------------------------

func (a *AuthHandler) LogInAdmin(c *fiber.Ctx) error {
	// parse request
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Generate token
	token, err := a.authService.LogIn(req.Email, req.Password)
	if err != nil {
		logs.Error(err.Error())
		return errs.SendFiberError(c, err)
	}

	// Set the JWT token in a cookie after redirect
	c.Cookie(&fiber.Cookie{
		Name:     "authToken",
		Value:    token,                              // Token from the auth service
		Expires:  time.Now().Add(time.Hour * 24 * 7), // Set expiration for 7 days
		HTTPOnly: true,                               // Prevent JavaScript access to the cookie
		Secure:   os.Getenv("ENVIRONMENT") != "dev",  // Only send the cookie over HTTPS in production
		SameSite: fiber.CookieSameSiteNoneMode,       // Allow cross-site cookie sharing
		Path:     "/",                                // Path for which the cookie is valid
		Domain:   os.Getenv("COOKIE_ADMIN_DOMAIN"),   // Domain for which the cookie is valid
	})

	// Send response and return nil to ensure proper handling
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Login successful"})
}

func (a *AuthHandler) LogOutAdmin(c *fiber.Ctx) error {
	// Delete JWT cookie
	c.Cookie(&fiber.Cookie{
		Name:     "authToken",
		Value:    "",                             // empty value
		Expires:  time.Now().Add(-1 * time.Hour), // set expiry in the past
		HTTPOnly: true,
		Secure:   os.Getenv("ENVIRONMENT") != "dev",
		SameSite: fiber.CookieSameSiteNoneMode,
		Path:     "/",                              // important: must match the path used when setting
		Domain:   os.Getenv("COOKIE_ADMIN_DOMAIN"), // Domain for which the cookie is valid
	})
	// Optionally, redirect to a logout page or send a response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Logout successful"})
}
