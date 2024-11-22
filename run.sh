#!/bin/bash

# Function to start a tmux session
start_tmux_session() {
    local session_name=$1
    local command=$2

    if tmux has-session -t $session_name 2>/dev/null; then
        echo "Tmux session '$session_name' already exists. Skipping..."
    else
        echo "Starting tmux session '$session_name'..."
        tmux new-session -d -s $session_name "$command"
    fi
}

echo "Starting services in tmux sessions..."

# Start Redis server
start_tmux_session redis "redis-server"

# Start Flask app
start_tmux_session flask "source proj.env/bin/activate && flask run"

# Start Celery worker
start_tmux_session celery_worker "source proj.env/bin/activate && celery -A app:celery_app worker --loglevel=info"

# Start Celery beat
start_tmux_session celery_beat "source proj.env/bin/activate && celery -A app:celery_app beat --loglevel=info"

# Start MailHog
start_tmux_session mailhog "~/go/bin/MailHog"

echo "All services started. Use 'tmux attach -t <session_name>' to view a session."
