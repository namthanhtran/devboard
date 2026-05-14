package models

type CreateMonitorDTO struct {
	ProjectID        *int    `json:"project_id"`
	Name             string  `json:"name" binding:"required"`
	URL              string  `json:"url" binding:"required,url"`
	Method           string  `json:"method"`
	Interval         int     `json:"interval"`
	Timeout          int     `json:"timeout"`
	ExpectedStatus   int     `json:"expected_status"`
	AlertEnabled     bool    `json:"alert_enabled"`
	TelegramChatID   *string `json:"telegram_chat_id"`
	TelegramBotToken *string `json:"telegram_bot_token"`
}

type UpdateMonitorDTO struct {
	Name             *string `json:"name"`
	URL              *string `json:"url"`
	Method           *string `json:"method"`
	Interval         *int    `json:"interval"`
	Timeout          *int    `json:"timeout"`
	ExpectedStatus   *int    `json:"expected_status"`
	IsActive         *bool   `json:"is_active"`
	IsPaused         *bool   `json:"is_paused"`
	AlertEnabled     *bool   `json:"alert_enabled"`
	TelegramChatID   *string `json:"telegram_chat_id"`
	TelegramBotToken *string `json:"telegram_bot_token"`
}
