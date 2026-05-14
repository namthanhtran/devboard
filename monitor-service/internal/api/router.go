package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/namthanhtran/devboard/monitor-service/internal/api/middleware"
	"github.com/namthanhtran/devboard/monitor-service/internal/config"
	"gorm.io/gorm"
)

func NewRouter(cfg *config.Config, db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS())

	// Health-check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "monitor",
		})
	})

	// Protected routes
	auth := r.Group("")
	auth.Use(middleware.JWTAuth(cfg.JwtAccessSecret))
	{
		// Handler
	}

	return r
}
