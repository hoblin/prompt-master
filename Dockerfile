FROM ruby@sha256:98e340a1e5a9a61ee0c30e464a058da093ab8179460ed096a2a763a3abaa6c47

ARG UID=1000
ARG GID=1000

# Create app user with matching host UID/GID
RUN groupadd -g ${GID} appgroup && \
    useradd -u ${UID} -g appgroup -m appuser

# Set bundle config location to app directory
ENV BUNDLE_APP_CONFIG=/app/.bundle

WORKDIR /app

# Add app files and set ownership
COPY --chown=appuser:appgroup . .

# Add the wait-for-it script
RUN chmod +x ./wait-for-it.sh

# Install production gems with frozen lockfile (supply chain protection)
RUN bundle config set --local frozen true && \
    bundle config set --local without 'development test' && \
    bundle install

# Expose 8080 port
EXPOSE 8080

USER appuser

CMD ["/bin/bash"]
