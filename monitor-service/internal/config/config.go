package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port            string
	DatabaseURL     string
	JwtAccessSecret string
	WorkerCount     int
	TelegramBot     string
}

func Load() *Config {
	return &Config{
		Port:            GetEnv("PORT", "4000"),
		DatabaseURL:     GetEnv("DATABASE_URL", ""),
		JwtAccessSecret: GetEnv("JWT_ACCESS_SECRET", ""),
		WorkerCount:     GetEnvInt("WORKER_COUNT", 10),
		TelegramBot:     GetEnv("TELEGRAM_BOT", ""),
	}
}

func GetEnv(key string, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func GetEnvInt(key string, fallback int) int {
	if val := os.Getenv(key); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return fallback
}
