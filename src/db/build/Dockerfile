FROM mcr.microsoft.com/mssql/server:2017-latest

ARG sapw

RUN mkdir data

# Include schema and initial data
COPY ./LeafDB.sql ./LeafDB.Init.sql ./

# Accept EULA
ENV ACCEPT_EULA Y

# Dev SA Password
ENV MSSQL_SA_PASSWORD ${sapw}

# Volumize somewhere to interact with host if needed
VOLUME /bak

# Set up database
RUN /opt/mssql/bin/sqlservr & sleep 10 \
    && /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ${MSSQL_SA_PASSWORD} -i ./LeafDB.sql \
    && /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ${MSSQL_SA_PASSWORD} -i ./LeafDB.Init.sql -d LeafDB \
    && pkill sqlservr