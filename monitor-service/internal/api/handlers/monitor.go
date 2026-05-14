package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/namthanhtran/devboard/monitor-service/internal/models"
	"gorm.io/gorm"
)

type MonitorHandler struct {
	db *gorm.DB
}

func NewMonitorHandler(db *gorm.DB) *MonitorHandler {
	return &MonitorHandler{db: db}
}

// POST /monitors
func (h *MonitorHandler) Create(c *gin.Context) {
	userId := c.GetInt("userId")

	var dto models.CreateMonitorDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status_code": http.StatusBadRequest,
			"message":     err.Error(),
		})
		return
	}

	monitor := models.Monitor{
		UserID:           userId,
		ProjectID:        dto.ProjectID,
		Name:             dto.Name,
		URL:              dto.URL,
		Method:           dto.Method,
		Interval:         dto.Interval,
		Timeout:          dto.Timeout,
		ExpectedStatus:   dto.ExpectedStatus,
		AlertEnabled:     dto.AlertEnabled,
		TelegramChatID:   dto.TelegramChatID,
		TelegramBotToken: dto.TelegramBotToken,
	}

	if monitor.Method == "" {
		monitor.Method = "GET"
	}
	if monitor.Interval == 0 {
		monitor.Interval = 60
	}
	if monitor.Timeout == 0 {
		monitor.Timeout = 10
	}
	if monitor.ExpectedStatus == 0 {
		monitor.ExpectedStatus = 200
	}

	if err := h.db.Create(&monitor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": http.StatusInternalServerError,
			"message":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status_code": http.StatusCreated,
		"message":     "Monitor created successfully",
		"data":        monitor,
	})
}
