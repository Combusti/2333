# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.238.0/containers/python-3/.devcontainer/base.Dockerfile

# [Choice] Python version (use -bullseye variants on local arm64/Apple Silicon): 3, 3.10, 3.9, 3.8, 3.7, 3.6, 3-bullseye, 3.10-bullseye, 3.9-bullseye, 3.8-bullseye, 3.7-bullseye, 3.6-bullseye, 3-buster, 3.10-buster, 3.9-buster, 3.8-buster, 3.7-buster, 3.6-buster
ARG VARIANT="3.10-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

# [Choice] Node.js version: none, lts/*, 16, 14, 12, 10
ARG NODE_VERSION="lts/*"
RUN if [ "${NODE_VERSION}" != "none" ]; then su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi

# Install OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    python3-dev \ 
    unixodbc-dev

# Set up pyodbc
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17

# Install pipenv
RUN pip install --no-cache-dir pipenv

# [Optional] Uncomment this line to install global node packages.
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g @angular/cli" 2>&1

# Make sure that we can install Angular without needing to accept their analytics question
ENV NG_CLI_ANALYTICS false

# Make the default folder for the application
RUN mkdir /usr/src/app && chown 1000:1000 -R /srv
RUN mkdir /usr/src/app/api && chown 1000:1000 -R /srv
RUN mkdir /usr/src/app/client && chown 1000:1000 -R /srv

# Set the working directory for any subsequent commands to the app directory
WORKDIR /usr/src/app
COPY api/Pipfile api/Pipfile.lock api/bootstrap.sh ./api/
COPY client/package.json client/package-lock.json ./client/

RUN ls -la /usr/src/app/client

# Install client dependencies
RUN cd /usr/src/app/client && npm install --save --legacy-peer-deps

# Install API dependencies
RUN cd /usr/src/app/api && pipenv install

# Expose a voume for the app directory
VOLUME /usr/src/app

# Setting the ENTRYPOINT to docker-init.sh will configure non-root access 
# to the Docker socket. The script will also execute CMD as needed.
CMD [ "while true; do sleep 10000; done" ]