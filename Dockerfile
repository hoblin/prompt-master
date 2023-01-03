FROM ruby:3.2.0

# Add app files
ADD . /app

WORKDIR /app
# Install production gems
RUN bundle install --without development test
# Create and migrate DB
RUN rake db:create db:migrate

# Expose 8080 port
EXPOSE 8080

CMD ["/bin/bash"]
