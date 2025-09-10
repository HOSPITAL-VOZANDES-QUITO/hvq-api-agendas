# ---------- BASE (libs y Oracle) ----------
FROM node:20-bookworm-slim AS base

# Paquetes del sistema
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     wget unzip ca-certificates libaio1 build-essential python3 \
  && rm -rf /var/lib/apt/lists/*

# Oracle Instant Client
WORKDIR /tmp
ARG OCI_VER=21_8
ARG OCI_ZIP=instantclient-basic-linux.x64-21.8.0.0.0dbru.zip
RUN wget https://download.oracle.com/otn_software/linux/instantclient/218000/${OCI_ZIP} \
  && unzip ${OCI_ZIP} \
  && mkdir -p /opt/oracle \
  && mv instantclient_${OCI_VER}/* /opt/oracle/ \
  && rm -rf instantclient_${OCI_VER} \
  && rm -f ${OCI_ZIP}

# Variables de entorno coherentes
ENV ORACLE_HOME=/opt/oracle
ENV LD_LIBRARY_PATH=/opt/oracle
ENV PATH=/opt/oracle:$PATH

# ---------- BUILDER (compila Nest) ----------
FROM base AS builder
WORKDIR /usr/src/app

# Instala TODAS las deps para poder compilar
COPY package*.json ./
RUN npm ci

# Copia código y build
COPY . .
RUN npm run build

# ---------- RUNTIME (ligero, solo prod) ----------
FROM node:20-bookworm-slim AS runtime
WORKDIR /usr/src/app

# Runtime solo necesita libaio y certs
RUN apt-get update \
  && apt-get install -y --no-install-recommends libaio1 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copia el Instant Client desde base
COPY --from=base /opt/oracle /opt/oracle
ENV ORACLE_HOME=/opt/oracle
ENV LD_LIBRARY_PATH=/opt/oracle
ENV PATH=/opt/oracle:$PATH
# Si usas tnsnames.ora, monta un volumen y apunta TNS_ADMIN
# ENV TNS_ADMIN=/opt/oracle/network/admin

# Deps de producción y artefactos
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /usr/src/app/dist ./dist

# Usuario no-root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nodejs \
  && chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Puerto y healthcheck
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
