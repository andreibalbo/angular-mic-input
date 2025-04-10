FROM node:20-slim

WORKDIR /app

# Install Angular CLI 19 specifically
RUN npm install -g @angular/cli@19

# Install basic tools
RUN apt-get update && apt-get install -y \
  git \
  && rm -rf /var/lib/apt/lists/*

# Keep container running
CMD ["sleep", "infinity"] 
