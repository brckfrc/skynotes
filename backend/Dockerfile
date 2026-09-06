FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
WORKDIR /app
COPY package*.json ./

# npm ve corepack KURULUM SONRASI silinir.
#
# Neden: uygulama "node index.js" ile calisir, calisma zamaninda npm'e ihtiyaci
# yoktur. Ama node:*-alpine imaji npm'i icinde tasir ve npm kendi "tar"
# kopyasini bundle eder. Trivy bunu bulup CRITICAL bildiriyor
# (CVE-2026-59873, node-tar gzip-bomb DoS). Bu CVE uygulamanin bagimliligi
# DEGIL, taban imajin parcasi -> lockfile veya "overrides" ile cozulemez,
# "docker build --pull" da coremez cunku taban imaj digest ile sabit.
#
# Silmek hem bulguyu kaldirir hem saldiri yuzeyini daraltir: container ele
# gecse bile saldirganin elinde paket yukleyici olmaz.
#
# AYNI RUN icinde yapilmasi onemli - ayri katmanda silinirse npm onceki
# katmanda durmaya devam eder.
RUN npm ci --omit=dev \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/lib/node_modules/corepack \
              /usr/local/bin/npm \
              /usr/local/bin/npx \
              /usr/local/bin/corepack \
              /root/.npm

COPY . .
ENV NODE_ENV=production
EXPOSE 8001
CMD ["node", "index.js"]
