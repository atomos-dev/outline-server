#!/bin/bash -eu
#
# Copyright 2018 The Outline Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# run_action shadowbox/server/build

RUN_ID="${RUN_ID:-$(date +%Y-%m-%d-%H%M%S)}"
readonly RUN_DIR="/tmp/outline/${RUN_ID}"
readonly ROOT_DIR=${ROOT_DIR:-$(pwd)}
readonly BUILD_DIR=${BUILD_DIR:-${ROOT_DIR}/build}
echo "Using directory ${RUN_DIR}"

function safe_base64() {
	local url_safe
	url_safe="$(base64 -w 0 - | tr '/+' '_-')"
	echo -n "${url_safe%%=*}"
}


export LOG_LEVEL="${LOG_LEVEL:-debug}"
SB_PUBLIC_IP="${SB_PUBLIC_IP:-$(curl https://ipinfo.io/ip)}"
export SB_PUBLIC_IP
# WARNING: The SB_API_PREFIX should be kept secret!
export SB_API_PREFIX="$(head -c 16 /dev/urandom | safe_base64)"
export SB_METRICS_URL='https://dev.metrics.getoutline.org'
export SB_STATE_DIR="${RUN_DIR}/persisted-state"
export APP_BASE_DIR="/root/outline-server-master/build/shadowbox"
readonly STATE_CONFIG="${SB_STATE_DIR}/shadowbox_server_config.json"

[[ -d "${SB_STATE_DIR}" ]] || mkdir -p "${SB_STATE_DIR}"
[[ -e "${STATE_CONFIG}" ]] || echo "{\"hostname\":\"${SB_HOSTNAME}\", \"portForNewAccessKeys\": ${SB_ACCESS_KEY_PORT}}" > "${STATE_CONFIG}"

readonly CERTIFICATE_NAME="${RUN_DIR}/shadowbox-selfsigned-dev"
export SB_CERTIFICATE_FILE="${CERTIFICATE_NAME}.crt"
export SB_PRIVATE_KEY_FILE="${CERTIFICATE_NAME}.key"
declare -a openssl_req_flags=(
  -x509
  -nodes
  -days 36500
  -newkey rsa:2048
  -subj '/CN=${SB_HOSTNAME}'
  -keyout "${SB_PRIVATE_KEY_FILE}"
  -out "${SB_CERTIFICATE_FILE}"
)
openssl req "${openssl_req_flags[@]}"


"./pkg/main"
