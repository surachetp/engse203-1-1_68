#!/usr/bin/env bash
set -euo pipefail

# Demo script for level-2-challenge
# This demo uses a separate data file so it doesn't overwrite your main tasks.json
DEMO_DATA=./data/demo-tasks.json
EXPORT_FILE=./docs/demo-export.json

echo "=== Demo: Task Manager CLI ==="
export DATA_FILE=${DEMO_DATA}

# Clean demo data file
rm -f "${DEMO_DATA}" "${EXPORT_FILE}"

echo "1) Add tasks"
node index.js add "Demo task 1" high
node index.js add "Demo task 2" medium

echo "\n2) List all tasks"
node index.js list all

echo "\n3) Complete task ID 1"
node index.js complete 1

echo "\n4) List completed tasks"
node index.js list completed

echo "\n5) Update task ID 2"
node index.js update 2 "Updated demo task"
node index.js list all

echo "\n6) Delete task ID 1"
node index.js delete 1
node index.js list all

echo "\n7) Show stats"
node index.js stats

echo "\n8) Export tasks to ${EXPORT_FILE}"
node index.js export "${EXPORT_FILE}"

echo "\n9) Import tasks from ${EXPORT_FILE} (merge)"
node index.js import "${EXPORT_FILE}"
node index.js list all

# Show demo data file
echo "\nFinal demo data file contents:"
cat "${DEMO_DATA}" || true

echo "\nDemo complete. Files: ${DEMO_DATA}, ${EXPORT_FILE}"

echo "(Note: demo used DATA_FILE=${DEMO_DATA} so it won't alter your main data/tasks.json)"
