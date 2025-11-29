FROM ruby@sha256:98e340a1e5a9a61ee0c30e464a058da093ab8179460ed096a2a763a3abaa6c47

# Add app files
ADD . /app

WORKDIR /app

# Add the wait-for-it script
RUN chmod +x ./wait-for-it.sh

# Install production gems with frozen lockfile (supply chain protection)
RUN bundle config set --local frozen true && \
    bundle install --without development test

# Expose 8080 port
EXPOSE 8080

CMD ["/bin/bash"]
