FROM denoland/deno

# Set working directory
WORKDIR /app

# Copy dependency files
COPY deps.ts* .
COPY lock.json* .
COPY import_map.json* .

# Copy source code
COPY . .

# Compile the permissions you need
ENV HOST=0.0.0.0
ENV PORT=3000

# Cache the dependencies (if you have import map)
RUN if [ -f import_map.json ]; then deno cache --import-map=import_map.json main.ts; else deno cache main.ts; fi

# The command to run the application - Fixed format
CMD deno run --allow-net --allow-env --allow-read --allow-write ${DENO_IMPORT_MAP:+--import-map=}${DENO_IMPORT_MAP:-} main.ts

# Expose the port
EXPOSE 3000