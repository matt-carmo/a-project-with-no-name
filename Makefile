ENV_FILE=.env

.PHONY: env

env: ## Update .env files
	@echo "Updating environment file..."
	@cp $(ENV_FILE) backend/.env
	@cp $(ENV_FILE) frontend/.env
	@cp $(ENV_FILE) desktop/.env
	@echo "✅ Environment file updated successfully."
