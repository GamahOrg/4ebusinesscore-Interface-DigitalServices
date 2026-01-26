#!/bin/sh

echo "🧪 Injecting runtime environment variables..."

TARGET_DIR="/app/digialservicesmanagement"
mkdir -p "$TARGET_DIR"

# Begin env.js
echo "window._env_ = {" > "$TARGET_DIR/env.js"

# Inject PUBLIC_URL if present
if [ -n "$PUBLIC_URL" ]; then
  echo "  \"PUBLIC_URL\": \"${PUBLIC_URL}\"," >> "$TARGET_DIR/env.js"
fi

# Include all REACT_APP_ variables
env | grep '^REACT_APP_' | while IFS='=' read -r name value; do
  echo "  \"$name\": \"${value}\"," >> "$TARGET_DIR/env.js"
done

echo "};" >> "$TARGET_DIR/env.js"

echo "✅ env.js created at $TARGET_DIR/env.js"
echo "🚀 Serving build from $TARGET_DIR on port 3000..."

serve -s "$TARGET_DIR" -l 3000