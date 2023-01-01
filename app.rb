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
require "will_paginate"
require "will_paginate/active_record"
WillPaginate.per_page = 20

# DB config
set :database, {adapter: "sqlite3", database: "prompt-master.sqlite3"}

error do
  erb :"500"
end

get "/" do
  @categories = Category.all

  haml :index, escape_html: false
end

# render index.erb with selected category
get "/category/:id" do
  @category = Category.find_by_id(params[:id])
  # redirect to root if category not found
  redirect "/" if @category.nil?

  # paginate tags array with kaminari of the selected category
  @tags = @category.tags.page(params[:page]).order("name")
  haml :index, escape_html: false
end

# serve static files from inspiration folder
get "/inspiration/*" do
  send_file "./inspiration/#{params[:splat].first}"
end
