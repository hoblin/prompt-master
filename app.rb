#!/usr/bin/env ruby
# Require all gems in Gemfile
require "bundler"
Bundler.require

# require classes recursively
Dir[File.dirname(__FILE__) + "/lib/*.rb"].each { |file| require file }

# use better errors
configure :development do
  use BetterErrors::Middleware
  BetterErrors.application_root = __dir__
end

# will_paginate config
require 'will_paginate/array'

error do
  erb :"500"
end

get "/" do
  @categories = Category.all

  haml :index, escape_html: false
end

# render index.erb with selected category
get "/category/:category" do
  @category = Category.find(params[:category])

  # redirect to root if category not found
  redirect "/" if @category.nil?

  # paginate tags array with kaminari of the selected category
  @tags = @category.tags.paginate page: params[:page], per_page: 20
  haml :index, escape_html: false
end

# serve static files from inspiration folder
get "/inspiration/*" do
  send_file "./inspiration/#{params[:splat].first}"
end
