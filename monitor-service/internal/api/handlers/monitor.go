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

func (h *MonitorHandler) List(c *gin.Context) {
	userId := c.GetInt("userId")

	var monitors []models.Monitor
	if err := h.db.Where("user_id = ?", userId).Find(&monitors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": http.StatusInternalServerError,
			"message":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": http.StatusOK,
		"message":     "Ok",
		"data":        monitors,
	})
}

func (h *MonitorHandler) GetById(c *gin.Context) {
	userId := c.GetInt("userId")
	id := c.Param("id")

	var monitor models.Monitor
	if err := h.db.Where("user_id = ? AND id = ?", userId, id).First(&monitor).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status_code": http.StatusNotFound,
			"message":     "Record not found!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": http.StatusOK,
		"message":     "Ok",
		"data":        monitor,
	})
}

func (h *MonitorHandler) Update(c *gin.Context) {
	userId := c.GetInt("userId")
	id := c.Param("id")

	var monitor models.Monitor
	if err := h.db.Where("user_id = ? AND id = ?", userId, id).First(&monitor).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status_code": http.StatusNotFound,
			"message":     "Record not found!",
		})
		return
	}

	var dto models.UpdateMonitorDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status_code": http.StatusBadRequest,
			"message":     err.Error(),
		})
		return
	}

	updates := map[string]interface{}{}

	if dto.Name != nil {
		updates["name"] = *dto.Name
	}

	if dto.URL != nil {
		updates["url"] = *dto.URL
	}

	if dto.Method != nil {
		updates["method"] = *dto.Method
	}

	if dto.Interval != nil {
		updates["interval"] = *dto.Interval
	}

	if dto.Timeout != nil {
		updates["timeout"] = *dto.Timeout
	}

	if dto.ExpectedStatus != nil {
		updates["expected_status"] = *dto.ExpectedStatus
	}

	if dto.AlertEnabled != nil {
		updates["alert_enabled"] = *dto.AlertEnabled
	}

	if dto.TelegramChatID != nil {
		updates["telegram_chat_id"] = *dto.TelegramChatID
	}

	if dto.TelegramBotToken != nil {
		updates["telegram_bot_token"] = *dto.TelegramBotToken
	}

	if err := h.db.Model(&monitor).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": http.StatusInternalServerError,
			"message":     "Failed to update monitor",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": http.StatusOK,
		"message":     "Ok",
		"data":        monitor,
	})
}

func (h *MonitorHandler) Delete(c *gin.Context) {
	userId := c.GetInt("userId")
	id := c.Param("id")

	var monitor models.Monitor
	if err := h.db.Where("user_id = ? AND id = ?", userId, id).First(&monitor).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status_code": http.StatusNotFound,
			"message":     err.Error(),
		})
		return
	}

	if err := h.db.Model(&monitor).Delete(&monitor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": http.StatusInternalServerError,
			"message":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": http.StatusOK,
		"message":     "Ok",
	})
}
