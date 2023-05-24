FROM ruby:3.2.0

# Add app files
ADD . /app

WORKDIR /app

# Add the wait-for-it script
RUN chmod +x ./wait-for-it.sh

# Install production gems
RUN bundle install --without development test

# Expose 8080 port
EXPOSE 8080

CMD ["/bin/bash"]
