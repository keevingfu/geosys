FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create directories for certbot
RUN mkdir -p /var/www/certbot

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]