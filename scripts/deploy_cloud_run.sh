#!/usr/bin/env bash
# ==============================================================================
# Deploy SDLC Implementer Agent Service to Google Cloud Run
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE_DIR="${REPO_ROOT}/sdlc-agents/implementer"

# Configuration with environment overrides
PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo "")}"
REGION="${REGION:-${GCP_REGION:-us-central1}}"
SERVICE_NAME="${SERVICE_NAME:-sdlc-implementer-agent}"
MEMORY="${MEMORY:-4Gi}"
CPU="${CPU:-2}"
TIMEOUT="${TIMEOUT:-3600}"
MAX_INSTANCES="${MAX_INSTANCES:-5}"
MIN_INSTANCES="${MIN_INSTANCES:-0}"
CONCURRENCY="${CONCURRENCY:-4}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Error: PROJECT_ID is not set and no active gcloud project found."
  echo "Usage: PROJECT_ID=my-project-id [REGION=us-central1] ./scripts/deploy_cloud_run.sh"
  exit 1
fi

echo "============================================================"
echo " Deploying Implementer Agent to Cloud Run"
echo " Project:         ${PROJECT_ID}"
echo " Region:          ${REGION}"
echo " Service Name:    ${SERVICE_NAME}"
echo " Source Path:     ${SOURCE_DIR}"
echo " CPU / Memory:    ${CPU} vCPU / ${MEMORY}"
echo " Request Timeout: ${TIMEOUT}s"
echo "============================================================"

# Ensure required GCP APIs are enabled
echo "==> Enabling required GCP services..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com \
  --project="${PROJECT_ID}"

# Retrieve or configure Service Account
SERVICE_ACCOUNT="${SERVICE_ACCOUNT:-}"
if [[ -z "${SERVICE_ACCOUNT}" ]]; then
  # Determine project number to grant Vertex AI permissions to default compute SA or dedicated SA
  PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
  SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
fi

echo "==> Ensuring Vertex AI User role on Service Account: ${SERVICE_ACCOUNT}"
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/aiplatform.user" \
  --condition=None >/dev/null 2>&1 || true

# Deploy to Cloud Run using source directory (Cloud Build builds Dockerfile)
echo "==> Building and deploying Cloud Run service..."
gcloud run deploy "${SERVICE_NAME}" \
  --source="${SOURCE_DIR}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --service-account="${SERVICE_ACCOUNT}" \
  --memory="${MEMORY}" \
  --cpu="${CPU}" \
  --timeout="${TIMEOUT}" \
  --min-instances="${MIN_INSTANCES}" \
  --max-instances="${MAX_INSTANCES}" \
  --concurrency="${CONCURRENCY}" \
  --execution-environment=gen2 \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT_ID},GOOGLE_GENAI_USE_VERTEXAI=true,GOOGLE_GENAI_LOCATION=${REGION},GOOGLE_GENAI_MODEL=gemini-3.7-flash" \
  --no-allow-unauthenticated

SERVICE_URL="$(gcloud run services describe "${SERVICE_NAME}" --project="${PROJECT_ID}" --region="${REGION}" --format='value(status.url)')"

echo ""
echo "============================================================"
echo " Implementer Agent Service Successfully Deployed!"
echo " Service URL: ${SERVICE_URL}"
echo "============================================================"
echo "To invoke via GitHub Actions, configure the following repository variables:"
echo "  - vars.IMPLEMENTER_SERVICE_URL: ${SERVICE_URL}"
echo "  - vars.GCP_PROJECT_ID:          ${PROJECT_ID}"
echo "  - vars.GCP_REGION:              ${REGION}"
echo "============================================================"
