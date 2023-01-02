#!/usr/bin/env ruby
# Require all gems in Gemfile
require "bundler"
Bundler.require

# require classes recursively
Dir[File.dirname(__FILE__) + "/lib/*.rb"].each { |file| require file }

# Sinatra base
class PromptMaster < Sinatra::Base
  register Sinatra::ActiveRecordExtension
  include WillPaginate::Sinatra::Helpers

  # set root
  set :root, File.dirname(__FILE__)

  # set views
  set :views, proc { File.join(root, "views") }

  # set public folder
  set :public_folder, proc { File.join(root, "public") }

  # use better errors
  configure :development do
    use BetterErrors::Middleware
    BetterErrors.application_root = __dir__
  end

  # will_paginate config
  require "will_paginate"
  require "will_paginate/active_record"
  WillPaginate.per_page = 60

  # DB config
  set :database, {adapter: "sqlite3", database: "prompt-master.sqlite3"}

  # set port
  set :port, 8080

  error do
    erb :"500"
  end

  get "/:mode?" do
    @categories = case params[:mode]
    when "featured"
      Category.featured
    when "hidden"
      Category.hidden
    else
      Category.all
    end

    haml :index, escape_html: false
  end

  # render index.erb with selected category
  get "/category/:id/:mode?" do
    @category = Category.find_by_id(params[:id])
    # redirect to root if category not found
    redirect "/" if @category.nil?

    # paginate tags array with kaminari of the selected category
    @tags = case params[:mode]
    when "featured"
      @category.tags.featured
    when "hidden"
      @category.tags.hidden
    else
      @category.tags.active
    end.order("name").page(params[:page])
    haml :index, escape_html: false
  end

  # add tag to featured tags
  put "/tag/:id/feature" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # add tag to featured tags
    @tag.update(featured: true)
    {success: true}.to_json
  end

  # remove tag from featured tags
  put "/tag/:id/unfeature" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # remove tag from featured tags
    @tag.update(featured: false)
    {success: true}.to_json
  end

  # hide tag
  put "/tag/:id/hide" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # hide tag
    @tag.update(active: false)
    {success: true}.to_json
  end

  # unhide tag
  put "/tag/:id/unhide" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # unhide tag
    @tag.update(active: true)
    {success: true}.to_json
  end

  # serve static files from inspiration folder
  get "/inspiration/*" do
    send_file "./inspiration/#{params[:splat].first}"
  end
end