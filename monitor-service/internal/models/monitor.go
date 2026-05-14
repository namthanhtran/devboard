package models

import "time"

type Monitor struct {
	ID             int    `json:"id" gorm:"primaryKey"`
	UserID         int    `json:"user_id"`
	ProjectID      *int   `json:"project_id"`
	Name           string `json:"name"`
	URL            string `json:"url"`
	Method         string `json:"method" gorm:"default:GET"`
	Interval       int    `json:"interval" gorm:"default:60"`
	Timeout        int    `json:"timeout" gorm:"default:10"`
	ExpectedStatus int    `json:"expected_status" gorm:"default:200"`
	IsActive       bool   `json:"is_active" gorm:"default:true"`
	IsPaused       bool   `json:"is_paused" gorm:"default:false"`

	AlertEnabled     bool    `json:"alert_enabled" gorm:"default:false"`
	TelegramChatID   *string `json:"telegram_chat_id,omitempty"`
	TelegramBotToken *string `json:"telegram_bot_token,omitempty"`

	LastStatus    *string    `json:"last_status"`
	LastCheckedAt *time.Time `json:"last_checked_at"`
	LastLatency   *int       `json:"last_latency"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Ping struct {
	ID         int       `json:"id" gorm:"primaryKey"`
	MonitorID  int       `json:"monitor_id"`
	Status     string    `json:"status"`
	StatusCode *int      `json:"status_code"`
	Latency    *int      `json:"latency"`
	Error      *string   `json:"error"`
	CheckedAt  time.Time `json:"checked_at"`
}

type Incident struct {
	ID         int        `json:"id" gorm:"primaryKey"`
	MonitorID  int        `json:"monitor_id"`
	StartedAt  time.Time  `json:"started_at"`
	ResolvedAt *time.Time `json:"resolved_at"`
	Duration   *int       `json:"duration"`
	Cause      *string    `json:"cause"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}
