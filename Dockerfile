# # Use an official node image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Remove existing node_modules and package-lock.json
RUN rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install --legacy-peer-deps

# Install the specific package
RUN npm install @rollup/rollup-linux-x64-musl --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]


# FROM node:18-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --legacy-peer-deps
# COPY . .
# RUN npm run dev

# # Production stage
# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]