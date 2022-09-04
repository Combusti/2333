FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

# Install Unzip
RUN apt-get update \
    && apt-get install unzip -y

# Install SQLPackage for Linux and make it executable
RUN wget -progress=bar:force -q -O sqlpackage.zip https://go.microsoft.com/fwlink/?linkid=2165213 \
    && unzip -qq sqlpackage.zip -d /opt/sqlpackage \
    && chmod +x /opt/sqlpackage/sqlpackage

USER mssql

# Add the DACPAC to the image
COPY database/Database.bacpac /tmp/db.bacpac

# Configure external build arguments to allow configurability.
ARG DB_GUARDIAN
ARG SA_PASSWORD

# Configure the required environmental variables
ENV ACCEPT_EULA=Y

# Launch SQL Server, confirm startup is complete, deploy the DACPAC, then terminate SQL Server.
# See https://stackoverflow.com/a/51589787/488695
RUN (/opt/mssql/bin/sqlservr --accept-eula & ) | grep -q "Service Broker manager has started" && ( echo "SQLServer started" && sleep 10s ) || ( echo "SQLSERVER failed to start" && exit ) \
    && /opt/sqlpackage/sqlpackage /action:Import /TargetServerName:. /TargetDatabaseName:${DB_GUARDIAN} /TargetUser:sa /tp:$SA_PASSWORD  /SourceFile:/tmp/db.bacpac  \
    # && rm /tmp/db.dacpac \
    && pkill sqlservr