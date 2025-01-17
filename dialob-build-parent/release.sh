#
# Copyright © 2015 - 2021 ReSys (info@dialob.io)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#!/usr/bin/env bash
set -e

# No changes, skip release
readonly local last_release_commit_hash=$(git log --author="$BOT_NAME" --pretty=format:"%H" -1)
echo "Last commit:    ${last_release_commit_hash} by $BOT_NAME"
echo "Current commit: ${GITHUB_SHA}"
if [[ "${last_release_commit_hash}" = "${GITHUB_SHA}" ]]; then
     echo "No changes, skipping release"
     #exit 0
fi

echo "Import GPG key"
echo "$GPG_KEY" > private.key
gpg --batch --import ./private.key 
rm ./private.key
echo "JAVA_HOME '$JAVA_HOME'"

# Config GIT
echo "Setup git user name to '$BOT_NAME' and email to '$BOT_EMAIL' GPG key ID $GPG_KEY_ID"
git config --global user.name "$BOT_NAME";
git config --global user.email "$BOT_EMAIL";

# Current and next version
LAST_RELEASE_VERSION=$(cat dialob-build-parent/release.version)
[[ $LAST_RELEASE_VERSION =~ ([^\\.]*)$ ]]
MINOR_VERSION=`expr ${BASH_REMATCH[1]}`
MAJOR_VERSION=${LAST_RELEASE_VERSION:0:`expr ${#LAST_RELEASE_VERSION} - ${#MINOR_VERSION}`}
NEW_MINOR_VERSION=`expr ${MINOR_VERSION} + 1`
RELEASE_VERSION=${MAJOR_VERSION}${NEW_MINOR_VERSION}

# docker image
readonly local DIALOB_BOOT_IMAGE=docker.io/resys/dialob-boot
readonly local DIALOB_SESSION_IMAGE=docker.io/resys/dialob-session-boot


echo ${RELEASE_VERSION} > dialob-build-parent/release.version
PROJECT_VERSION=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)

echo "Docker image: docker.io/resys/dialob-session-boot:${RELEASE_VERSION}"
echo "Docker image: docker.io/resys/dialob-boot:${RELEASE_VERSION}"
echo "Git checkout refname: '${refname}' branch: '${branch}' commit: '${GITHUB_SHA}'"
echo "Dev version: '${PROJECT_VERSION}' release version: '${RELEASE_VERSION}'"
echo "Releasing: '${RELEASE_VERSION}', previous: '${LAST_RELEASE_VERSION}'"

mvn versions:set -DnewVersion=${RELEASE_VERSION}
git commit -am "Release: ${RELEASE_VERSION}"
git tag -a ${RELEASE_VERSION} -m "release ${RELEASE_VERSION}"

mvn clean deploy -Pdialob-release --settings dialob-build-parent/ci-maven-settings.xml -B -Dmaven.javadoc.skip=false -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn
mvn versions:set -DnewVersion=${PROJECT_VERSION}
git commit -am "Release: ${RELEASE_VERSION}"
git push
git push origin ${RELEASE_VERSION}


docker image build -t ${DIALOB_BOOT_IMAGE}:${RELEASE_VERSION} --build-arg RELEASE_VERSION=${RELEASE_VERSION} dialob-boot/
docker image build -t ${DIALOB_SESSION_IMAGE}:${RELEASE_VERSION} --build-arg RELEASE_VERSION=${RELEASE_VERSION} dialob-session-boot/
docker tag ${DIALOB_SESSION_IMAGE}:${RELEASE_VERSION} ${DIALOB_SESSION_IMAGE}:latest
docker tag ${DIALOB_BOOT_IMAGE}:${RELEASE_VERSION} ${DIALOB_BOOT_IMAGE}:latest
docker push ${DIALOB_SESSION_IMAGE}:${RELEASE_VERSION}
docker push ${DIALOB_BOOT_IMAGE}:${RELEASE_VERSION}
docker push ${DIALOB_SESSION_IMAGE}:latest
docker push ${DIALOB_BOOT_IMAGE}:latest
