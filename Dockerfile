FROM ruby:3.2.0

# Add app files
ADD db /app/db
ADD public/images /app/public/images
ADD public/javascripts /app/public/javascripts
ADD public/stylesheets /app/public/stylesheets
ADD views /app/views
ADD Procfile /app/Procfile
ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
ADD Rakefile /app/Rakefile
ADD config.ru /app/config.ru
ADD lib /app/lib
ADD prompt_master.rb /app/prompt_master.rb

WORKDIR /app
# Install production gems
RUN bundle install --without development test
# Create and migrate DB
RUN rake db:create db:migrate db:sync
EXPOSE 8080

# Start the app via foreman
CMD ["foreman", "start", "-f", "Procfile", "-p", "8080"]
