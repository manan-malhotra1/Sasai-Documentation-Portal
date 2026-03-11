#!/usr/bin/env bash
# Deploy Sasai Documentation Portal to Google Cloud Run
# Project: nikhil-sasai-docs (233766951533)
# Run from repo root: ./scripts/deploy-cloud-run.sh

set -e

# ---------- Configuration ----------
PROJECT_ID="${GCP_PROJECT_ID:-nikhil-sasai-docs}"
PROJECT_NUMBER="${GCP_PROJECT_NUMBER:-233766951533}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="${CLOUD_RUN_SERVICE:-sasai-docs}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Default Cloud Build and Compute service accounts (used for permission setup)
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "=============================================="
echo "Cloud Run deploy: ${SERVICE_NAME}"
echo "Project: ${PROJECT_ID} (${PROJECT_NUMBER})"
echo "Region: ${REGION}"
echo "=============================================="

# ---------- 1. Ensure we use Project ID, not Project Number ----------
# APIs and billing require the project ID (e.g. nikhil-sasai-docs), not the number (233766951533).
if [[ "${PROJECT_ID}" =~ ^[0-9]+$ ]]; then
  echo "ERROR: GCP_PROJECT_ID must be the project ID (e.g. nikhil-sasai-docs), not the project number (${PROJECT_ID})."
  echo "   Use: export GCP_PROJECT_ID=nikhil-sasai-docs"
  exit 1
fi

# ---------- 2. Ensure gcloud is authenticated and project set ----------
echo ""
echo ">> Setting project to ${PROJECT_ID}..."
gcloud config set project "${PROJECT_ID}"

# ---------- 3. Check billing (required for Cloud Run / Cloud Build) ----------
echo ""
echo ">> Checking billing..."
if ! gcloud billing projects describe "${PROJECT_ID}" &>/dev/null; then
  echo ""
  echo "ERROR: Billing is not enabled for this project. Cloud Run and Cloud Build require a linked billing account."
  echo ""
  echo "To fix:"
  echo "  1. Open: https://console.cloud.google.com/billing/linkedaccount?project=${PROJECT_ID}"
  echo "  2. Link a billing account to the project (or create one first at https://console.cloud.google.com/billing)."
  echo "  3. Re-run this script."
  echo ""
  exit 1
fi
echo "   Billing is enabled."

# ---------- 4. Enable required APIs ----------
echo ""
echo ">> Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  containerregistry.googleapis.com \
  --project="${PROJECT_ID}"

# ---------- 5. Fix common permission issues (Cloud Build and deploy) ----------
echo ""
echo ">> Granting IAM roles to fix permission issues..."

# Cloud Build service account needs to build and deploy to Cloud Run
# - run.builder: build and deploy Cloud Run services
# - run.admin: create/update Cloud Run services (covers deploy)
# - iam.serviceAccountUser on compute SA: act as runtime identity when deploying
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin" \
  --condition=None \
  --quiet 2>/dev/null || true

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.builder" \
  --condition=None \
  --quiet 2>/dev/null || true

# So Cloud Build can act as the default compute SA (runtime for Cloud Run)
gcloud iam service-accounts add-iam-policy-binding "${COMPUTE_SA}" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --project="${PROJECT_ID}" \
  --quiet 2>/dev/null || true

# Push images to GCR (Artifact Registry is enabled for future use)
# Default Cloud Build SA usually has access; grant explicitly if you hit "denied" on push
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/storage.admin" \
  --condition=None \
  --quiet 2>/dev/null || true

echo "   IAM updates applied (errors above are OK if roles already exist)."

# ---------- 6. Optional: ensure your user can deploy (run.sourceDeveloper) ----------
CURRENT_USER=$(gcloud config get-value account 2>/dev/null || true)
if [ -n "${CURRENT_USER}" ]; then
  echo ""
  echo ">> Ensuring deployer has Cloud Run Source Developer role..."
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="user:${CURRENT_USER}" \
    --role="roles/run.sourceDeveloper" \
    --condition=None \
    --quiet 2>/dev/null || true
fi

# ---------- 7. Deploy from source (Cloud Build will use Dockerfile in repo) ----------
echo ""
echo ">> Building and deploying to Cloud Run (this may take several minutes)..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --min-instances=0 \
  --max-instances=10 \
  --project="${PROJECT_ID}"

echo ""
echo "=============================================="
echo "Deploy complete."
echo "Service URL: $(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)' --project=${PROJECT_ID})"
echo "=============================================="
